# OpenUP Frontend - Sprint 1

Sistema de gestión de proyectos OpenUP construido con React + TypeScript + Vite + React Router + Material UI.

## 📦 Stack Tecnológico

- **React 19.1.1** - Framework UI
- **TypeScript 5.9.2** - Tipado estático
- **Vite 7.1.7** - Build tool y dev server
- **React Router 7.9.2** - Enrutamiento
- **Material-UI 5.18.0** - Componentes UI
- **TailwindCSS 4.1.13** - Utilidades CSS
- **React Query 5.62.7** - Gestión de estado y caché
- **nanoid 5.0.7** - Generación de IDs únicos

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Verificar tipos TypeScript
npm run typecheck

# Build de producción
npm run build
```

Accede a la aplicación en: **http://localhost:5173/**

## 📁 Estructura del Proyecto

```
src/
├── pages/              # Páginas principales
│   ├── Projects/
│   │   ├── ProjectsListPage.tsx      # Listado de proyectos
│   │   ├── NewProjectPage.tsx        # Crear proyecto
│   │   └── ProjectDetailPage.tsx     # Detalle con tabs
│   ├── Home/
│   └── Welcome/
├── components/         # Componentes reutilizables
│   ├── plan/
│   │   ├── PlanForm.tsx              # Formulario plan inicial
│   │   └── PlanSummary.tsx           # Vista resumen del plan
│   ├── artifacts/
│   │   ├── InceptionArtifactCatalog.tsx   # Catálogo tipos
│   │   ├── ArtifactCreateForm.tsx         # Crear artefacto
│   │   ├── InlineArtifactEditor.tsx       # Editor de texto
│   │   └── PhaseArtifactsView.tsx         # Lista por fase
│   ├── iterations/
│   │   ├── IterationForm.tsx         # Crear iteración
│   │   └── IterationsTable.tsx       # Activas y pasadas
│   └── common/
├── services/           # Servicios mock con localStorage
│   ├── projectService.ts             # CRUD proyectos
│   ├── planService.ts                # Gestión planes
│   ├── artifactCatalogService.ts     # Catálogo artefactos
│   ├── artifactService.ts            # CRUD artefactos
│   └── iterationService.ts           # CRUD iteraciones
├── types/              # Definiciones TypeScript
│   ├── project.ts
│   ├── plan.ts
│   ├── artifact.ts
│   └── iteration.ts
├── app/                # Configuración app
│   ├── AppProviders.tsx              # React Query + MUI Theme
│   └── router.tsx                    # Configuración rutas
└── lib/                # Librerías configuradas
    └── react-query/
        └── queryClient.ts
```

## 🎯 Funcionalidades Implementadas

### ✅ MÓDULO HU-001 – CREAR PROYECTO OPENUP

**OT-45 y OT-48**: Formulario completo de nuevo proyecto

- 📍 Ruta: `/projects/new`
- **Campos obligatorios**: nombre, identificador, fecha de inicio
- **Metadatos**: responsable, descripción, tags con chips
- **Validación**: campos requeridos
- **Persistencia**: localStorage (mock)
- **Tipos**: `Project`, `CreateProjectInput`, `ProjectStatus`

**Archivos clave:**

- `pages/Projects/NewProjectPage.tsx`
- `services/projectService.ts`
- `types/project.ts`

```typescript
// Ejemplo de uso
const project = await projectService.createProject({
    name: 'Mi Proyecto',
    identifier: 'PROJ-001',
    startDate: '2025-01-01',
    owner: 'Juan Pérez',
    description: 'Descripción del proyecto',
    tags: ['web', 'importante'],
});
```

---

### ✅ MÓDULO HU-003 – PLAN DEL PROYECTO

**OT-53 y OT-54**: Vista de plan inicial asociado al proyecto

- 📍 Ubicación: Tab "Plan" en `/projects/:id`
- **Secciones del plan**:
    - Objetivos del proyecto
    - Alcance
    - Cronograma inicial por fase (Inception, Elaboration, Construction, Transition)
    - Hitos con nombre, fecha y descripción
    - Observaciones
- **Funcionalidad**:
    - Si no existe plan → botón "Crear plan inicial"
    - Formulario modal con todas las secciones
    - Resumen visual con tarjetas MUI
    - Auto-asociación al proyecto (campo `planId`)

**Archivos clave:**

- `components/plan/PlanForm.tsx`
- `components/plan/PlanSummary.tsx`
- `services/planService.ts`
- `types/plan.ts`

```typescript
// Estructura del plan
interface ProjectPlan {
    id: string;
    projectId: string;
    objectives: string;
    scope: string;
    initialSchedule: PhaseSchedule[];
    milestones: Milestone[];
    createdAt: Date;
    version: number;
    observations?: string;
}
```

---

### ✅ MÓDULO HU-006 – ARTEFACTOS DE INCEPCIÓN

**OT-58**: Catálogo de tipos de artefactos

- 📍 Ubicación: Tab "Incepción" en `/projects/:id`
- **5 tipos predefinidos**:
    1. Documento de Visión
    2. Lista de Stakeholders
    3. Lista de Riesgos Iniciales
    4. Plan de Proyecto v1
    5. Modelo de Casos de Uso de Alto Nivel
- **Propiedades editables**:
    - Descripción del tipo
    - Obligatoriedad (toggle)
- **Componente**: `InceptionArtifactCatalog`

**OT-59**: Registro de artefactos con metadatos

- **Formulario "Agregar artefacto"**:
    - Seleccionar tipo desde catálogo
    - Título personalizado
    - Descripción
    - Autor
- **Estados**: Pendiente, En revisión, Aprobado
- **Componente**: `ArtifactCreateForm`

**OT-61**: Edición de contenido textual en línea

- **Modo lectura**: texto formateado con `<pre>`
- **Modo edición**: TextField multilinea
- **Botones**: Guardar / Cancelar
- **Componente**: `InlineArtifactEditor`

**OT-63**: Vista de listado por fase con filtro de estado

- **Tabla con columnas**: Tipo, Título, Autor, Obligatorio, Estado
- **Filtro dropdown**: Todos, Pendiente, En revisión, Aprobado
- **Badges coloreados** por estado
- **Componente**: `PhaseArtifactsView`

**Archivos clave:**

- `components/artifacts/InceptionArtifactCatalog.tsx`
- `components/artifacts/ArtifactCreateForm.tsx`
- `components/artifacts/InlineArtifactEditor.tsx`
- `components/artifacts/PhaseArtifactsView.tsx`
- `services/artifactCatalogService.ts`
- `services/artifactService.ts`
- `types/artifact.ts`

```typescript
// Tipos de artefactos
type PhaseCode = 'INCEPTION' | 'ELABORATION' | 'CONSTRUCTION' | 'TRANSITION';

interface Artifact {
    id: string;
    projectId: string;
    phaseId: string;
    artifactTypeId: string;
    title: string;
    status: 'Pendiente' | 'En revisión' | 'Aprobado';
    isMandatory: boolean;
    contentText?: string;
    description?: string;
    author?: string;
    createdAt: Date;
}
```

---

### ✅ MÓDULO HU-015 – ITERACIONES

**OT-68**: Formulario para crear iteración

- **Campos**:
    - Nombre de la iteración
    - Objetivo
    - Fase (Inception/Elaboration/Construction/Transition)
    - Rango de fechas (inicio y fin)
- **Estado inicial**: "Planeada"
- **Componente**: `IterationForm`

**OT-70**: Vista de iteraciones activas y pasadas

- 📍 Ubicación: Tab "Iteraciones" en `/projects/:id`
- **Dos tablas separadas**:
    - **Activas**: status "Planeada" o "En curso"
    - **Pasadas**: status "Finalizada"
- **Columnas**: Nombre, Fase, Fechas, Estado, Objetivo
- **Componente**: `IterationsTable`

**Archivos clave:**

- `components/iterations/IterationForm.tsx`
- `components/iterations/IterationsTable.tsx`
- `services/iterationService.ts`
- `types/iteration.ts`

```typescript
interface Iteration {
    id: string;
    projectId: string;
    name: string;
    objective: string;
    phase: PhaseCode;
    startDate: string;
    endDate: string;
    status: 'Planeada' | 'En curso' | 'Finalizada';
}
```

---

## 🔌 Arquitectura de Servicios Mock

Todos los servicios están preparados para conectarse al backend. Los datos persisten en **localStorage** (proyectos) o **memoria** (planes, artefactos, iteraciones).

### Patrones implementados:

```typescript
// projectService.ts - Con localStorage
const STORAGE_KEY = 'openup_projects';
export const projectService = {
    list: (): Project[] => {
        /* TODO: GET /api/projects */
    },
    get: (id: string): Project | null => {
        /* TODO: GET /api/projects/:id */
    },
    createProject: (input: CreateProjectInput): Project => {
        /* TODO: POST /api/projects */
    },
    update: (id: string, changes: Partial<Project>): Project | null => {
        /* TODO: PATCH /api/projects/:id */
    },
};

// planService.ts - En memoria
let plans: ProjectPlan[] = [];
export const planService = {
    getPlanByProject: (projectId: string) => {
        /* TODO: GET /api/plans?projectId=:id */
    },
    createInitialPlan: (projectId: string, input: CreatePlanInput) => {
        /* TODO: POST /api/plans */
    },
};
```

**Puntos de integración marcados con `// TODO:` en:**

- `services/projectService.ts`
- `services/planService.ts`
- `services/artifactCatalogService.ts`
- `services/artifactService.ts`
- `services/iterationService.ts`

---

## 🎨 Sistema de Diseño

### Material-UI + TailwindCSS

**Tema personalizado**:

```typescript
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#2563eb' }, // Azul
        secondary: { main: '#9333ea' }, // Púrpura
    },
});
```

**Componentes MUI usados**:

- `Table`, `TableRow`, `TableCell`
- `Card`, `CardContent`, `CardHeader`
- `TextField`, `Select`, `MenuItem`
- `Button`, `IconButton`
- `Dialog`, `DialogTitle`, `DialogContent`
- `Chip`, `Badge`
- `Tabs`, `Tab`
- `Switch`, `FormControlLabel`

**Utilidades Tailwind** (v4 sintaxis):

```css
@import 'tailwindcss/preflight';
@import 'tailwindcss/utilities';

/* Clases usadas: p-4, mb-4, flex, gap-4, etc. */
```

---

## 🛣️ Rutas Implementadas

| Ruta            | Página              | Descripción          |
| --------------- | ------------------- | -------------------- |
| `/`             | `ProjectsListPage`  | Listado de proyectos |
| `/projects`     | `ProjectsListPage`  | Listado de proyectos |
| `/projects/new` | `NewProjectPage`    | Crear nuevo proyecto |
| `/projects/:id` | `ProjectDetailPage` | Detalle con 4 tabs   |

### Tabs en ProjectDetailPage:

1. **Resumen** - Información básica del proyecto
2. **Plan** - Formulario y vista del plan inicial
3. **Incepción** - Catálogo y gestión de artefactos
4. **Iteraciones** - Formulario y tabla de iteraciones

---

## 🔧 Configuración TypeScript

**Path alias configurado** en `tsconfig.json`:

```json
{
    "compilerOptions": {
        "paths": {
            "~/*": ["./src/*"]
        }
    }
}
```

**Uso en imports**:

```typescript
import { ProjectsListPage } from '~/pages/Projects/ProjectsListPage';
import { projectService } from '~/services/projectService';
import type { Project } from '~/types/project';
```

---

## 🧪 Estado de Testing

**Comandos disponibles**:

```bash
npm run typecheck  # Verificación de tipos TypeScript
```

**Testing pendiente**: Configurar Jest/Vitest + React Testing Library para pruebas unitarias y de integración.

---

## 📋 Checklist Sprint 1

### ✅ HU-001: Crear Proyecto OpenUP

- [x] OT-45: Formulario UI nuevo proyecto
- [x] OT-48: Metadatos básicos (responsable, descripción, tags)
- [x] Validación de campos
- [x] Persistencia en localStorage
- [x] Tipos TypeScript completos

### ✅ HU-003: Plan del Proyecto

- [x] OT-53: Vista para capturar plan
- [x] OT-54: Asociación plan-proyecto
- [x] Formulario con objetivos, alcance, cronograma
- [x] Gestión de hitos dinámicos
- [x] Vista resumen con tarjetas

### ✅ HU-006: Artefactos de Incepción

- [x] OT-58: Catálogo con 5 tipos predefinidos
- [x] OT-59: Pantalla agregar artefactos con metadatos
- [x] OT-61: Edición de contenido textual en línea
- [x] OT-63: Listado por fase con filtro de estado
- [x] Estados: Pendiente, En revisión, Aprobado
- [x] Toggle obligatoriedad en catálogo

### ✅ HU-015: Iteraciones

- [x] OT-68: Formulario crear iteración
- [x] OT-70: Vista iteraciones activas y pasadas
- [x] Asociación con fases OpenUP
- [x] Gestión de estados

---

## 🚧 Próximos Pasos (Sprint 2+)

### ✅ Mejoras UX Implementadas (adicionales al Sprint 1):

1. **Navegación mejorada**:
    - Breadcrumbs en todas las páginas (Nuevo Proyecto y Detalle)
    - Botones "Volver" y "Cancelar" consistentes
2. **Lista de proyectos**:
    - Estados con Chips coloreados (Creado/Planificado/En curso/Cerrado)
    - Mensaje motivacional cuando no hay proyectos con botón CTA
    - Tabla responsive con hover effects

3. **Formulario de tags**:
    - Tecla Enter para agregar tags rápidamente
    - Chips con botón eliminar (×)
    - Validación para evitar duplicados

---

## 🚧 Próximos Pasos (Sprint 2+)

1. **Backend Integration**:
    - Reemplazar servicios mock por llamadas HTTP
    - Implementar autenticación y autorización
    - Configurar axios/fetch con interceptors

2. **Testing**:
    - Configurar Vitest
    - Tests unitarios para servicios
    - Tests de integración para páginas
    - Tests E2E con Playwright

3. **Mejoras UX**:
    - Loading states con skeletons
    - Error boundaries mejorados
    - Toast notifications (react-toastify)
    - Confirmaciones para acciones destructivas

4. **Funcionalidades adicionales**:
    - Búsqueda y filtrado en listados
    - Ordenamiento en tablas
    - Paginación
    - Exportación de artefactos (PDF/Word)
    - Dashboard con métricas

5. **Optimizaciones**:
    - Code splitting por ruta
    - Lazy loading de componentes
    - Optimistic updates con React Query
    - Virtual scrolling para listas largas

---

## 📚 Recursos

- [React Router 7 Docs](https://reactrouter.com/en/main)
- [Material-UI Components](https://mui.com/material-ui/all-components/)
- [TanStack Query](https://tanstack.com/query/latest/docs/react/overview)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 👥 Contribución

Este proyecto sigue la metodología OpenUP con sprints de 2 semanas.

**Sprint actual**: Sprint 1 ✅ Completado
**Próximo sprint**: Sprint 2 - Integración Backend

---

## 📝 Notas Técnicas

### Dual Routing Architecture

El proyecto tiene configuración para dos modos:

1. **Vite SPA Mode** (recomendado para desarrollo):
    - Entry: `index.html` → `src/main.tsx`
    - Routing: `src/app/router.tsx` con `BrowserRouter`
    - Comando: `npm run dev`
    - Puerto: 5173

2. **React Router Dev Mode** (para SSR futuro):
    - Entry: `app/root.tsx`
    - File-based routing: `app/routes/*.tsx`
    - Wrappers que importan desde `src/pages/`
    - Comando: `react-router dev` (no configurado por defecto)

**Configuración actual**: Usando Vite SPA mode exclusivamente.

### localStorage Keys

- `openup_projects` - Almacenamiento de proyectos

---

**¡Sprint 1 implementado y funcional! 🎉**

## Convenciones

- Cada página tiene su carpeta y un `index.ts`/`<Name>Page.tsx`.
- Re-exportar en `index.ts` para imports limpios.
- Evitar imports relativos profundos usando `paths` en `tsconfig` (opcional).

## Próximos pasos

- Integrar enrutador apuntando a `pages/`.
- Añadir gestión de estado si se necesita.
- Configurar React Query y manejo de errores centralizado.
