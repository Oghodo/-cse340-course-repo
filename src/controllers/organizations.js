
import { body, validationResult } from 'express-validator';

/**
 * Import model functions
 */
import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';

/**
 * Validation and sanitization rules for organization form.
 */
const organizationValidation = [
    body('name')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),

    body('description')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),

    body('contactEmail')
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

/**
 * Display all organizations.
 */
const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';

        res.render('organizations', { title, organizations });
    } catch (error) {
        console.error('Error displaying organizations:', error);
        next(error);
    }
};

/**
 * Display details of a specific organization
 * and its associated service projects.
 */
const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const organizationId = req.params.id;

        const organizationDetails = await getOrganizationDetails(organizationId);

        if (!organizationDetails) {
            const error = new Error('Organization not found.');
            error.status = 404;
            return next(error);
        }

        const projects = await getProjectsByOrganizationId(organizationId);

        const title = 'Organization Details';

        res.render('organization', {
            title,
            organizationDetails,
            projects
        });
    } catch (error) {
        console.error('Error displaying organization details:', error);
        next(error);
    }
};

/**
 * Display the form for creating a new organization.
 */
const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
};

/**
 * Process the new organization form submission.
 */
const processNewOrganizationForm = async (req, res, next) => {
    try {
        // Check for validation errors
        const results = validationResult(req);

        if (!results.isEmpty()) {
            // Store validation errors as flash messages
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            // Redirect back to the form
            return res.redirect('/new-organization');
        }

        const { name, description, contactEmail } = req.body;

        const logoFilename = 'placeholder-logo.png';

        const organizationId = await createOrganization(
            name,
            description,
            contactEmail,
            logoFilename
        );

        // Store a success flash message
        req.flash('success', 'Organization added successfully!');

        // Redirect to the new organization's details page
        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        next(error);
    }
};

// Export controller functions
export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation
};
