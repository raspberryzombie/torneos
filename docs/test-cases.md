# Test Cases - Playwright

## Auth Flow

### TC01 - Login Exitoso
- Given: Usuario válido en DB
- When: Ingresa email y password correctos
- Then: Redirige a Home (Schedule)
- Then: Muestra nombre del usuario

### TC02 - Login Fallido (credenciales inválidas)
- Given: Usuario en página de login
- When: Ingresa email o password incorrectos
- Then: Muestra mensaje de error "Email o contraseña incorrectos"

### TC03 - Registro Exitoso
- Given: Usuario en página de registro
- When: Completa todos los campos válidos
- Then: Redirige a Home
- Then: Usuario queda logueado

### TC04 - Logout
- Given: Usuario logueado
- When: Click en "Cerrar Sesión"
- Then: Redirige a página de login

## Tournament Discovery

### TC05 - Ver Lista de Torneos
- Given: Usuario logueado
- When: Navega a /tournaments
- Then: Muestra lista de torneos
- Then: Cada card tiene nombre, venue, fecha

### TC06 - Filtrar Torneos por Categoría
- Given: Usuario en página de torneos
- When: Selecciona categoría "open"
- Then: Muestra solo tournaments de esa categoría

### TC07 - Ver Detalle de Torneo
- Given: Usuario en lista de torneos
- When: Click en un tournament card
- Then: Muestra detalle completo
- Then: Botón "Inscribirse" visible

### TC08 - Inscribirse a Torneo
- Given: Usuario en detail de torneo no inscrito
- When: Click "Inscribirse"
- Then: Se registra correctamente
- Then: Botón cambia a "Cancelar Inscripción"

## Match Schedule

### TC09 - Ver Partidos de Hoy
- Given: Usuario con partidos programados hoy
- When: Entra a Home
- Then: Sección "HOY" muestra partidos

### TC10 - Ver Partidos Próximos
- Given: Usuario con partidos en próximos 7 días
- When: Entra a Home
- Then: Sección "PRÓXIMOS 7 DÍAS" muestra partidos

### TC11 - Ver Mis Torneos Inscritos
- Given: Usuario logueado con torneos inscritos
- When: Entra a Home
- Then: Sección "MIS TORNEOS" muestra lista

## Match Reporting

### TC12 - Reportar Score
- Given: Partido finalizado sin score reportado
- When: Click "Reportar Score"
- Then: Modal abre
- When: Ingresa score y confirma
- Then: Score se guarda

### TC13 - Confirmar Resultado
- Given: Partido con score pendiente de confirmación
- When: Click "Confirmar Resultado"
- Then: Modal de confirmación abre
- When: Confirma
- Then: Estado cambia a completado

## Profile

### TC14 - Editar Perfil
- Given: Usuario en página de perfil
- When: Modifica nombre y nivel
- When: Click "Guardar Cambios"
- Then: Shows "Cambios guardados"

---

## Prioridad de Ejecución

| Priority | Test Cases |
|----------|------------|
| P0 - Auth | TC01, TC02, TC04 |
| P1 - Tournament | TC05, TC07, TC08 |
| P2 - Schedule | TC09, TC10 |
| P3 - Reporting | TC12, TC13 |
| P4 - Profile | TC14 |

---

*Last updated: 2026-05-04*