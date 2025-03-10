import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SECRET } from '$env/static/private';

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET);

export async function GET({ cookies }) {
    const token = cookies.get('supabase-auth-token');

    const { data: { user }, error} = await supabase.auth.getUser(token);
    if (error) {
        return json({error});
    } else {
        return json({user});
    }
}