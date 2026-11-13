
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

/**
 * Get upcoming service projects from the database.
 */
const getUpcomingProjects = async (number_of_projects) => {
    try {
        const query = `
            SELECT
                p.project_id,
                p.name AS title,
                p.description,
                p.project_date AS date,
                p.location,
                p.organization_id,
                o.name AS organization_name
            FROM project AS p
            INNER JOIN organization AS o
                ON p.organization_id = o.organization_id
            WHERE p.project_date >= CURRENT_DATE
            ORDER BY p.project_date ASC
            LIMIT $1;
        `;

        const result = await db.query(query, [number_of_projects]);

        return result.rows;
    } catch (error) {
        console.error('Error retrieving upcoming projects:', error);
        throw error;
    }
};

/**
 * Get details of a single service project by its ID.
 */
const getProjectDetails = async (id) => {
    try {
        const query = `
            SELECT
                p.project_id,
                p.name AS title,
                p.description,
                p.project_date AS date,
                p.location,
                p.organization_id,
                o.name AS organization_name
            FROM project AS p
            INNER JOIN organization AS o
                ON p.organization_id = o.organization_id
            WHERE p.project_id = $1;
        `;

        const result = await db.query(query, [id]);

        return result.rows[0];
    } catch (error) {
        console.error('Error retrieving project details:', error);
        throw error;
    }
};

/**
 * Get all service projects belonging to a specific category.
 */
const getProjectsByCategoryId = async (categoryId) => {
    try {
        const query = `
            SELECT
                p.project_id,
                p.name AS title,
                p.description,
                p.location,
                p.project_date AS date,
                p.organization_id,
                o.name AS organization_name,
                c.category_id,
                c.name AS category_name
            FROM project AS p
            INNER JOIN organization AS o
                ON p.organization_id = o.organization_id
            INNER JOIN category AS c
                ON p.category_id = c.category_id
            WHERE c.category_id = $1
            ORDER BY p.project_date ASC;
        `;

        const result = await db.query(query, [categoryId]);

        return result.rows;
    } catch (error) {
        console.error('Error retrieving projects by category:', error);
        throw error;
    }
};

/**
 * Create a new service project in the database.
 */
const createProject = async (
    title,
    description,
    location,
    date,
    organizationId
) => {
    const query = `
        INSERT INTO project
            (name, description, location, project_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const queryParams = [
        title,
        description,
        location,
        date,
        organizationId
    ];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project.');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(
            'Created new project with ID:',
            result.rows[0].project_id
        );
    }

    return result.rows[0].project_id;
};

// Export the model functions.
export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    getProjectsByCategoryId,
    createProject
};
