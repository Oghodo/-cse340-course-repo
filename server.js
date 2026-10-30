import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
  * Configure Express middleware
  */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

/**
  * Routes
  */
  // home page
app.get('/', (req, res) => {
    const title = 'Home';
  res.render('home', { title });
});
   // organizations page
app.get('/organizations', (req, res) => {
    const title = 'Organizations';
    res.render('organizations', { title });
});
  // projects page
app.get('/projects', (req, res) => {
    const title = 'Projects';
    res.render('projects', { title });
});
// Categories page
app.get('/categories', (req, res) => {
    const title = 'Categories';
    res.render('categories', { title });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));