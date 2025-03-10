import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SECRET } from '$env/static/private';

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET);

export async function POST({ request, params }) {
    const { comment, userDisplayName, blogCommentJson } = await request.json();
    const slug = params.slug;
    if (!comment || !comment.trim()) {
        return json({ error: 'Empty comment' }, { status: 400 });
    }
    const newComment = {
        comment: comment.trim(),
        timestamp: new Date().toUTCString(),
        displayName: userDisplayName || 'Anonymous'
    };
    const updatedComments = [...(blogCommentJson || []), newComment];
    const { data, error } = await supabase
        .from('blogs')
        .update({ comments: JSON.stringify(updatedComments) })
        .eq('slug', slug)
        .select()
        .single();
    if (error) {
        return json({ error: error.message }, { status: 500 });
    }
    return json({ data });
}

