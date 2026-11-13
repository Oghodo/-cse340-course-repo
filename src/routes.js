
import express from 'express';

import { showHomePage } from './controllers/home.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage
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

// Error-handling route
router.get('/test-error', testErrorPage);

// Organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Service project details page
router.get('/project/:id', showProjectDetailsPage);

// Category details page
router.get('/category/:id', showCategoryDetailsPage);

export default router;
