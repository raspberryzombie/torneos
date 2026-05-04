# Match Draws Specification

## Purpose

Allow users to visualize tournament brackets showing match progression through rounds.

---

## Requirements

### Requirement: View Tournament Bracket

The system MUST return all matches grouped by round.

#### Scenario: View bracket

- GIVEN a tournament has matches created
- WHEN user views the draw
- THEN they see: Round of 16 → Quarters → Semis → Final

#### Scenario: Tournament has no matches

- GIVEN a tournament with no matches generated
- WHEN user views the draw
- THEN they see empty state "Los partidos no han sido generados"

---

### Requirement: Match Card in Bracket

Each match in the bracket MUST show player names and status.

#### Scenario: Match with players

- GIVEN both players are assigned
- WHEN match is displayed
- THEN shows: "Player1 vs Player2" with winner highlighted

#### Scenario: Match TBD

- GIVEN one or both players not assigned
- THEN shows: "TBD vs TBD" or partial names

#### Scenario: Match status

- GIVEN match status is scheduled/in_progress/completed
- THEN shows colored indicator

---

## API Response Format

```json
{
  "tournament_id": "uuid",
  "rounds": [
    {
      "name": "Octavos",
      "matches": [
        {
          "id": "uuid",
          "player1": "Juan",
          "player2": "Pedro",
          "winner": "Juan",
          "status": "completed"
        }
      ]
    }
  ]
}
```

---

*Spec version: 1.0*
*Feature branch: feat/match-draws*