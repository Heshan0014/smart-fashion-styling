# Smart Fashion Backend - Complete Setup Guide

## Quick Start (5 Minutes)

### 1. Install PostgreSQL

**Windows:**
- Download: https://www.postgresql.org/download/windows/
- Install with default settings
- Remember your password

**Mac:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### 2. Create Database

Open PostgreSQL Command Line (psql):

```bash
# macOS/Linux
psql -U postgres

# Windows: Use pgAdmin or Command Prompt
```

Run this SQL:
```sql
CREATE DATABASE smart_fashion ENCODING 'UTF8';
\c smart_fashion;
```

Then copy all SQL from `database.sql` and paste into psql.

**Or use the script:**
```bash
# Linux/Mac
psql -U postgres -f database.sql

# Windows
psql -U postgres -f database.sql
```

### 3. Update Configuration

Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/smart_fashion
    username: postgres          # Your PostgreSQL username
    password: your_password     # Your PostgreSQL password
```

### 4. Build Backend

```bash
cd apps/backend
mvn clean install
```

### 5. Run Backend

```bash
mvn spring-boot:run
```

**Expected output:**
```
Started SmartFashionApplication in X.XXX seconds
INFO: Tomcat started on port(s): 8080
```

### 6. Test Login/Signup

**Signup:**
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
    "stylePreference": "casual"
  }
}
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

**Refresh Token:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/refresh-token \
  -H "Authorization: Bearer {refreshToken}"
```

---

## Complete File Structure

```
backend/
├── pom.xml                          ✅ Maven dependencies
├── database.sql                     ✅ Database schema
├── setup.sh                         ✅ Setup script
├── README.md                        ✅ Documentation
├── .gitignore                       ✅ Git rules
└── src/
    ├── main/
    │   ├── java/com/smartfashion/
    │   │   ├── SmartFashionApplication.java          ✅
    │   │   ├── config/
    │   │   │   └── SecurityConfig.java               ✅
    │   │   ├── controller/
    │   │   │   └── AuthController.java               ✅
    │   │   ├── dto/
    │   │   │   ├── AuthRequest.java                  ✅
    │   │   │   ├── SignUpRequest.java                ✅
    │   │   │   └── AuthResponse.java                 ✅
    │   │   ├── entity/
    │   │   │   └── User.java                         ✅
    │   │   ├── exception/
    │   │   │   ├── GlobalExceptionHandler.java       ✅
    │   │   │   ├── ErrorResponse.java                ✅
    │   │   │   ├── ResourceNotFoundException.java    ✅
    │   │   │   └── ResourceAlreadyExistsException.java ✅
    │   │   ├── repository/
    │   │   │   └── UserRepository.java               ✅
    │   │   ├── security/
    │   │   │   ├── JwtTokenProvider.java             ✅
    │   │   │   └── JwtAuthenticationFilter.java      ✅
    │   │   └── service/
    │   │       ├── AuthService.java                  ✅
    │   │       └── UserDetailsServiceImpl.java        ✅
    │   └── resources/
    │       └── application.yml                       ✅
    └── test/
        └── java/com/smartfashion/
            └── SmartFashionApplicationTests.java     ✅
```

---

## Troubleshooting

### Port 8080 Already in Use

```bash
# Find process using port 8080
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Kill process (macOS/Linux)
kill -9 <PID>

# Or change port in application.yml
server:
  port: 8081
```

### Database Connection Failed

```
ERROR: Connection to localhost:5432 refused

Solutions:
1. Start PostgreSQL:
   - macOS: brew services start postgresql@15
   - Linux: sudo service postgresql start
   - Windows: Open Services → PostgreSQL

2. Check credentials in application.yml
3. Verify database exists: psql -U postgres -l
```

### Password Validation Failed

```
Invalid password (missing uppercase, lowercase, digit, special char)

Valid: SecurePass@123
Invalid: password123

Requirements:
- 8+ characters
- Uppercase letter (A-Z)
- Lowercase letter (a-z)
- Digit (0-9)
- Special character (@$!%*?&)
```

### Build Fails

```bash
# Clear cache and rebuild
mvn clean install

# If still fails, check Java version
java -version  # Must be 17+

# Set JAVA_HOME if needed
export JAVA_HOME=/path/to/java17
```

---

## Security Checklist

- [ ] Change JWT secret in application.yml (use 32+ character random string)
- [ ] Use HTTPS in production
- [ ] Never commit application.yml with secrets
- [ ] Store passwords in environment variables
- [ ] Use .env file (add to .gitignore)
- [ ] Enable CORS only for allowed domains
- [ ] Setup regular backups
- [ ] Monitor logs for suspicious activity
- [ ] Keep dependencies updated

---

## Environment Variables (Optional)

Create `.env` file:
```
DB_URL=jdbc:postgresql://localhost:5432/smart_fashion
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-32-character-string
JWT_EXPIRATION=86400000
```

Update `application.yml`:
```yaml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USER}
    password: ${DB_PASSWORD}

jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION}
```

---

## Database Operations

### Check Users Table
```bash
psql -U postgres -d smart_fashion -c "SELECT id, username, email, role FROM users;"
```

### Check User Details
```bash
psql -U postgres -d smart_fashion -c "SELECT * FROM users WHERE email = 'john@example.com';"
```

### Reset Database
```bash
psql -U postgres -d smart_fashion -c "TRUNCATE TABLE users RESTART IDENTITY CASCADE;"
```

### Delete Database
```bash
psql -U postgres -c "DROP DATABASE smart_fashion;"
```

### Backup Database
```bash
pg_dump -U postgres smart_fashion > backup.sql
```

### Restore Database
```bash
psql -U postgres -d smart_fashion -f backup.sql
```

---

## Testing with Postman

### Import Collection

1. Open Postman
2. Click "Import"
3. Paste this JSON:

```json
{
  "info": {
    "name": "Smart Fashion Auth API",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Signup",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/v1/auth/signup",
        "header": [
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"username\":\"john_doe\",\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@example.com\",\"password\":\"SecurePass@123\",\"bodyType\":\"athletic\",\"skinTone\":\"warm\",\"stylePreference\":\"casual\"}"
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/v1/auth/login",
        "header": [
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"john@example.com\",\"password\":\"SecurePass@123\"}"
        }
      }
    },
    {
      "name": "Refresh Token",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/v1/auth/refresh-token",
        "header": [
          {"key": "Authorization", "value": "Bearer {{refreshToken}}"}
        ]
      }
    }
  ]
}
```

---

## Production Deployment

### Before Deploying

1. Change JWT secret to random 32+ character string
2. Set environment variables
3. Use HTTPS/TLS certificate
4. Configure database backups
5. Setup monitoring and alerting
6. Enable security headers
7. Configure rate limiting
8. Setup access logging

### Docker Deployment

```bash
# Build Docker image
docker build -t smart-fashion-backend .

# Run Docker container
docker run -d \
  -e DB_URL=jdbc:postgresql://db:5432/smart_fashion \
  -e DB_USER=postgres \
  -e DB_PASSWORD=your_password \
  -e JWT_SECRET=your-secret \
  -p 8080:8080 \
  smart-fashion-backend
```

### Cloud Deployment (AWS/Azure/GCP)

1. Build JAR: `mvn clean package -DskipTests`
2. Deploy to:
   - AWS EC2 or Elastic Beanstalk
   - Azure App Service
   - Google Cloud Run
   - Heroku

```bash
# Build JAR
mvn clean package -DskipTests

# JAR location
target/smart-fashion-backend-1.0.0.jar
```

---

## Support

**Issues?**
1. Check PostgreSQL is running
2. Verify credentials in application.yml
3. Check port 8080 is available
4. View logs: `tail -f ~/.m2/logs/spring.log`

**Common Errors:**
- `Connection refused` → PostgreSQL not running
- `Access denied` → Wrong credentials
- `Port already in use` → Change port or kill process
- `Validation error` → Check password requirements

---

**You're all set! Backend is ready to use.** ✅

Start backend: `mvn spring-boot:run`
Test it: Use curl or Postman examples above
