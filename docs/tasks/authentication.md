# Feature: User Authentication - Tasks

## Implementation Tasks

### Phase 1: Backend Setup

- [ ] **T1.1** Setup FastAPI with CORS and base config
- [ ] **T1.2** Install dependencies: python-jose, passlib, bcrypt, python-multipart
- [ ] **T1.3** Create database config (SQLite for MVP)
- [ ] **T1.4** Create User model with SQLAlchemy
- [ ] **T1.5** Implement password hashing utilities
- [ ] **T1.6** Create JWT token generation/validation
- [ ] **T1.7** Create auth endpoints (register, login, me, logout)
- [ ] **T1.8** Add Google OAuth setup (client ID/Secret config)
- [ ] **T1.9** Add rate limiting on auth endpoints

### Phase 2: Frontend Setup

- [ ] **T2.1** Install dependencies: react-router-dom, axios
- [ ] **T2.2** Create API client with JWT handling
- [ ] **T2.3** Create auth context (React Context API)
- [ ] **T2.4** Create protected route component
- [ ] **T2.5** Setup Tailwind CSS (if needed) or pure CSS with design tokens

### Phase 3: UI Implementation

- [ ] **T3.1** Create LoginScreen component
- [ ] **T3.2** Create RegisterScreen component  
- [ ] **T3.3** Create ProfileScreen component
- [ ] **T3.4** Apply dark theme from UI/UX guidelines
- [ ] **T3.5** Add form validation (email, password min 8 chars)
- [ ] **T3.6** Add error display (toast notifications)
- [ ] **T3.7** Add loading states

### Phase 4: Integration & Testing

- [ ] **T4.1** Connect frontend to backend auth
- [ ] **T4.2** Test registration flow
- [ ] **T4.3** Test login flow (email + Google)
- [ ] **T4.4** Test session persistence
- [ ] **T4.5** Test profile edit
- [ ] **T4.6** Verify dark theme matches guidelines

### Phase 5: Documentation

- [ ] **T5.1** Update API documentation in OpenAPI spec
- [ ] **T5.2** Add comments to auth code
- [ ] **T5.3** Document environment variables needed

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