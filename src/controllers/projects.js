
import {
    getUpcomingProjects,
    getProjectDetails
} from '../models/projects.js';

import {
    getCategoriesByProjectId
} from '../models/categories.js';

// Number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

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

// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage
};
