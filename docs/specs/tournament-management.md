# Tournament Management Specification

## Purpose

Allow organizers to create and manage tennis tournaments.

---

## Requirements

### Requirement: Create Tournament

The system MUST allow authenticated users to create a tournament.

The system MUST require: name, venue, start_date, end_date, capacity.

#### Scenario: Organizer creates tournament

- GIVEN the user is authenticated
- WHEN they submit tournament details (name, venue, dates, capacity)
- THEN the system creates the tournament
- AND returns the tournament details
- AND sets status to "open"

---

### Requirement: View My Tournaments

The system MUST allow users to view tournaments they created.

#### Scenario: View created tournaments

- GIVEN the user has created tournaments
- WHEN they request their tournaments
- THEN the system returns list of tournaments with status, registration count

---

### Requirement: Edit Tournament

The system MUST allow editing tournament details before it starts.

The system MUST prevent editing after tournament starts.

#### Scenario: Edit tournament before start

- GIVEN tournament start_date is in the future
- WHEN organizer updates details
- THEN changes are saved

#### Scenario: Edit after start

- GIVEN tournament has already started
- WHEN organizer attempts to edit
- THEN system returns error "No podés editar un torneo que ya empezó"

---

### Requirement: Cancel Tournament

The system MUST allow cancellation before registration deadline.

#### Scenario: Cancel tournament

- GIVEN organizer cancels their tournament
- WHEN they confirm cancellation
- THEN tournament status becomes "cancelled"
- AND all registrations are marked as cancelled

---

## API Endpoints

```
POST /api/tournaments           - Create tournament (auth required)
GET  /api/tournaments/me        - Get my created tournaments
PUT  /api/tournaments/{id}      - Update tournament
DELETE /api/tournaments/{id}   - Cancel tournament
```

---

## Request Format

```json
// POST /api/tournaments
{
  "name": "Torneo de Verano",
  "description": "Torneo open para todos los niveles",
  "venue": "Club de Tennis Buenos Aires",
  "address": "Av. Libertador 1234",
  "start_date": "2026-06-01",
  "end_date": "2026-06-15",
  "category": "open",
  "format": "singles",
  "capacity": 32,
  "entry_fee": 5000
}
```

---

*Spec version: 1.0*
*Feature branch: feat/tournament-management*