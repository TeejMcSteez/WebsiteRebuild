<script>
   import { goto } from "$app/navigation";
   import { onMount } from "svelte";
   /**
    * @type {Array<{slug: string}>}
    */
   let blogs = [];

   onMount(async () => {
      blogs = await getSupabaseTitles();
   });

   async function getSupabaseTitles() {
      try {
         const res = await fetch('/blog/api/supabaseTitles');
         const json = await res.json();

         if(!res.ok) {
            throw new Error(json.error || 'Failed to fetch');
         }
         return json.data;
      } catch (err) {
         console.log(err);
      }
   }

   /**
    * 
    * @param blogSlug {string}
    */
   async function getBlog(blogSlug) {
      await goto(`/blog/${blogSlug}`);
   }
</script>

<div class="dark:bg-zinc-600 min-w-screen min-h-screen">
   <div id="header" class="bg-zinc-800 flex flex-row justify-between items-center min-w-screen p-5">
      <h1 class="text-4xl text-white">Blog Posts</h1>
      <button on:click={async () => await goto('/')} class="text-3xl bg-zinc-900 text-white hover:bg-red-800 hover:animate-pulse rounded-xl p-3">Home</button>
   </div>
   
   <div id="blogPostSection" class="m-5 p-10 text-2xl dark:text-white flex flex-col items-center justify-center">
      <ul>
         {#if !blogs}
            <h2 class="flex flex-col text-white text-2xl items-center jusitfy-center bg-zinc-500">Please come back later for some new posts!</h2>
         {/if}
         {#each blogs as blog}
            <li><button on:click={() => getBlog(blog.slug)} on:keydown={(e) => e.key === 'Enter' && getBlog(blog.slug)} class="dark:text-white m-2 p-2 text-2xl dark:bg-zinc-700 bg-zinc-400 hover:bg-zinc-300 hover:animate-pulse rounded-xl">{blog.slug}</button></li>
         {/each}
         
      </ul>
   </div>
</div>

<!-- To remove overscroll -->
<style>
	:global(html, body) {
		overscroll-behavior: none; /* disables overscroll bounce effect */
		margin: 0;
		padding: 0;
	}
	:global(body) {
		background-color: rgb(255, 255, 255); /* match background with your design (e.g. bg-zinc-800/600) */
	}
</style>