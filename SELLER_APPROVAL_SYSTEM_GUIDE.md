# Seller Registration & Admin Approval System - Complete Setup Guide

## System Architecture

```
Customer/Seller Registration Form
    ↓
Backend API (POST /api/v1/sellers)
    ↓
Database (sellers table)
    ↓
Admin Dashboard (view pendingapprovals)
    ├→ Approve → Status: APPROVED
    ├→ Reject → DELETE from database
    ↓
Seller Login (Email + Password)
    ↓
Access System
```

## Features Implemented

### 1. **Seller Registration**
✅ Form submits to backend: `POST /api/v1/sellers`
✅ Data stored in PostgreSQL `sellers` table
✅ Default status: `PENDING`
✅ Password encrypted with BCrypt

### 2. **Admin Dashboard**
✅ View all registration requests with filters
✅ View Details button → Modal with full seller info
✅ **APPROVE** button → Updates status to `APPROVED` + stores approval timestamp
✅ **REJECT & DELETE** button → Permanently deletes registration request

### 3. **Seller Login**
✅ `POST /api/v1/sellers/login` endpoint
✅ Accepts: `{ email, password }`
✅ Validates:
   - Seller exists
   - Status is `APPROVED` (only approved sellers can login)
   - Password matches
✅ Returns seller data on success
✅ Stored in localStorage as `sellerUser`

### 4. **Multi-Role Login System**
✅ Admin: `admin@gmail.com` / `Admin@1234` → Admin Dashboard
✅ Seller: Any approved seller email/password → User as Seller
✅ Customer: Regular user login

---

## Testing Workflow

### **Step 1: Submit Seller Registration**
1. Open `http://localhost:3000`
2. Click "Become a Seller"
3. Fill in the form:
   - Shop Name: "My Fashion Store"
   - Email: "store@example.com"
   - Password: "MyPass123"
   - (Fill other required fields)
4. Click Submit
5. ✅ Should show: "Shop registration submitted successfully!"

### **Step 2: Admin Approves Seller**
1. Go to `http://localhost:3000/login`
2. Login as Admin:
   - Email: `admin@gmail.com`
   - Password: `Admin@1234`
3. Go to Admin Dashboard (automatic redirect)
4. Filter by "Pending" status
5. Click "View Details" on the seller request
6. In the modal:
   - Click **"✓ Approve"** to approve
   - Click **"✕ Reject & Delete"** to reject (will ask for confirmation)
7. ✅ Should show: "Seller approved successfully!" or "Seller request rejected and deleted!"

### **Step 3: Approved Seller Logs In**
1. Go to `http://localhost:3000/login`
2. Login with Seller Email/Password:
   - Email: `store@example.com`
   - Password: `MyPass123`
3. ✅ Should show: "Seller login successful! Redirecting..."
4. ✅ Seller data stored in localStorage as `sellerUser`

### **Step 4: Non-Approved Seller Cannot Login**
1. Register a new seller
2. Try to login WITHOUT admin approval
3. ✅ Should show: "Your registration is not approved yet. Current status: PENDING"

---

## Backend Endpoints

| Method | Endpoint | Purpose | Requires Auth |
|--------|----------|---------|---------------|
| POST | `/api/v1/sellers` | Register new seller | No |
| GET | `/api/v1/sellers` | Get all sellers (with filters) | Yes (admin) |
| GET | `/api/v1/sellers/{id}` | Get seller by ID | No |
| GET | `/api/v1/sellers/stats/overview` | Get statistics | No |
| POST | `/api/v1/sellers/login` | Seller login | No |
| PATCH | `/api/v1/sellers/{id}/approve` | Approve seller | Yes (admin) |
| DELETE | `/api/v1/sellers/{id}` | Delete seller | Yes (admin) |
| PUT | `/api/v1/sellers/{id}` | Update seller | Yes (admin) |

---

## Database Schema

### Sellers Table
```sql
- id (Primary Key, Auto-increment)
- shop_name (Required, Unique with email)
- email (Required, Unique)
- password (Encrypted with BCrypt)
- phone, address, city, state, zip_code
- bank_account_name, bank_account_number, bank_ifsc
- category, business_type, average_price_range
- website, instagram, facebook, twitter, linkedin
- status (PENDING, APPROVED, REJECTED)
- submitted_at, approved_at, rejected_at
- rejection_reason, created_at, updated_at
- Indexes: email, status, created_at, shop_name
```

---

## Frontend Components Updated

### Seller Registration (`seller-register.jsx`)
- ✅ Calls `sellerAPI.submitRegistration()` → Stores in database
- ✅ Password validation (min 6 chars, matching)
- ✅ Success/error alerts

### Admin Dashboard (`admin-dashboard.jsx`)
- ✅ Fetches sellers from API
- ✅ Real-time statistics
- ✅ Status filtering and search
- ✅ Details modal with approve/reject buttons
- ✅ `handleApprove()` → Calls PATCH `/approve`
- ✅ `handleReject()` → Calls DELETE (permanent removal)

### Login Page (`login.jsx`)
- ✅ Added seller login logic
- ✅ Tries seller login after admin check fails
- ✅ Stores seller session in localStorage
- ✅ Falls back to customer login if both fail

### Seller API Service (`sellerAPI.js`)
- ✅ `sellerLogin(email, password)` endpoint
- ✅ `deleteSeller(id)` endpoint
- ✅ All CRUD operations

---

## Backend Components Updated

### Seller Entity (`Seller.java`)
- ✅ 30+ fields mapping to database
- ✅ SellerStatus enum (PENDING, APPROVED, REJECTED)
- ✅ Automatic timestamps via @PrePersist/@PreUpdate
- ✅ Email unique constraint

### Seller Service (`SellerService.java`)
- ✅ `approveSeller(sellerId)` - Updates status + sets approvedAt
- ✅ `rejectSeller(sellerId, reason)` - Updates status + reason
- ✅ Password encoding in `createSeller()`
- ✅ Statistics calculation
- ✅ Search and filtering methods

### Seller Controller (`SellerController.java`)
- ✅ `POST /v1/sellers` - Create registration
- ✅ `POST /v1/sellers/login` - Seller login
- ✅ `PATCH /v1/sellers/{id}/approve` - Approve
- ✅ `DELETE /v1/sellers/{id}` - Delete
- ✅ `GET /v1/sellers` - List with filters
- ✅ Error handling and validation

---

## Configuration Files

### Backend (`application.yml`)
```yaml
spring.datasource.url=jdbc:postgresql://localhost:5432/smart_fashion
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update  # Auto-create tables
server.port=8080
server.servlet.context-path=/api
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:8080/api/v1
```

---

## API Response Examples

### Seller Registration Success
```json
{
  "message": "Seller registration submitted successfully",
  "data": {
    "id": 1,
    "shopName": "My Fashion Store",
    "email": "store@example.com",
    "status": "PENDING",
    "submittedAt": "2026-03-21T20:00:00",
    "createdAt": "2026-03-21T20:00:00"
  }
}
```

### Seller Login Success
```json
{
  "message": "Login successful",
  "data": {
    "id": 1,
    "shopName": "My Fashion Store",
    "email": "store@example.com",
    "status": "APPROVED",
    "phone": "+1-555-0100",
    "approvedAt": "2026-03-21T20:10:00"
  }
}
```

### Seller Login Failed (Not Approved)
```json
{
  "error": "Your registration is not approved yet. Current status: PENDING"
}
```

---

## Status Flow

```
Registration
    ↓
status = PENDING
    ↓
┌─────────────┬──────────────┐
│             │              │
Admin Approve  Admin Reject
│             │
↓             ↓
APPROVED      DELETED
(can login)   (from database)
```

---

## Running the System

### Start Backend
```bash
cd apps/backend
mvn clean install -DskipTests
java -jar target/smart-fashion-backend-1.0.0.jar
```

### Start Frontend
```bash
cd apps/frontend
npm run dev
```

### Access
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080/api`
- Admin Dashboard: `http://localhost:3000/admin/dashboard`

---

## Testing Checklist

- [ ] Seller registration form submits to database
- [ ] Admin can view pending requests
- [ ] Admin can view seller details in modal
- [ ] Admin approve button changes status to APPROVED
- [ ] Admin reject button deletes the request
- [ ] Approved seller can login
- [ ] Pending seller cannot login
- [ ] Seller data displayed in seller user object
- [ ] Password is encrypted in database
- [ ] Statistics update in real-time
- [ ] Filter by status works correctly
- [ ] Search by shop name/email works

---

## Common Issues & Fixes

### Issue: "Seller not found" during login
**Solution**: Check if seller was approved by admin. Only APPROVED sellers can login.

### Issue: "Invalid email or password"
**Solution**: Verify password is correct. Passwords are case-sensitive and encrypted.

### Issue: Admin approve not working
**Solution**: Ensure backend is running and connected to database. Check logs for errors.

### Issue: Rejected seller request still shows up
**Solution**: Refresh the Admin Dashboard. Rejected sellers are deleted from database.

---

**Status**: ✅ COMPLETE - All features implemented and ready for production testing
