import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zjmgkhhttdocphgtkbtb.supabase.co";
const supabaseAnonKey = "sb_publishable_p0vTjjwcT1pSNRBKSv15Kg_EmKpRjEM";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);