-- ============================================================
-- CSE 340 SERVICE NETWORK DATABASE
-- Complete Database Setup
-- ============================================================


-- ============================================================
-- 1. ORGANIZATION TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- ============================================================
-- 2. CATEGORY TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


-- ============================================================
-- 3. PROJECT TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS project (
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
-- 4. ROLES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);


-- ============================================================
-- 5. USERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 6. INSERT ORGANIZATIONS
-- ============================================================

INSERT INTO organization (
    name, description, contact_email, logo_filename
)
SELECT
    v.name, v.description, v.contact_email, v.logo_filename
FROM (
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
    )
) AS v(name, description, contact_email, logo_filename)
WHERE NOT EXISTS (
    SELECT 1 FROM organization o
    WHERE o.name = v.name
);


-- ============================================================
-- 7. INSERT CATEGORIES
-- ============================================================

INSERT INTO category (name)
VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness')
ON CONFLICT (name) DO NOTHING;


-- ============================================================
-- 8. INSERT PROJECTS
-- ============================================================

INSERT INTO project (
    name, description, location, project_date,
    organization_id, category_id
)
SELECT
    v.name,
    v.description,
    v.location,
    v.project_date::DATE,
    o.organization_id,
    c.category_id
FROM (
    VALUES
    ('Community Garden Initiative', 'Creating sustainable community gardens.', 'Benin City', '2026-11-15', 'BrightFuture Builders', 'Environmental'),
    ('School Renovation Project', 'Renovating classrooms and improving school facilities.', 'Benin City', '2026-11-20', 'BrightFuture Builders', 'Educational'),
    ('Clean Water Initiative', 'Supporting access to clean and safe drinking water.', 'Edo State', '2026-12-05', 'BrightFuture Builders', 'Community Service'),
    ('Community Health Center Upgrade', 'Improving community healthcare facilities.', 'Benin City', '2026-12-12', 'BrightFuture Builders', 'Health and Wellness'),
    ('Green Neighborhood Development', 'Planting trees and improving public spaces.', 'Benin City', '2026-12-18', 'BrightFuture Builders', 'Environmental'),

    ('Youth Learning Support', 'Providing educational resources to children.', 'Benin City', '2026-11-18', 'GreenHarvest Growers', 'Educational'),
    ('Urban Farming Training', 'Teaching residents sustainable urban farming methods.', 'Benin City', '2026-11-25', 'GreenHarvest Growers', 'Educational'),
    ('School Vegetable Garden', 'Helping schools establish vegetable gardens.', 'Edo State', '2026-12-03', 'GreenHarvest Growers', 'Educational'),
    ('Neighborhood Tree Planting', 'Planting trees to improve the local environment.', 'Benin City', '2026-12-10', 'GreenHarvest Growers', 'Environmental'),
    ('Healthy Food Awareness', 'Promoting healthy eating and nutritional education.', 'Benin City', '2026-12-20', 'GreenHarvest Growers', 'Health and Wellness'),

    ('Community Volunteer Outreach', 'Organizing community volunteer activities.', 'Benin City', '2026-11-16', 'UnityServe Volunteers', 'Community Service'),
    ('Youth Education Support', 'Providing learning assistance and educational materials.', 'Benin City', '2026-11-28', 'UnityServe Volunteers', 'Educational'),
    ('Community Health Awareness', 'Organizing health education and awareness activities.', 'Edo State', '2026-12-06', 'UnityServe Volunteers', 'Health and Wellness'),
    ('Public Environmental Cleanup', 'Coordinating volunteers to clean public spaces.', 'Benin City', '2026-12-14', 'UnityServe Volunteers', 'Environmental'),
    ('Food Donation Outreach', 'Collecting and distributing food to families in need.', 'Benin City', '2026-12-22', 'UnityServe Volunteers', 'Community Service')
) AS v(name, description, location, project_date, organization_name, category_name)
JOIN organization o ON o.name = v.organization_name
JOIN category c ON c.name = v.category_name
WHERE NOT EXISTS (
    SELECT 1
    FROM project p
    WHERE p.name = v.name
      AND p.organization_id = o.organization_id
);


-- ============================================================
-- 9. INSERT USER ROLES
-- ============================================================

INSERT INTO roles (role_name, role_description)
VALUES
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access')
ON CONFLICT (role_name) DO NOTHING;


-- ============================================================
-- 10. ASSIGN DEDICATED ADMIN TESTING ACCOUNT
-- ============================================================

-- The admin account must first be registered through the website.
-- This ensures the password is securely hashed using bcrypt.

UPDATE users
SET role_id = (
    SELECT role_id
    FROM roles
    WHERE role_name = 'admin'
)
WHERE email = 'admin@example.com';


-- Verify the dedicated admin account and its assigned role.

SELECT
    users.user_id,
    users.name,
    users.email,
    roles.role_name
FROM users
INNER JOIN roles
    ON users.role_id = roles.role_id
WHERE users.email = 'admin@example.com';


-- ============================================================
-- 11. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_project_organization
ON project(organization_id);

CREATE INDEX IF NOT EXISTS idx_project_category
ON project(category_id);

CREATE INDEX IF NOT EXISTS idx_project_date
ON project(project_date);

CREATE INDEX IF NOT EXISTS idx_users_role
ON users(role_id);


-- ============================================================
-- 12. DATABASE VERIFICATION
-- ============================================================

SELECT 'Organizations' AS table_name, COUNT(*) AS total_records
FROM organization

UNION ALL

SELECT 'Categories', COUNT(*)
FROM category

UNION ALL

SELECT 'Projects', COUNT(*)
FROM project

UNION ALL

SELECT 'Roles', COUNT(*)
FROM roles

UNION ALL

SELECT 'Users', COUNT(*)
FROM users;


-- ============================================================
-- 13. VERIFY PROJECTS PER ORGANIZATION
-- ============================================================

SELECT
    o.organization_id,
    o.name AS organization_name,
    COUNT(p.project_id) AS total_projects
FROM organization o
LEFT JOIN project p
    ON p.organization_id = o.organization_id
GROUP BY o.organization_id, o.name
ORDER BY o.organization_id;


-- ============================================================
-- 14. VERIFY PROJECT, ORGANIZATION AND CATEGORY RELATIONSHIPS
-- ============================================================

SELECT
    p.project_id,
    p.name AS project_name,
    o.name AS organization_name,
    c.name AS category_name,
    p.project_date,
    p.location
FROM project p
INNER JOIN organization o
    ON p.organization_id = o.organization_id
INNER JOIN category c
    ON p.category_id = c.category_id
ORDER BY p.project_id;


-- ============================================================
-- END OF DATABASE SETUP
-- ============================================================