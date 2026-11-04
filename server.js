import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllCategories } from './src/models/categories.js';

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
app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
});
  // projects page
app.get('/projects', (req, res) => {
    const title = 'Projects';
    res.render('projects', { title });
});
// Categories page
app.get('/categories', async (req, res) => {
    const nav = await getNav();

    const categories = await getAllCategories();

    res.render('categories', {
        title: 'Service Project Categories',
        nav,
        categories });
    });
app.listen(PORT, async () => {
    try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process with an erro code
  }
});

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));
