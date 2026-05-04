# Feature: Delegate Permissions - Tasks

## Implementation Tasks

### Phase 1: Backend - Models & Core

- [x] **T1.1** Create DelegateToken model in `backend/app/models/delegate_token.py`
- [x] **T1.2** Create delegate schemas in `backend/app/schemas/delegate.py`
- [x] **T1.3** Create delegate API router in `backend/app/api/delegates.py`
- [x] **T1.4** Implement generate QR endpoint
- [x] **T1.5** Implement activate session endpoint
- [x] **T1.6** Add permission check middleware
- [x] **T1.7** Add token validation on protected routes

### Phase 2: Frontend - Core UI

- [x] **T2.1** Create DelegateBanner component
- [x] **T2.2** Add QR scanner library (html5-qrcode or similar)
- [x] **T2.3** Create DelegateScanner page
- [x] **T2.4** Create DelegateQR modal in MyTournaments
- [x] **T2.5** Update API service with delegate endpoints

### Phase 3: Integration & Permissions

- [x] **T3.1** Block restricted actions in UI
- [x] **T3.2** Add permission checks on backend
- [x] **T3.3** Handle "no edit existing results" restriction
- [x] **T3.4** Implement revoke session functionality

### Phase 4: Testing

- [ ] **T4.1** Test generate QR flow
- [ ] **T4.2** Test scan and activate
- [ ] **T4.3** Test permission restrictions
- [ ] **T4.4** Test revoke functionality

---

## File Structure

```
backend/app/models/
├── delegate_token.py   # NEW

backend/app/schemas/
├── delegate.py        # NEW

backend/app/api/
├── delegates.py      # NEW

frontend/src/
├── components/
│   └── DelegateBanner.jsx   # NEW
├── pages/
│   ├── DelegateScanner.jsx  # NEW
│   └── DelegateQR.jsx        # NEW
├── services/
│   └── api.js               # MODIFIED
```

---

## Dependencies

### Backend
No new dependencies - using existing JWT and QR generation

### Frontend
```
npm install html5-qrcode  # QR scanning
```

---

## Estimated Effort

| Task Group | Hours |
|------------|-------|
| Backend | 4h |
| Frontend | 4h |
| Integration | 2h |
| Testing | 2h |
| **Total** | **12h** |

---

*Tasks version: 1.0*
*Feature branch: feat/delegate-permissions*