-- Smart Fashion Styling - User Authentication Database Schema
-- PostgreSQL Database Setup Script

-- Create Database
CREATE DATABASE smart_fashion ENCODING 'UTF8' TEMPLATE template0;

-- Connect to the database
\c smart_fashion;

-- Create USERS Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    enabled BOOLEAN NOT NULL DEFAULT true,
    account_non_locked BOOLEAN NOT NULL DEFAULT true,
    account_non_expired BOOLEAN NOT NULL DEFAULT true,
    credentials_non_expired BOOLEAN NOT NULL DEFAULT true,
    role VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',
    profile_picture_url VARCHAR(500),
    style_preference VARCHAR(255),
    body_type VARCHAR(255),
    skin_tone VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    
    CONSTRAINT check_role CHECK (role IN ('CUSTOMER', 'ADMIN', 'STYLIST')),
    CONSTRAINT check_email_format CHECK (email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
);

-- Create Indexes for Performance
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_role ON users(role);
CREATE INDEX idx_created_at ON users(created_at DESC);
CREATE INDEX idx_last_login ON users(last_login DESC);

-- Add comment to table
COMMENT ON TABLE users IS 'User accounts with authentication and profile information';
COMMENT ON COLUMN users.id IS 'Unique identifier for user';
COMMENT ON COLUMN users.email IS 'User email (unique, used for login)';
COMMENT ON COLUMN users.password IS 'Hashed password (BCrypt)';
COMMENT ON COLUMN users.role IS 'User role: CUSTOMER, ADMIN, or STYLIST';
COMMENT ON COLUMN users.body_type IS 'Body type for fashion recommendations';
COMMENT ON COLUMN users.skin_tone IS 'Skin tone for color recommendations';
COMMENT ON COLUMN users.style_preference IS 'User style preference for recommendations';

-- Create SELLERS Table
CREATE TABLE sellers (
    id BIGSERIAL PRIMARY KEY,
    shop_name VARCHAR(255) NOT NULL,
    shop_description TEXT,
    category VARCHAR(100),
    business_type VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    bank_account_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(50),
    average_price_range VARCHAR(100),
    website VARCHAR(500),
    instagram VARCHAR(255),
    facebook VARCHAR(500),
    twitter VARCHAR(255),
    linkedin VARCHAR(500),
    password VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    rejected_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
);

-- Create Indexes for Sellers
CREATE INDEX idx_seller_email ON sellers(email);
CREATE INDEX idx_seller_status ON sellers(status);
CREATE INDEX idx_seller_created_at ON sellers(created_at DESC);
CREATE INDEX idx_seller_shop_name ON sellers(shop_name);

-- Add comments to sellers table
COMMENT ON TABLE sellers IS 'Seller shop registration and information';
COMMENT ON COLUMN sellers.id IS 'Unique identifier for seller';
COMMENT ON COLUMN sellers.status IS 'Seller status: PENDING, APPROVED, or REJECTED';
COMMENT ON COLUMN sellers.submitted_at IS 'When the seller submitted their registration';
COMMENT ON COLUMN sellers.approved_at IS 'When the seller was approved by admin';

-- Sample Data (Optional - for testing)
-- Password: SellerPass@123 (will be hashed in application)
INSERT INTO sellers (shop_name, shop_description, category, business_type, email, phone, address, city, state, zip_code, bank_account_name, bank_account_number, bank_ifsc, average_price_range, website, status, created_at, updated_at)
VALUES (
    'Fashion Hub',
    'Premium fashion and accessories store',
    'clothing',
    'company',
    'fashionhub@example.com',
    '+1-555-0100',
    '123 Fashion Street',
    'New York',
    'NY',
    '10001',
    'Fashion Hub Inc',
    '1234567890123456',
    'HDFC0001234',
    '$50 - $200',
    'https://fashionhub.example.com',
    'APPROVED',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Sample Data (Optional - for testing)
-- Password: SecurePass@123 (BCrypt hash)
INSERT INTO users (username, email, password, first_name, last_name, role, body_type, skin_tone, style_preference, created_at, updated_at)
VALUES (
    'john_doe',
    'john@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gBsKq2',
    'John',
    'Doe',
    'CUSTOMER',
    'athletic',
    'warm',
    'casual',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Verify table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
