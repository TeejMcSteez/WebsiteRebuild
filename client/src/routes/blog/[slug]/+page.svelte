<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { marked } from 'marked';
    import { isUserAuthed } from '$lib/auth';

    /**
     * @type Array<{comment: string, timestamp: string, displayName: string}>
    */
    let blogCommentJson;
    let blogContent = '';
    let blogTitle = '';
    let comment = '';
    let userDisplayName = 'Anonymous';
    let isAuth = false;

    $: slug = $page.params.slug;

    import { createClient } from '@supabase/supabase-js'
    const supabase = createClient('https://dzqcqtucdqznjvagxmhj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6cWNxdHVjZHF6bmp2YWd4bWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDE5OTUsImV4cCI6MjA1NjM3Nzk5NX0.iUdqHG_dvoEfqndwfgqhz1ikik7H7PPk2okKlz8xlb8');

    /**
     * Fetches blog content and comments from Supabase on component mount.
     * Parses the blog content using marked and sets up comments.
     * @async
     * @function
     * @returns {Promise<void>}
     */
    onMount(async () => {
        const { data, error } = await supabase
            .from('blogs')
            .select('slug, content, comments')
            .eq('slug', slug)
            .limit(1)
            .single();
        
        if (error) {
            console.log('Error fetching blog:', error);
            blogTitle = slug;
            blogContent = '<h1>Blog not found</h1>';
        } else if (!data) {
            console.log('No blog found with the given slug');
            blogTitle = slug;
            blogContent = '<h1>Blog not found</h1>';
        } else {
            console.log('Fetched blog data:', data);
            blogContent = await marked(data.content);
            blogTitle = data.slug;
            // Parse comments if they're stored as a string
            try {
                blogCommentJson = typeof data.comments === 'string' 
                    ? JSON.parse(data.comments) // If comments are in JSON parses it 
                    : (data.comments || []); // Otherwise, use an empty array or the comments
                console.log('Parsed comments:', blogCommentJson);
            } catch (e) {
                console.error('Error parsing comments:', e);
                blogCommentJson = [];
            }
        }
        await getUser();
        isAuth = await isUserAuthed();
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
        
        const newComment = { 
            comment: comment.trim(), 
            timestamp: new Date().toUTCString(),
            displayName: userDisplayName
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

    /**
     * Initiates Google OAuth sign-in process.
     * Redirects user to Google authentication and handles the callback.
     * @async
     * @function
     * @returns {Promise<void>}
     */
    async function signInWithGoogle() {
        const redirectUri = process.env.NODE_ENV === 'production'
            ? `https://teejmcsteez.com/blog/${slug}`
            : `http://localhost:5173/blog/${slug}`;

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUri,
            },
        })
        if (error) {
            console.error('Error during sign in: ', error);
        } else {
            console.log('oauth: ', data);
            isAuth = true;
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
        const { data: { user }, error} = await supabase.auth.getUser();

        if (error) {
            console.error('Error retrieving user:', error);
        } else if (user) {
            userDisplayName = user.user_metadata.name || 'Anonymous';
            console.log('Username:', userDisplayName);
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