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

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ========================================
// Express Middleware Configuration
// ========================================

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
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
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';

        res.render('organizations', {
            title,
            organizations
        });
    } catch (error) {
        console.error('Error loading organizations:', error);
        res.status(500).send('Unable to load organizations.');
    }
});

// Projects page
app.get('/projects', async (req, res) => {
    try {
        const projects = await getAllProjects();
        const title = 'Service Projects';

        res.render('projects', {
            title,
            projects
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        res.status(500).send('Unable to load service projects.');
    }
});

// Categories page
app.get('/categories', async (req, res) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Project Categories';

        res.render('categories', {
            title,
            categories
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        res.status(500).send('Unable to load categories.');
    }
});

// ========================================
// Start the Server
// ========================================

app.listen(PORT, async () => {
    try {
        await testConnection();

        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);

        const projects = await getAllProjects();
        console.log(`Successfully retrieved ${projects.length} service projects.`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
});
