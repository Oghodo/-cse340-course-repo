
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * Configure Express middleware
 */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

/**
 * Routes
 */

// Home page
app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

// Organizations page
app.get('/organizations', (req, res) => {
  res.render('organizations', { title: 'Organizations' });
});

// Projects page
app.get('/projects', (req, res) => {
  res.render('projects', { title: 'Projects' });
});

// Categories page
app.get('/categories', (req, res) => {
  res.render('categories', { title: 'Categories' });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
