
import db from './db.js';

/**
 * Get all categories from the database.
 */
export async function getAllCategories() {
    try {
        const result = await db.query(
            'SELECT * FROM category ORDER BY category_id ASC'
        );

        return result.rows;
    } catch (error) {
        console.error('Error retrieving categories:', error);
        throw error;
    }
}
