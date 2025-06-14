// js_superbase.js
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Replace with your Supabase Project URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Supabase Public Anon Key

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Supabase URL or Anon Key is missing. Please check your js_superbase.js file.");
}

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
