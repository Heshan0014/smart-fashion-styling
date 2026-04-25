@echo off
REM Smart Fashion Backend Setup Script for Windows

echo.
echo ================================
echo Smart Fashion Backend Setup
echo ================================
echo.

REM Check if PostgreSQL is installed
WHERE psql >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: PostgreSQL is not installed or not in PATH
    echo Download from: https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

echo [OK] PostgreSQL found

REM Get inputs
setlocal enabledelayedexpansion

set /p DB_HOST="Enter PostgreSQL host (default: localhost): "
if "!DB_HOST!"=="" set DB_HOST=localhost

set /p DB_PORT="Enter PostgreSQL port (default: 5432): "
if "!DB_PORT!"=="" set DB_PORT=5432

set /p DB_USER="Enter PostgreSQL username (default: postgres): "
if "!DB_USER!"=="" set DB_USER=postgres

set /p DB_PASSWORD="Enter PostgreSQL password: "

echo.
echo Testing database connection...

REM Test connection
psql -h !DB_HOST! -p !DB_PORT! -U !DB_USER! -c "SELECT 1" >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to connect to PostgreSQL
    echo Check:
    echo 1. PostgreSQL is running
    echo 2. Host: !DB_HOST!
    echo 3. Port: !DB_PORT!
    echo 4. Username: !DB_USER!
    echo 5. Password is correct
    pause
    exit /b 1
)

echo [OK] PostgreSQL connection successful
echo.
echo Creating database and tables...

REM Create database and tables
psql -h !DB_HOST! -p !DB_PORT! -U !DB_USER! -f database.sql >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to create database
    pause
    exit /b 1
)

echo [OK] Database created successfully
echo.
echo Updating application configuration...

REM Update application.yml
(
echo spring:
echo   application:
echo     name: smart-fashion-backend
echo.
echo   datasource:
echo     url: jdbc:postgresql://!DB_HOST!:!DB_PORT!/smart_fashion
echo     username: !DB_USER!
echo     password: !DB_PASSWORD!
echo     driver-class-name: org.postgresql.Driver
echo.
echo   jpa:
echo     hibernate:
echo       ddl-auto: validate
echo     properties:
echo       hibernate:
echo         dialect: org.hibernate.dialect.PostgreSQLDialect
echo         format_sql: true
echo     show-sql: false
echo.
echo server:
echo   port: 8080
echo   servlet:
echo     context-path: /api
echo.
echo jwt:
echo   secret: your-super-secret-key-change-in-production-minimum-32-characters-long
echo   expiration: 86400000
echo   refresh-token-expiration: 604800000
echo.
echo logging:
echo   level:
echo     root: INFO
echo     com.smartfashion: DEBUG
) > src\main\resources\application.yml

echo [OK] Configuration updated
echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next steps:
echo 1. IMPORTANT: Change JWT secret in src\main\resources\application.yml
echo 2. Run: mvn clean install
echo 3. Run: mvn spring-boot:run
echo 4. Backend will start at: http://localhost:8080
echo.
echo Test signup:
echo curl -X POST http://localhost:8080/api/v1/auth/signup ^
echo  -H "Content-Type: application/json" ^
echo  -d "{\"username\":\"john_doe\",\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@example.com\",\"password\":\"SecurePass@123\",\"bodyType\":\"athletic\",\"skinTone\":\"warm\",\"stylePreference\":\"casual\"}"
echo.
pause
