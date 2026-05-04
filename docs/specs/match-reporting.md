# Match Reporting Specification

## Purpose

Allow players to report match scores and confirm opponent results.

---

## Requirements

### Requirement: Winner Reports Score

The system MUST allow the winner to report the match score.

The system MUST validate that the reporter is actually in the match.

#### Scenario: Winner reports score

- GIVEN the user is the winner of a scheduled match
- WHEN they report score with sets (e.g., "6-4, 6-3")
- THEN the system stores the score
- AND sets status to "pending_confirmation"

#### Scenario: Non-player tries to report

- GIVEN a user who is not part of the match
- WHEN they attempt to report the score
- THEN the system returns HTTP 403

---

### Requirement: Opponent Confirms

The system MUST allow the opponent to confirm the reported score.

The system MUST auto-confirm if 24 hours pass without objection.

#### Scenario: Opponent confirms

- GIVEN opponent receives confirmation request
- WHEN they confirm the score
- THEN match status becomes "completed"
- AND winner is officially recorded

#### Scenario: Opponent disputes

- GIVEN opponent disagrees with reported score
- WHEN they dispute the result
- THEN match status becomes "disputed"
- AND admin is notified for manual review

#### Scenario: Auto-confirm after 24h

- GIVEN 24 hours have passed since score was reported
- AND opponent has not confirmed or disputed
- THEN the system auto-confirms the result

---

### Requirement: View Pending Confirmations

The system MUST show matches waiting for user confirmation.

#### Scenario: User has pending confirmations

- GIVEN user has matches where they need to confirm
- WHEN they view their schedule
- THEN they see a "Confirmar resultado" prompt

---

## API Endpoints

```
POST /api/matches/{id}/score   - Report match score (winner only)
POST /api/matches/{id}/confirm - Confirm match result
POST /api/matches/{id}/dispute - Dispute match result
```

---

## Request/Response

```json
// POST /api/matches/{id}/score
{
  "score": "6-4, 6-3, 6-2",
  "winner_id": "user-uuid"
}

// POST /api/matches/{id}/confirm
{}
```

---

*Spec version: 1.0*
*Feature branch: feat/match-reporting*