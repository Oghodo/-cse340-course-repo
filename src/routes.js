
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
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Home page
router.get('/', showHomePage);

// Main listing pages
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// Create organization
router.get('/new-organization', showNewOrganizationForm);

router.post(
    '/new-organization',
    organizationValidation,
    processNewOrganizationForm
);

// Edit organization
router.get('/edit-organization/:id', showEditOrganizationForm);

router.post(
    '/edit-organization/:id',
    organizationValidation,
    processEditOrganizationForm
);

// Create service project
router.get('/new-project', showNewProjectForm);

router.post(
    '/new-project',
    projectValidation,
    processNewProjectForm
);

// Edit service project
router.get('/edit-project/:id', showEditProjectForm);

router.post(
    '/edit-project/:id',
    projectValidation,
    processEditProjectForm
);

// Create category
router.get('/new-category', showNewCategoryForm);

router.post(
    '/new-category',
    categoryValidation,
    processNewCategoryForm
);

// Edit category
router.get('/edit-category/:id', showEditCategoryForm);

router.post(
    '/edit-category/:id',
    categoryValidation,
    processEditCategoryForm
);

// Assign categories to a project
router.get(
    '/project/:projectId/assign-categories',
    showAssignCategoriesForm
);

router.post(
    '/project/:projectId/assign-categories',
    processAssignCategoriesForm
);

// Organization details
router.get('/organization/:id', showOrganizationDetailsPage);

// Project details
router.get('/project/:id', showProjectDetailsPage);

// Category details
router.get('/category/:id', showCategoryDetailsPage);

// Test error page
router.get('/test-error', testErrorPage);

export default router;
