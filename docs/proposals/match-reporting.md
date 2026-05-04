# Proposal: Match Reporting

## Intent

Permitir a los jugadores reportar el resultado de sus partidos. El ganador reporta el score, el oponente confirma, y si hay disputa se marca para revisión manual.

## Scope

### In Scope
- Winner reporta score (set by set)
- Opponent confirma resultado
- Si oponente no confirma en 24h, se acepta auto
- Sistema de disputas para desacuerdos

### Out of Scope
- Revisión manual de disputas (admin)
- Validación automática de scores

## Approach

API: Endpoint para reportar score y confirmar. Frontend: Modal en MatchCard para reportar.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/app/api/matches.py` | Modified | Add report/confirm endpoints |
| `frontend/src/pages/Schedule.jsx` | Modified | Add report button |

## Success Criteria

- [ ] POST /api/matches/{id}/score permite reportar
- [ ] POST /api/matches/{id}/confirm permite confirmar
- [ ] UI permite reportar desde MatchCard