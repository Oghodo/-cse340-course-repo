
import db from './db.js';

/**
 * Get all organizations from the database.
 */
const getAllOrganizations = async () => {
    const query = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM public.organization
        ORDER BY organization_id ASC;
    `;

    const result = await db.query(query);
    return result.rows;
};

/**
 * Get organization details by its unique ID.
 */
const getOrganizationDetails = async (organizationId) => {
    const query = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM public.organization
        WHERE organization_id = $1;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Create a new organization in the database.
 */
const createOrganization = async (
    name,
    description,
    contactEmail,
    logoFilename
) => {
    const query = `
        INSERT INTO public.organization
            (name, description, contact_email, logo_filename)
        VALUES ($1, $2, $3, $4)
        RETURNING organization_id;
    `;

    const queryParams = [
        name,
        description,
        contactEmail,
        logoFilename
    ];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create organization.');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(
            'Created new organization with ID:',
            result.rows[0].organization_id
        );
    }

    return result.rows[0].organization_id;
};

/**
 * Update an existing organization in the database.
 */
const updateOrganization = async (
    organizationId,
    name,
    description,
    contactEmail,
    logoFilename
) => {
    const query = `
        UPDATE public.organization
        SET
            name = $1,
            description = $2,
            contact_email = $3,
            logo_filename = $4
        WHERE organization_id = $5
        RETURNING organization_id;
    `;

    const queryParams = [
        name,
        description,
        contactEmail,
        logoFilename,
        organizationId
    ];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null;
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(
            'Updated organization with ID:',
            result.rows[0].organization_id
        );
    }

    return result.rows[0].organization_id;
};

// Export the model functions.
export {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
};
