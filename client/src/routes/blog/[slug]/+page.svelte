<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { marked } from 'marked';

    /**
     * @type Array<{comment: string, timestamp: string, displayName: string}>
    */
    let blogCommentJson = [];  // Initialize as empty array
    let blogContent = '';
    let blogTitle = '';
    let comment = '';
    /** @type {string}*/

    $: slug = $page.params.slug;

    /**
     * Fetches blog content and comments from Supabase on component mount.
     * Parses the blog content using marked and sets up comments.
     * @async
     * @function
     * @returns {Promise<void>}
     */
    onMount(async () => {
        const res = await fetch(`/blog/${slug}/api/supabaseBlog`);

        const json = await res.json();

        if (!res.ok) {
            console.log('Error fetching blog:', json.error.message);
            blogTitle = slug;
            blogContent = '<h1>Blog not found</h1>';
        } else if (!json.data) {
            console.log('Error fetching blog:', json.error.message);
            blogTitle = slug;
            blogContent = '<h1>Blog not found</h1>';
        } else {
            const data = json.data;

            console.log('Fetched Data: ', data);

            blogContent = data.content;
            blogTitle = data.slug;
            
            // Safer comment parsing
            if (data.comments) {
                try {
                    if (typeof data.comments === 'string') {
                        blogCommentJson = JSON.parse(data.comments);
                    } else if (Array.isArray(data.comments)) {
                        blogCommentJson = data.comments;
                    } else {
                        blogCommentJson = [];
                    }
                } catch (err) {
                    console.error('Error parsing comments:', err);
                    blogCommentJson = [];
                }
            }

            try {
                blogContent = await marked(blogContent, { // Options
                    async: true, // waits until Promise is fullfilled
                    gfm: true, // GitHub markdown format 
                    breaks: true // Adds <br> on \n
                });
            } catch (err) {
                console.log(err);
            }
        }
    });

    /**
     * Submits a new comment to the blog post.
     * Adds the comment to the database and updates the local comment list.
     * @async
     * @function
     * @returns {Promise<void>}
     */
    async function submitComment() {
        if (!comment.trim()) return;
        const res = await fetch(`/blog/${slug}/api/submitComment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                comment,
                blogCommentJson
            })
        });
        const result = await res.json();
        if (!res.ok || result.error) {
            console.log('Error submitting comment:', result.error);
        } else {
            try {
                const updatedData = result.data;
                blogCommentJson = typeof updatedData.comments === 'string'
                    ? JSON.parse(updatedData.comments)
                    : (updatedData.comments || []);
                comment = '';
            } catch (e) {
                console.error('Error parsing updated comments:', e);
            }
        }
    }

</script>

<div id="header" class="bg-zinc-800 flex flex-row justify-between items-center min-w-screen">
    <h1 class="m-5 p-2 text-3xl text-white">{blogTitle}</h1>
    <button on:click={() => history.back()} class="text-3xl bg-zinc-900 text-white hover:bg-red-800 hover:animate-pulse rounded-xl p-3 m-2">Back</button>
</div>

<div class="dark:bg-zinc-600 bg-white min-w-screen min-h-screen p-10" id="content">
    <div id="blogContent" class="dark:text-white text-xl flex flex-col items-center justify-center p-10">
        {@html blogContent}
    </div>
</div>

<div id="commentSection">
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
</div>

<!-- Back to Top Button -->
<button on:click={() => scrollTo({top: 0, behavior: "smooth"})} class="fixed bottom-4 right-4 bg-zinc-900 text-white px-4 py-2 rounded shadow-lg hover:bg-red-800 transition">
    Back to Top
</button>
<!-- To remove overscroll -->
<style>
	:global(html, body) {
		overscroll-behavior: none; /* disables overscroll bounce effect */
		margin: 0;
		padding: 0;
	}
	:global(body) {
		background-color: #18181b; /* match background with your design (e.g. bg-zinc-800/600) */
	}
</style>