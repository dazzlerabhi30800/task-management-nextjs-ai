import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pkfuswlebiwgjnoywkbo.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SECRET!;
export const supabase = createClient(supabaseUrl, supabaseKey);
