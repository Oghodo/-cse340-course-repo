import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllCategories } from './src/models/categories.js';
import { getAllProjects } from './src/models/projects.js';

// ========================================
// Application Configuration
// ========================================

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number
const PORT = process.env.PORT || 3000;

// Configure file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the Express application
const app = express();

// ========================================
// Express Middleware Configuration
// ========================================

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Configure the views directory
app.set('views', path.join(__dirname, 'src/views'));

// ========================================
// Application Routes
// ========================================

// Home page
app.get('/', (req, res) => {
    const title = 'Home';

    res.render('home', {
        title
    });
});

// Organizations page
app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', {
        title,
        organizations
    });
});

// Projects page
app.get('/projects', async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Projects';

    res.render('projects', {
        title,
        projects
    });
});

// Categories page
app.get('/categories', async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Project Categories';

    res.render('categories', {
        title,
        categories
    });
});

// ========================================
// Start the Server
// ========================================

app.listen(PORT, async () => {
    try {
        await testConnection();

        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
});
