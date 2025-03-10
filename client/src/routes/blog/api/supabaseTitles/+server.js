import { json } from '@sveltejs/kit';

import { createClient } from '@supabase/supabase-js';

import { SUPABASE_URL, SUPABASE_SECRET } from '$env/static/private';

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET);

export async function GET() {
    const { data, error } = await supabase
      .from('blogs')
      .select('slug');

      if (error) {
        return json({ error: error.message},{ status: 500 });
      }

      return json({ data });
}