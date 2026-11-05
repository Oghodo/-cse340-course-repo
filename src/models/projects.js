
import db from './db.js';

/**
 * Get all projects from the database.
 */
const getAllProjects = async () => {
    try {
        const query = `
            SELECT
                p.project_id,
                p.name,
                p.description,
                o.name AS organization_name,
                c.name AS category_name
            FROM project p
            INNER JOIN organization o
                ON p.organization_id = o.organization_id
            INNER JOIN category c
                ON p.category_id = c.category_id
            ORDER BY p.project_id ASC;
        `;

        const result = await db.query(query);

        return result.rows;
    } catch (error) {
        console.error('Error retrieving projects:', error);
        throw error;
    }
};

export { getAllProjects };
