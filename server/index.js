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
const session = require('express-session');
const { OAuth2Client } = require('google-auth-library');
require ('dotenv').config();

// Google OAuth2 config
const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/auth/google/callback';
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Called to insert a comment with title of post and comment

const POSTS_DIR = path.join(__dirname, 'posts');

const supabase = createClient('https://dzqcqtucdqznjvagxmhj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6cWNxdHVjZHF6bmp2YWd4bWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDE5OTUsImV4cCI6MjA1NjM3Nzk5NX0.iUdqHG_dvoEfqndwfgqhz1ikik7H7PPk2okKlz8xlb8');

app.use(cors());
app.use(server.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Auth middleware
const checkAuth = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        return res.redirect('/login');
    }
    next();
};

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
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Initialize Google OAuth2 login
app.get('/auth/google', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.email']
    });
    res.redirect(url);
});

// Google OAuth2 callback
app.get('/auth/google/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Verify token and get user info
        const ticket = await oauth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload();
        
        // Here you can check if the email matches your allowed email
        if (payload.email === 'tjhall047@gmail.com') {
            req.session.isAuthenticated = true;
            res.redirect('/admin');
        } else {
            res.status(403).send('Unauthorized');
        }
    } catch (error) {
        console.error('Authentication error:', error);
        res.redirect('/login');
    }
});

// Update root route to redirect to admin if authenticated, otherwise to login
app.get('/', (req, res) => {
    if (req.session.isAuthenticated) {
        res.redirect('/admin');
    } else {
        res.redirect('/login');
    }
});

// Move admin route before the 404 handler
app.get('/admin', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Protect all API routes
app.use('/api', checkAuth);

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