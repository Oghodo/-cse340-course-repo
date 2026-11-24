
import db from './db.js';

/**
 * Get all categories from the database.
 */
const getAllCategories = async () => {
    try {
        const result = await db.query(
            'SELECT * FROM category ORDER BY category_id ASC'
        );

        return result.rows;
    } catch (error) {
        console.error('Error retrieving categories:', error);
        throw error;
    }
};

/**
 * Get a single category by its ID.
 */
const getCategoryById = async (id) => {
    try {
        const query = `
            SELECT
                category_id,
                name
            FROM category
            WHERE category_id = $1
        `;

        const result = await db.query(query, [id]);

        return result.rows[0];
    } catch (error) {
        console.error('Error retrieving category:', error);
        throw error;
    }
};

/**
 * Create a new category.
 */
const createCategory = async (name) => {
    try {
        const query = `
            INSERT INTO category (name)
            VALUES ($1)
            RETURNING category_id;
        `;

        const result = await db.query(query, [name]);

        return result.rows[0].category_id;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

/**
 * Update an existing category.
 */
const updateCategory = async (id, name) => {
    try {
        const query = `
            UPDATE category
            SET name = $1
            WHERE category_id = $2
            RETURNING category_id;
        `;

        const result = await db.query(query, [name, id]);

        if (result.rows.length === 0) {
            throw new Error('Failed to update category.');
        }

        return result.rows[0].category_id;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

/**
 * Get the category assigned to a service project.
 * Each project has one category through project.category_id.
 */
const getCategoriesByProjectId = async (projectId) => {
    try {
        const query = `
            SELECT
                c.category_id,
                c.name
            FROM category AS c
            INNER JOIN project AS p
                ON p.category_id = c.category_id
            WHERE p.project_id = $1
            ORDER BY c.category_id ASC;
        `;

        const result = await db.query(query, [projectId]);

        return result.rows;
    } catch (error) {
        console.error('Error retrieving project category:', error);
        throw error;
    }
};

/**
 * Assign one category to a service project.
 */
const assignCategoryToProject = async (categoryId, projectId) => {
    try {
        const query = `
            UPDATE project
            SET category_id = $1
            WHERE project_id = $2
            RETURNING project_id;
        `;

        const result = await db.query(query, [categoryId, projectId]);

        if (result.rows.length === 0) {
            throw new Error('Project not found.');
        }

        return result.rows[0].project_id;
    } catch (error) {
        console.error('Error assigning category to project:', error);
        throw error;
    }
};

/**
 * Update the category assignment for a service project.
 * Only one category can be assigned to each project.
 */
const updateCategoryAssignments = async (projectId, categoryIds) => {
    try {
        if (!Array.isArray(categoryIds) || categoryIds.length !== 1) {
            throw new Error('Please select exactly one category.');
        }

        return await assignCategoryToProject(
            categoryIds[0],
            projectId
        );
    } catch (error) {
        console.error('Error updating project category:', error);
        throw error;
    }
};

export {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    getCategoriesByProjectId,
    assignCategoryToProject,
    updateCategoryAssignments
};
