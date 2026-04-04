# Password Reset Feature - Testing Guide

## Complete Flow Testing

### Prerequisites
- Backend running on http://localhost:8080
- Frontend running on http://localhost:3000
- PostgreSQL database with `password_resets` table
- Email configuration set up (see EMAIL_SETUP_GUIDE.md)

### Test Scenario 1: Happy Path (Complete Reset)

#### Step 1: Initiate Password Reset (Forgot Password)
1. Open frontend: http://localhost:3000/login
2. Click "Forgot password?" link
3. Enter registered email address
4. Click "Send Reset Link"
5. **Expected**: Success message appears

#### Step 2: Verify Email Received
1. Check your email inbox
2. **Expected**: Email from Smart Fashion Styling with subject "Password Reset Request - Smart Fashion Styling"
3. **Email contains**: 
   - Personalized greeting with first name
   - Reset link with token
   - Expiration time (60 minutes from request)
   - Footer from team

#### Step 3: Click Reset Link
1. Click the link in the email
2. **Expected**: Redirected to http://localhost:3000/reset-password?token=<token>
3. **Page shows**: "Reset Your Password" form

#### Step 4: Create New Password
1. Enter new password (min 6 characters)
2. Confirm password (must match)
3. Click "Reset Password"
4. **Expected**: 
   - Success message appears
   - Auto-redirect to login after 2 seconds
   - Old password no longer works
   - New password allows login

---

### Test Scenario 2: Invalid Token

#### Step 1: Try with invalid token
1. Manually navigate to: `http://localhost:3000/reset-password?token=invalid-token-12345`
2. **Expected**: Error message "This reset link has expired or is invalid"
3. "Back to Login" button is available

#### Step 2: Try with no token
1. Navigate to: `http://localhost:3000/reset-password`
2. **Expected**: Error message "No reset token provided"

---

### Test Scenario 3: Expired Token

#### Step 1: Request password reset
1. Follow Test Scenario 1, Step 1-2

#### Step 2: Wait for expiration (or modify token expiry)
1. In application.yml, temporarily set:
```yaml
app:
  password-reset-token-expiry-minutes: 0
```
2. Request a new password reset
3. After a few seconds, try to use the link

#### Step 3: Use expired token
1. Click the reset link
2. **Expected**: Error message about expired token
3. User can request a new reset link

---

### Test Scenario 4: Password Mismatch

#### During Step 4 of Test Scenario 1:
1. Enter "newPassword123" in first field
2. Enter "differentPassword456" in second field
3. **Expected**: Real-time error "Passwords do not match"
4. Submit button is disabled (grayed out)

---

### Test Scenario 5: Token Reuse Prevention

#### Step 1: Successfully reset password
1. Follow Test Scenario 1 completely

#### Step 2: Try to reuse the same token
1. Click the same reset link from the email again
2. **Expected**: Error "Reset token has expired or already been used"

---

### Test Scenario 6: Invalidate Previous Tokens

#### Step 1: Request password reset
1. Click "Forgot password" and submit email
2. Note: Email 1 with token is received

#### Step 2: Request another reset immediately
1. While email 1 is fresh, request password reset again for same email
2. Receive Email 2 with new token

#### Step 3: Try old token
1. Use token from Email 1
2. **Expected**: Error "Reset token has expired or already been used"
3. New token from Email 2 should work

---

### API Testing with Postman/cURL

#### Test 1: Request Password Reset
```bash
curl -X POST http://localhost:8080/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "If an account exists with that email, you will receive a password reset link",
  "resetToken": "uuid-token-string"
}
```

#### Test 2: Validate Reset Token
```bash
curl -X GET "http://localhost:8080/api/v1/auth/validate-reset-token?token=YOUR_TOKEN_HERE"
```

**Expected Response (Valid Token):**
```json
{
  "valid": true
}
```

**Expected Response (Invalid Token):**
```json
{
  "valid": false
}
```

#### Test 3: Reset Password
```bash
curl -X POST http://localhost:8080/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_TOKEN_HERE",
    "newPassword": "NewPassword123",
    "confirmPassword": "NewPassword123"
  }'
```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Password has been successfully reset. You can now login with your new password."
}
```

**Expected Response (Failure):**
```json
{
  "success": false,
  "message": "Reset token has expired or already been used"
}
```

---

## Backend Verification

### Check Logs for Email Sending
Look for these log messages in your backend console:

**Success:**
```
Password reset email sent to: user@example.com
```

**Failure:**
```
Failed to send password reset email to: user@example.com
[Error details...]
```

### Database Verification

```sql
-- Check password reset tokens
SELECT id, email, token, expires_at, used, created_at 
FROM password_resets 
ORDER BY created_at DESC 
LIMIT 5;

-- Check if token was marked as used
SELECT * FROM password_resets WHERE token = 'your-token';

-- Check user password was updated
SELECT id, email, password, updated_at FROM users WHERE email = 'user@example.com';
```

---

## Debugging Checklist

- [ ] Backend is running without errors
- [ ] Frontend is running without errors
- [ ] PostgreSQL database is accessible
- [ ] `password_resets` table exists in database
- [ ] Email credentials are configured (check environment variables)
- [ ] Port 587 (SMTP) is not blocked by firewall
- [ ] Registered test user exists in the database
- [ ] Check backend logs for email sending status
- [ ] Verify email is not going to spam folder
- [ ] Test with backend logs at DEBUG level for detailed info

### Enable Debug Logging
In application.yml, add:
```yaml
logging:
  level:
    org.springframework.mail: DEBUG
    org.springframework.mail.javamail: DEBUG
    com.smartfashion.service: DEBUG
```

---

## Common Issues and Solutions

### Email not received?
- Check spam/junk folder
- Verify email credentials are correct
- Check backend logs for "Failed to send" errors
- Test with `curl` API endpoint

### Token validation fails?
- Ensure token hasn't expired (default 60 minutes)
- Check database for `password_resets` entry
- Verify `used` flag is false

### Password update not working?
- Check new password meets minimum 6 character requirement
- Verify passwords match exactly
- Check database for user update

### Session hangs on "Validating your reset link..."?
- Verify backend is running
- Check network tab in browser DevTools for API response
- Look for CORS errors in browser console
- Check if validate-reset-token endpoint is responding

---

## Test Data

### Test User (if needed)
Email: testuser@example.com
Password: TestPassword123

### Test Credentials for Gmail
Email: your-email@gmail.com
App Password: (16 characters from Google Account)

---

## Performance Considerations

- Token generation: Instant
- Email sending: Usually 1-5 seconds
- Token validation: Instant (database query)
- Password reset: Instant (password encoding + update)
- Token cleanup: Optional scheduled task

## Security Verification

- [ ] Tokens are UUID format (not sequential)
- [ ] Token expiry is enforced
- [ ] Tokens are marked as used after reset
- [ ] Passwords are encoded (not stored in plain text)
- [ ] Email existence is not revealed (even if user doesn't exist)
- [ ] Multiple reset requests invalidate previous tokens
- [ ] Reset link includes secure token in URL
- [ ] HTTPS should be used in production
