# 📊 Public Budget Tracker v2

Dashboard interactivo para visualizar presupuesto público latinoamericano.
Construido con Angular 18, i18n propio (ES/EN), Chart.js y SCSS modular.

---

## 🚀 Instalación

```bash
# 1. Crear workspace con el CLI (solo la primera vez)
ng new public-budget-tracker --standalone --routing --style=scss
cd public-budget-tracker

# 2. Instalar Chart.js
npm install chart.js

# 3. Copiar los archivos de este zip sobre la estructura generada

# 4. Levantar
ng serve
# → http://localhost:4200
```

---

## 📁 Estructura

```
src/
├── styles/
│   ├── _variables.scss     ← tokens: colores, tipografía, espaciado, breakpoints
│   ├── _mixins.scss        ← helpers: respond-to, flex-center, card, btn, etc.
│   ├── _reset.scss         ← normalize del DOM
│   ├── _components.scss    ← patrones de UI: navbar, kpi-card, filter-bar, table...
│   └── _utilities.scss     ← clases utilitarias: grid, spacing, text, pills
├── styles.scss             ← punto de entrada (importa todo en orden)
│
└── app/
    ├── core/
    │   ├── interfaces/
    │   │   └── budget.interface.ts
    │   └── services/
    │       ├── budget.service.ts
    │       ├── filter.service.ts
    │       └── translate.service.ts
    │
    ├── features/
    │   ├── dashboard/
    │   │   ├── components/
    │   │   │   ├── kpi-grid/         ← kpi-grid.component.{ts,html,scss}
    │   │   │   ├── sector-table/     ← sector-table.component.{ts,html,scss}
    │   │   │   └── charts/           ← charts.component.{ts,html,scss}
    │   │   └── dashboard.component.{ts,html,scss}
    │   ├── budget-list/
    │   │   └── budget-list.component.{ts,html,scss}
    │   └── chart-view/
    │       └── chart-view.component.{ts,html,scss}
    │
    └── shared/
        ├── components/
        │   ├── navbar/               ← navbar.component.{ts,html,scss}
        │   ├── kpi-card/             ← kpi-card.component.{ts,html,scss}
        │   ├── filter-bar/           ← filter-bar.component.{ts,html,scss}
        │   ├── chart-wrapper/        ← chart-wrapper.component.{ts,html,scss}
        │   └── loading-spinner/      ← loading-spinner.component.{ts,html,scss}
        └── pipes/
            ├── translate.pipe.ts
            └── budget-currency.pipe.ts

assets/
├── i18n/
│   ├── es.json             ← traducciones en español
│   └── en.json             ← traducciones en inglés
└── data/
    └── budget.json         ← datos mock 2020–2024
```

---

## 🌐 i18n

El `TranslateService` carga el JSON de traducción al iniciar (`es` por defecto).
El botón en la navbar alterna entre ES y EN sin recargar la página.

```typescript
// Uso en template
{{ 'kpi.totalBudgeted' | translate }}

// Uso en componente
this.translate.instant('table.noData')
```

---

## 🎨 SCSS global

El sistema de estilos tiene 5 capas con importación en orden estricto:

| Archivo | Propósito |
|---|---|
| `_variables.scss` | Tokens: colores, tipografía, espaciado, z-index, breakpoints |
| `_mixins.scss` | Helpers reutilizables: `respond-to`, `flex-center`, `card`, `btn-*` |
| `_reset.scss` | Normalización del DOM |
| `_components.scss` | Clases de componentes: `.navbar`, `.kpi-card`, `.data-table`, `.spinner-wrap` |
| `_utilities.scss` | Una responsabilidad por clase: `.text-sm`, `.grid-4`, `.pill-optimal` |

Los componentes usan `@use '../../../styles/variables' as *` para acceder a los tokens sin repetir valores.

---

## 🛠️ Stack

| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 18 | Framework, standalone components, control flow (`@if`, `@for`) |
| RxJS | 7.8 | Estado reactivo: `BehaviorSubject`, `switchMap`, `combineLatest` |
| Chart.js | 4.4 | Gráficas de barras, línea, dona y barras horizontales |
| TypeScript | 5.4 | Tipos estrictos en interfaces y servicios |
| SCSS | — | Sistema modular de 5 capas |

---

## 📝 Licencia

MIT
