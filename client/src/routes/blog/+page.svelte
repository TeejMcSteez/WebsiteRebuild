<script>
   import { goto } from "$app/navigation";
   import { onMount } from "svelte";
   /**
    * @type {Array<{slug: string}>}
    */
   let blogs = [];

   import { createClient } from "@supabase/supabase-js";

   const supabase = createClient("https://dzqcqtucdqznjvagxmhj.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6cWNxdHVjZHF6bmp2YWd4bWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDE5OTUsImV4cCI6MjA1NjM3Nzk5NX0.iUdqHG_dvoEfqndwfgqhz1ikik7H7PPk2okKlz8xlb8");

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