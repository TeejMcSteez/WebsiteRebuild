<script>
   import { goto } from "$app/navigation";
   import { onMount } from "svelte";
   /**
    * @type {Array<{slug: string}>}
    */
   let blogs = [];

   import { SUPABASE_URL, SUPABASE_SECRET } from '$env/static/private';
   import { createClient } from "@supabase/supabase-js";

   const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET);

   onMount(async () => {
      const { data, error } = await supabase
      .from('blogs')
      .select('slug');

      if (error) {
         console.log(error);
      } else {
         blogs = data;
         console.log(data);
      }
   });

   /**
    * 
    * @param blogSlug {string}
    */
   async function getBlog(blogSlug) {
      await goto(`/blog/${blogSlug}`);
   }
</script>

<div class="bg-zinc-600 min-w-screen min-h-screen">
   <div id="header" class="bg-zinc-800 flex flex-row justify-between items-center min-w-screen p-12">
      <h1 class="text-4xl text-white">Blog Posts</h1>
      <button on:click={async () => await goto('/')} class="text-3xl bg-zinc-900 text-white hover:bg-red-800 hover:animate-pulse rounded-xl p-3">Home</button>
   </div>
   
   <div id="blogPostSection" class="m-5 p-10 text-2xl text-white flex flex-col items-center justify-center">
      <ul>
         {#if !blogs}
            <h2 class="flex flex-col text-white text-2xl items-center jusitfy-center bg-zinc-500">Please come back later for some new posts!</h2>
         {/if}
         {#each blogs as blog}
            <li><button on:click={() => getBlog(blog.slug)} on:keydown={(e) => e.key === 'Enter' && getBlog(blog.slug)} class="text-white m-2 p-2 text-2xl bg-zinc-700 hover:bg-zinc-300 hover:animate-pulse rounded-xl">{blog.slug}</button></li>
         {/each}
         
      </ul>
   </div>
</div>