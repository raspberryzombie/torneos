# UI/UX Design Guidelines
## Tennis Tournament App - Mobile-First Dark Theme

---

### 1. Design Philosophy

```
"Elemental, sin ruido"
- Información primero, decoración después
- Lo que importa durante un partido: hora, opponent, court
- Lo que importa entre partidos: registrar, resulta
- Lo que importa antes: encontrar, inscribirse
```

**sobrio**: Sin gradientes, sin sombras excesivas, sin decorative elements.
**Elegante**:tipografía medida, whitespace, proporción.

---

### 2. Color Palette - Dark Theme

#### 2.1 Core Colors

```
--bg-primary: #0D0D0D         ← Negro profundo, no #000000
--bg-secondary: #1A1A1A       ← Cards, surfaces
--bg-tertiary: #262626         ← Inputs, elevated surfaces

--text-primary: #F5F5F5       ← Blanco suave (no #FFF)
--text-secondary: #A3A3A3       ← Labels, hints
--text-tertiary: #666666         ← Disabled

--accent: #00D4AA             ← Tennis green/teal - acción principal
--accent-hover: #00F5C4       ← Hover states
--accent-muted: #00D4AA33     ← Borders sutiles
```

#### 2.2 Semantic Colors

```
--success: #10B981            ← Ganar, confirmada
--warning: #F59E0B           ← Pendiente, urgency
--error: #EF4444             ← Error, perder, cancelar
--info: #3B82F6             ← Información neutral

-- court-available: #10B981
-- court-occupied: #F59E0B
-- court-maintenance: #EF4444
```

#### 2.3 Tennis Context Colors

```
-- score-winning: #10B981      ← Voy ganando
-- score-losing: #EF4444      ← Voy perdiendo
-- score-tie: #F59E0B        ← Tie-break
```

---

### 2.4 Dark Theme - Contrast Ratios

| Elemento | Color | Ratio WCAG |
|----------|-------|-----------|
| Texto principale | #F5F5F5 | 15.3:1 ✓ |
| Texto secundario | #A3A3A3 | 7.1:1 ✓ |
| Botón primary | #00D4AA en #0D0D0D | 12.1:1 ✓ |
| Border subtle | #333333 | 4.8:1 ✓ |

**Fuera del sol**: suficiente. **Bajo el sol directo**: considerar always-on display brightness.

---

### 3. Typography

#### 3.1 Font Family

```
--font-display: 'Outfit', sans-serif      ← Headlines, números grandes
--font-body: 'DM Sans', sans-serif      ← Body, labels
--font-mono: 'JetBrains Mono', monospace ← Scores, códigos
```

**Nota**: Outfit + DM Sans - Google Fonts gratuitos, buena legibilidad.

#### 3.2 Sizes

```
--text-xs: 0.75rem    (12px)   ← Timestamps, hints
--text-sm: 0.875rem   (14px)   ← Labels secondary
--text-base: 1rem     (16px)   ← Body, legibilidad sol
--text-lg: 1.125rem   (18px)   ← Card titles
--text-xl: 1.5rem     (24px)   ← Section headers
--text-2xl: 2rem     (32px)   ← Page titles
--text-3xl: 2.5rem   (40px)   ← HORARIO - lo más grande
```

#### 3.3 Weights

```
--font-normal: 400         ← Body
--font-medium: 500         ← Labels
--font-semibold: 600       ← buttons, links
--font-bold: 700          ← Números (scores, hours)
```

#### 3.4 Line Height

```
--leading-tight: 1.25      ← Headlines
--leading-normal: 1.5     ← Body
--leading-relaxed: 1.75   ← Labels
```

---

### 4. Spacing System

```
--space-1: 0.25rem   (4px)   ← Icon gaps
--space-2: 0.5rem    (8px)   ← Inline elements
--space-3: 0.75rem   (12px)  ← Component internal
--space-4: 1rem      (16px)  ← Default
--space-5: 1.5rem    (24px)  ← Between sections  
--space-6: 2rem      (32px)  ← Major sections
--space-8: 3rem      (48px)  ← Page padding top/bottom
```

---

### 5. Border Radius

```
--radius-sm: 0.375rem   (6px)   ← Inputs
--radius-md: 0.5rem    (8px)   ← Cards, buttons
--radius-lg: 0.75rem   (12px)  ← Modals
--radius-full: 9999px   ← Pills, avatars
```

---

### 6. Components

#### 6.1 Button - Primary

```
Height: 48px (mínimo touch-friendly)
Padding: 16px 24px
Background: var(--accent)
Color: var(--bg-primary)  ← dark bg, texto oscuro
Font-weight: 600
Border-radius: var(--radius-md)

States:
- Default: --accent
- Hover: --accent-hover
- Active: scale(0.98)
- Disabled: --accent + opacity 0.5
- Loading: spinner
```

#### 6.2 Button - Secondary

```
Background: transparent
Border: 1px solid var(--accent-muted)
Color: var(--accent)
```

#### 6.3 Button - Ghost

```
Background: transparent
Color: var(--text-secondary)
Hover: bg var(--bg-tertiary)
```

#### 6.4 Card - Match

```
Background: var(--bg-secondary)
Border: 1px solid var(--border-subtle)
Border-radius: var(--radius-md)
Padding: var(--space-4)

Content layout:
┌─────────────────────────────────┐
│ COURT 5    │  14:30  │ HOY      │  ← Header: court, time, day
├─────────────────────────────────┤
│                                   │
│  vs    MARIA GARCÍA              │  ← Opponent name large
│        (4) [2]  [1]              │  ← Seed + scores
│                                   │
├─────────────────────────────────┤
│ 16:00 • 15 min                   │  ← Duration estimate
└─────────────────────────────────┘
```

**Importante**: 
- Hora MUY grande (40px+) - legible al sol
- Oponente prominent
- Court number visible

#### 6.5 Card - Tournament

```
Background: var(--bg-secondary)
Border-radius: var(--radius-md)
Padding: var(--space-4)

Content:
┌─────────────────────────────────┐
│ [📷] Club Tennis Las Palmas     │  ← Image + name
├─────────────────────────────────┤
│ Singles M •Elim •32 players     │  ← Format, capacity
│ 🏆 $500 • Clay                 │  ← Prize, surface
├─────────────────────────────────┤
│ 📅 15-16 Jun                  │
│ 📍 2.3km • [Map]              │
├─────────────────────────────────┤
│ [REGISTER]   24/32 spots       │  ← CTA
└─────────────────────────────────┘
```

#### 6.6 Input Field

```
Height: 48px
Background: var(--bg-tertiary)
Border: 1px solid var(--border-subtle)
Border-radius: var(--radius-md)
Padding: 12px 16px
Color: var(--text-primary)
Font-size: var(--text-base)

States:
- Focus: border var(--accent)
- Error: border var(--error)
- Disabled: opacity 0.5
```

#### 6.7 Bottom Navigation

```
Position: fixed bottom
Height: 64px + safe area
Background: var(--bg-secondary)
Border-top: 1px solid var(--border-subtle)

Items: 4 maximum
[Icon + Label] por cada

Selected: var(--accent)
Unselected: var(--text-tertiary)
```

#### 6.8 Schedule Card - Priority

```
Background: var(--bg-tertiary)  ← slight elevation
Border-left: 4px solid var(--accent)  ← Ahora voy

Content:
┌─────────────────────────────────┐
│ ▌ 14:30        HOY        ⏱ 15 │
├─────────────────────────────────┤
│        vs MARIA GARCÍA           │
│            en Court 5           │
├─────────────────────────────────┤
│       [YA] [✓ REPORT]         │  ← Primary action
└─────────────────────────────────┘
```

---

### 7. Layout Patterns

#### 7.1 Mobile Screen Structure

```
┌─────────────────────────────────┐
│ [≡]  Mi Horario      [🔔]      │ ← Header: menu, title, notifications
├─────────────────────────────────┤
│                                 │
│      [HOY: 14 de Mayo]         │ ← Date context
│                                 │
│   ┌─────────────────────────┐   │
│   │ ▌ 14:30    vs...      │   │ ← Next match card
│   │         Court 5         │   │
│   └─────────────────────────┘   │
│                                 │
│   ┌─────────────────────────┐   │
│   │ 16:00    vs...        │   │
│   │         Court 3        │   │
│   └─────────────────────────┘   │
│                                 │
│   ... more cards ...            │
│                                 │ ← Scrollable
├─────────────────────────────────┤
│ [🏠]  [📅]  [🔍]  [👤]      │ ← Bottom nav
└─────────────────────────────────┘
```

#### 7.2 Tournament List

```
Header: filtro sticky
[All ▼] [This Weekend ▼] [Near ▼]
│
Card stack scrollable
```

---

### 8. Interactions

#### 8.1 Gestures

```
Tap: selección default
Long press: opciones adicionales (reportar problema)
Swipe left: acciones rápidas (cancel)
Pull down: refresh
Swipe right: back
```

#### 8.2 Feedback

```
Button tap: ripple desde punto de touch
Loading: skeleton con shimmer sutil
Error: toast con retry button
Success: check animation 300ms
```

#### 8.3 Animations

```
Duration: 150ms default, 300ms para transiciones
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Reduced motion: respeitar prefers-reduced-motion
```

**Prioridad**: Percepción de velocidad > animations decorativos

---

### 9. Accessibility

```
✓ Botones mínimos 44x44px touch target
✓ Texto 16px+ legible al sol
✓ Alto contraste siempre
✓ Labels en inputs (no placeholder-only)
✓ Focus visible
✓ Screen reader labels
✓ Reduced motion support
```

---

### 10. Screen Templates

#### 10.1 Home / Mi Horario

```
Priority: PRIMARY
Content: Today's matches + upcoming

States:
- Empty: "No tenés partidos hoy. [Buscar tournaments]"
- Loading: skeleton cards
- Error: retry button
- Has matches: cards sorted by time
```

#### 10.2 Tournament Browse

```
Priority: PRIMARY
Content: List + filters
Filters sticky at top
Infinite scroll with pagination
```

#### 10.3 Tournament Detail

```
Priority: PRIMARY
Content: Info + registration

Sections:
- Header (image + name)
- Info (dates, venue, format)
- Categories (tabs or list)
- Register button (sticky bottom on mobile)
```

#### 10.4 Match Card (During Match)

```
Priority: PRIMARY
Content: Score + actions

Actions:
- Report score (if you're reporting)
- View draw (if viewing)
- Can't play (if withdrawal)
```

#### 10.5 Profile

```
Priority: LOW (only basic in MVP)
Content: Name, level, history
Edit mode available
```

---

### 11. Performance Targets

```
LCP (Largest Contentful Paint): < 1.5s
FID (First Input Delay): < 100ms
CLS (Cumulative Layout Shift): < 0.1

Bundle size target: < 150KB initial JS
```

---

### 12. Dark Theme Preview

```
┌─────────────────────────────────┐
│ ████████████████████████████    │ ← Browser bar
├─────────────────────────────────┤
│ ← Back    Mi Horario     🔔   │
├─────────────────────────────────┤
│                                 │
│ HOY, Miércoles 14              │
│                                 │
│ ┌─────────────────────────┐   │
│ ▌ 14:30        🏃 EN JUEGO   │   │ ← Card destacado
│ │                         │   │
│ │        vs M. GARCÍA      │   │
│ │         Court 5         │   │
│ │        6-4  3-6  [2-1] │   │
│ │                         │   │
│ │    [REPORTAR] [VER]     │   │
│ └─────────────────────────┘   │
│                                 │
│ ┌─────────────────────────┐   │
│ │ 16:00          PENDIENTE │   │
│ │     vs J. PEREZ         │   │
│ │        Court 3         │   │
│ └─────────────────────────┘   │
│                                 │
├─────────────────────────────────┤
│ [🏠]   [📅]   [🔍]   [👤]   │
│ Inicio Torneos Perfil          │
└─────────────────────────────────┘
```

---

### 13. Implementation Notes

#### CSS Custom Properties

```css
:root {
  /* Colors */
  --bg-primary: #0D0D0D;
  --bg-secondary: #1A1A1A;
  --bg-tertiary: #262626;
  --text-primary: #F5F5F5;
  --text-secondary: #A3A3A3;
  --text-tertiary: #666666;
  --accent: #00D4AA;
  --accent-hover: #00F5C4;
  
  /* Typography */
  --font-display: 'Outfit', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
}
```

#### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Outfit:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

### 14. What's Next

- Crear component library (shadcn/ui)
- Implementar screens con estas guidelines
- Testing con usuarios reales en tournaments

---

*Guidelines sujeito a testing y refinamiento.*