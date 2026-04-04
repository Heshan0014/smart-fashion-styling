# Smart Fashion Backend - Spring Boot Authentication

## Overview

Complete Spring Boot backend implementation for user authentication (login/signup) with JWT token-based security, designed for an AI-driven fashion recommendation system.

## Features

✅ User Registration (Signup) with validation  
✅ User Login with JWT authentication  
✅ Token refresh mechanism  
✅ Role-based access control (CUSTOMER, ADMIN, STYLIST)  
✅ Fashion-specific user attributes (body type, skin tone, style preference)  
✅ Comprehensive error handling  
✅ Spring Security integration  
✅ Password encryption with BCrypt  

## Prerequisites

- Java 17+
- Maven 3.6+
- PostgreSQL 13+ (recommended)
- Spring Boot 3.2.0

## Project Structure

```
backend/
├── src/main/java/com/smartfashion/
│   ├── SmartFashionApplication.java          # Main application entry point
│   ├── config/
│   │   └── SecurityConfig.java               # Spring Security configuration
│   ├── controller/
│   │   └── AuthController.java               # REST API endpoints
│   ├── dto/
│   │   ├── AuthRequest.java                  # Login request DTO
│   │   ├── SignUpRequest.java                # Signup request DTO
│   │   └── AuthResponse.java                 # Authentication response DTO
│   ├── entity/
│   │   └── User.java                         # User entity with fashion attributes
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java       # Global exception handling
│   │   ├── ErrorResponse.java                # Error response format
│   │   ├── ResourceNotFoundException.java    # 404 exception
│   │   └── ResourceAlreadyExistsException.java # 409 exception
│   ├── repository/
│   │   └── UserRepository.java               # User data access
│   ├── security/
│   │   ├── JwtTokenProvider.java             # JWT token generation/validation
│   │   └── JwtAuthenticationFilter.java      # JWT filter implementation
│   └── service/
│       ├── AuthService.java                  # Authentication business logic
│       └── UserDetailsServiceImpl.java        # Spring Security user details
├── src/main/resources/
│   └── application.yml                       # Configuration properties
├── pom.xml                                   # Maven dependencies
└── .gitignore                                # Git ignore rules
```

## Installation & Setup

### 1. Clone and Navigate to Backend

```bash
cd apps/backend
```

### 2. Setup Database

**PostgreSQL Setup (Recommended):**
```sql
-- Create database
CREATE DATABASE smart_fashion;

-- Connect to database
\c smart_fashion;

-- Tables will be auto-created by Hibernate
```

**Update application.yml:**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/smart_fashion
    username: postgres
    password: your_password
```

### 3. Build the Project

```bash
mvn clean install
```

### 4. Run the Application

```bash
mvn spring-boot:run
```

Server starts at: `http://localhost:8080`

## API Endpoints

### 1. User Signup
```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "bodyType": "athletic",
  "skinTone": "warm",
  "stylePreference": "casual"
}
```

**Response (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "expiresIn": 86400,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER",
    "bodyType": "athletic",
    "skinTone": "warm",
    "stylePreference": "casual",
    "profilePictureUrl": null
  }
}
```

### 2. User Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "expiresIn": 86400,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER",
    "bodyType": "athletic",
    "skinTone": "warm",
    "stylePreference": "casual",
    "profilePictureUrl": null
  }
}
```

### 3. Refresh Access Token
```http
POST /api/v1/auth/refresh-token
Authorization: Bearer {refreshToken}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "expiresIn": 86400,
  "user": { ... }
}
```

## Authentication Using JWT Tokens

Include the access token in all protected endpoints:

```http
GET /api/v1/protected-resource
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

## Validation Rules

### Password Requirements:
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 digit (0-9)
- At least 1 special character (@$!%*?&)

Example: `SecurePass@123` ✅

### Username Requirements:
- 3-20 characters
- Contains only alphanumeric, dots, underscores, hyphens
- Example: `john_doe`, `john.doe`, `john-doe` ✅

### Email:
- Must be valid email format
- Must be unique in database

## Error Responses

### Already Registered (409 Conflict)
```json
{
  "timestamp": "2026-03-15T10:30:45.123456",
  "status": 409,
  "error": "Conflict",
  "message": "Email already registered"
}
```

### Validation Error (400 Bad Request)
```json
{
  "timestamp": "2026-03-15T10:30:45.123456",
  "status": 400,
  "error": "Validation Error",
  "message": "Input validation failed",
  "validationErrors": {
    "password": "Password must contain at least one uppercase letter",
    "username": "Username is required"
  }
}
```

### User Not Found (404 Not Found)
```json
{
  "timestamp": "2026-03-15T10:30:45.123456",
  "status": 404,
  "error": "Not Found",
  "message": "User not found"
}
```

## Security Features

- **BCrypt Password Hashing**: Passwords are hashed with BCrypt (strength 10)
- **JWT Tokens**: Secure token-based authentication with 24-hour expiration
- **CSRF Protection**: Disabled for stateless API (optional: enable for sessions)
- **Stateless Sessions**: No server-side session storage
- **CORS**: Configure in SecurityConfig as needed
- **HTTPS**: Required for production

## Environment Configuration

Create `.env` file:
```env
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
JWT_EXPIRATION=86400000
REFRESH_TOKEN_EXPIRATION=604800000
DB_URL=jdbc:postgresql://localhost:5432/smart_fashion
DB_USER=postgres
DB_PASSWORD=your_password
```

Update `application.yml` to use environment variables:
```yaml
jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION}
  refresh-token-expiration: ${REFRESH_TOKEN_EXPIRATION}
```

## Database Schema

The `User` entity creates the following table structure:

```sql
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
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_username ON users(username);
```

## Testing with Postman/Curl

### Signup:
```bash
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass@123",
    "bodyType": "athletic",
    "skinTone": "warm",
    "stylePreference": "casual"
  }'
```

### Login:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

## Production Deployment

### Pre-deployment Checklist:
1. ✅ Update JWT secret: `jwt.secret` (minimum 32 characters)
2. ✅ Configure database credentials securely
3. ✅ Enable HTTPS
4. ✅ Set `spring.jpa.hibernate.ddl-auto=validate` (don't auto-create)
5. ✅ Configure CORS appropriately
6. ✅ Enable logging and monitoring
7. ✅ Setup backup strategy
8. ✅ Configure rate limiting

### Deploy to Cloud:
```bash
# Build production JAR
mvn clean package -DskipTests

# Deploy to AWS EC2, Azure App Service, Google Cloud Run, etc.
java -jar target/smart-fashion-backend-1.0.0.jar
```

## Troubleshooting

**Issue**: `NoSuchMethodError: JwtParser.setSigningKey()`
- **Solution**: Update JJWT version in `pom.xml` to 0.12.3+

**Issue**: `Liquibase errors during startup`
- **Solution**: Ensure database is running and credentials are correct

**Issue**: `Password does not meet requirements`
- **Solution**: Password must have uppercase, lowercase, digit, special char (@$!%*?&)

## Future Enhancements

- [ ] Email verification
- [ ] OAuth2 integration (Google, Facebook)
- [ ] Two-factor authentication (2FA)
- [ ] Social login
- [ ] User profile endpoints
- [ ] Password reset functionality
- [ ] User preferences and AI model training data
- [ ] Integration with ML recommendation engine

## License

MIT License - See LICENSE file for details

---

**Last Updated**: March 2026  
**Version**: 1.0.0
