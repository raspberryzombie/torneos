# Requerimiento: Sistema de Delegación de Permisos via QR

## Problemática

El administrador de un torneo necesita ayuda para cargar resultados de partidos pero no quiere dar acceso completo al sistema. Necesita una forma segura de delegar permisos específicos temporalmente.

## Solución Propuesta

Generar un código QR único que contiene un token de permisos limitados. El editor escanea el QR y obtiene acceso temporal con restricciones específicas.

---

## Flujo Detallado

### Actor: Administrador (Owner del Torneo)

1. El admin está en la página "Mis Torneos"
2. Ve un botón "Generar QR de Editor" en su torneo
3.Hace click y el sistema genera un QR único que contiene:
   - Token cifrado con permisos de edición limitada
   - ID del torneo
   - Fecha de expiración (configurable, default 24h)
   - Lista de permisos explícitos

4. El admin muestra el QR al editor

### Actor: Editor (Usuario Auxiliar)

1. El editor desde su app ve una opción "Escanear QR de Editor" 
2. Abre la cámara y escanea el QR del admin
3. El sistema valida el token y crea una sesión con permisos limitados
4. El editor puede:
   - ✅ Reportar NUEVOS resultados de partidos
   - ✅ Ver detalles del torneo y bracket
   - ✅ Ver lista de partidos
   - ❌ NO puede editar resultados ya cargados
   - ❌ NO puede finalizar el torneo
   - ❌ NO puede borrar el torneo
   - ❌ NO puede editar información del torneo
   - ❌ NO puede gestionar inscripciones

---

## Permisos del Token Delegado

| Permiso | Descripción | ¿Activado? |
|---------|-------------|-------------|
| `view:tournament` | Ver detalle del torneo | ✅ Sí |
| `view:bracket` | Ver cuadro/bracket | ✅ Sí |
| `view:matches` | Ver lista de partidos | ✅ Sí |
| `create:results` | Crear nuevos resultados | ✅ Sí |
| `update:matches` | Editar partidos existentes | ❌ NO |
| `delete:matches` | Eliminar partidos | ❌ NO |
| `update:tournament` | Editar info del torneo | ❌ NO |
| `delete:tournament` | Borrar el torneo | ❌ NO |
| `finalize:tournament` | Finalizar el torneo | ❌ NO |
| `manage:registrations` | Gestionar inscripciones | ❌ NO |

---

## Restricciones de Seguridad

### 1. Expiración
- El token QR expira después de un tiempo configurable
- Default: 24 horas
- Máximo: 72 horas

### 2. Un solo uso (opcional)
- El QR puede ser de un solo uso (más seguro)
- Una vez escaneado, se invalida

### 3. Revocación
- El admin puede revocar el acceso en cualquier momento
- Al revocar, el token se invalida inmediatamente

### 4. Auditoría
- Todas las acciones del editor quedan registradas
- El admin puede ver quién hizo qué y cuándo

---

## Validaciones del Sistema

### Escenario: QR expirado
- When: El editor intenta usar un QR después de su expiración
- Then: Sistema muestra "Este código QR ha expirado"
- And: No se crea la sesión

### Escenario: QR ya usado (single-use)
- When: El editor intenta usar un QR de un solo uso ya utilizado
- Then: Sistema muestra "Este código QR ya fue utilizado"
- And: No se crea la sesión

### Escenario: Permiso denegado
- When: El editor con sesión limitada intenta acceder a función no permitida
- Then: Sistema muestra "No tienes permiso para realizar esta acción"
- And: Lo redirige a una página con permisos válidos

---

## API Endpoints Nuevos

### Backend

```
POST /api/tournaments/{id}/delegate/qr
- Genera un QR con token de permisos limitados
- Params: expires_in_hours, single_use

DELETE /api/tournaments/{id}/delegate/revoke
- Revoca un token de delegación activo

GET /api/tournaments/{id}/delegate/sessions
- Lista sesiones de delegación activas

POST /api/auth/delegated/login
- Valida token QR y crea sesión de editor
```

### Frontend

- `DelegateQR.jsx` - Modal/Página para generar QR
- `DelegateScanner.jsx` - Escáner de cámara
- `DelegateSessionBanner.jsx` - Indicador de sesión limitada

---

## UI/UX

### Generar QR (Admin)
```
┌─────────────────────────────────┐
│ ← Atras     Mis Torneos        │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐  │
│  │ Tournament: Verano 2026 │  │
│  │ [Generar QR de Editor] │  │
│  └─────────────────────────┘  │
│                                 │
│  Opciones:                     │
│  ☑ Expira en 24 horas          │
│  ☐ Un solo uso                │
│                                 │
│  [GENERAR QR]                  │
│                                 │
└─────────────────────────────────┘
```

### Escuchar QR (Editor)
```
┌─────────────────────────────────┐
│  📷 Escanear QR de Editor       │
├─────────────────────────────────┤
│                                 │
│     [Cámara activa]            │
│     Apuntá al código QR        │
│                                 │
│  Cuando escanees verás        │
│  tus permisos granted          │
│                                 │
└─────────────────────────────────┘
```

### Banner de Sesión Limitada
```
┌─────────────────────────────────┐
│ 🔒 Sesión de Editor             │
│  Modo: Solo lectura y reportes │
│  [Salir]                        │
└─────────────────────────────────┘
```

---

## Success Criteria

- [ ] Admin puede generar QR con permisos configurables
- [ ] QR es escaneable desde la app
- [ ] Editor obtiene sesión con permisos limitados
- [ ] Editor puede crear nuevos resultados
- [ ] Editor NO puede editar resultados existentes
- [ ] Editor NO puede finalizar/borrar/edita tournament
- [ ] Admin puede revocar acceso
- [ ] QR expira después del tiempo configurado
- [ ] Sistema registra todas las acciones del editor

---

*Versión: 1.0*
*Fecha: 2026-05-04*