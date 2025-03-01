/**
 * 1. Add GitHub hook to automatically pull posts directory from GitHub to the server
 * 2. Add OAuth2.0 for the admin panel access to the supabase database.
 * 
 */
const path = require('node:path');
const server = require('express');
const cors = require('cors');
const fs = require('node:fs');
const matter = require('gray-matter');
const app = server();
const { createClient } = require('@supabase/supabase-js');

// Called to insert a comment with title of post and comment

const POSTS_DIR = path.join(__dirname, 'posts');

const supabase = createClient('https://dzqcqtucdqznjvagxmhj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6cWNxdHVjZHF6bmp2YWd4bWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDE5OTUsImV4cCI6MjA1NjM3Nzk5NX0.iUdqHG_dvoEfqndwfgqhz1ikik7H7PPk2okKlz8xlb8');



app.use(cors());
app.use(server.json());
/**
 * Gets all the blog titles from the posts directory
 * @returns {array<string>} returns an array of blog titles
 */
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
    res.json(blogTitles); // Return the blog titles as a JSON response
});

app.get('/api/blogPost/:title', async (req, res) => {
    const title = req.params.title;
    const blogPost = getBlogPost(title);

    console.log(blogPost);

    console.log(blogPost.content.content);

    console.log(blogPost.slug);

    // send the blog post to front end database
    const { data, error } = await supabase
        .from('blogs')
        .insert([
            {
                slug: blogPost.slug.replace('.md', ''),
                content: blogPost.content.content,
                comments: null // comments are nullable
            }
        ]);
    if (error) {
        console.log(error);
        res.json({ error: error });
    } else {
        console.log('Data inserted successfully: ', data);
        res.json({ data: data });
    }     
});

app.get('/api/database/titles', async (req, res) => {
    const { data, error } = await supabase
        .from('blogs')
        .select('slug'); // Select only the slug column
    if (error) {
        console.log(error);
        res.json({ error: error });
    } else {
        console.log(`Titles: ${data}`);
        res.json(data); // Return the data directly
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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