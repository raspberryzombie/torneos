# Tournament Discovery Specification

## Purpose

Allow users to discover, view details, and register for tennis tournaments.

---

## Requirements

### Requirement: List Tournaments

The system MUST return a list of upcoming tournaments sorted by start date.

The system SHOULD filter tournaments based on provided query parameters (location, date range, category).

#### Scenario: View upcoming tournaments

- GIVEN there are tournaments scheduled in the next 30 days
- WHEN the user requests GET /api/tournaments
- THEN the system returns a list of tournaments with: id, name, venue, start_date, category, format, capacity, registered_count
- AND each tournament includes registration status for the current user

#### Scenario: Filter tournaments by category

- GIVEN there are tournaments with category "masculino", "femenino", and "open"
- WHEN the user filters by category="open"
- THEN the system returns only tournaments where category="open"

#### Scenario: Filter tournaments by location

- GIVEN there are tournaments in "Buenos Aires", "Córdoba", and "Mendoza"
- WHEN the user filters by location="Buenos Aires"
- THEN the system returns only tournaments in Buenos Aires

---

### Requirement: View Tournament Details

The system MUST return complete tournament information including description, rules, and registered players.

The system MUST indicate whether the current user is registered.

#### Scenario: View full tournament details

- GIVEN the user requests GET /api/tournaments/{id}
- THEN the system returns: id, name, description, organizer_name, venue, address, start_date, end_date, category, format, capacity, entry_fee, status, registered_players list
- AND the response includes is_registered: true/false for current user

#### Scenario: Tournament not found

- GIVEN a tournament with id="invalid-id" does not exist
- WHEN the user requests GET /api/tournaments/invalid-id
- THEN the system returns HTTP 404 with error message "Torneo no encontrado"

---

### Requirement: Register for Tournament

The system MUST allow a registered user to register for a tournament with available capacity.

The system MUST prevent double registration.

#### Scenario: Successful registration

- GIVEN the user is logged in
- AND the tournament has available capacity (registered < capacity)
- AND the user is not already registered
- WHEN the user requests POST /api/tournaments/{id}/register
- THEN the system creates a registration record
- AND returns HTTP 201 with registration details
- AND increments registered_count

#### Scenario: Tournament full

- GIVEN the tournament has reached capacity (registered = capacity)
- WHEN the user attempts to register
- THEN the system returns HTTP 400 with error "Torneo completo"

#### Scenario: Already registered

- GIVEN the user is already registered for the tournament
- WHEN the user attempts to register again
- THEN the system returns HTTP 400 with error "Ya estás registrado en este torneo"

#### Scenario: Tournament cancelled

- GIVEN the tournament status is "cancelled"
- WHEN the user attempts to register
- THEN the system returns HTTP 400 with error "Torneo cancelado"

---

### Requirement: Cancel Registration

The system MUST allow a registered user to cancel their registration before the tournament starts.

#### Scenario: Cancel registration

- GIVEN the user is registered for the tournament
- AND the tournament has not started
- WHEN the user requests DELETE /api/tournaments/{id}/register
- THEN the system removes the registration
- AND returns HTTP 200 with success message

#### Scenario: Tournament already started

- GIVEN the tournament has already started
- WHEN the user attempts to cancel
- THEN the system returns HTTP 400 with error "No puedes cancelar un torneo que ya empezó"

---

### Requirement: User Registrations

The system MUST allow a user to view their registered tournaments.

#### Scenario: View my registrations

- GIVEN the user is logged in
- WHEN the user requests GET /api/registrations
- THEN the system returns list of tournaments the user is registered for
- AND each includes registration status and tournament details

---

## API Endpoints

```
GET    /api/tournaments              - List tournaments (with filters)
GET    /api/tournaments/{id}         - Tournament details
POST   /api/tournaments/{id}/register - Register for tournament
DELETE /api/tournaments/{id}/register - Cancel registration
GET    /api/registrations            - My registrations
```

---

## Database Schema

```sql
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  organizer_id UUID REFERENCES users(id),
  venue VARCHAR(255) NOT NULL,
  address VARCHAR(500),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  category VARCHAR(20) CHECK (category IN ('masculino', 'femenino', 'open')),
  format VARCHAR(20) CHECK (format IN ('singles', 'dobles', 'mixto')),
  capacity INTEGER NOT NULL,
  entry_fee DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'full', 'cancelled', 'completed')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id),
  user_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  registered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);
```

---

*Spec version: 1.0*
*Feature branch: feat/tournament-discovery*