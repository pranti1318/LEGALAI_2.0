const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase credentials missing in .env');
}

const supabase = createClient(
    supabaseUrl || 'https://mxzfeumkybbvkeqmafhu.supabase.co',
    supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14emZldW1reWJidmtlcW1hZmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NzM0NTUsImV4cCI6MjA4NzM0OTQ1NX0.7_CmDzj8aZeWLRpDfOr4D5HkmCtDitiKXuzvFCdnpZ4'
);

module.exports = supabase;
