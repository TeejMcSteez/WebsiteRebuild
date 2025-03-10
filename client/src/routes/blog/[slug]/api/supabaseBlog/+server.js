import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SECRET } from '$env/static/private';

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET);

export async function GET({ params }) {
    const { slug } = params; // get slug from the URL
    const { data, error } = await supabase
        .from('blogs')
        .select('slug, content, comments')
        .eq('slug', slug)
        .limit(1)
        .single();
    if (error) {
        return json({ error: error.message }, { status: 500 });
    }
    return json({data});
}