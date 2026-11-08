
import express from 'express';

import { showHomePage } from './controllers/home.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage
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

// Error-handling route
router.get('/test-error', testErrorPage);

// Organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Service project details page
router.get('/project/:id', showProjectDetailsPage);

// Category details page
router.get('/category/:id', showCategoryDetailsPage);

export default router;

