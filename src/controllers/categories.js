
import {
    body,
    validationResult
} from 'express-validator';

import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    getCategoriesByProjectId,
    updateCategoryAssignments
} from '../models/categories.js';

import {
    getProjectsByCategoryId,
    getProjectDetails
} from '../models/projects.js';

/**
 * Validation rules for category forms.
 */
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

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
 * Display the form for creating a new category.
 */
const showNewCategoryForm = (req, res) => {
    const title = 'Create New Category';

    res.render('new-category', { title });
};

/**
 * Process the new category form submission.
 */
const processNewCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-category');
    }

    try {
        const { name } = req.body;

        await createCategory(name);

        req.flash('success', 'Category created successfully!');

        res.redirect('/categories');
    } catch (error) {
        console.error('Error creating category:', error);
        next(error);
    }
};

/**
 * Display the form for editing an existing category.
 */
const showEditCategoryForm = async (req, res, next) => {
    try {
        const id = req.params.id;

        const category = await getCategoryById(id);

        if (!category) {
            const error = new Error('Category not found.');
            error.status = 404;
            return next(error);
        }

        const title = 'Edit Category';

        res.render('edit-category', {
            title,
            category
        });
    } catch (error) {
        console.error('Error displaying edit category form:', error);
        next(error);
    }
};

/**
 * Process the edit category form submission.
 */
const processEditCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-category/${req.params.id}`);
    }

    try {
        const id = req.params.id;
        const { name } = req.body;

        await updateCategory(id, name);

        req.flash('success', 'Category updated successfully!');

        res.redirect(`/category/${id}`);
    } catch (error) {
        console.error('Error updating category:', error);
        next(error);
    }
};

/**
 * Display the form for assigning one category to a project.
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

        const selectedCategoryId = assignedCategories.length > 0
            ? assignedCategories[0].category_id
            : '';

        const title = 'Assign Category to Project';

        res.render('assign-categories', {
            title,
            projectId,
            projectDetails,
            categories,
            assignedCategories,
            selectedCategoryId
        });
    } catch (error) {
        console.error('Error displaying assign category form:', error);
        next(error);
    }
};

/**
 * Process the category assignment form submission.
 */
const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        // Accept either a single categoryId or the existing categoryIds field.
        const selectedCategory = req.body.categoryId ?? req.body.categoryIds;

        if (!selectedCategory) {
            req.flash('error', 'Please select a category.');
            return res.redirect(`/project/${projectId}/assign-categories`);
        }

        // Convert the submitted value into an array.
        const categoryIdsArray = Array.isArray(selectedCategory)
            ? selectedCategory
            : [selectedCategory];

        // A project can have only one category.
        if (categoryIdsArray.length !== 1) {
            req.flash('error', 'Please select exactly one category.');
            return res.redirect(`/project/${projectId}/assign-categories`);
        }

        await updateCategoryAssignments(
            projectId,
            categoryIdsArray
        );

        req.flash('success', 'Category updated successfully.');

        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project category:', error);
        next(error);
    }
};

// Export controller functions.
export {
    categoryValidation,
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};
