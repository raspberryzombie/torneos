# Historias de Usuario - Torneos App
## Formato Gherkin - Happy Paths

---

## Módulo: Autenticación

---

### HU-001: Registro de nuevo usuario

**Como** nuevo jugador de tennis
**Quiero** crear una cuenta en la app
**Para** poder acceder a las funcionalidades de tornejos y gestión de partidos

#### Escenario: Registro exitoso con email y password

```gherkin
Feature: Registro de usuario
  Background:
    Given el usuario está en la página de registro

  Scenario: Registro con datos válidos
    When el usuario ingresa su nombre "Juan Pérez"
    And ingresa su email "juan@test.com"
    And ingresa una contraseña "password123"
    And confirma la contraseña "password123"
    And acepta los términos y condiciones
    And hace click en "CREAR CUENTA"
    Then el sistema crea la cuenta exitosamente
    And el usuario es redirigido a la página principal (Schedule)
    And el usuario ve un mensaje de éxito
    And el usuario está automáticamente logueado
    And el sistema muestra "Hola, Juan Pérez" en el header
```

#### Escenario: Registro con contraseña muy segura

```gherkin
  Scenario: Registro con contraseña segura
    When el usuario ingresa nombre "María García"
    And ingresa email "maria@test.com"
    And ingresa contraseña "Tenis2024!Club"
    And confirma la contraseña "Tenis2024!Club"
    And acepta los términos y condiciones
    And hace click en "CREAR CUENTA"
    Then el sistema crea la cuenta exitosamente
    And el usuario es redirigido a la página principal
```

---

### HU-002: Inicio de sesión

**Como** usuario registrado
**Quiero** iniciar sesión con mi email y contraseña
**Para** acceder a mi cuenta y funcionalidades

#### Escenario: Login exitoso

```gherkin
Feature: Inicio de sesión
  Background:
    Given el usuario está en la página de login
    And el usuario "Juan Pérez" existe en el sistema con email "juan@test.com" y password "password123"

  Scenario: Login con credenciales correctas
    When el usuario ingresa su email "juan@test.com"
    And ingresa su contraseña "password123"
    And hace click en "INICIAR SESIÓN"
    Then el sistema valida las credenciales
    And el usuario es redirigido a la página principal (Schedule)
    And el sistema muestra "Hola, Juan" en el header
    And el token de autenticación se guarda en el navegador
```

#### Escenario: Login con cuenta de Google

```gherkin
  Scenario: Login con Google
    Given el usuario tiene una cuenta de Google registrada en el sistema
    When hace click en "Continuar con Google"
    Then el sistema redirecciona al flujo de autenticación de Google
    And después de autenticarse, el usuario es redirigido a la página principal
    And el usuario ve su nombre en el header
```

---

### HU-003: Cierre de sesión

**Como** usuario logueado
**Quiero** cerrar mi sesión
**Para** salir de la aplicación de forma segura

#### Escenario: Logout exitoso

```gherkin
Feature: Cierre de sesión
  Background:
    Given el usuario está logueado en la aplicación
    And está en su página de perfil

  Scenario: Cerrar sesión desde perfil
    When hace click en "Cerrar Sesión"
    Then el sistema cierra la sesión
    And elimina el token de autenticación
    And el usuario es redirigido a la página de login
    And el usuario no puede acceder a páginas protegidas
```

---

## Módulo: Descubrimiento de Torneos

---

### HU-004: Explorar lista de torneos disponibles

**Como** jugador registrado
**Quiero** ver la lista de torneos disponibles
**Para** encontrar torneos donde participar

#### Escenario: Ver todos los torneos disponibles

```gherkin
Feature: Exploración de torneos
  Background:
    Given el usuario está logueado
    And existen torneos "Torneo de Verano", "Open Nacional", "Torneo de Club" en el sistema

  Scenario: Ver lista de torneos
    When el usuario navega a la sección "Torneos"
    Then el sistema muestra una lista de tarjetas de torneos
    And cada tarjeta muestra: nombre, venue, fecha, categoría, capacidad
    And los torneos se muestran ordenados por fecha de inicio
```

#### Escenario: Torneos vacíos

```gherkin
  Scenario: No hay tournaments disponibles
    Given no existen tournaments en el sistema
    When el usuario navega a la sección "Torneos"
    Then el sistema muestra un mensaje "No hay tournaments programados"
    And muestra "Pronto habrá nuevos torneitos"
```

#### Escenario: Filtrar por categoría

```gherkin
  Scenario: Filtrar tournaments por categoría open
    Given existen tournaments de categorías "masculino", "femenino" y "open"
    When el usuario selecciona la categoría "Open" en el filtro
    Then el sistema muestra solo los tournaments de categoría "open"
    And los tournaments de otras categorías se ocultan
```

#### Escenario: Filtrar por ubicación

```gherkin
  Scenario: Filtrar tournaments por ubicación
    Given existen tournaments en "Buenos Aires", "Córdoba" y "Mendoza"
    When el usuario ingresa "Buenos Aires" en el filtro de ubicación
    Then el sistema muestra solo los tournaments de "Buenos Aires"
```

---

### HU-005: Ver detalle de un torneo

**Como** jugador interesado en un torneo
**Quiero** ver la información completa del torneo
**Para** decidir si participar o no

#### Escenario: Ver información completa del torneo

```gherkin
Feature: Detalle de torneo
  Background:
    Given el usuario está en la lista de tournaments
    And existe el "Torneo de Verano 2026" con los siguientes datos:
      | Campo | Valor |
      | Nombre | Torneo de Verano 2026 |
      | Descripción | Torneo open para todos los niveles |
      | Venue | Club de Tennis Buenos Aires |
      | Dirección | Av. Libertador 1234 |
      | Fecha | 15/06/2026 - 30/06/2026 |
      | Categoría | Open |
      | Formato | Singles |
      | Cupo | 8/16 |
      | Inscripción | $5000 |
      | Organizador | Juan Pérez |

  Scenario: Ver detalle del torneo
    When el usuario hace click en la tarjeta del "Torneo de Verano 2026"
    Then el sistema muestra la página de detalle del torneo
    And muestra toda la información del torneo
    And muestra el botón "Inscribirse"
    And muestra el botón "Ver Cuadro del Torneo"
```

---

### HU-006: Inscribirse a un torneo

**Como** jugador quiero inscribirme en un torneo
**Para** participar y jugar partidos

#### Escenario: Inscripción exitosa

```gherkin
Feature: Inscripción a torneo
  Background:
    Given el usuario está en el detalle de un torneo
    And el torneo tiene capacidad disponible (8/16)
    And el usuario no está registrado en este torneo

  Scenario: Inscribirse exitosamente
    When hace click en el botón "Inscribirse"
    Then el sistema crea la inscripción
    And muestra mensaje de éxito "Te inscribiste correctamente"
    And el botón cambia a "Cancelar Inscripción"
    And la cuenta de inscritos se actualiza (9/16)
```

#### Escenario: Inscripción en torneo lleno

```gherkin
  Scenario: Inscribirse en torneo completo
    Given el tournament está completo (16/16)
    When hace click en "Inscribirse"
    Then el sistema muestra el mensaje "Torneo Completo"
    And el botón está deshabilitado
```

---

### HU-007: Cancelar inscripción

**Como** jugador inscrito en un torneo
**Quiero** cancelar mi inscripción
**Para** no participar en el torneo

#### Escenario: Cancelar inscripción exitosamente

```gherkin
Feature: Cancelar inscripción
  Background:
    Given el usuario está inscrito en un torneo
    And el torneo aún no ha comenzado

  Scenario: Cancelar inscripción antes del inicio
    When hace click en "Cancelar Inscripción"
    Then el sistema elimina la inscripción
    And muestra mensaje de éxito "Inscripción cancelada"
    And el botón cambia a "Inscribirse"
    And la cuenta de inscritos disminuye
```

---

## Módulo: Agenda de Partidos

---

### HU-008: Ver partidos de hoy

**Como** jugador tengo partidos programados hoy
**Quiero** ver mis partidos del día
**Para** saber cuándo y dónde jugar

#### Escenario: Ver partidos de hoy

```gherkin
Feature: Schedule - Partidos de hoy
  Background:
    Given el usuario está logueado
    And tiene un partido hoy a las 14:00 contra "María García"
    And el partido es en "Court 3"
    And el tournament es "Torneo de Verano"

  Scenario: Ver partidos de hoy
    When el usuario está en la página principal (Schedule)
    Then ve la sección "HOY"
    And ve una tarjeta con:
      | Campo | Valor |
      | Oponente | vs María García |
      | Hora | 14:00 |
      | Court | Court 3 |
      | Estado | Programado |
      | Tournament | Torneo de Verano |
```

#### Escenario: Sin partidos hoy

```gherkin
  Scenario: No hay partidos hoy
    Given el usuario no tiene partidos programados para hoy
    When está en la página de Schedule
    Then la sección "HOY" muestra "No tenés partidos hoy"
```

---

### HU-009: Ver próximos partidos

**Como** jugador tengo partidos programados en los próximos días
**Quiero** ver mi agenda de la semana
**Para** planificar mi disponibilidad

#### Escenario: Ver próximos 7 días

```gherkin
Feature: Schedule - Próximos partidos
  Background:
    Given el usuario tiene partidos programados:
      | Día | Oponente | Hora | Court |
      | Mañana | Pedro López | 10:00 | Court 1 |
      | Jueves | Carlos Rodríguez | 15:00 | Court 2 |
      | Sábado | Ana Martínez | 11:00 | Court 3 |

  Scenario: Ver próximos partidos
    When el usuario está en la página de Schedule
    Then ve la sección "PRÓXIMOS 7 DÍAS"
    And muestra las tarjetas de los próximos partidos
    And cada tarjeta muestra: oponente, fecha, hora, court
    And los partidos están ordenados por fecha
```

#### Escenario: Sin partidos próximos

```gherkin
  Scenario: No hay partidos próximos
    Given el usuario no tiene partidos en los próximos 7 días
    When está en la página de Schedule
    Then la sección "PRÓXIMOS 7 DÍAS" muestra "No tenés partidos programados"
    And muestra link "Encontrá tournaments y inscribite"
```

---

### HU-010: Ver mis torneos inscritos

**Como** jugador estoy inscrito en torneos
**Quiero** acceso rápido a mis torneos
**Para** poder verlos fácilmente

#### Escenario: Ver lista de torneos inscritos

```gherkin
Feature: Mis torneos inscritos
  Background:
    Given el usuario está inscrito en los siguientes tournaments:
      | Tournament | Venue | Fecha Inicio |
      | Torneo de Verano | Club Buenos Aires | 15/06/2026 |
      | Open Nacional | Club Córdoba | 20/07/2026 |

  Scenario: Ver mis tournaments desde Schedule
    When el usuario está en la página de Schedule
    Then ve la sección "MIS TORNEOS"
    And muestra lista de tarjetas con los tournaments inscritos
    And cada tarjeta muestra: nombre, venue, fecha de inicio
    And al hacer click en una tarjeta navega al detalle del torneo
```

---

## Módulo: Reporte de Resultados

---

### HU-011: Reportar resultado de partido

**Como** jugador gané un partido
**Quiero** reportar el score
**Para** registrar el resultado en el sistema

#### Escenario: Reportar score como ganador

```gherkin
Feature: Reporte de resultado
  Background:
    Given el usuario ganó un partido contra "María García"
    And el partido está en estado "Programado"
    And el partido ya terminó

  Scenario: Reportar score del partido
    When está en la página de Schedule
    And ve el partido en la sección "HOY" o "PRÓXIMOS 7 DÍAS"
    And hace click en "Reportar Score"
    Then se abre un modal para ingresar el score
    When ingresa el score "6-4, 6-3, 6-2"
    And hace click en "Reportar Resultado"
    Then el sistema guarda el score
    And el partido cambia a estado "Pendiente de confirmación"
    And muestra mensaje "Score reportado, esperando confirmación del oponente"
```

#### Escenario: Reportar score de partido en curso

```gherkin
  Scenario: Reportar score de partido en curso
    Given el partido está en estado "En curso"
    When hace click en "Reportar Score"
    Then puede reportar el resultado inmediatamente
```

---

### HU-012: Confirmar resultado reportado

**Como** jugador opponent de un partido
**Quiero** confirmar el resultado reportado
**Para** validar el score del ganador

#### Escenario: Confirmar resultado

```gherkin
Feature: Confirmación de resultado
  Background:
    Given el oponente reportó el score "6-4, 6-3"
    And el partido está en estado "Pendiente de confirmación"

  Scenario: Confirmar resultado del partido
    When el usuario ve el partido en su Schedule
    And el partido muestra estado "Confirmar"
    And hace click en "Confirmar Resultado"
    Then se abre un modal que muestra el score reportado
    And muestra "vs [Oponente]"
    And muestra "Score reportado: 6-4, 6-3"
    When hace click en "Confirmar"
    Then el sistema confirma el resultado
    And el partido cambia a estado "Completado"
    And muestra mensaje "Resultado confirmado"
```

---

### HU-013: Disputar resultado

**Como** jugador opponent no estoy de acuerdo con el score
**Para** que un administrador revise el resultado

#### Escenario: Disputar resultado

```gherkin
  Scenario: Disputear resultado incorrecto
    Given el oponente reportó un score que no es correcto
    When está en el modal de confirmación
    And hace click en "Disputear"
    Then el sistema marca el partido como "Disputeado"
    And muestra mensaje "Resultado disputeado. Un administrador revisará el caso."
```

---

## Módulo: Perfil de Usuario

---

### HU-014: Editar perfil

**Como** usuario quiero actualizar mi información
**Para** mantener mis datos actualizados

#### Escenario: Editar nombre y nivel

```gherkin
Feature: Edición de perfil
  Background:
    Given el usuario está en su página de perfil
    And su perfil actual muestra:
      | Campo | Valor |
      | Nombre | Juan Pérez |
      | Nivel | 5 |
      | Mano | Derecha |

  Scenario: Actualizar nombre y nivel
    When modifica el nombre a "Juan Actualizado"
    And selecciona el nivel 7
    And hace click en "GUARDAR CAMBIOS"
    Then el sistema guarda los cambios
    And muestra mensaje "Cambios guardados"
    And el perfil muestra los nuevos valores
```

#### Escenario: Cambiar mano preferida

```gherkin
  Scenario: Cambiar mano preferida
    When hace click en "Zurda"
    And hace click en "GUARDAR CAMBIOS"
    Then el sistema guarda el cambio
    And muestra mensaje de éxito
    And la mano preferida se actualiza a "Zurda"
```

---

## Módulo: Gestión de Torneos (Organizador)

---

### HU-015: Crear un nuevo torneo

**Como** organizador quiero crear un nuevo torneo
**Para** que jugadores puedan inscribirse

#### Escenario: Crear torneo con todos los campos

```gherkin
Feature: Crear torneo
  Background:
    Given el usuario está en la página "Mis Torneos"
    And hace click en el botón "+" para crear nuevo

  Scenario: Crear torneo exitosamente
    When ingresa los datos del torneo:
      | Campo | Valor |
      | Nombre | Torneo de Invierno 2026 |
      | Descripción | Competencia para todos los niveles |
      | Club/Sede | Club de Tennis Norte |
      | Dirección | Av. Principal 500 |
      | Fecha Inicio | 01/07/2026 |
      | Fecha Fin | 15/07/2026 |
      | Categoría | Open |
      | Formato | Singles |
      | Cupo | 16 |
      | Inscripción | 3000 |
    And hace click en "Crear Torneo"
    Then el sistema crea el torneo
    And el usuario es redirigido a "Mis Torneos"
    And ve el nuevo torneo en la lista
    And el estado del torneo es "Abierto"
```

#### Escenario: Crear torneo con campos mínimos

```gherkin
  Scenario: Crear torneo solo con campos obligatorios
    When ingresa solo los campos obligatorios:
      | Campo | Valor |
      | Nombre | Torneo Express |
      | Club/Sede | Club Local |
      | Fecha Inicio | 10/06/2026 |
      | Fecha Fin | 12/06/2026 |
      | Cupo | 8 |
    And hace click en "Crear Tournament"
    Then el sistema crea el torneo
    And los campos opcionales quedan vacíos/nulos
```

---

### HU-016: Ver mis torneos creados

**Como** organizador quiero ver los torneos que creé
**Para** administrarlos

#### Escenario: Lista de mis tournaments

```gherkin
Feature: Mis tournaments creados
  Background:
    Given el usuario creó los siguientes tournaments:
      | Tournament | Estado | Inscritos |
      | Torneo de Verano | Abierto | 8/16 |
      | Torneo de Invierno | Completo | 16/16 |
      | Torneo Express | Cancelado | 0/8 |

  Scenario: Ver mis tournaments
    When navega a "Mis Torneos"
    Then ve la lista de sus tournaments creados
    And cada tarjeta muestra: nombre, venue, fecha, categoría, inscritos/cupo
    And muestra el badge de estado de cada torneo
```

---

### HU-017: Ver cuadro/bracket del torneo

**Como** jugador u organizador quiero ver el cuadro del torneo
**Para** ver la estructura de partidos por ronda

#### Escenario: Ver bracket del torneo

```gherkin
Feature: Ver cuadro del torneo
  Background:
    Given el tournament tiene partidos generados en las siguientes rondas:
      | Ronda | Partido 1 | Partido 2 |
      | Octavos | Juan vs Pedro | María vs Luis |
      | Cuartos | Juan vs María | - vs - |
      | Semifinal | - vs - | - vs - |
      | Final | - vs - | - vs - |

  Scenario: Ver bracket visual
    Given el usuario está en el detalle de un torneo
    When hace click en "Ver Cuadro del Tournament"
    Then el sistema muestra la página de bracket
    And muestra las columnas por ronda (Octavos, Cuartos, Semifinal, Final)
    And cada ronda muestra las tarjetas de partidos
    And las tarjetas muestran: jugador 1 vs jugador 2
    And si hay winner, se muestra resaltado en verde
    And si el partido está en curso, se muestra con indicador
```

#### Escenario: Ver bracket vacío

```gherkin
  Scenario: Tournament sin partidos generados
    Given el torneo no tiene partidos generados
    When el usuario navega al cuadro del torneo
    Then muestra "Los partidos no han sido generados"
    And muestra "Pronto podrás ver el cuadro del torneo"
```

---

## Módulo: Navegación

---

### HU-018: Navegación entre secciones

**Como** usuario quiero navegar fácilmente
**Para** acceder a las diferentes funciones de la app

#### Escenario: Navegación con bottom nav

```gherkin
Feature: Navegación principal
  Background:
    Given el usuario está en cualquier página de la app

  Scenario: Navegar a Schedule
    When hace click en el icono "📅" de la barra de navegación
    Then es redirigido a la página principal (Schedule)

  Scenario: Navegar a Torneos
    When hace click en el icono "🏆" de la barra de navegación
    Then es redirigido a la página de lista de tournaments

  Scenario: Navegar a Perfil
    When hace click en el icono "👤" de la barra de navegación
    Then es redirigido a la página de perfil del usuario
```

---

## Módulo: Validaciones y Errores

---

### HU-019: Validación de registro

**Como** sistema quiero validar los datos del registro
**Para** garantizar datos correctos

#### Escenario: Email ya registrado

```gherkin
  Scenario: Registro con email existente
    Given el email "juan@test.com" ya está registrado
    When el usuario intenta registrarse con ese email
    Then el sistema muestra error "Este email ya está registrado"
    And sugiere "Iniciar sesión" o usar otro email
```

#### Escenario: Contraseña muy corta

```gherkin
  Scenario: Registro con contraseña corta
    When el usuario ingresa contraseña "123"
    And confirma "123"
    And acepta términos
    And hace click en "CREAR CUENTA"
    Then el sistema muestra error "La contraseña debe tener al menos 8 caracteres"
```

#### Escenario: Contraseñas no coinciden

```gherkin
  Scenario: Contraseñas diferentes
    When ingresa contraseña "password123"
    And confirma "password124"
    And hace click en "CREAR CUENTA"
    Then el sistema muestra error "Las contraseñas no coinciden"
```

#### Escenario: Términos no aceptados

```gherkin
  Scenario: Sin aceptar términos
    When completa todos los campos
    But no acepta los términos y condiciones
    And hace click en "CREAR CUENTA"
    Then el sistema muestra error "Debes aceptar los términos y condiciones"
```

---

### HU-020: Manejo de sesión expirada

**Como** usuario quiero que me redirija al login si mi sesión expira
**Para** poder iniciar sesión nuevamente

#### Escenario: Sesión expirada

```gherkin
Feature: Sesión expirada
  Background:
    Given el usuario tiene una sesión activa
    And el token de autenticación expira

  Scenario: Intentar acceder a página protegida
    When intenta acceder a cualquier página protegida
    Then el sistema detecta que el token es inválido
    And elimina el token del navegador
    And redirige a la página de login
    And muestra mensaje "Tu sesión expiró. Iniciá sesión nuevamente."
```

---

## Resumen de Cobertura

| Módulo | Historias | Escenarios |
|--------|-----------|-------------|
| Autenticación | HU-001, HU-002, HU-003 | 7 |
| Descubrimiento de Torneos | HU-004, HU-005, HU-006, HU-007 | 8 |
| Agenda de Partidos | HU-008, HU-009, HU-010 | 6 |
| Reporte de Resultados | HU-011, HU-012, HU-013 | 3 |
| Perfil | HU-014 | 2 |
| Gestión de Torneos | HU-015, HU-016, HU-017 | 3 |
| Navegación | HU-018 | 1 |
| Validaciones | HU-019, HU-020 | 6 |
| **TOTAL** | **18 HUs** | **36+ escenarios** |

---

*Documento generado: 2026-05-04*
*Proyecto: Torneos - Tennis Tournament Manager*