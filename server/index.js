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
const Database = require('better-sqlite3');

const db = new Database('database.db');

// Create a table for posts if they dont exist
db.exec(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY,
    postSlug TEXT,
    comment TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP    
)`);

// Called to insert a comment with title of post and comment

const insertComment = db.prepare(`INSERT INTO comments (postSlug, comment) VALUES (?, ?)`);

const POSTS_DIR = path.join(__dirname, 'posts');

app.use(cors());
app.use(server.json());

//routes
// gets all blog titles
app.get('/api/blogs', (req, res) => {
    const files = fs.readdirSync(POSTS_DIR);
    const posts = files.map(file => {
        const filePath = path.join(POSTS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        const {data} = matter(content);

        return {
            title: data.title,
            slug: file.replace('.md', '')
        };

    });
    res.json(posts);
});
// Gets a single blog content
app.get('/api/blogs/:slug', (req, res) => {
    const filePath = path.join(POSTS_DIR, `${req.params.slug}.md`);

    if (!fs.existsSync(filePath)) {
        res.status(404).json({message: 'Post not found'});
        return;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    res.json({content});
});
// Gets all comments for a blog
app.get('/api/blogs/:slug/comments', (req, res) => {
    const response = db.prepare(`SELECT * FROM comments WHERE postSlug = ?`);
    const comments = response.all(req.params.slug);
    
    res.json(comments);
});
// add comment handler for blog
app.post('/api/blogs/:slug/addComment', (req, res) => {
    const { slug } = req.params;
    const { comment } = req.body;

    if (!comment) {
        res.status(400).json({ message: 'Comment is required' });
        return;
    }

    insertComment.run(slug, comment);
    
    res.json({ message: 'Comment added' });
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