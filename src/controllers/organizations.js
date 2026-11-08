
/**
 * Import model functions
 */
import {
    getAllOrganizations,
    getOrganizationDetails
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';

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

// Export controller functions
export {
    showOrganizationsPage,
    showOrganizationDetailsPage
};
