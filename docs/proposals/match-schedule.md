# Proposal: Match Schedule

## Intent

Permitir a los usuarios ver sus partidos programados (hoy y próximos), con información de horario, oponente, y court. También recibir recordatorios antes de los partidos.

## Scope

### In Scope
- Ver partidos de hoy
- Ver partidos próximos (próximos 7 días)
- Tarjetas de partido con: hora, oponente, court, estado
- Mis registros de torneos (acceso rápido)

### Out of Scope
- Notificaciones push (P0 pero depende de infraestructura)
- Creación de partidos (para árbitros/organizadores)

## Capabilities

### New Capabilities
- `match-schedule`: Ver agenda de partidos

## Approach

API: Endpoint para obtener partidos del usuario. Frontend: Pantalla de agenda unificada (hoy + próximos) con filtros por fecha.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/app/models/match.py` | New | Modelo Match |
| `backend/app/api/matches.py` | New | Endpoints API |
| `frontend/src/pages/Schedule.jsx` | Modified | Expandir agenda |

## Rollback Plan

Revertir commits de archivos nuevos.

## Success Criteria

- [ ] GET /api/matches retorna partidos del usuario
- [ ] UI muestra hoy + próximos
- [ ] Tarjetas muestran oponente, hora, court