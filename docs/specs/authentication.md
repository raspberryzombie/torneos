# Feature: User Authentication
## Specification Document

---

## 1. Overview

### Purpose
Allow users to register, login, and manage their player profiles in the tennis tournament app.

### Target Users
- Tennis players (amateur and recreational)
- Tournament organizers (club managers, pros)

### User Flows
1. **Registration** - Create account with email or Google
2. **Login** - Authenticate and maintain session
3. **Profile Management** - Update player information

---

## 2. Requirements

### 2.1 Registration

#### Scenario: Email Registration
- **GIVEN** a new user wants to create an account
- **WHEN** they enter email, password, and confirm password
- **AND** they agree to terms of service
- **THEN** account is created
- **AND** user is logged in automatically
- **AND** redirect to profile completion

#### Scenario: Google Social Login
- **GIVEN** user clicks "Continue with Google"
- **WHEN** they authenticate with Google
- **THEN** account is created (if new) or logged in (if existing)
- **AND** profile data is populated from Google

#### Scenario: Profile Completion After Registration
- **GIVEN** new user after registration
- **WHEN** completing profile
- **THEN** must provide:
  - Display name (required)
  - Player level 1-10 or NTRP equivalent (required)
  - Preferred hand: left/right (required)
  - Date of birth (optional, for age verification)
- **AND** can upload profile photo (optional)

---

### 2.2 Authentication

#### Scenario: Email Login
- **GIVEN** existing user
- **WHEN** they enter email + password
- **AND** credentials are valid
- **THEN** they are logged in
- **AND** redirect to schedule (home)

#### Scenario: Invalid Credentials
- **GIVEN** user enters wrong password
- **WHEN** they submit login
- **THEN** error message: "Email o contraseña incorrectos"
- **AND** they can try again

#### Scenario: Session Persistence
- **GIVEN** logged in user
- **WHEN** they close browser
- **THEN** session persists for 30 days
- **AND** no re-login required on return

#### Scenario: Logout
- **GIVEN** logged in user
- **WHEN** they click logout
- **THEN** session is cleared
- **AND** redirect to login page

---

### 2.3 Profile Management

#### Scenario: View Profile
- **GIVEN** logged in user
- **WHEN** they visit profile page
- **THEN** they see:
  - Profile photo
  - Display name
  - Player level
  - Preferred hand
  - Member since date

#### Scenario: Edit Profile
- **GIVEN** logged in user
- **WHEN** they edit and save profile
- **THEN** changes are saved
- **AND** confirmation toast shown

---

## 3. Technical Specification

### 3.1 API Endpoints

```
POST /api/auth/register
Body: { email, password, name }
Response: { user, access_token }

POST /api/auth/login
Body: { email, password }
Response: { user, access_token }

GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { user }

POST /api/auth/logout
Headers: Authorization: Bearer <token>
Response: { success }

GET /api/auth/google
Redirect: Google OAuth URL

GET /api/auth/google/callback
Query: code
Response: { user, access_token }
```

### 3.2 User Schema

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  level: number; // 1-10
  preferredHand: 'left' | 'right';
  dateOfBirth?: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 3.3 Database

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  photo_url VARCHAR(500),
  level INTEGER CHECK (level >= 1 AND level <= 10),
  preferred_hand VARCHAR(10) CHECK (preferred_hand IN ('left', 'right')),
  date_of_birth DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. Security Requirements

- Password: minimum 8 characters
- Passwords stored with bcrypt (work factor 12)
- JWT tokens: 30-day expiration
- Tokens stored in httpOnly cookies
- CSRF protection enabled
- Rate limiting on auth endpoints

---

## 5. UI/UX Requirements

See: `docs/UI-UX-guidelines.md`

### 5.1 Login Screen
```
┌─────────────────────────────────┐
│ ← Back      Iniciar Sesión     │
├─────────────────────────────────┤
│                                 │
│           [Logo]               │
│                                 │
│    Torneos                    │
│                                 │
│  ┌─────────────────────────┐  │
│  │ tu@email.com            │  │ ← Email input
│  └─────────────────────────┘  │
│                                 │
│  ┌─────────────────────────┐  │
│  │ ••••••••               │  │ ← Password input
│  └─────────────────────────┘  │
│                                 │
│  [INICIAR SESIÓN]              │ ← Primary button
│                                 │
│  ○─────────────────────────   │
│      o continuar con Google   │ ← Social login
│                                 │
│  ¿No tenés cuenta? [Registrarte]│ ← Link to register
└─────────────────────────────────┘
```

### 5.2 Register Screen
```
┌─────────────────────────────────┐
│ ← Atras     Crear Cuenta       │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐  │
│  │ Tu nombre               │  │ ← Name input
│  └─────────────────────────┘  │
│                                 │
│  ┌─────────────────────────┐  │
│  │ tu@email.com            │  │ ← Email input
│  └─────────────────────────┘  │
│                                 │
│  ┌─────────────────────────┐  │
│  │ ••••••••               │  │ ← Password
│  └─────────────────────────┘  │
│                                 │
│  ┌─────────────────────────┐  │
│  │ ••••••••               │  │ ← Confirm password
│  └─────────────────────────┘  │
│                                 │
│  [CREAR CUENTA]                │
│                                 │
│  ○─────────────────────────   │
│      o continuar con Google   │
│                                 │
│  [✓] Acepto Terminos y        │
│     Condiciones              │
└──────────────────────���─��────────┘
```

### 5.3 Profile Screen
```
┌─────────────────────────────────┐
│ ← Atras     Mi Perfil          │
├─────────────────────────────────┤
│                                 │
│          ┌──────┐             │
│          │ 📷  │               │ ← Photo (tap to change)
│          └──────┘             │
│                                 │
│      Juan Pérez              │ ← Name (editable)
│                                 │
│      Nivel: 5                  │ ← Level selector
│                                 │
│      Mano: Derecha            │ ← Hand toggle
│                                 │
│  ───────────────────────────   │
│      Miembro desde: Ene 2024 │
│                                 │
│  [GUARDAR CAMBIOS]            │
└─────────────────────────────────┘
```

---

## 6. Edge Cases

### 6.1 Email Already Exists
- **WHEN** registering with existing email
- **THEN** error: "Este email ya está registrado"
- **AND** suggest login

### 6.2 Google Account Without Email
- **WHEN** Google account has no email permission
- **THEN** prompt user to enter email manually

### 6.3 Password Too Weak
- **WHEN** password < 8 chars
- **THEN** error: "La contraseña debe tener al menos 8 caracteres"

### 6.4 Session Expired
- **WHEN** token expired
- **THEN** redirect to login with message
- **AND** preserve last URL for redirect back

---

## 7. Acceptance Criteria

- [ ] User can register with email + password
- [ ] User can login with Google
- [ ] Session persists 30 days
- [ ] User can edit profile (name, level, hand)
- [ ] Invalid credentials show error message
- [ ] Protected routes redirect to login if not authenticated

---

## 8. Out of Scope (MVP)

- Email verification
- Password reset flow
- Two-factor authentication
- Profile photo upload to cloud storage
- Multiple profiles per account
- Team/club accounts

---

*Spec version: 1.0*
*Created: 2026-05-04*
*Feature branch: feat/user-authentication*