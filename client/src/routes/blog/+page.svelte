<script>

   import { goto } from "$app/navigation";
   import { onMount } from "svelte";
   /**
    * @type {Array<{slug: string}>}
    */
   let blogs = [];
   let blogTitlePath = "http://localhost:3000/api/blogs";

   onMount(async () => {
      const res = await fetch(blogTitlePath);
      blogs = await res.json();
      console.log(blogs);
   });
   /**
    * 
    * @param blogSlug {string}
    */
   async function getBlog(blogSlug) {
      await goto(`/blog/${blogSlug}`);
   }
</script>
<!-- TODO:
 Main: Figure out a smart way to actually get blogs and post them to the landing page and then find a sensible way for the user 
 to the view the blog which will be in markdown with either loading a new window or re-rendering the page somehow.

 1. Upon clicking on a title, the page will re-render with the fetched contents (in markdown format) of the post.
    1a. With the title as the header isntead of the blog landing page and the contents of the post below it.
    1b. Also try to make a smoothe and clean in possbile in transition but never did this before so might look like shit lol.
 2. Add a section for comments
 3. add a function on:click will fetch the blog title in the tag from the node server.
-->

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