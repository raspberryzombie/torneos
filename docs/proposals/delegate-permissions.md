# Proposal: Delegate Permissions via QR

## Intent

Permitir a administradores de torneos delegar permisos de edición limitados a otros usuarios mediante un código QR seguro, sin necesidad de compartir credenciales.

## Scope

### In Scope
- Generar QR con token de permisos limitados
- Escaneo de QR desde la app
- Sesión de editor con permisos restringidos
- Revocación de acceso por parte del admin
- Auditoría de acciones del editor

### Out of Scope
- Notificaciones push cuando editor hace cambios
- Límite de editores por torneo
- Plantillas de permisos predefinidas

## Capabilities

### New Capabilities
- `delegate-qr`: Generar QR de delegación
- `delegate-scan`: Escanear y activar sesión limitada
- `delegate-manage`: Revocar sesiones activas

## Approach

Backend:
- Nuevo modelo DelegateToken con permisos embebidos
- Endpoints para generar, validar, revocar tokens
- Middleware para verificar permisos en cada request

Frontend:
- Modal para generar QR con opciones
- Escáner de cámara
- Banner indicador de sesión limitada
- Bloqueo de acciones no permitidas

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/app/models/delegate_token.py` | New | Modelo de token de delegación |
| `backend/app/api/delegates.py` | New | Endpoints de gestión |
| `frontend/src/pages/DelegateQR.jsx` | New | Generar QR |
| `frontend/src/pages/DelegateScanner.jsx` | New | Escanear QR |
| `frontend/src/components/DelegateBanner.jsx` | New | Indicador de sesión |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| QR expira mientras se usa | Low | Mostrar tiempo restante |
| Token manipulado | Low | Firmado cryptográficamente |

## Rollback Plan

Eliminar archivos creados. No hay cambios destructivos.

## Success Criteria

- [ ] Admin genera QR con permisos limitados
- [ ] Editor puede crear resultados nuevos
- [ ] Editor NO puede editar/borrar/finalizar
- [ ] Admin puede revocar acceso