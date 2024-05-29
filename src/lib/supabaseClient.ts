import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://lrvqobcbzynkutsqnxsu.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export type User = Database["public"]["Tables"]["users"]["Row"];
