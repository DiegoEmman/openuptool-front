# Integración Frontend-Backend OpenUpTool

## ✅ Estado: COMPLETADO

El frontend ya está completamente integrado con el backend. Todos los servicios están refactorizados para usar HTTP en lugar de localStorage.

## 🔧 Configuración

### Variables de Entorno
Archivo: `.env`
```
VITE_API_URL=http://localhost:5000/api
```

### Configuración del Cliente HTTP
- **Archivo**: `src/services/api/httpClient.ts`
- **Base URL**: Configurada dinámicamente desde `ENV.API_BASE_URL`
- **Headers**: Content-Type JSON por defecto
- **Manejo de errores**: Extrae mensajes de error del backend

## 📡 Servicios Refactorizados

### 1. Project Service (`projectService.ts`)
**Endpoints:**
- `GET /projects` - Lista todos los proyectos
- `POST /projects` - Crea proyecto con 4 fases automáticas
- `GET /projects/{id}` - Obtiene proyecto específico
- `PATCH /projects/{id}` - Actualiza proyecto

**Cambios en tipos:**
- ✅ Añadidos campos `createdAt` y `updatedAt` opcionales
- ✅ Campo `phases` retorna array de códigos de fase

### 2. Phase Service (`phaseService.ts`)
**Endpoints:**
- `GET /projects/{projectId}/phases` - Lista fases del proyecto
- `GET /projects/{projectId}/phases/{phaseCode}` - Obtiene fase por código
- `PATCH /projects/{projectId}/phases/{phaseId}` - Actualiza fase
- `POST /projects/{projectId}/phases/{phaseId}/start` - Inicia fase
- `POST /projects/{projectId}/phases/{phaseId}/complete` - Completa fase

**Estado:** ✅ Listo

### 3. Artifact Service (`artifactService.ts`)
**Endpoints:**
- `GET /projects/{projectId}/artifacts?phaseId={phaseCode}` - Lista artefactos
- `POST /projects/{projectId}/artifacts` - Crea artefacto
- `PATCH /projects/{projectId}/artifacts/{id}` - Actualiza artefacto

**Estado:** ✅ Listo

### 4. Artifact Catalog Service (`artifactCatalogService.ts`)
**Endpoints:**
- `GET /artifact-types` - Lista todos los tipos
- `GET /artifact-types?phase={phaseCode}` - Filtra por fase

**Estado:** ✅ Listo

### 5. Plan Service (`planService.ts`)
**Endpoints:**
- `GET /plans` - Lista planes
- `POST /plans` - Crea plan
- `GET /plans/{id}` - Obtiene plan específico
- `PATCH /plans/{id}` - Actualiza plan

**Estado:** ✅ Listo

### 6. Iteration Service (`iterationService.ts`)
**Endpoints:**
- `GET /projects/{projectId}/iterations` - Lista iteraciones
- `POST /projects/{projectId}/iterations` - Crea iteración
- `PATCH /projects/{projectId}/iterations/{id}` - Actualiza iteración

**Estado:** ✅ Listo

## 🎨 Componentes Actualizados

Todos los componentes principales ya manejan estados async:

### Páginas
- ✅ `ProjectsListPage.tsx` - Carga proyectos con useEffect
- ✅ `NewProjectPage.tsx` - Crea proyectos con loading/error states
- ✅ `ProjectDetailPage.tsx` - Carga proyecto con Promise.all

### Componentes
- ✅ `PlanForm.tsx` - Submit async
- ✅ `IterationForm.tsx` - Submit async
- ✅ `ArtifactCreateForm.tsx` - Submit async
- ✅ `InlineArtifactEditor.tsx` - Update async
- ✅ `InceptionArtifactCatalog.tsx` - Carga tipos async

## 🚀 Cómo Ejecutar

### Backend
```powershell
cd e:\Escritorio\openuptool-api\src\OpenUpTool.Api
dotnet run
```
**URL:** http://localhost:5000
**Swagger:** http://localhost:5000

### Frontend
```powershell
cd e:\Escritorio\openuptool-front
npm install
npm run dev
```
**URL:** http://localhost:5173

## ✅ Verificaciones

### 1. Verificar Comunicación
Abrir la consola del navegador y verificar que las peticiones HTTP se ejecuten correctamente:
- Network tab debe mostrar llamadas a `http://localhost:5000/api/*`
- No debe haber errores CORS
- Respuestas 200/201 para operaciones exitosas

### 2. Flujo Completo
1. **Crear Proyecto**
   - Ir a /projects/new
   - Llenar formulario
   - Verificar que se creen 4 fases automáticamente

2. **Ver Proyecto**
   - Lista debe cargar desde backend
   - Click en proyecto debe mostrar detalles

3. **Crear Artefactos**
   - Ir a fase Inception
   - Crear artefactos
   - Verificar que se guarden en backend

## 🔍 Diferencias Backend vs Frontend

### IDs
- **Backend**: Usa `Guid` (UUID)
- **Frontend**: Usa `string`
- ✅ Compatibles - JavaScript convierte automáticamente

### Fechas
- **Backend**: Retorna DateTime en formato ISO
- **Frontend**: Usa `string` en formato ISO
- ✅ Compatibles

### Phase Status
- **Backend**: Usa `PENDING`, `IN_PROGRESS`, `COMPLETED`
- **Frontend**: Mismo formato
- ✅ Compatibles

### Artifact Status
- **Backend**: Usa strings libres
- **Frontend**: Define tipos específicos
- ⚠️ **Acción requerida**: El backend debe validar estos valores o el frontend debe aceptar cualquier string

## 📝 Notas Importantes

### CORS
El backend ya está configurado con CORS para:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (alternativo)
- `http://localhost:4200` (alternativo)

### Persistencia
- ✅ Los datos se guardan en PostgreSQL
- ✅ Las fases se crean automáticamente al crear un proyecto
- ✅ Los tipos de artefactos Inception están pre-cargados

### Swagger
Usa Swagger UI para probar los endpoints manualmente:
- http://localhost:5000

## 🐛 Troubleshooting

### Error: "Unable to connect to the remote server"
- Verificar que el backend esté corriendo en puerto 5000
- Verificar que no haya firewall bloqueando

### Error: "CORS policy"
- El backend ya tiene CORS configurado
- Verificar que la URL en `.env` sea correcta

### Error: "404 Not Found"
- Verificar que la ruta del endpoint sea correcta
- Algunos endpoints requieren parámetros en la URL

### Datos no se guardan
- Abrir DevTools > Network
- Verificar que la petición se envíe correctamente
- Revisar la respuesta del servidor

## ✨ Próximos Pasos Recomendados

1. **Validación**: Agregar validación de tipos en el backend (FluentValidation)
2. **Autenticación**: Implementar JWT cuando sea necesario
3. **Paginación**: Agregar paginación en endpoints de lista
4. **Búsqueda**: Implementar filtros y búsqueda
5. **Testing**: Agregar tests unitarios e integración
6. **Optimización**: Implementar caché cuando sea apropiado
