import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SECRET } from '$env/static/private';

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET);

export async function load() {

    const tokName = localStorage.key(0); // Gets the first key in localStorage which should be the only key for my site.

    if (tokName) {
        const tok = localStorage.getItem(tokName);

        if (tok) { // If there is a token tries to auth the token
            const { data: { user }, error} = await supabase.auth.getUser(tok);
            if (error) {
                return { error };
            } else {
                return { user };
            }
        }
    } else { // There are no token therefore the person is anon
        return { user: 'Anonymous' };
    }

    
}