
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

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsers
} from './controllers/usersController.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Home page
router.get('/', showHomePage);

// Main pages
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Dashboard route - Login required
router.get('/dashboard', requireLogin, showDashboard);

// Registered users page - Login and Admin required
router.get('/users', requireLogin, requireRole('admin'), showUsers);

// New organization form - Admin only
router.get('/new-organization', requireLogin, requireRole('admin'), showNewOrganizationForm);

router.post(
    '/new-organization',
    requireLogin,
    requireRole('admin'),
    organizationValidation,
    processNewOrganizationForm
);

// Edit organization form - Admin only
router.get(
    '/edit-organization/:id',
    requireLogin,
    requireRole('admin'),
    showEditOrganizationForm
);

router.post(
    '/edit-organization/:id',
    requireLogin,
    requireRole('admin'),
    organizationValidation,
    processEditOrganizationForm
);

// New service project form - Admin only
router.get('/new-project', requireLogin, requireRole('admin'), showNewProjectForm);

router.post(
    '/new-project',
    requireLogin,
    requireRole('admin'),
    projectValidation,
    processNewProjectForm
);

// Edit service project form - Admin only
router.get(
    '/edit-project/:id',
    requireLogin,
    requireRole('admin'),
    showEditProjectForm
);

router.post(
    '/edit-project/:id',
    requireLogin,
    requireRole('admin'),
    projectValidation,
    processEditProjectForm
);

// New category form - Admin only
router.get('/new-category', requireLogin, requireRole('admin'), showNewCategoryForm);

router.post(
    '/new-category',
    requireLogin,
    requireRole('admin'),
    categoryValidation,
    processNewCategoryForm
);

// Edit category form - Admin only
router.get(
    '/edit-category/:id',
    requireLogin,
    requireRole('admin'),
    showEditCategoryForm
);

router.post(
    '/edit-category/:id',
    requireLogin,
    requireRole('admin'),
    categoryValidation,
    processEditCategoryForm
);

// Assign categories to a project - Admin only
router.get(
    '/project/:projectId/assign-categories',
    requireLogin,
    requireRole('admin'),
    showAssignCategoriesForm
);

router.post(
    '/project/:projectId/assign-categories',
    requireLogin,
    requireRole('admin'),
    processAssignCategoriesForm
);

// Organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Service project details page
router.get('/project/:id', showProjectDetailsPage);

// Category details page
router.get('/category/:id', showCategoryDetailsPage);

// Error-handling route
router.get('/test-error', testErrorPage);

export default router;
