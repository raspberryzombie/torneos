# Proposal: Match Draws

## Intent

Permitir a los usuarios visualizar el bracket/llamada del torneo. Ver la estructura de partidos por ronda (octavos, cuartos, semis, final).

## Scope

### In Scope
- Ver bracket del torneo por ronda
- Ver partido individual en el bracket
- Indicador de estado (pendiente, en curso, completado)

### Out of Scope
- Generación automática de brackets
- Edición manual del bracket
- Resultados en tiempo real con actualizaciones push

## Approach

Frontend: Componente visual de árbol de bracket. API: Endpoint para obtener partidos del torneo agrupados por ronda.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/app/api/tournaments.py` | Modified | Add get tournament with matches |
| `frontend/src/pages/TournamentDraw.jsx` | New | Bracket visualization |

## Success Criteria

- [ ] GET /api/tournaments/{id}/matches retorna partidos por ronda
- [ ] UI muestra bracket visual con rondas