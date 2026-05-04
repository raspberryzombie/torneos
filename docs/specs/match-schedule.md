# Match Schedule Specification

## Purpose

Allow users to view their scheduled matches with details about time, opponent, court, and status.

---

## Requirements

### Requirement: View Today's Matches

The system MUST return matches scheduled for today.

The system MUST show only matches where the user is either player1 or player2.

#### Scenario: User has matches today

- GIVEN the user is registered for a tournament with matches scheduled for today
- WHEN the user requests their schedule
- THEN the system returns today's matches with: match_id, tournament_name, opponent_name, scheduled_at, court, status

#### Scenario: No matches today

- GIVEN the user has no matches scheduled for today
- WHEN the user checks their schedule
- THEN the system returns an empty list
- AND shows "No tenés partidos hoy"

---

### Requirement: View Upcoming Matches

The system MUST return matches scheduled in the next 7 days.

The system SHOULD sort by scheduled date ascending.

#### Scenario: User has upcoming matches

- GIVEN the user has matches in the next 7 days
- WHEN the user requests their schedule
- THEN the system returns matches grouped by date
- AND includes tournament name, opponent, time, court

#### Scenario: No upcoming matches

- GIVEN the user has no upcoming matches
- WHEN the user checks their schedule
- THEN the system shows empty state with "No tenés partidos programados"

---

### Requirement: Match Card Details

The system MUST provide complete match information for display.

#### Scenario: Match card displays all info

- GIVEN a match exists for the user
- WHEN the match card is rendered
- THEN it shows:
  - Tournament name
  - Opponent name (or "TBD" if opponent not assigned)
  - Scheduled time (format: "14:00")
  - Court number/name
  - Match status (scheduled, in_progress, completed, cancelled)

---

### Requirement: Access My Registrations

The system MUST allow quick access to registered tournaments.

#### Scenario: Quick access to registrations

- GIVEN the user has registered for tournaments
- WHEN the user views the schedule screen
- THEN they can access a list of their registered tournaments
- AND tap to view tournament details

---

## API Endpoints

```
GET /api/matches              - Get user's matches (today + upcoming)
GET /api/matches/{id}        - Get match detail
GET /api/registrations       - Get user's registrations (alias)
```

---

## Database Schema

```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id),
  round VARCHAR(20),
  player1_id UUID REFERENCES users(id),
  player2_id UUID REFERENCES users(id),
  court VARCHAR(50),
  scheduled_at TIMESTAMP NOT NULL,
  score JSON,
  winner_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## UI Layout

```
┌─────────────────────────────────┐
│ ← Atras      Mi Agenda          │
├─────────────────────────────────┤
│                                 │
│  HOY                            │
│  ┌─────────────────────────┐  │
│  │ vs Juan Pérez           │  │
│  │ 14:00 - Court 3         │  │
│  │ Club de Tennis          │  │
│  └─────────────────────────┘  │
│                                 │
│  PRÓXIMOS 7 DÍAS                │
│  ┌─────────────────────────┐  │
│  │ vs María García         │  │
│  │ Sáb 10/05 - 10:00       │  │
│  │ Court 1                 │  │
│  └─────────────────────────┘  │
│                                 │
│  ───────────────────────────   │
│  MIS TORNEOS INSCRITOS         │
│  └─────────────────────────   │
│                                 │
└─────────────────────────────────┘
```

---

*Spec version: 1.0*
*Feature branch: feat/match-schedule*