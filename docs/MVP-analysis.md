# MVP - Tennis Tournament App
## Minimum Viable Product Analysis

### 1. USO REAL - El Escenario

```
Jugador en court 5 → Mira el teléfono con la mano que no tiene la raqueta
→ Tiene 30 segundos entre games
→ Está al sol (alta luminosidad)
→ Conexión lenta por crowding
→ Quiere saber: ¿Cuándo juego? ¿Contra quién? ¿En qué court?
```

**No quiere**: Login flow de 5 pasos, dashboards complejos, videos.

---

### 2. screens MÍNIMAS para MVP

| Screen | Prioridad | Por qué |
|--------|----------|--------|
| **Mi Horario** | P0 | La única cosa que importa durante el partido |
| **Mi Partidos** | P0 | Ver opponent y resultado |
| **Lista Torneos** | P0 | Encontrar tournaments para join |
| **Detalles Tournament** | P0 | Info básica + registration |
| **Login/Register** | P0 | Existencia requerida |
| **Mi Perfil** | P1 |基本信息 |

---

### 3. Mobile-First Design Principles

#### 3.1 UI Constraints para Match Context

```
✓ Botones mínimos 44x44px (touch easy)
✓ Texto mínimo 16px (legible al sol)
✓ Alto contraste (-readable outdoors)
✓ Un-task por pantalla (una sola acción)
✓ Loading < 2 segundos
✓ Offline schedule cache
✓ Pull-to-refresh (no auto-refresh)
```

#### 3.2 Navigation

```
Minimizar taps para llegar a lo que importa:
Home → Mi Horario = 1 tap (directo)
Home → Mi Partidos = 1 tap

Bottom navigation con icons + labels:
[🏠] [📅] [🔍] [👤]
```

---

### 4. Feature Subset MVP

#### P0 - Absolutely Required

**Authentication:**
- [ ] Email + password registro
- [ ] Google social login
- [ ] Sesión persistente (no log out cada 5 min)

**Player Profile:**
- [ ] Nombre, photo, nivel (1-10 o NTRP)
- [ ] Preferencias: mano, superficie

**Tournament Discovery:**
- [ ] Lista tournaments filtrable por:
  - Ubicación (radio)
  - Fechas (estefinde)
  - Categoría (singles/doubles)
- [ ] Buscar por nombre

**Tournament Details:**
- [ ] Nombre, fechas, lugar (map link)
- [ ] Formato (elim, round robin)
- [ ] Categorías disponibles
- [ ] Capacidad / ocupa
- [ ] Register button (1 tap)

**My Schedule (CORE - el más usado):**
- [ ] Lista de partidos hoy + próximos 3 días
- [ ] Cada card muestra:
  - Hora (destacado grande)
  - Oponente
  - Court number
  - Score (si terminado)
- [ ] Notificación 30min antes de cada partido

**Match Reporting:**
- [ ] Ganador registra score
- [ ] Confirmación automático al opponent
- [ ] Si dispute, flag para review

#### P1 - Should Have (para que no falle el flow)

- [ ] Ver draws (mi bracket)
- [ ] Lista espera (waitlist position)
- [ ] Resultados live (ver otros partidos)
- [ ] Cancelar registration
- [ ] Tournament chat (solo announcements)

#### P2 - Nice to Have (después)

- [ ] Ratings UTR/ITN link
- [ ] Historial tournaments
- [ ] Invitar friends
- [ ] Rate tournament

---

### 5. Mobile Performance Requirements

| Métrica | Target | Por qué |
|---------|-------|--------|
| First Contentful Paint | < 1.5s | Percepción de velocidad |
| Time to Interactive | < 3s | Cuanto antes pueda interactuar |
| Lighthouse Score | > 90 | SEO + UX |
| Offline support | Schedule cached | Sin wifi del tournament |
| Push notifications | < 5s delay | Timing de partidos crítico |

---

### 6. Responsive Breakpoints

```
Mobile: 320px - 480px ← PRIMARY
Tablet: 481px - 768px ← SECONDARY
Desktop: 769px+ ← fallback para admins
```

**Nota**: Mobile first no significa "mobile only", pero enfocamos 80% del esfuerzo en mobile.

---

### 7. Organizer Minimal Flow (MVP)

Si nous expande a organizer:

| Feature | Priority |
|---------|----------|
| Create tournament | P0 |
| Set basic info (name, date, venue) | P0 |
| Add categories + capacity | P0 |
| Publish | P0 |
| View registrations | P0 |
| Input scores | P0 |
| Generate bracket | P1 |
| Set entry fee | P2 |

---

### 8. MVP Scope - Resumen

```
Solo 6 screens:
├── Login/Register
├── Home (mi horario del día)
├── Browse tournaments
├── Tournament detail
├── Mi perfil
└── Admin (si organizer): crear tournament
```

**Principio**: Si no lo usás durante un partido, no va en MVP.

---

### 9. Tech Stack Recomendado (MVP)

**Frontend:**
- Next.js (React) - SSR para performance inicial
- Tailwind CSS - responsive rápido
- PWA - offline support
- Service workers - cache schedule

**Backend:**
- FastAPI (Python) - rápido de construir
- SQLite (MVP) - simple, embedded
- PostgreSQL (si escala)

**Auth:**
- Clerk o NextAuth (social login rápido)

---

### 10. Success Metrics MVP

| Metric | Target |
|--------|--------|
| Users que registran | 500+ |
| Tournament registrations | 2000+ |
| Match scores reportados | 95% |
| App store rating | 4.0+ |
| Retention 30-day | 40% |

---

### 11. What's NOT in MVP

- Video streaming
- Live scoring de otros partidos (solo el mío)
- Chat entre players
- Rankings/ratings
- Sponsorship
- Múltiples formatos de tournament
- Venue management
- Analytics complejos
- Multi-language
- Payment processing completo
- Club management
- Comments/ratings de tournaments

Estos vienen en versiones posteriores.

---

*Documento sujeito a revisión com user feedback del field testing.*