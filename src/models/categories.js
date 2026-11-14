
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
 * Get all categories associated with a service project.
 */
const getCategoriesByProjectId = async (projectId) => {
    try {
        const query = `
            SELECT
                c.category_id,
                c.name
            FROM category AS c
            INNER JOIN project_category AS pc
                ON c.category_id = pc.category_id
            WHERE pc.project_id = $1
            ORDER BY c.category_id ASC
        `;

        const result = await db.query(query, [projectId]);

        return result.rows;
    } catch (error) {
        console.error('Error retrieving project categories:', error);
        throw error;
    }
};

/**
 * Assign a category to a service project.
 */
const assignCategoryToProject = async (categoryId, projectId) => {
    try {
        const query = `
            INSERT INTO project_category (category_id, project_id)
            VALUES ($1, $2);
        `;

        await db.query(query, [categoryId, projectId]);
    } catch (error) {
        console.error('Error assigning category to project:', error);
        throw error;
    }
};

/**
 * Update all category assignments for a service project.
 */
const updateCategoryAssignments = async (projectId, categoryIds) => {
    try {
        // Remove existing category assignments
        const deleteQuery = `
            DELETE FROM project_category
            WHERE project_id = $1;
        `;

        await db.query(deleteQuery, [projectId]);

        // Add the newly selected categories
        for (const categoryId of categoryIds) {
            await assignCategoryToProject(categoryId, projectId);
        }
    } catch (error) {
        console.error('Error updating project category assignments:', error);
        throw error;
    }
};

export {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    getCategoriesByProjectId,
    updateCategoryAssignments
};
