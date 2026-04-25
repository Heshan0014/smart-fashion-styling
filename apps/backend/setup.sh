#!/bin/bash
# Setup Script for Smart Fashion Backend

echo "================================"
echo "Smart Fashion Backend Setup"
echo "================================"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed"
    echo "Install from: https://www.postgresql.org/download/"
    exit 1
fi

echo "✅ PostgreSQL found"

# Get credentials
read -p "Enter PostgreSQL host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Enter PostgreSQL port (default: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

read -p "Enter PostgreSQL username (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "Enter PostgreSQL password: " DB_PASSWORD
echo ""

# Test connection
echo "Testing database connection..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "SELECT 1" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Failed to connect to PostgreSQL"
    exit 1
fi

echo "✅ PostgreSQL connection successful"

# Create database and tables
echo "Creating database and tables..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -f database.sql > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Database and tables created successfully"
else
    echo "❌ Failed to create database"
    exit 1
fi

# Update application.yml
echo "Updating application configuration..."
cat > src/main/resources/application.yml << EOF
spring:
  application:
    name: smart-fashion-backend
  
  datasource:
    url: jdbc:postgresql://$DB_HOST:$DB_PORT/smart_fashion
    username: $DB_USER
    password: $DB_PASSWORD
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    show-sql: false

server:
  port: 8080
  servlet:
    context-path: /api

jwt:
  secret: your-super-secret-key-change-in-production-minimum-32-characters-long
  expiration: 86400000
  refresh-token-expiration: 604800000

logging:
  level:
    root: INFO
    com.smartfashion: DEBUG
EOF

echo "✅ Configuration updated"
echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Configure JWT secret in application.yml"
echo "2. Run: mvn clean install"
echo "3. Run: mvn spring-boot:run"
echo "4. Backend will start at: http://localhost:8080"
echo ""
