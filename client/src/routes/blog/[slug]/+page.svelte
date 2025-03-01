<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { marked } from 'marked';

    /**
     * @type Array<{comment: string, timestamp: string}>
    */
    let blogCommentJson;
    let blogContent = '';
    let blogTitle = '';
    let comment = '';

    $: slug = $page.params.slug;

    import { createClient } from '@supabase/supabase-js'
    const supabase = createClient('https://dzqcqtucdqznjvagxmhj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6cWNxdHVjZHF6bmp2YWd4bWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDE5OTUsImV4cCI6MjA1NjM3Nzk5NX0.iUdqHG_dvoEfqndwfgqhz1ikik7H7PPk2okKlz8xlb8');

    onMount(async () => {
        const { data, error } = await supabase
            .from('blogs')
            .select('slug, content, comments')
            .eq('slug', slug)
            .single();
        
        if (error) {
            console.log('Error fetching blog:', error);
            blogTitle = slug;
            blogContent = '<h1>Blog not found</h1>';
        } else {
            console.log('Fetched blog data:', data);
            blogContent = await marked(data.content);
            blogTitle = data.slug;
            // Parse comments if they're stored as a string
            try {
                blogCommentJson = typeof data.comments === 'string' 
                    ? JSON.parse(data.comments) 
                    : (data.comments || []);
                console.log('Parsed comments:', blogCommentJson);
            } catch (e) {
                console.error('Error parsing comments:', e);
                blogCommentJson = [];
            }
        }
    });

    async function submitComment() {
        if (!comment.trim()) return;
        
        const newComment = { 
            comment: comment.trim(), 
            timestamp: new Date().toUTCString() 
        };
        
        const updatedComments = [...blogCommentJson, newComment];
        
        const { data, error } = await supabase
            .from('blogs')
            .update({
                comments: JSON.stringify(updatedComments) // Stringify before saving
            })
            .eq('slug', slug)
            .select()
            .single();

        if (error) {
            console.log('Error submitting comment:', error);
        } else {
            // Parse the comments after update
            try {
                blogCommentJson = typeof data.comments === 'string'
                    ? JSON.parse(data.comments)
                    : (data.comments || []);
                comment = '';
            } catch (e) {
                console.error('Error parsing updated comments:', e);
            }
        }
    }
</script>

<div id="header" class="bg-zinc-800 flex flex-row justify-between items-center min-w-screen">
    <h1 class="text-4xl text-white">{blogTitle}</h1>
    <button on:click={() => history.back()} class="text-3xl bg-zinc-900 text-white hover:bg-red-800 hover:animate-pulse rounded-xl p-5 m-2">Back</button>
</div>

<div class="bg-zinc-600 min-w-screen min-h-screen p-10">
    <div id="blogContent" class="text-white text-xl flex flex-col items-center justify-center p-10">
        {@html blogContent}
    </div>
</div>

<div id="commentWrapper" class="bg-zinc-800 min-w-screen min-h-screen p-10">
    <h2 class="text-2xl text-white underline">Comments</h2>
    <div id="commentSection">
        {#each blogCommentJson as comment}
            <div class="bg-zinc-800 p-5 m-5 rounded-md">
                <p class="text-white">{comment.comment}</p>
                <footer class="text-white">{comment.timestamp} UTC</footer>
            </div>
        {/each}
    </div>
    
    <div id="addCommentSection" class="p-5">
        <h2 class="text-2xl text-white">Add a Comment</h2>
        <textarea bind:value={comment} class="w-full p-2 rounded-md" rows="4" placeholder="Write your comment here..."></textarea>
        <button on:click={() => submitComment()} class="mt-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Submit</button>
    </div>
</div>