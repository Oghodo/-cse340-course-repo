
import {
    body,
    validationResult
} from 'express-validator';

import {
    getUpcomingProjects,
    getProjectDetails,
    createProject
} from '../models/projects.js';

import {
    getCategoriesByProjectId
} from '../models/categories.js';

import {
    getAllOrganizations
} from '../models/organizations.js';

// Number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

/**
 * Validation rules for new service project forms.
 */
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 999 })
        .withMessage('Description must be less than 1000 characters'),

    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 199 })
        .withMessage('Location must be less than 200 characters'),

    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),

    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

/**
 * Display the upcoming service projects page.
 */
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';

        res.render('projects', { title, projects });
    } catch (error) {
        console.error('Error displaying upcoming projects:', error);
        next(error);
    }
};

/**
 * Display details of a single service project
 * including its associated categories.
 */
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const id = req.params.id;

        const project = await getProjectDetails(id);

        if (!project) {
            const error = new Error('Service project not found.');
            error.status = 404;
            return next(error);
        }

        const categories = await getCategoriesByProjectId(id);
        const title = project.title;

        res.render('project', {
            title,
            project,
            categories
        });
    } catch (error) {
        console.error('Error displaying project details:', error);
        next(error);
    }
};

/**
 * Display the form for creating a new service project.
 */
const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Add New Service Project';

        res.render('new-project', {
            title,
            organizations
        });
    } catch (error) {
        console.error('Error displaying new project form:', error);
        next(error);
    }
};

/**
 * Process the new service project form submission.
 */
const processNewProjectForm = async (req, res) => {

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const {
        title,
        description,
        location,
        date,
        organizationId
    } = req.body;

    try {
        await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash(
            'success',
            'New service project created successfully!'
        );

        res.redirect('/projects');
    } catch (error) {
        console.error('Error creating new project:', error);

        req.flash(
            'error',
            'There was an error creating the service project.'
        );

        res.redirect('/new-project');
    }
};

// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation
};
