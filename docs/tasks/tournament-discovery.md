# Feature: Tournament Discovery - Tasks

## Implementation Tasks

### Phase 1: Backend Models & Config

- [x] **T1.1** Create Tournament model in `backend/app/models/tournament.py`
- [x] **T1.2** Create Registration model in `backend/app/models/registration.py`
- [x] **T1.3** Add tournament schemas in `backend/app/schemas/tournament.py`
- [x] **T1.4** Create tournaments API router in `backend/app/api/tournaments.py`

### Phase 2: API Endpoints

- [x] **T2.1** Implement GET /api/tournaments (list with filters)
- [x] **T2.2** Implement GET /api/tournaments/{id} (detail)
- [x] **T2.3** Implement POST /api/tournaments/{id}/register
- [x] **T2.4** Implement DELETE /api/tournaments/{id}/register
- [x] **T2.5** Implement GET /api/registrations (my registrations)

### Phase 3: Frontend UI

- [x] **T3.1** Create Tournaments page with list and filters
- [x] **T3.2** Create TournamentDetail page
- [x] **T3.3** Add register/cancel button logic
- [x] **T3.4** Update Schedule page to include nav to tournaments
- [x] **T3.5** Add tournament service to api.js

### Phase 4: Integration

- [x] **T4.1** Connect frontend to backend endpoints
- [ ] **T4.2** Test full registration flow

---

## File Structure

```
backend/app/models/
├── tournament.py      # NEW
├── registration.py   # NEW

backend/app/schemas/
├── tournament.py     # NEW

backend/app/api/
├── tournaments.py   # NEW

frontend/src/pages/
├── Tournaments.jsx   # NEW
├── TournamentDetail.jsx  # NEW

frontend/src/services/
├── api.js           # MODIFIED
```

---

## Estimated Effort

| Task Group | Hours |
|------------|-------|
| Backend | 3-4h |
| Frontend | 3-4h |
| Testing | 1h |
| **Total** | **7-9h** |

---

*Tasks version: 1.0*
*Feature branch: feat/tournament-discovery*