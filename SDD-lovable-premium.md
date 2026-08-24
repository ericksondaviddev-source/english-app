# SDD: Migracion a Lovable Premium - English App

## Objetivo
Migrar la English App actual a un diseno premium estilo Lovable, manteniendo la funcionalidad existente pero elevando la calidad visual y la experiencia de usuario.

## Estado Actual

### Stack
- React 19 + Vite 8
- Tailwind CSS 4
- JavaScript (no TypeScript)
- Custom CSS variables para theming

### Estructura
```
src/
├── components/   (11 componentes)
├── hooks/        (5 hooks)
├── utils/        (5 utilidades)
├── data/         (2 archivos de datos)
├── App.jsx
├── index.css
└── main.jsx
```

### Diseno Actual
- Colores personalizados via CSS variables
- Emoji icons (no libreria de iconos)
- Hover effects basicos (scale)
- Grid layout para modos
- Bottom navigation simple
- Dark mode funcional

## Propuestas de Mejora (Lovable Premium)

### 1. Migracion a shadcn/ui
**Componentes a migrar:**
- `Home.jsx` → Card components de shadcn
- `Layout.jsx` → Navigation components
- `Practice.jsx` → Dialog/Modal components
- `Profile.jsx` → Card components
- `Ranking.jsx` → Table components

**Dependencias a instalar:**
```bash
npm i lucide-react clsx tailwind-merge
npx shadcn@latest init
npx shadcn@latest add button card dialog navigation-menu
```

### 2. Mejoras Visuales

| Elemento | Actual | Lovable Premium |
|----------|--------|-----------------|
| **Iconos** | Emoji | Lucide React icons |
| **Bordes** | rounded-2xl | rounded-xl + shadows suaves |
| **Hover** | scale-[1.02] | transition-all + shadow-md |
| **Glassmorphism** | No | backdrop-blur-md bg-white/70 |
| **Tipografia** | font-bold | font-extrabold tracking-tight |
| **Sombras** | Ninguna | shadow-sm → shadow-lg |
| **Espaciado** | p-4, gap-3 | p-6, gap-4, space-y-6 |

### 3. Componentes a Crear

| Componente | Descripcion |
|------------|-------------|
| `GlassCard` | Tarjeta con glassmorphism |
| `GradientButton` | Boton con gradiente sutil |
| `IconBadge` | Badge con icono y color |
| `LoadingSkeleton` | Skeleton de carga |
| `ToastNotification` | Notificaciones toast |

### 4. Microinteracciones

```css
/* Transiciones modernas */
.transition-all duration-200 ease-out
hover:scale-[1.02] hover:shadow-lg
active:scale-[0.98]
focus:ring-2 focus:ring-primary/50
```

### 5. Paleta de Colores Actualizada

```css
:root {
  --color-primary: #6366F1;      /* Indigo */
  --color-primary-light: #818CF8;
  --color-success: #10B981;      /* Emerald */
  --color-error: #EF4444;
  --color-warning: #F59E0B;
  --color-bg: #FFFFFF;
  --color-bg-secondary: #F8FAFC;
  --color-border: #E2E8F0;
  --color-text: #1E293B;
  --color-text-secondary: #64748B;
}

.dark {
  --color-bg: #0F172A;
  --color-bg-secondary: #1E293B;
  --color-border: #334155;
  --color-text: #F1F5F9;
  --color-text-secondary: #94A3B8;
}
```

## Plan de Implementacion

### Fase 1: Configuracion (15 min)
1. Instalar shadcn/ui y dependencias
2. Configurar theme en tailwind.config.js
3. Crear utilidad `cn()` para classnames

### Fase 2: Componentes Base (30 min)
1. Crear `GlassCard.jsx`
2. Crear `GradientButton.jsx`
3. Crear `IconBadge.jsx`
4. Crear `LoadingSkeleton.jsx`

### Fase 3: Migracion de Componentes (45 min)
1. `Layout.jsx` → Navigation moderna
2. `Home.jsx` → Cards con glassmorphism
3. `ScoreBar.jsx` → Barra premium
4. `Practice.jsx` → Interface pulida

### Fase 4: Microinteracciones (20 min)
1. Agregar transiciones a todos los botones
2. Agregar hover effects
3. Agregar loading states
4. Agregar toast notifications

### Fase 5: Testing y Ajustes (15 min)
1. Verificar dark mode
2. Probar responsive design
3. Ajustar espaciados y colores

## Impacto y Riesgos

### Impacto
- **Archivos modificados:** ~15 componentes
- **Archivos nuevos:** ~5 componentes base
- **Dependencias nuevas:** lucide-react, clsx, tailwind-merge, shadcn/ui

### Riesgos
- **Bajo:** shadcn/ui es compatible con Tailwind CSS 4
- **Bajo:** Los componentes son aditivos, no reemplazan funcionalidad
- **Mitigacion:** Mantener dark mode existente

## Criterios de Exito

- [ ] Todos los componentes migrados a shadcn/ui
- [ ] Glassmorphism implementado en cards principales
- [ ] Microinteracciones funcionando
- [ ] Dark mode compatible
- [ ] Responsive design mantenido
- [ ] Performance sin degradacion
