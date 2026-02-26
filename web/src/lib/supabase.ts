import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://uvnetpnjinxzhggoqmwz.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseAnonKey) {
  console.warn(
    "Supabase Anon Key is missing. Please add it to your .env file.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
