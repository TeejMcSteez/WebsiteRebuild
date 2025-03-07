require('dotenv').config();

const path = require('node:path');
const server = require('express');
const cors = require('cors');
const fs = require('node:fs');
const matter = require('gray-matter');
const app = server();
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const { uid } = require('uid');

const POSTS_DIR = path.join(__dirname, 'posts');

const supabase = createClient('https://dzqcqtucdqznjvagxmhj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6cWNxdHVjZHF6bmp2YWd4bWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDE5OTUsImV4cCI6MjA1NjM3Nzk5NX0.iUdqHG_dvoEfqndwfgqhz1ikik7H7PPk2okKlz8xlb8');

app.use(cors());
app.use(server.json());

function signToken() {
    return jwt.sign({ id: uid()}, // random uid
        fs.readFileSync(path.join(__dirname, process.env.KEYPATH)), // sign key
        {
            expiresIn: '1h', // expires in an hr
        }
    );
}

// Authentication middleware
const requireAuth = async (req, res, next) => {
    // use jwt or local storage to properly authenticate the user
};

function getBlogTitles() {
    const blogTitles = fs.readdirSync(POSTS_DIR);
    return blogTitles;
}

function getBlogPost(title) {
    const blogContent = fs.readFileSync(path.join(POSTS_DIR, title), 'utf-8');
    const parsedContent = matter(blogContent);
    return {slug: title, content: parsedContent};
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});
// Add authing route handling for google login
app.get('/api/google/auth', async (req, res) => {
    
});

app.get('/api/blogTitles', (req, res) => {
    const blogTitles = getBlogTitles();
    res.json(blogTitles);
});

app.get('/api/database/titles', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('blogs')
            .select('slug');
        
        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/blogPost/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const blogPost = getBlogPost(title.concat('.md'));

        // send the blog post to front end database
        const { data, error } = await supabase
            .from('blogs')
            .insert([
                {
                    slug: blogPost.slug.replace('.md', ''),
                    content: blogPost.content.content
                }
            ])
            .select();

        if (error) {
            console.error(error);
            return res.status(500).json({ error: error });
        }

        console.log('Data inserted successfully: ', data);
        res.json({ data: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add login page route
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
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