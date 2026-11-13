
import { body, validationResult } from 'express-validator';

/**
 * Import model functions.
 */
import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';

/**
 * Validation and sanitization rules for organization forms.
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
const showNewOrganizationForm = async (req, res, next) => {
    try {
        const title = 'Add New Organization';

        res.render('new-organization', { title });
    } catch (error) {
        next(error);
    }
};

/**
 * Process the new organization form submission.
 */
const processNewOrganizationForm = async (req, res, next) => {
    try {
        const results = validationResult(req);

        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });

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

        req.flash('success', 'Organization added successfully!');

        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        next(error);
    }
};

/**
 * Display the form for editing an existing organization.
 */
const showEditOrganizationForm = async (req, res, next) => {
    try {
        const organizationId = req.params.id;

        const organizationDetails = await getOrganizationDetails(organizationId);

        if (!organizationDetails) {
            const error = new Error('Organization not found.');
            error.status = 404;
            return next(error);
        }

        const title = 'Edit Organization';

        res.render('edit-organization', {
            title,
            organizationDetails
        });
    } catch (error) {
        console.error('Error displaying edit organization form:', error);
        next(error);
    }
};

/**
 * Process the edit organization form submission.
 */
const processEditOrganizationForm = async (req, res, next) => {
    try {
        const results = validationResult(req);

        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            return res.redirect(`/edit-organization/${req.params.id}`);
        }

        const organizationId = req.params.id;

        const {
            name,
            description,
            contactEmail,
            logoFilename
        } = req.body;

        const updatedOrganizationId = await updateOrganization(
            organizationId,
            name,
            description,
            contactEmail,
            logoFilename
        );

        if (!updatedOrganizationId) {
            const error = new Error('Organization not found.');
            error.status = 404;
            return next(error);
        }

        req.flash('success', 'Organization updated successfully!');

        res.redirect(`/organization/${updatedOrganizationId}`);
    } catch (error) {
        next(error);
    }
};

/**
 * Export controller functions.
 */
export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
};
