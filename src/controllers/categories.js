
import {
    getAllCategories,
    getCategoryById
} from '../models/categories.js';

import { getProjectsByCategoryId } from '../models/projects.js';

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

// Export controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage
};
