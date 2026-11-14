
import {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    updateCategoryAssignments
} from '../models/categories.js';

import {
    getProjectsByCategoryId,
    getProjectDetails
} from '../models/projects.js';

/**
 * Display all service categories.
 */
const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';

        res.render('categories', { title, categories });
    } catch (error) {
        console.error('Error displaying categories:', error);
        next(error);
    }
};

/**
 * Display details of a single category
 * and all projects belonging to that category.
 */
const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const id = req.params.id;

        const category = await getCategoryById(id);

        if (!category) {
            const error = new Error('Category not found.');
            error.status = 404;
            return next(error);
        }

        const projects = await getProjectsByCategoryId(id);
        const title = category.name;

        res.render('category', {
            title,
            category,
            projects
        });
    } catch (error) {
        console.error('Error displaying category details:', error);
        next(error);
    }
};

/**
 * Display the form for assigning categories to a project.
 */
const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            const error = new Error('Service project not found.');
            error.status = 404;
            return next(error);
        }

        const categories = await getAllCategories();

        const assignedCategories = await getCategoriesByProjectId(projectId);

        const title = 'Assign Categories to Project';

        res.render('assign-categories', {
            title,
            projectId,
            projectDetails,
            categories,
            assignedCategories
        });
    } catch (error) {
        console.error('Error displaying assign categories form:', error);
        next(error);
    }
};

/**
 * Process the category assignment form submission.
 */
const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        // Get selected category IDs from the form.
        const selectedCategoryIds = req.body.categories || [];

        // Ensure the selected IDs are always an array.
        const categoryIdsArray = Array.isArray(selectedCategoryIds)
            ? selectedCategoryIds
            : [selectedCategoryIds];

        await updateCategoryAssignments(
            projectId,
            categoryIdsArray
        );

        req.flash('success', 'Categories updated successfully.');

        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project categories:', error);
        next(error);
    }
};

// Export controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};
