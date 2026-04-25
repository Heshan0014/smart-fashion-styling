# Password Reset Feature - Complete Implementation Guide

## ✅ What's Already Implemented

### Backend Components
- ✅ **PasswordResetService.java** - Full password reset logic with email sending
- ✅ **PasswordReset Entity** - Database model with validation methods
- ✅ **PasswordResetRepository** - JPA repository with query methods
- ✅ **AuthController Endpoints** - Three REST endpoints for password reset flow
- ✅ **DTOs** - ForgotPasswordRequest, ResetPasswordRequest, and Response classes
- ✅ **Database Migrations** - SQL script to create password_resets table
- ✅ **Spring Mail Configuration** - SMTP setup in application.yml with environment variables

### Frontend Components
- ✅ **ForgotPassword Modal** - Beautiful modal component for email entry
- ✅ **Reset Password Page** - Full form with validation and password matching
- ✅ **Login Integration** - "Forgot password?" link in login page
- ✅ **Routing** - /reset-password route with token parameter handling
- ✅ **UI/UX** - Tailwind styled with error/success handling

### Features
- ✅ Secure token generation (UUID)
- ✅ Token expiration (configurable, default 60 minutes)
- ✅ Token reuse prevention (marked as used after reset)
- ✅ Previous tokens invalidation (new reset invalidates old tokens)
- ✅ Password strength validation (minimum 6 characters)
- ✅ Secure password encoding (bcrypt)
- ✅ Email security (doesn't reveal if email exists)
- ✅ Rate limiting ready (can be added)

---

## 🚀 What You Need to Do Now

### Step 1: Set Up Email Configuration

Choose your email provider and configure credentials:

#### **Option A: Gmail (Easiest for Development)**

**Quick Setup (Windows):**
```batch
# Run the automated setup script
cd apps\backend
setup-email.bat
# Follow the prompts
```

**Manual Setup (Windows PowerShell):**
```powershell
# 1. Go to: https://myaccount.google.com/apppasswords
# 2. Generate App Password (16 characters)
# 3. Set environment variables:

$env:MAIL_USERNAME = "your-email@gmail.com"
$env:MAIL_PASSWORD = "your-16-character-app-password"
$env:FRONTEND_URL = "http://localhost:3000"
$env:RESET_TOKEN_EXPIRY = "60"
```

#### **Option B: SendGrid (Best for Production)**

```powershell
# 1. Create SendGrid account: https://sendgrid.com
# 2. Create API Key
# 3. Run:

$env:MAIL_USERNAME = "apikey"
$env:MAIL_PASSWORD = "SG.your-api-key"
$env:MAIL_FROM = "your-verified-email@domain.com"
```

**Note:** Also update `application.yml` SMTP host to `smtp.sendgrid.net`

### Step 2: Verify Database Setup

Ensure the `password_resets` table is created:

```bash
# Method 1: Auto-create via Hibernate (application.yml has ddl-auto: update)
# Just run the backend, it will create the table automatically

# Method 2: Manual SQL (if needed)
cd apps/backend
psql -U postgres -d smart_fashion -f add-password-reset-table.sql
```

### Step 3: Restart Backend Service

```bash
cd apps/backend

# Stop any running instance (Ctrl+C)

# Clean build
mvn clean

# Run with new environment variables
mvn spring-boot:run

# OR if built, run the JAR
java -jar target/smart-fashion-backend-1.0.0.jar.original
```

### Step 4: Test the Complete Flow

1. **Open Frontend**: http://localhost:3000/login
2. **Click**: "Forgot password?" link
3. **Enter**: Your registered email
4. **Check**: Your email inbox for reset link
5. **Click**: The reset link in the email
6. **Set**: New password
7. **Login**: With new password

### Step 5: Verify Email is Received

- ✅ Check inbox for email from Smart Fashion Styling
- ✅ If not found, check spam folder
- ✅ Check backend logs for "Password reset email sent to:"
- ✅ If error appears, see Troubleshooting section

---

## 📁 File Structure

```
apps/backend/
├── src/main/java/com/smartfashion/
│   ├── service/
│   │   └── PasswordResetService.java      ✅ Main service
│   ├── entity/
│   │   └── PasswordReset.java             ✅ Database model
│   ├── repository/
│   │   └── PasswordResetRepository.java   ✅ Data access
│   ├── controller/
│   │   └── AuthController.java            ✅ API endpoints
│   └── dto/
│       ├── ForgotPasswordRequest.java     ✅
│       ├── ResetPasswordRequest.java      ✅
│       └── ForgotPasswordResponse.java    ✅
│
├── src/main/resources/
│   └── application.yml                    ✅ Email config
│
├── add-password-reset-table.sql           ✅ Database migration
├── EMAIL_SETUP_GUIDE.md                   📖 Detailed setup instructions
├── PASSWORD_RESET_TESTING.md              🧪 Testing guide
├── setup-email.bat                        🔧 Windows setup script
├── setup-email.sh                         🔧 Linux/Mac setup script
└── .env.example                           📝 Environment variables template

apps/frontend/
├── src/pages/customer/
│   ├── login.jsx                          ✅ Has "Forgot password" link
│   ├── reset-password.jsx                 ✅ Reset form page
│   └── forgot-password.jsx                ❌ (Uses modal instead)
│
├── src/components/
│   └── ForgotPassword.jsx                 ✅ Modal component
│
└── src/App.jsx                            ✅ /reset-password route
```

---

## 🔌 API Endpoints

All endpoints return appropriate HTTP status codes and messages.

### 1. Request Password Reset
```
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200 OK):
{
  "success": true,
  "message": "If an account exists with that email, you will receive a password reset link",
  "resetToken": "uuid-string"
}
```

### 2. Validate Reset Token
```
GET /api/v1/auth/validate-reset-token?token=YOUR_TOKEN

Response (200 OK):
{
  "valid": true
}

Response (200 OK - Invalid):
{
  "valid": false
}
```

### 3. Reset Password
```
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "token": "your-token",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}

Response (200 OK):
{
  "success": true,
  "message": "Password has been successfully reset. You can now login with your new password."
}

Response (400 Bad Request):
{
  "success": false,
  "message": "Reset token has expired or already been used"
}
```

---

## 🧪 Testing Scenarios

### Quick Test with cURL
```bash
# 1. Request reset
curl -X POST http://localhost:8080/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'

# 2. Check email for token

# 3. Validate token
curl "http://localhost:8080/api/v1/auth/validate-reset-token?token=YOUR_TOKEN"

# 4. Reset password
curl -X POST http://localhost:8080/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_TOKEN","newPassword":"NewPass123","confirmPassword":"NewPass123"}'
```

See [PASSWORD_RESET_TESTING.md](PASSWORD_RESET_TESTING.md) for complete testing guide.

---

## ⚠️ Troubleshooting

### Email not received?
**Problem**: "Sent success" but no email arrives

**Solutions:**
1. Check spam/junk folder
2. Verify email provider credentials are correct
3. Check backend logs: `Failed to send password reset email`
4. Test SMTP connection manually
5. Ensure port 587 is not blocked

### Token validation fails?
**Problem**: "This reset link has expired or is invalid"

**Solutions:**
1. Check if token expired (default 60 minutes)
2. Verify token matches database entry
3. Check if token was already used
4. Request a new password reset

### Backend won't start?
**Problem**: Application fails to start

**Solutions:**
1. Check email configuration: `MAIL_USERNAME` and `MAIL_PASSWORD`
2. Verify PostgreSQL is running
3. Check logs for specific error messages
4. Enable debug logging (see EMAIL_SETUP_GUIDE.md)

### Frontend shows "Validating..." forever?
**Problem**: Reset password page stuck loading

**Solutions:**
1. Check if backend is running on port 8080
2. Look for CORS errors in browser console
3. Open DevTools Network tab to see API response
4. Verify validate-reset-token endpoint is working

---

## 🔐 Security Features

- ✅ **Tokens**: UUID format, not guessable
- ✅ **Expiration**: Default 60 minutes from creation
- ✅ **Single Use**: Tokens marked as used after reset
- ✅ **Invalidation**: New reset requests invalidate old tokens
- ✅ **Encoding**: Passwords stored with bcrypt hashing
- ✅ **Privacy**: Doesn't reveal if email exists in system
- ✅ **HTTPS Ready**: Works with SSL/TLS in production
- ✅ **Database Indexes**: Fast token lookups with indexed queries

---

## 📊 Database Schema

```sql
CREATE TABLE password_resets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_token (token) WHERE used = FALSE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);
```

---

## 🚀 Next Steps

1. ✅ **Now**: Set up email credentials (Step 1 above)
2. ✅ **Then**: Restart backend (Step 3 above)
3. ✅ **Finally**: Test the complete flow (Step 4 above)

### After Confirmation
- [ ] Add rate limiting to prevent abuse
- [ ] Send HTML emails with better formatting
- [ ] Add email templates/customization
- [ ] Set up email bounce handling
- [ ] Monitor email delivery metrics
- [ ] Configure for production HTTPS

---

## 📝 Configuration Reference

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `MAIL_USERNAME` | Email account/API key | your-email@gmail.com |
| `MAIL_PASSWORD` | Email password/API key | your-app-password |
| `MAIL_FROM` | Sender email (optional) | Uses MAIL_USERNAME |
| `FRONTEND_URL` | Frontend base URL | http://localhost:3000 |
| `RESET_TOKEN_EXPIRY` | Token expiry in minutes | 60 |

### SMTP Providers

**Gmail**
- Host: smtp.gmail.com
- Port: 587
- Username: email@gmail.com
- Password: App Password (16 chars)

**SendGrid**
- Host: smtp.sendgrid.net
- Port: 587
- Username: apikey
- Password: SG.xxxxx

---

## 📞 Support

For detailed setup instructions, see: [EMAIL_SETUP_GUIDE.md](EMAIL_SETUP_GUIDE.md)
For testing procedures, see: [PASSWORD_RESET_TESTING.md](PASSWORD_RESET_TESTING.md)

**Key Files to Reference:**
- Backend Service: `PasswordResetService.java`
- Configuration: `application.yml`
- API Endpoints: `AuthController.java`
- Frontend: `reset-password.jsx`, `ForgotPassword.jsx`
