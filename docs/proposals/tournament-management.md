# Proposal: Tournament Management

## Intent

Permitir a los organizadores crear y gestionar torneitos de tenis. El usuario con rol de organizador puede crear tournaments, configurar基本信息, y gestionar inscripciones.

## Scope

### In Scope
- Crear nuevo torneo (nombre, fechas, venue, categoría, formato, capacity, fee)
- Ver mis torneitos creados
- Editar torneo (mientras no haya-started)
- Cancelar torneo

### Out of Scope
- Generación automática de brackets
- Panel de administración complejo
- Estadísticas del torneo

## Capabilities

### New Capabilities
- `tournament-create`: Crear nuevos torneos
- `tournament-manage`: Gestionar mis torneos

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/app/api/tournaments.py` | Modified | Add create/update endpoints |
| `frontend/src/pages/CreateTournament.jsx` | New | Form crear |
| `frontend/src/pages/MyTournaments.jsx` | New | Lista mis torneos |

## Success Criteria

- [ ] POST /api/tournaments (create)
- [ ] GET /api/tournaments/me (my tournaments)
- [ ] PUT /api/tournaments/{id}
- [ ] UI form crear torneo
- [ ] UI lista mis torneos