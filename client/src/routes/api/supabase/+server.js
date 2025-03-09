import { json } from '@sveltejs/kit';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient("https://dzqcqtucdqznjvagxmhj.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6cWNxdHVjZHF6bmp2YWd4bWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDE5OTUsImV4cCI6MjA1NjM3Nzk5NX0.iUdqHG_dvoEfqndwfgqhz1ikik7H7PPk2okKlz8xlb8");

export async function GET() {
    const { data, error } = await supabase.from('skills').select('*');

    if (error) {
        return json({ error: error.message}, {status: 500});
    }

    return json({ data });
}