<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { marked } from 'marked';
    import {API_PATH} from '$lib/index.js'

    let blogContent = '';
    let blogTitle = '';
    let comment = '';

    $: slug = $page.params.slug;

    onMount(async () => {
        const res = await fetch(`${API_PATH}/blogs/${slug}`);
        const data = await res.json();
        blogContent = await marked(data.content);
        blogTitle = data.title;
        getBlogComments(slug);
    });
    /**
     * @type Array<{id: number, comment: string, timestamp: string}>
     */
    let blogCommentJson = [];
    /**
    * 
    * @param blogSlug {string}
    */
   async function getBlogComments(blogSlug) {
      // fetch comments from the node server
      const res = await fetch(`${API_PATH}/blogs/${blogSlug}/comments`);
      const comments = await res.json();
      blogCommentJson = comments;
      console.log(comments);
   }

   async function submitComment() {
        const encodedSlug = encodeURIComponent(slug);
        const res = await fetch(`${API_PATH}/blogs/${encodedSlug}/addComment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment })
        });
        if (res.ok) {
            comment = '';
            // Oeptionally, refresh comments
            await getBlogComments(slug);
        } else {
            console.error('Failed to submit comment', res.status, res.statusText);
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
        <button on:click={submitComment} class="mt-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Submit</button>
    </div>
</div>