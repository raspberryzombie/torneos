# Proposal: Tournament Discovery

## Intent

Permitir a los usuarios encontrar y registrarse en torneitos de tenis. El usuario necesita poder browsear torneitos disponibles, filtrar por ubicación/fecha/categoría, ver detalles de un torneo, e inscribirse con un tap.

## Scope

### In Scope
- Listado de torneitos disponibles (próximos)
- Filtros: ubicación, fecha, categoría (masculino/femenino/open)
- Vista de detalle de torneo
- Registro en torneo (inscripción)
- Cancelar inscripción

### Out of Scope
- Creación de torneitos (P1 - para organizadores)
- Match draws/resultados (P1)
- Panel de administración de inscripciones
- Notificaciones push

## Capabilities

### New Capabilities
- `tournament-list`: Ver listado de torneitos disponibles con filtros
- `tournament-detail`: Ver detalle de un torneo específico
- `tournament-registration`: Inscribirse/cancelar en un torneo

## Approach

API REST con endpoints para listar, filtrar, obtener detalle, y gestionar inscripciones. Frontend: pantalla de exploración con filtros y pantalla de detalle.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/app/models/tournament.py` | New | Modelo Tournament |
| `backend/app/models/registration.py` | New | Modelo Registration |
| `backend/app/api/tournaments.py` | New | Endpoints API |
| `frontend/src/pages/Tournaments.jsx` | New | Pantalla listar |
| `frontend/src/pages/TournamentDetail.jsx` | New | Pantalla detalle |
| `frontend/src/services/api.js` | Modified | Agregar endpoints |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| DB migrations | Low | SQLite permite additive changes |

## Rollback Plan

Revertir commits de archivos nuevos. No hay cambios destructivos.

## Success Criteria

- [ ] GET /api/tournaments retorna lista con filtros
- [ ] GET /api/tournaments/:id retorna detalle
- [ ] POST /api/tournaments/:id/register registra usuario
- [ ] UI muestra список torneitos con filtros
- [ ] UI permite registro con un tap