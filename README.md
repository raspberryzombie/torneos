# Tennis Tournament App - Technical Specification

## Project Overview

- **Name**: Torneos (Tennis Tournament Manager)
- **Type**: Mobile-first Web Application
- **Stack**: React/Vite + FastAPI
- **Target Users**: Tennis Players (amateur/pro) + Tournament Organizers
- **MVP Focus**: Match scheduling, tournament registration, score reporting

---

## Architecture

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── components/     # UI components
│   ├── pages/          # Screen components
│   ├── hooks/         # Custom hooks
│   ├── services/      # API calls
│   ├── stores/        # State management
│   ├── types/         # TypeScript types
│   └── utils/         # Utilities
├── public/
└── index.html
```

### Backend (FastAPI)
```
backend/
├── app/
│   ├── api/           # API routes
│   ├── models/        # DB models
│   ├── schemas/       # Pydantic schemas
│   ├── services/      # Business logic
│   └── main.py        # App entrypoint
├── .venv/
└── requirements.txt
```

---

## Core Features (MVP Priority)

### P0 - Must Have
1. **User Authentication**
   - Email + password registration
   - Google social login
   - Player profile (name, level, hand)

2. **Tournament Discovery**
   - Browse tournaments (filter by location, date, category)
   - Tournament details view
   - Registration (one-tap)

3. **Match Schedule**
   - My schedule today + upcoming
   - Match cards (time, opponent, court)
   - Push notifications (30min before)

4. **Match Reporting**
   - Winner reports score
   - Opponent confirmation
   - Dispute handling

### P1 - Should Have
5. **Tournament Management** (Organizer)
   - Create tournament
   - Basic config (name, dates, venue)
   - Manage registrations

6. **Match Draws**
   - Bracket visualization
   - Live updates

---

## Design System

See: `docs/UI-UX-guidelines.md`

### Key Points
- Dark theme (#0D0D0D base)
- Accent: #00D4AA (tennis green)
- Mobile-first (44px touch targets, 16px min text)
- Schedule is PRIMARY screen

---

## API Endpoints (Draft)

### Auth
- `POST /api/auth/register` - Email registration
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user
- `POST /api/auth/google` - Google OAuth

### Tournaments
- `GET /api/tournaments` - List (with filters)
- `GET /api/tournaments/{id}` - Detail
- `POST /api/tournaments` - Create (organizer)
- `POST /api/tournaments/{id}/register` - Register
- `DELETE /api/tournaments/{id}/register` - Cancel

### Matches
- `GET /api/matches` - My matches
- `GET /api/matches/{id}` - Match detail
- `POST /api/matches/{id}/score` - Report score

### Users
- `GET /api/users/me` - Profile
- `PUT /api/users/me` - Update profile

---

## Database Schema (Draft)

### Users
```sql
users (
  id, email, password_hash, name, photo_url,
  level, preferred_hand, created_at
)
```

### Tournaments
```sql
tournaments (
  id, name, organizer_id, venue, start_date,
  end_date, format, category, capacity,
  entry_fee, status, created_at
)
```

### Matches
```sql
matches (
  id, tournament_id, round, player1_id,
  player2_id, court, scheduled_at,
  score, winner_id, status
)
```

### Registrations
```sql
registrations (
  id, tournament_id, user_id, category,
  status, registered_at
)
```

---

## Workflow

### Starting a New Feature
```bash
# En OpenCode, ejecutar:
/sdd-new user-authentication

# El orchestrator corre:
# 1. sdd-explore → Investigation
# 2. sdd-propose → Proposal
# 3. sdd-spec → Written specs
# 4. sdd-design → Architecture
# 5. sdd-tasks → Task breakdown
# 6. sdd-apply → Implementation
# 7. sdd-verify → Testing/verification
# 8. sdd-archive → Documentation
```

### Branch Strategy
```
feat/<feature-name>    # New features
fix/<issue-name>       # Bug fixes
refactor/<name>        # Refactoring
docs/<name>           # Documentation
```

---

## Getting Started

1. Install dependencies:
   ```bash
   cd frontend && npm install
   cd backend && source .venv/bin/activate && pip install -r requirements.txt
   ```

2. Run development:
   ```bash
   # Frontend
   cd frontend && npm run dev
   
   # Backend
   cd backend && source .venv/bin/activate && uvicorn main:app --reload
   ```

3. Access:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000
   - API Docs: http://localhost:8000/docs

---

## Future Considerations

- UTR/ITN integration
- Live streaming
- Video replay
- Payment processing
- Chat between players
- Analytics dashboard

---

*Last updated: 2026-05-04*