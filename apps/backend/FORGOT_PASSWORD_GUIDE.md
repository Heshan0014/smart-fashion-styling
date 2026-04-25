# Forgot Password Feature - Implementation Guide

## Overview
A complete "Forgot Password" feature has been implemented for the Smart Fashion application. Users can now reset their passwords through a secure email verification process.

## Architecture

### Backend Components

#### 1. **PasswordReset Entity** (`PasswordReset.java`)
- Stores password reset tokens with expiration
- Links to User entity
- Tracks token usage and expiration
- Methods: `isValid()`, `markAsUsed()`

#### 2. **PasswordResetRepository** (`PasswordResetRepository.java`)
- JPA Repository for database operations
- Methods: `findByToken()`, `findByEmail()`, `findByUserAndUsedFalse()`

#### 3. **PasswordResetService** (`PasswordResetService.java`)
- Core business logic for password reset flow
- Methods:
  - `requestPasswordReset()` - Initiates reset and sends email
  - `validateResetToken()` - Validates if token is still valid
  - `resetPassword()` - Updates user password with valid token
  - `cleanupExpiredTokens()` - Optional maintenance task

#### 4. **AuthController Endpoints** (`AuthController.java`)

New endpoints added:
- **POST** `/v1/auth/forgot-password` - Send reset email
- **GET** `/v1/auth/validate-reset-token?token={token}` - Validate token
- **POST** `/v1/auth/reset-password` - Reset password

### Frontend Components

#### 1. **ForgotPassword Component** (`ForgotPassword.jsx`)
- Modal dialog for email entry
- Shows success message with check icon
- Handles email sending request
- Props: `isOpen`, `onClose`

#### 2. **ResetPassword Page** (`reset-password.jsx`)
- Full page for password reset
- Validates reset token on mount
- Password strength indicators
- Show/hide password toggle
- Confirms password matching
- Redirects to login on success

#### 3. **Login Page Update** (`login.jsx`)
- "Forgot password?" link now opens modal
- Integrated ForgotPassword component
- Seamless user flow

#### 4. **App Router Update** (`App.jsx`)
- Added `/reset-password` route
- Tokens passed as URL query parameter

## Database Setup

### SQL Migration

Run this migration to create the `password_resets` table:

```sql
CREATE TABLE IF NOT EXISTS password_resets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_password_resets_email ON password_resets(email);
CREATE INDEX idx_password_resets_token ON password_resets(token) WHERE used = FALSE;
CREATE INDEX idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX idx_password_resets_expires_at ON password_resets(expires_at);
```

**File**: `apps/backend/add-password-reset-table.sql`

## Configuration

### Email Setup (application.yml)

Update your email configuration in `application.yml`:

```yaml
spring:
  mail:
    host: smtp.gmail.com  # or your email provider
    port: 587
    username: ${MAIL_USERNAME:your-email@gmail.com}
    password: ${MAIL_PASSWORD:your-app-password}
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enable: true
      mail.smtp.starttls.required: true
    from: ${MAIL_USERNAME:your-email@gmail.com}

app:
  frontend-url: ${FRONTEND_URL:http://localhost:3000}
  password-reset-token-expiry-minutes: ${RESET_TOKEN_EXPIRY:60}
```

### Gmail Configuration (If using Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Copy the generated password
3. Set environment variables:
   ```
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=<app-password-from-step-2>
   FRONTEND_URL=http://localhost:3000
   RESET_TOKEN_EXPIRY=60
   ```

### Alternative Email Providers

**SendGrid**:
```yaml
spring:
  mail:
    host: smtp.sendgrid.net
    port: 587
    username: apikey
    password: ${SENDGRID_API_KEY}
```

**Office 365**:
```yaml
spring:
  mail:
    host: smtp.office365.com
    port: 587
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
```

## API Endpoints

### 1. Request Password Reset
```
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response 200:
{
  "success": true,
  "message": "If an account exists with that email, you will receive a password reset link",
  "resetToken": "token-for-dev-testing"  // Only in development
}
```

### 2. Validate Reset Token
```
GET /api/v1/auth/validate-reset-token?token={token}

Response 200:
{
  "valid": true
}
```

### 3. Reset Password
```
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}

Response 200:
{
  "success": true,
  "message": "Password has been successfully reset. You can now login with your new password."
}

Response 400:
{
  "success": false,
  "message": "Passwords do not match"
}
```

## User Flow

### 1. Forgot Password Step by Step

1. **User clicks "Forgot password?"** on login page
   - Modal opens with email input
   
2. **User enters email** and clicks "Send Reset Link"
   - Backend generates secure token
   - Email sent with reset link
   - Modal shows success message
   
3. **User clicks email link**
   - Opens reset-password page with token in URL
   - Frontend validates token with backend
   - Shows password reset form
   
4. **User enters new password**
   - Must be at least 6 characters
   - Must match confirmation password
   - Click "Reset Password"
   
5. **Success**
   - Password updated
   - User redirected to login
   - Can now login with new password

## Security Features

1. **Token Expiration** (default: 60 minutes)
   - Tokens automatically expire after configured time
   - No password reset possible after expiration
   
2. **One-time Use**
   - Each token can only be used once
   - Previous tokens invalidated when new reset requested
   - Used tokens cannot be reused
   
3. **Secure Token Generation**
   - UUID-based secure tokens
   - Unique and unpredictable
   - Stored as hashed if using database-level security
   
4. **Email Verification**
   - Only verified emails receive reset links
   - Non-existent emails don't reveal account existence
   
5. **Password Encryption**
   - All passwords encoded with PasswordEncoder
   - Passwords never stored in plain text

## Testing

### Manual Testing

#### Test Case 1: Valid Password Reset
1. Go to login page
2. Click "Forgot password?"
3. Enter valid email
4. Check email for link
5. Click link in email
6. Enter new password (e.g., "NewPass123")
7. Click "Reset Password"
8. Should see success message
9. Login with new password

#### Test Case 2: Invalid Token
1. Try accessing `http://localhost:3000/reset-password?token=invalid`
2. Should show "Invalid reset link" message

#### Test Case 3: Expired Token
1. Wait for token expiration (60+ minutes by default)
2. Try to reset password with expired token
3. Should show expiration message

#### Test Case 4: Non-matching Passwords
1. Enter "Password123" and "Password456"
2. Should show error "Passwords do not match"

### Development Testing

In development mode, the `resetToken` is included in the forgot-password response for testing without email setup:

```javascript
// Response includes:
"resetToken": "uuid-token-here"
```

You can use this token directly for testing without setting up email.

## Files Created/Modified

### Backend
- ✅ `entity/PasswordReset.java` - NEW
- ✅ `repository/PasswordResetRepository.java` - NEW
- ✅ `dto/ForgotPasswordRequest.java` - NEW
- ✅ `dto/ForgotPasswordResponse.java` - NEW
- ✅ `dto/ResetPasswordRequest.java` - NEW
- ✅ `dto/ResetPasswordResponse.java` - NEW
- ✅ `service/PasswordResetService.java` - NEW
- ✅ `controller/AuthController.java` - MODIFIED (added 3 new endpoints)
- ✅ `resources/application.yml` - MODIFIED (added email config)
- ✅ `add-password-reset-table.sql` - NEW (migration script)

### Frontend
- ✅ `components/ForgotPassword.jsx` - NEW
- ✅ `pages/customer/reset-password.jsx` - NEW
- ✅ `pages/customer/login.jsx` - MODIFIED (added forgot password modal)
- ✅ `App.jsx` - MODIFIED (added reset-password route)

## Troubleshooting

### Emails not sending

**Check 1: Email Service Configuration**
- Verify `MAIL_USERNAME` and `MAIL_PASSWORD` in environment variables
- Test with Gmail app password
- Check firewall/port 587 is open

**Check 2: Logs**
- Check application logs for JavaMailSender errors
- Backend logs will show "Failed to send password reset email"

**Check 3: Email Format**
- Ensure emails are valid format
- Use test email address

### Token validation failing

**Check 1: Database Setup**
- Ensure `password_resets` table was created
- Check user_id foreign key exists

**Check 2: Token Expiry**
- Check if 60 minutes have passed (default expiry)
- Generate new reset link if expired

### Password not updating

**Check 1: Database Connection**
- Ensure PostgreSQL is running
- Check connection string in `application.yml`

**Check 2: Authorization**
- Ensure user exists in database
- Check user account is not disabled

## Future Enhancements

1. **Email Template Customization**
   - HTML email templates
   - Brand customization

2. **OTP Alternative**
   - One-Time Password via SMS
   - SMS + Email verification

3. **Password Strength Validation**
   - Require uppercase/lowercase/numbers/special chars
   - Check against common password list

4. **Rate Limiting**
   - Limit password reset requests per email
   - Prevent brute force token guessing

5. **Admin Override**
   - Admin can initiate password resets for users
   - Admin can unlock accounts

6. **Session Management**
   - Invalidate existing sessions on password reset
   - Force re-login on other devices

## Support

For issues or questions, check:
- Backend logs: Spring Boot logs in console
- Frontend console: Browser DevTools Console
- Database: Check `password_resets` table directly

---

**Implementation Date**: March 23, 2026
**Version**: 1.0
**Status**: Production Ready
