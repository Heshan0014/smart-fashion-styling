# Password Reset Email - Quick Action Checklist

## ✅ BEFORE YOU START
- [ ] Backend is built: `mvn clean install`
- [ ] PostgreSQL database is running
- [ ] Frontend is running on http://localhost:3000
- [ ] Test user account exists in database

---

## 🎯 3-MINUTE QUICK SETUP (Gmail)

### Step 1: Get Gmail App Password (2 minutes)
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Copy the 16-character password shown

### Step 2: Set Environment Variables (1 minute)

**PowerShell (Windows):**
```powershell
$env:MAIL_USERNAME = "your-email@gmail.com"
$env:MAIL_PASSWORD = "your-16-char-password"
$env:FRONTEND_URL = "http://localhost:3000"
$env:RESET_TOKEN_EXPIRY = "60"
```

**Command Prompt (Windows):**
```batch
setx MAIL_USERNAME your-email@gmail.com
setx MAIL_PASSWORD your-16-char-password
setx FRONTEND_URL http://localhost:3000
setx RESET_TOKEN_EXPIRY 60
```

### Step 3: Restart Backend (0 minutes)
```bash
cd apps/backend
# If already running: Press Ctrl+C to stop
mvn spring-boot:run
```

### Step 4: Test It! (Instant)
1. Go to http://localhost:3000/login
2. Click "Forgot password?"
3. Enter your email
4. Check your inbox!

---

## ⚡ AUTOMATED SETUP (Windows)

Instead of manual steps, just run:
```bash
cd apps\backend
setup-email.bat
```

Follow the prompts - it will do everything automatically!

---

## 🔍 VERIFY IT'S WORKING

### Check 1: Backend Logs
When you request password reset, look for:
```
Password reset email sent to: user@example.com
```

If you see:
```
Failed to send password reset email to: user@example.com
```
- Check email credentials
- Check firewall/port 587

### Check 2: Frontend Response
Should show: "If an account exists with that email, you will receive a password reset link"

### Check 3: Email Received
- Check inbox (usually arrives in 1-5 seconds)
- If not found, check spam folder
- Open the email and click the reset link

### Check 4: Token Validation
If link works, you should see the "Reset Your Password" form

### Check 5: Password Reset
Enter new password and success message should appear

---

## ❌ COMMON PROBLEMS & SOLUTIONS

| Problem | Cause | Solution |
|---------|-------|----------|
| No email received | Wrong credentials | Re-check email & app password |
| No email received | Port 587 blocked | Use port 465 if available, or check firewall |
| Backend won't start | Env vars not set | Make sure to set user env vars (not just session) |
| Token validation fails | Token expired | Tokens last 60 minutes - request new reset |
| Frontend shows error | Backend not running | Start backend with `mvn spring-boot:run` |
| Email in spam folder | Gmail filters | Mark as "Not Spam" to improve delivery |

---

## 🚀 PRODUCTION SETUP (After Testing)

Once development testing works, for production:

### Use SendGrid Instead of Gmail
```powershell
$env:MAIL_USERNAME = "apikey"
$env:MAIL_PASSWORD = "SG.your-sendgrid-key"
$env:MAIL_FROM = "noreply@yourdomain.com"
```

### Update application.yml
```yaml
spring:
  mail:
    host: smtp.sendgrid.net  # Change from gmail.com
    port: 587
```

### Enable HTTPS
- Update `FRONTEND_URL` to use https://
- Ensure backend uses HTTPS certificate
- Test reset links with HTTPS

---

## 📋 CHECKLIST - COMPLETE FLOW

- [ ] Set email credentials (Gmail or other)
- [ ] Restart backend
- [ ] Verify backend starts without errors
- [ ] Check backend logs show "Password reset email sent to:" (not errors)
- [ ] Test with frontend login page
- [ ] Click "Forgot password?"
- [ ] Enter test email
- [ ] Check inbox for email
- [ ] Click reset link in email
- [ ] Form validation works (password matching)
- [ ] New password set successfully
- [ ] Login with new password works
- [ ] Old password no longer works

---

## 📞 HELP

**Still having issues?** See detailed guides:
- Full setup: `EMAIL_SETUP_GUIDE.md`
- Complete testing: `PASSWORD_RESET_TESTING.md`
- Implementation overview: `RESET_PASSWORD_IMPLEMENTATION.md`

**Key command to run:**
```bash
cd apps/backend && mvn spring-boot:run
```

**Watch for this in logs:**
```
Password reset email sent to: ...
```

If you see errors about email, check the `EMAIL_SETUP_GUIDE.md` troubleshooting section.

---

## 📊 WHAT'S HAPPENING WHEN YOU REQUEST PASSWORD RESET

```
1. Frontend sends email to backend API
   ↓
2. Backend generates secure UUID token
   ↓
3. Backend saves token to database with expiry (60 min)
   ↓
4. Backend SENDS EMAIL with reset link containing token
   ↓
5. Frontend shows success message
   ↓
6. User receives email
   ↓
7. User clicks link → Reset form appears
   ↓
8. User enters new password
   ↓
9. Backend validates token & updates password
   ↓
10. User redirected to login with new password
```

**The key step is #4** - Email must be configured for this to work!

---

## 🎯 IMMEDIATE ACTION REQUIRED

1. **Get Gmail App Password** → 1 minute
2. **Set Environment Variables** → 1 minute  
3. **Restart Backend** → 30 seconds
4. **Test** → 30 seconds

**Total Time: Less than 5 minutes to get email working!**

→ Then see `PASSWORD_RESET_TESTING.md` for comprehensive testing

---

Would you like help with any specific step? Let me know!
