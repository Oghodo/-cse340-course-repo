
import {
    getUpcomingProjects,
    getProjectDetails
} from '../models/projects.js';

// Number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

/**
 * Display the upcoming service projects page.
 */
const showProjectsPage = async (req, res) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';

        res.render('projects', { title, projects });
    } catch (error) {
        console.error('Error displaying upcoming projects:', error);
        res.status(500).send('An error occurred while retrieving upcoming projects.');
    }
};

/**
 * Display details of a single service project.
 */
const showProjectDetailsPage = async (req, res) => {
    try {
        const id = req.params.id;

        const project = await getProjectDetails(id);

        if (!project) {
            return res.status(404).send('Service project not found.');
        }

        const title = project.title;

        res.render('project', { title, project });
    } catch (error) {
        console.error('Error displaying project details:', error);
        res.status(500).send('An error occurred while retrieving project details.');
    }
};

// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage
};
