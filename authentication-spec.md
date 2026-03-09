# Freshtick Authentication System Specification

## 1. Overview

This document defines the authentication architecture for the Freshtick platform.

Supported login methods:

1. SMS OTP login using MSG91
2. Google Sign-In using Google Identity Services

Goal:

- Allow users to login using multiple authentication methods.
- Ensure that **one real user corresponds to only one user record**.
- Prevent duplicate accounts when users log in using different providers.
- Support future authentication providers.

---

# 2. Authentication Principles

Authentication must follow these core principles:

1. Each person must have **one unique user record**.
2. Multiple authentication providers can link to the same user.
3. A user may authenticate using any linked provider.
4. New providers should be attachable without schema changes.

Authentication providers must **map to the same user_id**.

---

# 3. System Architecture

Authentication structure:

User
├── Phone OTP Login
├── Google Login
└── Future Providers

All authentication methods resolve to a single:

```
users.id
```

---

# 4. Database Schema

## users table

Stores the core user profile.

```sql
users
-----
id BIGINT PRIMARY KEY
name VARCHAR(255)
email VARCHAR(255) NULL UNIQUE
phone VARCHAR(20) NULL UNIQUE
email_verified_at TIMESTAMP NULL
phone_verified_at TIMESTAMP NULL
created_at TIMESTAMP
updated_at TIMESTAMP
```

Rules:

- email must be unique if present
- phone must be unique if present
- either email or phone must exist

---

## social_accounts table

Stores OAuth provider identities.

```sql
social_accounts
---------------
id BIGINT PRIMARY KEY
user_id BIGINT
provider VARCHAR(50)
provider_id VARCHAR(255)
created_at TIMESTAMP
```

Relationships:

```
social_accounts.user_id → users.id
```

Example:

```
provider: google
provider_id: 103847562384756
```

---

# 5. Authentication Providers

## SMS OTP Authentication

Provider: MSG91

OTP flow:

```
User enters phone number
↓
Send OTP
↓
User enters OTP
↓
OTP verified
↓
Lookup user by phone
```

### Case A — Existing phone

```
Find user by phone
Login user
```

### Case B — New phone

```
Create user
Store phone number
Login user
```

Example record:

```
users
-----
id: 21
phone: 9876543210
email: NULL
```

---

# 6. Google OAuth Login

Provider: Google Identity Services

OAuth response contains:

```
provider_id
email
name
avatar
```

System logic:

Step 1 — Lookup provider

```
SELECT * FROM social_accounts
WHERE provider = 'google'
AND provider_id = google_provider_id
```

### Case A — Provider exists

```
Retrieve user
Login user
```

---

### Case B — Provider does not exist

Check user by email.

```
SELECT * FROM users
WHERE email = google_email
```

#### If email exists

```
Link google account
Insert record into social_accounts
Login user
```

#### If email does not exist

```
Create new user
Insert google email
Insert social_accounts record
Login user
```

---

# 7. Account Linking Rules

Users may login using different providers over time.

Example:

```
First login → Google
Second login → Phone OTP
```

System must merge authentication identities.

---

## Example Scenario

Step 1 — Google login

```
email = rahul@gmail.com
provider_id = 837465829
```

User created:

```
users
-----
id: 10
email: rahul@gmail.com
phone: NULL
```

Social link created:

```
social_accounts
-----
user_id: 10
provider: google
provider_id: 837465829
```

---

Step 2 — Phone OTP login

```
phone = 9876543210
```

System logic:

```
Check if phone exists
```

If not:

```
Check currently authenticated user
```

Update:

```
users.phone = 9876543210
```

Final record:

```
users
-----
id: 10
email: rahul@gmail.com
phone: 9876543210
```

User can now login using:

- Google
- Phone OTP

---

# 8. Provider Lookup Priority

Before creating any user record, system must check:

```
1. provider_id (social_accounts)
2. email (users table)
3. phone (users table)
```

A new user must only be created if none exist.

---

# 9. Laravel Implementation Notes

Recommended OAuth package:

Laravel Socialite

Install:

```
composer require laravel/socialite
```

Environment configuration:

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/auth/google/callback
```

Service configuration:

```
config/services.php
```

```
'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT_URI'),
],
```

---

# 10. Route Definitions

Google OAuth routes:

```
GET /auth/google
GET /auth/google/callback
```

OTP routes:

```
POST /auth/otp/send
POST /auth/otp/verify
```

---

# 11. OTP Security Rules

OTP validation must enforce:

```
OTP expiration: 5 minutes
Max attempts: 5
Resend cooldown: 30 seconds
Daily OTP limit per phone: configurable
```

All OTP attempts must be logged.

---

# 12. OAuth Security Rules

Google authentication must enforce:

```
Verify OAuth token server-side
Never trust client-side email
Validate provider_id
Store provider_id permanently
```

---

# 13. Login User Experience

Recommended login options:

```
Continue with Google
Continue with Phone
Continue with Email
```

After Google login, if phone is missing:

```
Prompt user to verify phone
```

This improves:

- delivery accuracy
- fraud prevention
- account recovery

---

# 14. Future Provider Support

The architecture supports additional providers:

```
Apple Sign-In
Facebook Login
Email Password Login
Magic Link Login
```

All additional providers must use:

```
social_accounts
```

No schema change required.

---

# 15. Example Final User Structure

```
users
-----
id: 21
name: Rahul
email: rahul@gmail.com
phone: 9876543210
```

```
social_accounts
---------------
user_id: 21
provider: google
provider_id: 1029384756
```

This user can authenticate using:

```
Google
Phone OTP
Email
```

All resolve to:

```
user_id = 21
```

---

# 16. Expected System Outcome

The authentication system must guarantee:

- no duplicate user accounts
- multiple login methods per user
- clean database structure
- easy provider expansion
- secure identity verification

This architecture is used by platforms such as:

- Swiggy
- Zomato
- Uber

---

# 17. Copilot Implementation Rules

Copilot must follow these strict rules:

1. Never create a user without checking:
    - provider_id
    - email
    - phone

2. Always link OAuth identities using the social_accounts table.

3. OTP authentication must only login users after phone verification.

4. Social login must always validate provider_id.

5. Users created by social login must be linkable to phone verification later.

6. Database constraints must prevent duplicate email or phone.

---

# End of Specification
