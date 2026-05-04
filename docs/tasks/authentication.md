# Feature: User Authentication - Tasks

## Implementation Tasks

### Phase 1: Backend Setup

- [x] **T1.1** Setup FastAPI with CORS and base config
- [x] **T1.2** Install dependencies: python-jose, passlib, bcrypt, python-multipart
- [x] **T1.3** Create database config (SQLite for MVP)
- [x] **T1.4** Create User model with SQLAlchemy
- [x] **T1.5** Implement password hashing utilities
- [x] **T1.6** Create JWT token generation/validation
- [x] **T1.7** Create auth endpoints (register, login, me, logout)
- [x] **T1.8** Add Google OAuth setup (client ID/Secret config)
- [x] **T1.9** Add rate limiting on auth endpoints

### Phase 2: Frontend Setup

- [x] **T2.1** Install dependencies: react-router-dom, axios
- [x] **T2.2** Create API client with JWT handling
- [x] **T2.3** Create auth context (React Context API)
- [x] **T2.4** Create protected route component
- [x] **T2.5** Setup Tailwind CSS (if needed) or pure CSS with design tokens

### Phase 3: UI Implementation

- [x] **T3.1** Create LoginScreen component
- [x] **T3.2** Create RegisterScreen component
- [x] **T3.3** Create ProfileScreen component
- [x] **T3.4** Apply dark theme from UI/UX guidelines
- [x] **T3.5** Add form validation (email, password min 8 chars)
- [x] **T3.6** Add error display (toast notifications)
- [x] **T3.7** Add loading states

### Phase 4: Integration & Testing

- [x] **T4.1** Connect frontend to backend auth
- [x] **T4.2** Test registration flow
- [x] **T4.3** Test login flow (email + Google)
- [ ] **T4.4** Test session persistence
- [ ] **T4.5** Test profile edit
- [x] **T4.6** Verify dark theme matches guidelines

### Phase 5: Documentation

- [x] **T5.1** Update API documentation in OpenAPI spec
- [x] **T5.2** Add comments to auth code
- [x] **T5.3** Document environment variables needed

---

## Dependencies Needed

### Backend
```
fastapi
uvicorn
sqlalchemy
pydantic
python-jose[cryptography]
passlib[bcrypt]
python-multipart
python-dotenv
```

### Frontend
```
react-router-dom
axios
```

---

## Environment Variables

```env
# Backend (.env)
DATABASE_URL=sqlite:///./torneos.db
SECRET_KEY=<generate-64-char-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200  # 30 days

# Google OAuth
GOOGLE_CLIENT_ID=<from-google-cloud>
GOOGLE_CLIENT_SECRET=<from-google-cloud>
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

---

## File Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── auth.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── auth.py
│   └── api/
│       ├── __init__.py
│       └── auth.py
├── .env
├── requirements.txt
└── main.py

frontend/src/
├── contexts/
│   └── AuthContext.tsx
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Profile.tsx
├── services/
│   └── api.ts
├── components/
│   └── (shared components)
└── App.tsx
```

---

## Estimated Effort

| Task Group | Hours |
|-----------|-------|
| Backend | 4-6h |
| Frontend | 4-6h |
| Testing | 2h |
| **Total** | **10-14h** |

---

*Tasks version: 1.0*
*Feature branch: feat/user-authentication*