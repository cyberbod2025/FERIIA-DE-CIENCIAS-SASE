import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("carga las rutas publicas principales en viewport movil", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Tu Progreso" })).toBeVisible();

  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /Feria de Ciencias/i })).toBeVisible();
  await expect(page.getByText("Nombre completo")).toBeVisible();

  await page.goto("/tutorial");
  await expect(page.getByText("Guía de la feria")).toBeVisible();
  await expect(page.getByRole("button", { name: /Ver mapa de la feria/i })).toBeVisible();

  await page.goto("/mapa");
  await expect(page.getByText("Mapa de la feria")).toBeVisible();
  await expect(page.getByText(/Stands disponibles:/)).toBeVisible();

  await page.goto("/ranking");
  await expect(page.getByText("Ranking de Líderes")).toBeVisible();
  await expect(page.getByText("Tabla general")).toBeVisible();

  await page.goto("/panel/login");
  await expect(page.getByText("Panel docente • ESD-310")).toBeVisible();
  await expect(page.getByText("Correo institucional")).toBeVisible();
});
