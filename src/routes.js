
import express from 'express';

import { showHomePage } from './controllers/home.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// New organization form
router.get('/new-organization', showNewOrganizationForm);

// Handle new organization form submission with validation
router.post(
    '/new-organization',
    organizationValidation,
    processNewOrganizationForm
);

// Edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Handle edit organization form submission with validation
router.post(
    '/edit-organization/:id',
    organizationValidation,
    processEditOrganizationForm
);

// New service project form
router.get('/new-project', showNewProjectForm);

// Handle new service project form submission with validation
router.post(
    '/new-project',
    projectValidation,
    processNewProjectForm
);

// Error-handling route
router.get('/test-error', testErrorPage);

// Organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Service project details page
router.get('/project/:id', showProjectDetailsPage);

// Category details page
router.get('/category/:id', showCategoryDetailsPage);

export default router;

