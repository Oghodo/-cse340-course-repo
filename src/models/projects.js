
import db from './db.js';

/**
 * Get all projects from the database
 * along with their organization and category names.
 */
const getAllProjects = async () => {
    try {
        const query = `
            SELECT
                p.project_id,
                p.name,
                p.description,
                p.location,
                p.project_date,
                p.organization_id,
                o.name AS organization_name,
                c.name AS category_name
            FROM project AS p
            INNER JOIN organization AS o
                ON p.organization_id = o.organization_id
            INNER JOIN category AS c
                ON p.category_id = c.category_id
            ORDER BY p.project_date ASC;
        `;

        const result = await db.query(query);

        return result.rows;
    } catch (error) {
        console.error('Error retrieving projects:', error);
        throw error;
    }
};

/**
 * Get projects associated with a specific organization.
 */
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            name,
            description,
            location,
            project_date
        FROM project
        WHERE organization_id = $1
        ORDER BY project_date ASC;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId };

