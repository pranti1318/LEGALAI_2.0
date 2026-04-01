require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkSupabase() {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://mxzfeumkybbvkeqmafhu.supabase.co';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14emZldW1reWJidmtlcW1hZmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NzM0NTUsImV4cCI6MjA4NzM0OTQ1NX0.7_CmDzj8aZeWLRpDfOr4D5HkmCtDitiKXuzvFCdnpZ4';

    console.log('Testing connection to Supabase...');
    console.log('URL:', supabaseUrl);

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
        const { data, error } = await supabase.from('lawyers').select('*').limit(1);

        if (error) {
            console.error('❌ Supabase connection failed:', error.message);
            process.exit(1);
        } else {
            console.log('✅ Supabase connection successful!');
            console.log('Sample data from lawyers table:', data);
            process.exit(0);
        }
    } catch (err) {
        console.error('❌ An unexpected error occurred:', err.message);
        process.exit(1);
    }
}

checkSupabase();
