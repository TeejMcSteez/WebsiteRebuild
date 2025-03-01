# How I Built My Blog Software 🚀

## Overview

Initially, I planned to swap content directly between servers, but that approach quickly proved to be both cumbersome and inefficient. I decided it was time to explore a more robust solution by learning a new database!

After exploring Vercel’s storage options, **Supabase** caught my eye—it sounded incredibly cool and intriguing. I decided to give it a try, and it ended up working great! 🎉

## Front End 💻

- **Fetching Data:**  
  When the user loads the DOM, the frontend fetches all the post titles from the Supabase database (SD).

- **Navigation:**  
  When a user clicks on a title, the slug (a URL-friendly version of the title) is added to the URL. Svelte handles the routing, loading a new page corresponding to that title.

- **Rendering Content:**  
  On the new page, the title is displayed and the accompanying content (including post details and comments) is fetched. The markdown is then rendered into HTML using the grey-matter parser.

## Back End 🛠️

- **Uploading Files:**  
  A simple HTML page powered by Node.js facilitates file uploads. It compares the current titles in the Supabase database with those in the server's post directory.

- **Synchronization:**  
  Much like the client side, clicking on a title initiates an upload of the title and its content to the SD, effectively splitting the responsibilities between the front and back ends.

## Conclusion ✨

I plan to add authentication for submitting comments and further refine the UI. Although I’m using TailwindCSS, I feel there's still room for improvement in making it look even better.

I’d love to hear your thoughts on how to enhance this website/blog—any feedback is more than welcome! 😊
