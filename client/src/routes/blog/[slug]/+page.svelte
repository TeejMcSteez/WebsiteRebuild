<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { marked } from 'marked';

    let blogContent = '';
    let blogTitle = '';

    $: slug = $page.params.slug;

    onMount(async () => {
        const res = await fetch(`http://localhost:3000/api/blogs/${slug}`);
        const data = await res.json();
        blogContent = await marked(data.content);
        blogTitle = data.title;
    });
</script>

<div class="bg-zinc-600 min-w-screen min-h-screen p-10">
    <div id="header" class="bg-zinc-800 flex flex-row justify-between items-center min-w-screen p-12">
        <h1 class="text-4xl text-white">{blogTitle}</h1>
        <button on:click={() => history.back()} class="text-3xl bg-zinc-900 text-white hover:bg-red-800 hover:animate-pulse rounded-xl p-3">Back</button>
    </div>
    <div id="blogContent" class="text-white text-xl flex flex-col items-center justify-center p-10">
        {@html blogContent}
    </div>
</div>
