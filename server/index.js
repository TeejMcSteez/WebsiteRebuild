/**
 * TODO: Write routes for frontend API for different services. 
 * I can either group services in different files with functions or write them here. 
 * Add listener function for server to listen for requests from the frontend server.
 * 
 * 1. If I am going to write a blog I need a way to write and save posts easily. 
 *   I can use markdown for the posts and save them in a database.
 *   Grab the markdown file and send it to the frontend to render.
 *   Think of a decent way to add the markdown file to the database.
 */
const path = require('node:path');
const server = require('express');
const cors = require('cors');
const fs = require('node:fs');
const matter = require('gray-matter');
const app = server();
const { createClient } = require('@supabase/supabase-js');
const { error } = require('node:console');

// Called to insert a comment with title of post and comment

const POSTS_DIR = path.join(__dirname, 'posts');

const supabase = createClient('https://dzqcqtucdqznjvagxmhj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6cWNxdHVjZHF6bmp2YWd4bWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDE5OTUsImV4cCI6MjA1NjM3Nzk5NX0.iUdqHG_dvoEfqndwfgqhz1ikik7H7PPk2okKlz8xlb8');



app.use(cors());
app.use(server.json());

function getBlogTitles() {
    const blogTitles = fs.readdirSync(POSTS_DIR);
    return blogTitles;
}
/**
 * 
 * @param {string} title title of the markdown file
 * @returns {object} returns {slug: title, content: parsedContent}
 * with the title of the doc and parsed markdown 
 */
function getBlogPost(title) {
    const blogContent = fs.readFileSync(path.join(POSTS_DIR, title), 'utf-8');
    const parsedContent = matter(blogContent);
    return {slug: title, content: parsedContent};
}

//routes
app.get('/api/blogTitles', (req, res) => {
    const blogTitles = getBlogTitles();

    console.log(blogTitles);
});

app.get('/api/blogPost/:title', (req, res) => {
    const title = req.params.title;
    const blogPost = getBlogPost(title.concat('.md'));

    console.log(blogPost);

    console.log(blogPost.content.content);

    console.log(blogPost.slug);

    // send the blog post to front end database
    const {data, error} = supabase
        .from('blogs')
        .insert([
            {
                slug: blogPost.slug.replace('.md', ''),
                content: blogPost.content.content
            }
        ]);
    if (error) {
        console.log(error);
        res.json({error: error});
    } else {
        console.log('Data inserted successfully: ', data);
        res.json({data: data});
    }     
    
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({"message": "file not found"});
})

// 500 Handler
app.use((req, res) => {
    res.status(500).json({"message": "an error occured on the server"});
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});