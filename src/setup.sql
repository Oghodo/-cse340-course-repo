
-- ============================================================
-- CSE 340 SERVICE NETWORK DATABASE
-- Database Setup Script
-- ============================================================


-- ============================================================
-- 1. ORGANIZATION TABLE
-- ============================================================

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


-- ============================================================
-- 2. CATEGORY TABLE
-- ============================================================

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


-- ============================================================
-- 3. PROJECT TABLE
-- ============================================================

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    organization_id INTEGER NOT NULL
        REFERENCES organization(organization_id),
    category_id INTEGER NOT NULL
        REFERENCES category(category_id)
);


-- ============================================================
-- 4. INSERT SERVICE PROJECTS
-- ============================================================


-- ------------------------------------------------------------
-- ORGANIZATION 1: BRIGHTFUTURE BUILDERS
-- ------------------------------------------------------------

INSERT INTO project (
    name,
    description,
    location,
    project_date,
    organization_id,
    category_id
)
VALUES
(
    'Community Garden Initiative',
    'Creating sustainable community gardens.',
    'Benin City',
    '2026-11-15',
    1,
    1
),
(
    'School Renovation Project',
    'Renovating classrooms and improving school facilities.',
    'Benin City',
    '2026-11-20',
    1,
    2
),
(
    'Clean Water Initiative',
    'Supporting access to clean and safe drinking water.',
    'Edo State',
    '2026-12-05',
    1,
    3
),
(
    'Community Health Center Upgrade',
    'Improving community healthcare facilities.',
    'Benin City',
    '2026-12-12',
    1,
    4
),
(
    'Green Neighborhood Development',
    'Planting trees and improving public spaces.',
    'Benin City',
    '2026-12-18',
    1,
    1
);


-- ------------------------------------------------------------
-- ORGANIZATION 2: GREENHARVEST GROWERS
-- ------------------------------------------------------------

INSERT INTO project (
    name,
    description,
    location,
    project_date,
    organization_id,
    category_id
)
VALUES
(
    'Youth Learning Support',
    'Providing educational resources to children.',
    'Benin City',
    '2026-11-18',
    2,
    2
),
(
    'Urban Farming Training',
    'Teaching residents sustainable urban farming methods.',
    'Benin City',
    '2026-11-25',
    2,
    2
),
(
    'School Vegetable Garden',
    'Helping schools establish vegetable gardens.',
    'Edo State',
    '2026-12-03',
    2,
    2
),
(
    'Neighborhood Tree Planting',
    'Planting trees to improve the local environment.',
    'Benin City',
    '2026-12-10',
    2,
    1
),
(
    'Healthy Food Awareness',
    'Promoting healthy eating and nutritional education.',
    'Benin City',
    '2026-12-20',
    2,
    4
);


-- ------------------------------------------------------------
-- ORGANIZATION 3: UNITYSERVE VOLUNTEERS
-- ------------------------------------------------------------

INSERT INTO project (
    name,
    description,
    location,
    project_date,
    organization_id,
    category_id
)
VALUES
(
    'Community Volunteer Outreach',
    'Organizing community volunteer activities.',
    'Benin City',
    '2026-11-16',
    3,
    3
),
(
    'Youth Education Support',
    'Providing learning assistance and educational materials.',
    'Benin City',
    '2026-11-28',
    3,
    2
),
(
    'Community Health Awareness',
    'Organizing health education and awareness activities.',
    'Edo State',
    '2026-12-06',
    3,
    4
),
(
    'Public Environmental Cleanup',
    'Coordinating volunteers to clean public spaces.',
    'Benin City',
    '2026-12-14',
    3,
    1
),
(
    'Food Donation Outreach',
    'Collecting and distributing food to families in need.',
    'Benin City',
    '2026-12-22',
    3,
    3
);


-- ============================================================
-- 5. FIX MISSING PROJECT LOCATIONS
-- ============================================================

-- Assign a default location to any project with a missing
-- or empty location, provided Benin City is accurate.

UPDATE project
SET location = 'Benin City, Edo State, Nigeria'
WHERE location IS NULL
   OR TRIM(location) = '';


-- ============================================================
-- 6. DATABASE VERIFICATION
-- ============================================================


-- Display All Organizations

SELECT *
FROM organization
ORDER BY organization_id;


-- Display All Categories

SELECT *
FROM category
ORDER BY category_id;


-- Display All Projects

SELECT *
FROM project
ORDER BY project_id;


-- ============================================================
-- 7. DISPLAY PROJECTS WITH ORGANIZATION AND CATEGORY NAMES
-- ============================================================

SELECT
    p.project_id,
    p.name AS project_name,
    p.description,
    p.location,
    p.project_date,
    o.name AS organization_name,
    c.name AS category_name
FROM project AS p
INNER JOIN organization AS o
    ON p.organization_id = o.organization_id
INNER JOIN category AS c
    ON p.category_id = c.category_id
ORDER BY p.project_id ASC;


-- ============================================================
-- 8. VERIFY PROJECT COUNT PER ORGANIZATION
-- ============================================================

SELECT
    o.organization_id,
    o.name AS organization_name,
    COUNT(p.project_id) AS total_projects
FROM organization AS o
LEFT JOIN project AS p
    ON o.organization_id = p.organization_id
GROUP BY
    o.organization_id,
    o.name
ORDER BY o.organization_id;


-- ============================================================
-- 9. VERIFY PROJECT DATES AND LOCATIONS
-- ============================================================

-- Check for projects with missing dates

SELECT
    project_id,
    name,
    project_date
FROM project
WHERE project_date IS NULL;


-- Check for projects with missing locations

SELECT
    project_id,
    name,
    location
FROM project
WHERE location IS NULL
   OR TRIM(location) = '';


-- ============================================================
-- 10. DISPLAY THE NEXT FIVE UPCOMING SERVICE PROJECTS
-- ============================================================

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
LIMIT 5;


-- ============================================================
-- END OF CSE 340 SERVICE NETWORK DATABASE
-- ============================================================
