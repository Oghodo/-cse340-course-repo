
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
 * Get all categories associated with a service project.
 */
const getCategoriesByProjectId = async (projectId) => {
    try {
        const query = `
            SELECT
                c.category_id,
                c.name
            FROM category AS c
            INNER JOIN project AS p
                ON c.category_id = p.category_id
            WHERE p.project_id = $1
            ORDER BY c.category_id ASC
        `;

        const result = await db.query(query, [projectId]);

        return result.rows;
    } catch (error) {
        console.error('Error retrieving project categories:', error);
        throw error;
    }
};

export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId
};

