# Delegate Permissions Specification

## Purpose

Allow tournament admins to temporarily delegate limited editing permissions to helpers via secure QR codes.

---

## Requirements

### Requirement: Generate Delegate QR

The admin MUST generate a QR code containing a secure token with predefined permissions.

#### Scenario: Generate QR with default options

- GIVEN the admin is on "Mis Torneos" page
- WHEN they click "Generar QR de Editor" on their tournament
- AND they leave default options (24h expiry, multiple use)
- THEN the system generates a QR code
- AND the QR contains a signed token with limited permissions

#### Scenario: Generate QR with single-use option

- GIVEN the admin checks "Un solo uso" option
- WHEN they click "Generar QR"
- THEN the token is marked as single-use
- AND can only be redeemed once

---

### Requirement: Scan and Activate Session

The editor MUST scan the QR to activate a limited session.

#### Scenario: Scan valid QR

- GIVEN the editor scans a valid QR code
- WHEN the token is valid and not expired
- THEN the system creates a limited session
- AND the editor sees a banner indicating "Sesión de Editor"
- AND the editor can create new match results

#### Scenario: Scan expired QR

- GIVEN the QR code has expired
- WHEN the editor scans it
- THEN the system shows error "Este código QR ha expirado"

#### Scenario: Scan already-used QR

- GIVEN the QR is marked as single-use and already used
- WHEN the editor scans it
- THEN the system shows "Este código QR ya fue utilizado"

---

### Requirement: Limited Session Behavior

The editor with delegate session MUST have restricted permissions.

#### Scenario: Editor tries to create new result

- GIVEN the editor has an active delegate session
- WHEN they navigate to a match and click "Reportar Score"
- THEN the system allows the action
- AND saves the new result

#### Scenario: Editor tries to edit existing result

- GIVEN the editor has an active delegate session
- AND there is an existing result in the system
- WHEN they try to edit the score
- THEN the system shows "No tienes permiso para editar este resultado"

#### Scenario: Editor tries to delete match

- GIVEN the editor has an active delegate session
- WHEN they try to delete a match
- THEN the system shows "No tienes permiso para eliminar partidos"

#### Scenario: Editor tries to finalize tournament

- GIVEN the editor has an active delegate session
- WHEN they try to finalize the tournament
- THEN the system shows "No tienes permiso para finalizar el torneo"

#### Scenario: Editor tries to delete tournament

- GIVEN the editor has an active delegate session
- WHEN they try to delete the tournament
- THEN the system shows "No tienes permiso para borrar el torneo"

---

### Requirement: Revoke Delegate Session

The admin MUST be able to revoke active delegate sessions.

#### Scenario: Revoke active session

- GIVEN there is an active delegate session on a tournament
- WHEN the admin clicks "Revocar" on the session
- THEN the token is invalidated
- AND the editor's session is terminated
- AND the editor sees "Tu acceso ha sido revocado por el administrador"

---

### Requirement: View Delegate Sessions

The admin MUST see all active delegate sessions on their tournament.

#### Scenario: List active sessions

- GIVEN there are 2 active delegate sessions on a tournament
- WHEN the admin views "Mis Torneos" details
- THEN they see a list with:
  - Editor name or "Usuario[masked]"
  - Creation time
  - Expiration time
  - "Revocar" button for each

---

## API Endpoints

```
POST   /api/tournaments/{id}/delegate/qr      - Generate delegate QR
GET    /api/tournaments/{id}/delegate/sessions - List active sessions
DELETE /api/tournaments/{id}/delegate/sessions/{session_id} - Revoke session
POST   /api/auth/delegate/activate           - Activate session from QR
POST   /api/auth/delegate/deactivate         - Deactivate own session
```

---

## Token Structure

```json
{
  "tournament_id": "uuid",
  "permissions": ["view:tournament", "view:bracket", "view:matches", "create:results"],
  "restrictions": ["no_edit_existing", "no_delete", "no_finalize", "no_manage_registrations"],
  "expires_at": "2026-05-05T14:00:00Z",
  "single_use": false,
  "created_by": "admin-uuid",
  "token_id": "uuid"
}
```

---

## UI Components

### DelegateBanner
- Shows when user has active delegate session
- Displays "🔒 Modo Editor - Permisos limitados"
- Has "Salir" button to deactivate

### RestrictedActionModal
- Shows when user tries restricted action
- Displays "No tienes permiso para..."

---

*Spec version: 1.0*
*Feature branch: feat/delegate-permissions*