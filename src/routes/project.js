import express from 'express';
import {
    showProjectsPage,
    showProjectDetailsPage
} from '../controllers/projects.js';

const router = express.Router();

// Route for all upcoming service projects
router.get('/projects', showProjectsPage);

// Route for an individual service project
router.get('/project/:id', showProjectDetailsPage);

export default router;