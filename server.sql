CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    owner_id INT REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(255),
    completed BOOL,
    project_id INT REFERENCES projects (id),
    assigned_to INT REFERENCES users (id)
);

INSERT INTO
    users (user_name, email)
VALUES (
        'Alex Johnson',
        'alex.johnson@example.com'
    ),
    (
        'Sarah Connor',
        'sarah.c@example.com'
    ),
    (
        'Michael Chen',
        'm.chen@example.com'
    ),
    (
        'Emily Davis',
        'emily.d@example.com'
    ),
    (
        'David Miller',
        'david.m@example.com'
    );

INSERT INTO
    projects (
        project_name,
        description,
        owner_id
    )
VALUES (
        'StudyFlow Redesign',
        'Overhauling the user dashboard and REST API',
        1
    ),
    (
        'E-Commerce Mobile App',
        'Building React Native app for the online store',
        2
    ),
    (
        'Database Migration',
        'Migrating legacy SQL schemas and optimizing indexes',
        1
    ),
    (
        'Marketing Campaign Q4',
        'Landing page updates and SEO optimizations',
        3
    );

INSERT INTO
    tasks (
        title,
        description,
        completed,
        project_id,
        assigned_to
    )
VALUES
    -- Tasks for Project 1 (StudyFlow Redesign)
    (
        'Design Figma Wireframes',
        'Create UI mocks for dashboard view',
        TRUE,
        1,
        4
    ),
    (
        'Setup Express Routes',
        'Implement CRUD endpoints for user tasks',
        TRUE,
        1,
        1
    ),
    (
        'Refactor State Management',
        'Migrate React local state to Context API',
        FALSE,
        1,
        1
    ),
    (
        'Fix Restocking Bug',
        'Fix SQL transaction connection leaks in Express',
        FALSE,
        1,
        3
    ),
    -- Tasks for Project 2 (E-Commerce Mobile App)  ('Setup React Native Environment', 'Configure iOS/Android builds', TRUE, 2, 2),
    (
        'Implement Shopping Cart',
        'Build cart screen with total price calculation',
        FALSE,
        2,
        5
    ),
    (
        'Integrate Payment Gateway',
        'Connect Stripe API for checkout flow',
        FALSE,
        2,
        2
    ),
    (
        'User Authentication UI',
        'Build Login and Register screens',
        TRUE,
        2,
        4
    ),
    -- Tasks for Project 3 (Database Migration)
    (
        'Audit Existing Schema',
        'Review foreign key relationships and constraints',
        TRUE,
        3,
        3
    ),
    (
        'Write Migration Scripts',
        'Draft SQL queries for data conversion',
        FALSE,
        3,
        1
    ),
    (
        'Add Performance Indexes',
        'Index foreign keys and frequent filter columns',
        FALSE,
        3,
        3
    ),
    -- Tasks for Project 4 (Marketing Campaign Q4)
    (
        'Update Landing Page Hero Section',
        'Add new banner images and CTA buttons',
        TRUE,
        4,
        4
    ),
    (
        'Optimize Image Assets',
        'Compress WebP images for faster load times',
        TRUE,
        4,
        5
    ),
    (
        'Configure Google Analytics',
        'Track click rates on registration form',
        FALSE,
        4,
        5
    ),
    (
        'SEO Meta Description Audit',
        'Update meta tags for top landing pages',
        FALSE,
        4,
        NULL
    );

