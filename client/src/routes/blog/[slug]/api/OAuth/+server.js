import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SECRET, NODE_ENV } from '$env/static/private';

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET);

export async function GET({ params }) {
    const redirectUri = process.env.NODE_ENV === 'production'
            ? `https://teejmcsteez.com/blog/${params.slug}/api/setAccessToken`
            : `http://localhost:5173/blog/${params.slug}/api/setAccessToken`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUri },
    });
    if (error) {
        return json({ success: false, error: error.message });
    } else {
        // data.url contains the OAuth URL
        return json({ success: true, url: data.url });
    }
}