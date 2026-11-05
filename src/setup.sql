
-- ==================================================
-- CSE 340 SERVICE NETWORK DATABASE
-- ==================================================


-- ==================================================
-- 1. ORGANIZATION TABLE
-- ==================================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- Insert Sample Organizations

INSERT INTO organization (
    name,
    description,
    contact_email,
    logo_filename
)
VALUES
    (
        'BrightFuture Builders',
        'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
        'info@brightfuturebuilders.org',
        'brightfuture-logo.png'
    ),
    (
        'GreenHarvest Growers',
        'An urban farming collective promoting food sustainability and education in local neighborhoods.',
        'contact@greenharvest.org',
        'greenharvest-logo.png'
    ),
    (
        'UnityServe Volunteers',
        'A volunteer coordination group supporting local charities and service initiatives.',
        'hello@unityserve.org',
        'unityserve-logo.png'
    );


-- Display Organizations

SELECT *
FROM organization;


-- ==================================================
-- 2. CATEGORY TABLE
-- ==================================================

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


-- Insert Service Project Categories

INSERT INTO category (name)
VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness');


-- Display Categories

SELECT *
FROM category;


-- ==================================================
-- 3. PROJECT TABLE
-- ==================================================

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    organization_id INTEGER NOT NULL
        REFERENCES organization(organization_id),
    category_id INTEGER NOT NULL
        REFERENCES category(category_id)
);


-- Insert Sample Projects

INSERT INTO project (
    name,
    description,
    organization_id,
    category_id
)
VALUES
    (
        'Community Garden Initiative',
        'Creating sustainable community gardens.',
        1,
        1
    ),
    (
        'Youth Learning Support',
        'Providing educational resources to children.',
        2,
        2
    ),
    (
        'Community Volunteer Outreach',
        'Organizing community volunteer activities.',
        3,
        3
    );


-- Display Projects

SELECT *
FROM project;


-- ==================================================
-- 4. DATABASE VERIFICATION
-- ==================================================

-- Display All Projects with Their Organizations
-- and Categories

SELECT
    p.project_id,
    p.name AS project_name,
    p.description,
    o.name AS organization_name,
    c.name AS category_name
FROM project AS p
INNER JOIN organization AS o
    ON p.organization_id = o.organization_id
INNER JOIN category AS c
    ON p.category_id = c.category_id
ORDER BY p.project_id ASC;


-- ==================================================
-- END OF DATABASE SCRIPT
-- ==================================================
