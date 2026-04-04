# Email Setup Guide for Password Reset Feature

## Overview
The password reset feature requires email configuration to send verification links. This guide walks you through setting up email with Gmail (recommended), SendGrid, or custom SMTP servers.

## Option 1: Gmail (Recommended for Development)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Complete the verification process

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer" (or your device)
3. Google will generate a 16-character password
4. Copy this password (you'll need it in Step 3)

### Step 3: Configure Environment Variables

#### On Windows (Command Prompt):
```batch
setx MAIL_USERNAME your-email@gmail.com
setx MAIL_PASSWORD your-16-character-app-password
setx FRONTEND_URL http://localhost:3000
setx RESET_TOKEN_EXPIRY 60
```

#### On Windows (PowerShell):
```powershell
$env:MAIL_USERNAME = "your-email@gmail.com"
$env:MAIL_PASSWORD = "your-16-character-app-password"
$env:FRONTEND_URL = "http://localhost:3000"
$env:RESET_TOKEN_EXPIRY = "60"
```

#### On Linux/Mac:
```bash
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-16-character-app-password
export FRONTEND_URL=http://localhost:3000
export RESET_TOKEN_EXPIRY=60
```

### Step 4: Update application.yml (Already Configured)
The application.yml is already set up to use these environment variables:
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USERNAME:your-email@gmail.com}
    password: ${MAIL_PASSWORD:your-app-password}
    from: ${MAIL_USERNAME:your-email@gmail.com}
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enable: true
      mail.smtp.starttls.required: true
```

### Step 5: Restart Backend Service
```bash
# Stop the running backend
# Then restart it to pick up the new environment variables
cd apps/backend
mvn clean spring-boot:run
```

## Option 2: SendGrid (Recommended for Production)

### Step 1: Create SendGrid Account
1. Sign up at [SendGrid](https://sendgrid.com/free)
2. Create a free account or upgrade to paid

### Step 2: Create API Key
1. Go to Settings > API Keys
2. Create a new API Key with "Full Access"
3. Copy the key

### Step 3: Configure Environment Variables
Replace the Gmail configuration with SendGrid:

**Windows (PowerShell):**
```powershell
$env:MAIL_USERNAME = "apikey"
$env:MAIL_PASSWORD = "SG.your-sendgrid-api-key"
```

**Linux/Mac:**
```bash
export MAIL_USERNAME=apikey
export MAIL_PASSWORD=SG.your-sendgrid-api-key
```

### Step 4: Update application.yml for SendGrid
```yaml
spring:
  mail:
    host: smtp.sendgrid.net
    port: 587
    username: ${MAIL_USERNAME:apikey}
    password: ${MAIL_PASSWORD:your-sendgrid-api-key}
    from: ${SENDER_EMAIL:your@domain.com}  # Your verified sender email
```

## Option 3: Custom SMTP Server

Configure these environment variables for any SMTP server:
```powershell
$env:MAIL_HOST = "smtp.your-provider.com"
$env:MAIL_PORT = "587"
$env:MAIL_USERNAME = "your-username"
$env:MAIL_PASSWORD = "your-password"
$env:MAIL_FROM = "noreply@yourdomain.com"
```

Update application.yml:
```yaml
spring:
  mail:
    host: ${MAIL_HOST:smtp.gmail.com}
    port: ${MAIL_PORT:587}
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    from: ${MAIL_FROM:noreply@smartfashion.com}
```

## Verifying Email Configuration

### Method 1: Check Spring Boot Logs
When you start the backend, look for:
```
...
c.s.service.PasswordResetService : Password reset email sent to: user@example.com
```

### Method 2: Test with Postman
1. Start backend service
2. Send POST to: `http://localhost:8080/api/v1/auth/forgot-password`
3. Request body:
```json
{
  "email": "test@example.com"
}
```
4. Check your email for the reset link

### Method 3: Check Backend Console
The backend logs all email sending attempts. If you see errors like:
- `Failed to send password reset email` - Check email credentials
- `Connection timeout` - Check SMTP host and port
- `Authentication failed` - Verify username and password

## Troubleshooting

### Email not sending?
1. **Verify credentials** - Test credentials with a simple test script
2. **Check firewall** - Ensure port 587 is not blocked
3. **Review logs** - Check backend console for specific error messages
4. **Enable less secure apps** (Gmail) - If getting auth errors
5. **Check sender email** - Verify the sender email is allowed

### Gmail Issues?
- If using Gmail, ensure you generated an App Password, NOT your regular password
- App Passwords only work with 2-Factor Authentication enabled
- The 16-character password should have NO spaces

### SendGrid Issues?
- Verify the API key starts with `SG.`
- Ensure the sender email domain is verified in SendGrid
- Check that the email account has not been suspended

## Email Customization

To customize the email message, edit the `buildEmailContent()` method in `PasswordResetService.java`:

```java
private String buildEmailContent(User user, String resetUrl) {
    return String.format(
        "Hello %s,\n\n" +
        "We received a request to reset your password. Click the link below:\n\n" +
        "%s\n\n" +
        "This link expires in %d minutes.\n\n" +
        "If you didn't request this, ignore this email.\n\n" +
        "Best regards,\n" +
        "Smart Fashion Styling Team",
        user.getFirstName() ?? "User",
        resetUrl,
        tokenExpiryMinutes
    );
}
```

## Production Deployment

For production:
1. Use a professional email service (SendGrid, AWS SES, etc.)
2. Store credentials in secure environment variables
3. Set up email templates for HTML emails
4. Configure DKIM/SPF records for your domain
5. Monitor email delivery success rates
6. Set up bounce handling

## Related Files
- Backend: `apps/backend/src/main/java/com/smartfashion/service/PasswordResetService.java`
- Configuration: `apps/backend/src/main/resources/application.yml`
- Frontend: `apps/frontend/src/pages/customer/reset-password.jsx`
- Frontend Modal: `apps/frontend/src/components/ForgotPassword.jsx`
- Database: `apps/backend/add-password-reset-table.sql`
