-- Insert Admin User into PostgreSQL Database
-- Password: Admin@1234 (BCrypt hashed: $2a$12$Mya1wQVrKHu3JxLLhN3tZOlb7n1eI0MBSjGXgcJYeJGPzQNmVKqhW)

INSERT INTO users (
    username,
    email,
    password,
    first_name,
    last_name,
    enabled,
    account_non_locked,
    account_non_expired,
    credentials_non_expired,
    role,
    created_at,
    updated_at
) VALUES (
    'admin',
    'admin@gmail.com',
    '$2a$12$Mya1wQVrKHu3JxLLhN3tZOlb7n1eI0MBSjGXgcJYeJGPzQNmVKqhW',
    'Admin',
    'User',
    true,
    true,
    true,
    true,
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO UPDATE SET
    role = 'ADMIN'
    WHERE users.email = 'admin@gmail.com' AND users.role != 'ADMIN';
