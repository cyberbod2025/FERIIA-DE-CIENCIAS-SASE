import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function readDotEnvValue(name: string) {
  const envPath = join(process.cwd(), ".env");
  const content = readFileSync(envPath, "utf8");
  const line = content
    .split(/\r?\n/)
    .find((entry) => entry.startsWith(`${name}=`));

  if (!line) {
    throw new Error(`Falta ${name} en .env para ejecutar Playwright.`);
  }

  return line.slice(name.length + 1).trim();
}

async function getStationWithTrivia() {
  const supabaseUrl = readDotEnvValue("VITE_SUPABASE_URL");
  const supabaseAnonKey = readDotEnvValue("VITE_SUPABASE_ANON_KEY");

  const response = await fetch(
    `${supabaseUrl}/rest/v1/trivias?select=estacion_id&limit=1`,
    {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`No se pudo leer trivias de Supabase: ${response.status}`);
  }

  const data = (await response.json()) as Array<{ estacion_id: string }>;
  const stationId = data[0]?.estacion_id;

  if (!stationId) {
    throw new Error("No hay trivias disponibles para pruebas E2E.");
  }

  return stationId;
}

async function studentRpcsAvailable() {
  const supabaseUrl = readDotEnvValue("VITE_SUPABASE_URL");
  const supabaseAnonKey = readDotEnvValue("VITE_SUPABASE_ANON_KEY");

  const checks = [
    {
      name: "issue_student_session",
      body: { p_nickname: "Ada Playwright", p_grupo: "1°A", p_grado: 1 },
    },
    {
      name: "obtener_progreso_estudiante_v1",
      body: {
        p_estudiante_id: "00000000-0000-0000-0000-000000000000",
        p_session_token: "token-demo",
      },
    },
    {
      name: "registrar_progreso_v2",
      body: {
        p_estudiante_id: "00000000-0000-0000-0000-000000000000",
        p_estacion_id: "00000000-0000-0000-0000-000000000000",
        p_puntos_ganados: 0,
        p_session_token: "token-demo",
      },
    },
    {
      name: "finalizar_trivia_v2",
      body: {
        p_estudiante_id: "00000000-0000-0000-0000-000000000000",
        p_estacion_id: "00000000-0000-0000-0000-000000000000",
        p_puntos_adicionales: 0,
        p_session_token: "token-demo",
      },
    },
  ];

  for (const check of checks) {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${check.name}`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(check.body),
    });

    if (response.status === 404) {
      return false;
    }

    const bodyText = await response.text();
    if (bodyText.includes("Could not find the function")) {
      return false;
    }
  }

  return true;
}

test("completa el flujo alumno desde login hasta trivia", async ({ page }) => {
  test.fail(
    !(await studentRpcsAvailable()),
    "Supabase actual no expone las RPCs de sesión y progreso que requiere el frontend; la prueba queda como regresión conocida hasta alinear backend y app.",
  );

  const stationId = await getStationWithTrivia();
  const nickname = `Ada Playwright${Date.now()}`;

  await page.goto("/login");
  await page.getByPlaceholder("Nombre y Apellido").fill(nickname);
  await page.locator("select").selectOption("1°A");
  await page.getByRole("button", { name: /Iniciar sesión/i }).click();

  await expect(page).toHaveURL(/\/tutorial$/);
  await expect(page.getByText("Guía de la feria")).toBeVisible();

  const sessionToken = await page.evaluate(() => localStorage.getItem("student_session_token"));
  expect(sessionToken).toBeTruthy();

  await page.getByRole("button", { name: /Ver mapa de la feria/i }).click();
  await expect(page).toHaveURL(/\/mapa$/);
  await expect(page.getByText(/Stands disponibles:/)).toBeVisible();

  await page.goto(`/stand/${stationId}`);
  await expect(page.getByText("Check-in QR")).toBeVisible();
  await page.getByRole("button", { name: /Registrar visita/i }).click();
  await expect(page.getByRole("button", { name: /Responder trivia/i })).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: /Responder trivia/i }).click();
  await expect(page).toHaveURL(new RegExp(`/trivia/${stationId}$`));

  for (let index = 0; index < 10; index += 1) {
    if (await page.getByText("Trivia finalizada").isVisible().catch(() => false)) {
      break;
    }

    const answerOptions = page.locator("div.grid.grid-cols-1.gap-4 button");
    await expect(answerOptions.first()).toBeVisible();
    await answerOptions.first().click();
    await page.waitForTimeout(4_500);
  }

  await expect(page.getByText("Trivia finalizada")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("button", { name: /Volver al mapa/i })).toBeVisible();
});

