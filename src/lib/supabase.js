import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://ivptkiuhxzdhjnslzalv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cHRraXVoeHpkaGpuc2x6YWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTY5MjIsImV4cCI6MjA4NzUzMjkyMn0.xlbKyUttrY_uINfF-YIoCFXoPWe_QidEftDsgw6SKXE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
