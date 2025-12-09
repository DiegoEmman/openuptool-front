# HU-012: Asociar Entregables a Flujos de Trabajo - Frontend

## ✅ Implementación Completada

### 📋 Backend Verificado

El backend provee 21 endpoints para:

- **Workflows**: CRUD completo de flujos de trabajo
- **WorkflowStates**: Gestión de estados con orden, colores, responsables
- **ArtifactStateHistory**: Historial completo de cambios de estado
- 4 Entidades: Workflow, WorkflowState, WorkflowStateResponsible, ArtifactStateHistory

### 🎯 Archivos Creados

#### 1. **Types** (`src/types/workflow.ts`)

```
✅ Workflow, WorkflowState, WorkflowStateResponsible
✅ ArtifactStateHistory, ArtifactWithWorkflow
✅ CreateWorkflowInput, UpdateWorkflowInput
✅ CreateWorkflowStateInput, UpdateWorkflowStateInput
✅ CreateWorkflowStateResponsibleInput
✅ ChangeArtifactStateInput
✅ WorkflowWithStates (DTOs combinados)
```

#### 2. **Services** (`src/services/workflowService.ts`)

```
✅ workflowService
   - list() - Todos los flujos
   - getByProject(projectId) - Flujos de un proyecto
   - getById(id) - Detalles de un flujo
   - create(input) - Crear flujo
   - update(id, input) - Actualizar flujo
   - delete(id) - Eliminar flujo

✅ workflowStateService
   - getByWorkflow(workflowId) - Estados de un flujo
   - create(input) - Crear estado
   - update(id, input) - Actualizar estado
   - delete(id) - Eliminar estado
   - addResponsible(input) - Agregar responsable
   - removeResponsible(stateId, userId) - Quitar responsable

✅ artifactStateService
   - getArtifactWithWorkflow(artifactId) - Info de artefacto con flujo
   - getHistory(artifactId) - Historial de cambios
   - changeState(input) - Cambiar estado de artefacto
   - assignWorkflow(artifactId, workflowId) - Asignar flujo a artefacto
```

#### 3. **Components** (`src/components/workflow/`)

**WorkflowForm.tsx** ✅

- Formulario de creación/edición de flujos
- Campos: nombre, descripción, isActive
- Modo create/edit con validación

**WorkflowsTable.tsx** ✅

- Tabla de flujos con columnas: nombre, descripción, estados (preview), activo, acciones
- Preview de estados (muestra primeros 3 con chips de colores)
- Acciones: Ver, Editar, Eliminar

**WorkflowStateForm.tsx** ✅

- Formulario de creación/edición de estados
- Campos: nombre, descripción, orden, color, checkboxes (inicial/final), acciones requeridas
- Color picker con 6 presets + input hex
- Validación de orden numérico

**WorkflowStatesView.tsx** ✅

- Vista detallada de estados de un flujo
- Lista ordenada de estados con:
    - Número de orden con color de fondo
    - Badges para estado inicial/final
    - Descripción y acciones requeridas
    - Lista de responsables con chips
- Acciones: Editar, Eliminar estado

**ArtifactStateChanger.tsx** ✅

- Dialog para cambiar estado de un artefacto
- Muestra estado actual y flujo asignado
- Selector de nuevo estado con preview de acciones requeridas
- Campo de comentario opcional

**StateHistoryView.tsx** ✅

- Tabla de historial de cambios de estado
- Columnas: fecha, estado anterior, estado nuevo, usuario, comentario
- Estados con chips de colores
- Ordenado por fecha descendente

#### 4. **Pages** (`src/pages/Workflows/`)

**WorkflowsPage.tsx** ✅

- Página principal de gestión de workflows
- 2 tabs:
    1. **Lista de Flujos**: Tabla de workflows con botón crear
    2. **Gestionar Estados**: Vista detallada con estados y responsables
- Integra todos los componentes
- Gestión completa de workflows y estados

**index.ts** ✅

- Export de WorkflowsPage

#### 5. **Routes** (`app/routes/`)

**projects.$id.workflows.tsx** ✅

- Ruta `/projects/:id/workflows`
- Renderiza WorkflowsPage

**routes.ts** ✅

- Agregada ruta de workflows al router

**index.ts** (pages) ✅

- Export de Workflows agregado

### 🔄 Flujo de Uso

#### Gestión de Workflows

1. Navegar a `/projects/{projectId}/workflows`
2. Ver lista de flujos existentes
3. **Crear Flujo**: Click en "Crear Flujo de Trabajo"
    - Ingresar nombre, descripción
    - Marcar como activo/inactivo
4. **Editar/Eliminar**: Acciones en la tabla

#### Gestión de Estados

1. Click en "Ver" en un flujo
2. Tab "Gestionar Estados"
3. **Agregar Estado**: Click en "Agregar Estado"
    - Nombre, orden, color, descripción
    - Marcar como inicial/final
    - Definir acciones requeridas
4. Estados se muestran ordenados con colores
5. **Editar/Eliminar**: Iconos en cada estado

#### Cambiar Estado de Artefacto

1. Desde cualquier artefacto, usar `ArtifactStateChanger`
2. Seleccionar nuevo estado del dropdown
3. Ver descripción y acciones requeridas
4. Agregar comentario opcional
5. Confirmar cambio

#### Ver Historial

1. En vista de artefacto, usar `StateHistoryView`
2. Ver tabla completa de cambios
3. Estados con colores, fechas, usuarios, comentarios

### 📊 Características Principales

✅ **CRUD Completo de Workflows**

- Crear, editar, eliminar flujos de trabajo
- Activar/desactivar flujos
- Asociar flujos a proyectos

✅ **Gestión de Estados**

- Estados ordenados con números
- 6 colores predefinidos + selector hex
- Estados iniciales y finales marcados
- Acciones requeridas por estado

✅ **Responsables por Estado**

- Múltiples responsables por estado
- Roles opcionales
- Vista de responsables con chips

✅ **Cambio de Estado de Artefactos**

- Asignación de flujos a artefactos
- Cambio de estado con validación
- Comentarios en cambios

✅ **Historial Completo**

- Todos los cambios auditados
- Fecha, usuario, estados previo/nuevo
- Comentarios opcionales

✅ **UI/UX**

- Material-UI consistente con el resto del proyecto
- Colores visuales para estados
- Chips para responsables y estados
- Validaciones en formularios
- Confirmaciones en eliminaciones

### 🔗 Integración con Otros Módulos

**Artefactos de Elaboración**

- Asignar flujos a documentos, modelos, diagramas
- Cambiar estados durante la fase de elaboración
- Ver historial de revisiones

**Construcción**

- Flujos para código, builds, releases
- Estados: Borrador → En Desarrollo → En Revisión → Aprobado

**Testing**

- Flujos para casos de prueba
- Estados: Creado → En Ejecución → Pasado/Fallado

**Transición**

- Flujos para builds finales
- Estados: En Construcción → En QA → Aprobado para Producción

### 📝 Seed Data (Backend)

El backend incluye 2 workflows de ejemplo:

1. **Revisión de Documentos**
    - Borrador → En Revisión → Aprobado

2. **Desarrollo de Código**
    - Nuevo → En Desarrollo → En Revisión → Completado

### 🎨 Paleta de Colores por Defecto

- Azul: #6366F1 (Estados en progreso)
- Verde: #10B981 (Estados finales/aprobados)
- Amarillo: #F59E0B (Estados en revisión)
- Rojo: #EF4444 (Estados rechazados)
- Morado: #8B5CF6 (Estados especiales)
- Gris: #6B7280 (Estados inactivos)

### ✨ Próximos Pasos

Para usar esta funcionalidad:

1. **Navegar a Workflows**:

    ```
    http://localhost:5173/projects/{TU_PROJECT_ID}/workflows
    ```

2. **Crear primer flujo**:
    - Click en "Crear Flujo de Trabajo"
    - Nombre: "Revisión de Documentos"
    - Marcar como activo

3. **Agregar estados**:
    - Tab "Gestionar Estados"
    - Crear: "Borrador" (orden 1, color azul, inicial)
    - Crear: "En Revisión" (orden 2, color amarillo)
    - Crear: "Aprobado" (orden 3, color verde, final)

4. **Asignar a artefactos**:
    - En elaboración, construcción, testing
    - Usar `ArtifactStateChanger` component

5. **Gestionar cambios**:
    - Cambiar estados según el flujo
    - Agregar comentarios
    - Ver historial completo

### 🐛 Debugging

Si tienes problemas:

1. **Verificar backend**: Los 21 endpoints deben estar funcionando
2. **Verificar proyecto**: El projectId debe existir
3. **Console del navegador**: Ver errores de API
4. **Network tab**: Verificar requests/responses

### 📖 Documentación Backend

Ver archivos en `openuptool-api/Sprint3/`:

- `HU-012-Asociar-Entregables-Flujos-Trabajo.ps1`: Tests de endpoints
- `HU-012-IMPLEMENTATION-SUMMARY.md`: Documentación completa

## ✅ Estado Final

- **0 errores de compilación**
- **Todos los componentes creados**
- **Servicios completos con 21 endpoints**
- **Ruta configurada**
- **Integración lista**
- **Tipado completo**

¡HU-012 Frontend 100% Completado! 🎉
