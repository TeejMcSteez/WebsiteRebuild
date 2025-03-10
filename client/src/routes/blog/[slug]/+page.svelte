<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { marked } from 'marked';

    /**
     * @type Array<{comment: string, timestamp: string, displayName: string}>
    */
    let blogCommentJson;
    let blogContent = '';
    let blogTitle = '';
    let comment = '';
    /** @type {string}*/
    let userDisplayName;

    $: slug = $page.params.slug;

    /**
     * Fetches blog content and comments from Supabase on component mount.
     * Parses the blog content using marked and sets up comments.
     * @async
     * @function
     * @returns {Promise<void>}
     */
    onMount(async () => {
        // Check if the URL hash contains access token info
        if (window.location.hash.includes('access_token')) {
            const params = new URLSearchParams(window.location.hash.substring(1));
            const token = params.get('access_token');
            if (token) {
                // Redirect to endpoint to store the token as a cookie
                window.location.href = `/blog/${slug}/api/setAccessToken?access_token=${token}`;
                return;
            }
        }

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
            try {
                blogCommentJson = typeof data.comments === 'string'
                    ? JSON.parse(data.comments)
                    : (data.comments || []);
                console.log('Parsed comments: ', blogCommentJson);
            } catch (err) {
                if (err instanceof Error) {
                    console.log('Error parsing comments: ', err.message);
                } else {
                    console.log('Error parsing comments: ', err);
                }
            }

            try {
                blogContent = await marked(blogContent);
            } catch (err) {
                console.log(err);
            }
        }
        await getUser();
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
                userDisplayName,
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

    /**
     * Initiates Google OAuth sign-in process.
     * Redirects user to Google authentication and handles the callback.
     * @async
     * @function
     * @returns {Promise<void>}
     */
    async function signInWithGoogle() {
        const res = await fetch(`/blog/${slug}/api/OAuth`);
        const jsonResponse = await res.json();
        if (jsonResponse.success && jsonResponse.url) {
            window.location.href = jsonResponse.url;
        } else {
            console.error('Error during sign in: ', jsonResponse.error);
        }
    }
    
    /**
     * Retrieves the current authenticated user's information.
     * Updates the userDisplayName with the Google display name if available.
     * @async
     * @function
     * @returns {Promise<void>}
     */
    async function getUser() {
        const res = await fetch(`/blog/${slug}/api/getUser`);
        const json = await res.json();

        if (!json.user) {
            userDisplayName = 'Anonymous';
        } else {
            userDisplayName = json.user.user_metadata.name;
        }
    }
</script>

<div id="header" class="bg-zinc-800 flex flex-row justify-between items-center min-w-screen">
    <h1 class="m-5 p-2 text-3xl text-white">{blogTitle}</h1>
    <button on:click={() => history.back()} class="text-3xl bg-zinc-900 text-white hover:bg-red-800 hover:animate-pulse rounded-xl p-5 m-2">Back</button>
</div>

<div class="bg-zinc-600 min-w-screen min-h-screen p-10">
    <div id="blogContent" class="text-white text-xl flex flex-col items-center justify-center p-10">
        {@html blogContent}
    </div>
</div>

<div id="commentWrapper" class="bg-zinc-800 min-w-screen min-h-screen p-10">
    <h2 class="text-2xl text-white underline">Comments</h2>
    <p class="text-s text-white italic">If you would like your display name to be added sign in with Google with the button below and it uses your gmail display name!</p>
    <div id="commentSection">
        {#each blogCommentJson as comment}
            <div class="bg-zinc-800 p-5 m-5 rounded-md">
                <p class="text-white">{comment.comment}</p>
                <footer class="text-white">{comment.timestamp} UTC - {comment.displayName}</footer>
            </div>
        {/each}
    </div>
    
    <div id="addCommentSection" class="p-5">
        <h2 class="text-2xl text-white">Add a Comment</h2>
        <textarea bind:value={comment} class="w-full p-2 rounded-md" rows="4" placeholder="Write your comment here..."></textarea>
        <button on:click={() => submitComment()} class="mt-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Submit</button>
    </div>
</div>

<div class="bg-zinc-800 flex flex-col items-center justify-center">
    <p class="text-white ">You are currently commenting as: {userDisplayName}</p>
    <button class="m-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700" on:click={() => signInWithGoogle()}>Sign in With Google</button>
</div>

<!-- Back to Top Button -->
<button on:click={() => scrollTo({top: 0, behavior: "smooth"})} class="fixed bottom-4 right-4 bg-zinc-900 text-white px-4 py-2 rounded shadow-lg hover:bg-red-800 transition">
    Back to Top
</button>