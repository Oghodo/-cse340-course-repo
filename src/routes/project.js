
import express from 'express';

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation
} from '../controllers/projects.js';

const router = express.Router();

// Display all upcoming service projects
router.get('/projects', showProjectsPage);

// Display an individual service project
router.get('/project/:id', showProjectDetailsPage);

// Display the new project form
router.get('/new-project', showNewProjectForm);

// Process the new project form
router.post(
    '/new-project',
    projectValidation,
    processNewProjectForm
);

export default router;
