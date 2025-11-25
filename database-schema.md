# OpenUP - Modelo Base de Datos (OT-43)

## 📋 Diseño del Esquema Relacional

### Diagrama Lógico - Tablas Principales

---

## 1️⃣ GESTIÓN DE USUARIOS Y AUTENTICACIÓN

### **Tabla: `users`**

Almacena información de los usuarios del sistema.

| Columna         | Tipo                               | Constraints                | Descripción                     |
| --------------- | ---------------------------------- | -------------------------- | ------------------------------- |
| `id`            | UUID                               | PRIMARY KEY                | Identificador único del usuario |
| `email`         | VARCHAR(255)                       | UNIQUE, NOT NULL           | Email para login                |
| `password_hash` | VARCHAR(255)                       | NOT NULL                   | Contraseña encriptada (bcrypt)  |
| `full_name`     | VARCHAR(255)                       | NOT NULL                   | Nombre completo                 |
| `role`          | ENUM('ADMIN', 'MANAGER', 'MEMBER') | NOT NULL, DEFAULT 'MEMBER' | Rol global del usuario          |
| `is_active`     | BOOLEAN                            | NOT NULL, DEFAULT TRUE     | Estado de la cuenta             |
| `created_at`    | TIMESTAMP                          | NOT NULL, DEFAULT NOW()    | Fecha de creación               |
| `updated_at`    | TIMESTAMP                          | NOT NULL, DEFAULT NOW()    | Última actualización            |

**Índices:**

- `idx_users_email` (email) - Para autenticación rápida
- `idx_users_active` (is_active) - Para filtrar usuarios activos

---

## 2️⃣ GESTIÓN DE PROYECTOS

### **Tabla: `projects`**

Tabla principal de proyectos OpenUP.

| Columna       | Tipo                                                             | Constraints                  | Descripción                              |
| ------------- | ---------------------------------------------------------------- | ---------------------------- | ---------------------------------------- |
| `id`          | UUID                                                             | PRIMARY KEY                  | Identificador único del proyecto         |
| `name`        | VARCHAR(255)                                                     | NOT NULL                     | Nombre del proyecto                      |
| `identifier`  | VARCHAR(50)                                                      | UNIQUE, NOT NULL             | Código corto del proyecto (ej: PROJ-001) |
| `description` | TEXT                                                             | NULL                         | Descripción detallada                    |
| `start_date`  | DATE                                                             | NOT NULL                     | Fecha de inicio del proyecto             |
| `end_date`    | DATE                                                             | NULL                         | Fecha estimada de finalización           |
| `status`      | ENUM('CREATED', 'PLANNED', 'IN_PROGRESS', 'CLOSED', 'CANCELLED') | NOT NULL, DEFAULT 'CREATED'  | Estado actual del proyecto               |
| `owner_id`    | UUID                                                             | NOT NULL, FK → users(id)     | Responsable principal del proyecto       |
| `plan_id`     | UUID                                                             | NULL, FK → project_plans(id) | Referencia al plan inicial               |
| `created_at`  | TIMESTAMP                                                        | NOT NULL, DEFAULT NOW()      | Fecha de creación                        |
| `updated_at`  | TIMESTAMP                                                        | NOT NULL, DEFAULT NOW()      | Última actualización                     |

**Índices:**

- `idx_projects_identifier` (identifier) - Para búsqueda rápida por código
- `idx_projects_owner` (owner_id) - Para proyectos por responsable
- `idx_projects_status` (status) - Para filtrar por estado

**Justificación:**

- `owner_id` → FK a `users`: Asegura que el responsable exista y permite trazabilidad.
- `plan_id` → FK a `project_plans`: Relación 1:1 opcional, el plan se crea después del proyecto.
- `identifier` UNIQUE: Evita duplicados en códigos de proyecto.

---

### **Tabla: `project_tags`**

Tabla de relación N:N entre proyectos y etiquetas (tags).

| Columna      | Tipo        | Constraints                                   | Descripción         |
| ------------ | ----------- | --------------------------------------------- | ------------------- |
| `id`         | UUID        | PRIMARY KEY                                   | Identificador único |
| `project_id` | UUID        | NOT NULL, FK → projects(id) ON DELETE CASCADE | Proyecto asociado   |
| `tag`        | VARCHAR(50) | NOT NULL                                      | Etiqueta/tag        |
| `created_at` | TIMESTAMP   | NOT NULL, DEFAULT NOW()                       | Fecha de creación   |

**Índices:**

- `idx_project_tags_project` (project_id) - Para obtener tags por proyecto
- `idx_project_tags_tag` (tag) - Para buscar proyectos por tag
- `unique_project_tag` (project_id, tag) - Evita tags duplicados en el mismo proyecto

**Justificación:**

- Tabla intermedia para relación N:N flexible.
- `ON DELETE CASCADE`: Si se elimina un proyecto, se eliminan sus tags.

---

### **Tabla: `project_members`**

Miembros asignados a cada proyecto con roles específicos.

| Columna      | Tipo                                            | Constraints                                   | Descripción         |
| ------------ | ----------------------------------------------- | --------------------------------------------- | ------------------- |
| `id`         | UUID                                            | PRIMARY KEY                                   | Identificador único |
| `project_id` | UUID                                            | NOT NULL, FK → projects(id) ON DELETE CASCADE | Proyecto            |
| `user_id`    | UUID                                            | NOT NULL, FK → users(id) ON DELETE CASCADE    | Usuario miembro     |
| `role`       | ENUM('OWNER', 'MANAGER', 'DEVELOPER', 'VIEWER') | NOT NULL, DEFAULT 'DEVELOPER'                 | Rol en el proyecto  |
| `joined_at`  | TIMESTAMP                                       | NOT NULL, DEFAULT NOW()                       | Fecha de asignación |

**Índices:**

- `idx_project_members_project` (project_id) - Para listar miembros de un proyecto
- `idx_project_members_user` (user_id) - Para listar proyectos de un usuario
- `unique_project_user` (project_id, user_id) - Un usuario solo puede estar una vez por proyecto

**Justificación:**

- Tabla intermedia N:N con atributo adicional `role`.
- `ON DELETE CASCADE`: Si se elimina proyecto o usuario, se elimina la membresía.

---

## 3️⃣ FASES DEL PROYECTO

### **Tabla: `phases`**

Define las 4 fases estándar de OpenUP para cada proyecto.

| Columna        | Tipo                                                           | Constraints                                   | Descripción                      |
| -------------- | -------------------------------------------------------------- | --------------------------------------------- | -------------------------------- |
| `id`           | UUID                                                           | PRIMARY KEY                                   | Identificador único              |
| `project_id`   | UUID                                                           | NOT NULL, FK → projects(id) ON DELETE CASCADE | Proyecto asociado                |
| `phase_code`   | ENUM('INCEPTION', 'ELABORATION', 'CONSTRUCTION', 'TRANSITION') | NOT NULL                                      | Código de fase OpenUP            |
| `name`         | VARCHAR(100)                                                   | NOT NULL                                      | Nombre de la fase (ej: "Inicio") |
| `start_date`   | DATE                                                           | NULL                                          | Fecha inicio planificada         |
| `end_date`     | DATE                                                           | NULL                                          | Fecha fin planificada            |
| `actual_start` | DATE                                                           | NULL                                          | Fecha inicio real                |
| `actual_end`   | DATE                                                           | NULL                                          | Fecha fin real                   |
| `status`       | ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED')                    | NOT NULL, DEFAULT 'PENDING'                   | Estado de la fase                |
| `order_index`  | INTEGER                                                        | NOT NULL                                      | Orden de la fase (1-4)           |
| `created_at`   | TIMESTAMP                                                      | NOT NULL, DEFAULT NOW()                       | Fecha de creación                |

**Índices:**

- `idx_phases_project` (project_id, order_index) - Para obtener fases ordenadas
- `unique_project_phase` (project_id, phase_code) - Solo una fase de cada tipo por proyecto

**Justificación:**

- Una fase por cada tipo (INCEPTION, ELABORATION, etc.) por proyecto.
- `order_index`: Facilita la ordenación y navegación secuencial.
- Fechas planificadas vs reales: Permite comparar estimaciones con ejecución.

---

## 4️⃣ PLAN DEL PROYECTO

### **Tabla: `project_plans`**

Plan inicial del proyecto (versión 1).

| Columna        | Tipo      | Constraints                                           | Descripción               |
| -------------- | --------- | ----------------------------------------------------- | ------------------------- |
| `id`           | UUID      | PRIMARY KEY                                           | Identificador único       |
| `project_id`   | UUID      | NOT NULL, UNIQUE, FK → projects(id) ON DELETE CASCADE | Proyecto asociado (1:1)   |
| `objectives`   | TEXT      | NOT NULL                                              | Objetivos del proyecto    |
| `scope`        | TEXT      | NOT NULL                                              | Alcance del proyecto      |
| `observations` | TEXT      | NULL                                                  | Observaciones adicionales |
| `version`      | INTEGER   | NOT NULL, DEFAULT 1                                   | Versión del plan          |
| `created_by`   | UUID      | NOT NULL, FK → users(id)                              | Usuario que creó el plan  |
| `created_at`   | TIMESTAMP | NOT NULL, DEFAULT NOW()                               | Fecha de creación         |
| `updated_at`   | TIMESTAMP | NOT NULL, DEFAULT NOW()                               | Última actualización      |

**Índices:**

- `idx_project_plans_project` (project_id) - Para obtener plan por proyecto

**Justificación:**

- Relación 1:1 con `projects` mediante `project_id UNIQUE`.
- `version`: Preparado para versionamiento futuro.
- `created_by`: Auditoría de quién creó el plan.

---

### **Tabla: `plan_milestones`**

Hitos definidos en el plan del proyecto.

| Columna       | Tipo         | Constraints                                        | Descripción               |
| ------------- | ------------ | -------------------------------------------------- | ------------------------- |
| `id`          | UUID         | PRIMARY KEY                                        | Identificador único       |
| `plan_id`     | UUID         | NOT NULL, FK → project_plans(id) ON DELETE CASCADE | Plan asociado             |
| `name`        | VARCHAR(255) | NOT NULL                                           | Nombre del hito           |
| `date`        | DATE         | NOT NULL                                           | Fecha objetivo del hito   |
| `description` | TEXT         | NULL                                               | Descripción del hito      |
| `order_index` | INTEGER      | NOT NULL                                           | Orden del hito en el plan |
| `created_at`  | TIMESTAMP    | NOT NULL, DEFAULT NOW()                            | Fecha de creación         |

**Índices:**

- `idx_milestones_plan` (plan_id, order_index) - Para obtener hitos ordenados

**Justificación:**

- Relación 1:N (un plan tiene muchos hitos).
- `ON DELETE CASCADE`: Si se elimina el plan, se eliminan sus hitos.

---

## 5️⃣ ARTEFACTOS

### **Tabla: `artifact_types`**

Catálogo de tipos de artefactos por fase OpenUP (seed inicial).

| Columna          | Tipo                                                           | Constraints              | Descripción                            |
| ---------------- | -------------------------------------------------------------- | ------------------------ | -------------------------------------- |
| `id`             | UUID                                                           | PRIMARY KEY              | Identificador único                    |
| `phase_code`     | ENUM('INCEPTION', 'ELABORATION', 'CONSTRUCTION', 'TRANSITION') | NOT NULL                 | Fase a la que pertenece                |
| `code`           | VARCHAR(50)                                                    | UNIQUE, NOT NULL         | Código único del tipo (ej: VISION_DOC) |
| `name`           | VARCHAR(255)                                                   | NOT NULL                 | Nombre del tipo de artefacto           |
| `description`    | TEXT                                                           | NULL                     | Descripción del tipo                   |
| `is_mandatory`   | BOOLEAN                                                        | NOT NULL, DEFAULT TRUE   | Si es obligatorio en la fase           |
| `default_format` | ENUM('TEXT', 'FILE', 'MIXED')                                  | NOT NULL, DEFAULT 'TEXT' | Formato por defecto                    |
| `created_at`     | TIMESTAMP                                                      | NOT NULL, DEFAULT NOW()  | Fecha de creación                      |
| `updated_at`     | TIMESTAMP                                                      | NOT NULL, DEFAULT NOW()  | Última actualización                   |

**Índices:**

- `idx_artifact_types_phase` (phase_code) - Para obtener tipos por fase
- `idx_artifact_types_code` (code) - Para búsqueda rápida por código

**Justificación:**

- Catálogo central reutilizable en todos los proyectos.
- `code` UNIQUE: Evita duplicados (ej: dos "VISION_DOC").
- Seed inicial con los 5 tipos de Inception: VISION_DOC, STAKEHOLDERS, INITIAL_RISKS, PROJECT_PLAN_V1, HL_USE_CASES.

---

### **Tabla: `artifacts`**

Instancias de artefactos creados en cada proyecto.

| Columna            | Tipo                                     | Constraints                                   | Descripción                           |
| ------------------ | ---------------------------------------- | --------------------------------------------- | ------------------------------------- |
| `id`               | UUID                                     | PRIMARY KEY                                   | Identificador único                   |
| `project_id`       | UUID                                     | NOT NULL, FK → projects(id) ON DELETE CASCADE | Proyecto asociado                     |
| `phase_id`         | UUID                                     | NOT NULL, FK → phases(id) ON DELETE CASCADE   | Fase asociada                         |
| `artifact_type_id` | UUID                                     | NOT NULL, FK → artifact_types(id)             | Tipo de artefacto                     |
| `title`            | VARCHAR(255)                             | NOT NULL                                      | Título personalizado del artefacto    |
| `description`      | TEXT                                     | NULL                                          | Descripción adicional                 |
| `content_text`     | TEXT                                     | NULL                                          | Contenido textual (para formato TEXT) |
| `file_url`         | VARCHAR(500)                             | NULL                                          | URL del archivo (para formato FILE)   |
| `author_id`        | UUID                                     | NULL, FK → users(id)                          | Usuario creador                       |
| `status`           | ENUM('PENDING', 'IN_REVIEW', 'APPROVED') | NOT NULL, DEFAULT 'PENDING'                   | Estado del artefacto                  |
| `is_mandatory`     | BOOLEAN                                  | NOT NULL                                      | Heredado del tipo al crear            |
| `created_at`       | TIMESTAMP                                | NOT NULL, DEFAULT NOW()                       | Fecha de creación                     |
| `updated_at`       | TIMESTAMP                                | NOT NULL, DEFAULT NOW()                       | Última actualización                  |

**Índices:**

- `idx_artifacts_project` (project_id) - Para listar por proyecto
- `idx_artifacts_phase` (phase_id) - Para listar por fase
- `idx_artifacts_type` (artifact_type_id) - Para agrupar por tipo
- `idx_artifacts_status` (status) - Para filtrar por estado

**Justificación:**

- Relación N:N entre proyectos y tipos de artefacto, con atributos adicionales.
- `is_mandatory`: Se copia del tipo al crear, pero puede modificarse por proyecto.
- `author_id` NULL: Permite artefactos sin autor específico.
- `content_text` y `file_url`: Almacenamiento flexible según formato.

---

## 6️⃣ ITERACIONES

### **Tabla: `iterations`**

Iteraciones/sprints dentro de cada proyecto.

| Columna       | Tipo                                        | Constraints                                   | Descripción                             |
| ------------- | ------------------------------------------- | --------------------------------------------- | --------------------------------------- |
| `id`          | UUID                                        | PRIMARY KEY                                   | Identificador único                     |
| `project_id`  | UUID                                        | NOT NULL, FK → projects(id) ON DELETE CASCADE | Proyecto asociado                       |
| `phase_id`    | UUID                                        | NOT NULL, FK → phases(id)                     | Fase a la que pertenece                 |
| `name`        | VARCHAR(255)                                | NOT NULL                                      | Nombre de la iteración (ej: "Sprint 1") |
| `objective`   | TEXT                                        | NULL                                          | Objetivo de la iteración                |
| `start_date`  | DATE                                        | NOT NULL                                      | Fecha de inicio                         |
| `end_date`    | DATE                                        | NOT NULL                                      | Fecha de fin                            |
| `status`      | ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED') | NOT NULL, DEFAULT 'PLANNED'                   | Estado de la iteración                  |
| `order_index` | INTEGER                                     | NOT NULL                                      | Orden dentro del proyecto               |
| `created_at`  | TIMESTAMP                                   | NOT NULL, DEFAULT NOW()                       | Fecha de creación                       |
| `updated_at`  | TIMESTAMP                                   | NOT NULL, DEFAULT NOW()                       | Última actualización                    |

**Índices:**

- `idx_iterations_project` (project_id, order_index) - Para listar ordenadas por proyecto
- `idx_iterations_phase` (phase_id) - Para agrupar por fase
- `idx_iterations_status` (status) - Para filtrar activas/pasadas

**Justificación:**

- Múltiples iteraciones por proyecto y fase.
- `order_index`: Orden secuencial dentro del proyecto.
- `phase_id`: Asocia iteración a una fase específica (una iteración puede estar en Elaboration, otra en Construction, etc.).

---

## 📊 RESUMEN DE RELACIONES

```
users (1) ──────< (N) projects (owner_id)
users (1) ──────< (N) project_members (N) >────── (1) projects
users (1) ──────< (N) artifacts (author_id)
users (1) ──────< (N) project_plans (created_by)

projects (1) ──< (N) phases
projects (1) ──< (N) project_tags
projects (1) ──< (N) artifacts
projects (1) ──< (N) iterations
projects (1) ──── (1) project_plans (plan_id, project_id)

project_plans (1) ──< (N) plan_milestones

phases (1) ──< (N) artifacts
phases (1) ──< (N) iterations

artifact_types (1) ──< (N) artifacts
```

---

## 🔑 JUSTIFICACIÓN DE CLAVES

### **Claves Primarias (PK)**

- **UUID en todas las tablas**:
    - Ventajas: Únicos globalmente, seguros para APIs REST, dificulta enumeración.
    - Desventaja: Ocupan más espacio que INTEGER.
    - Justificación: Sistema distribuido futuro, integración con microservicios.

### **Claves Foráneas (FK) principales**

1. **`projects.owner_id` → `users.id`**
    - Garantiza que el responsable exista.
    - `NOT NULL`: Todo proyecto debe tener owner.
    - Sin `ON DELETE CASCADE`: Si se elimina un usuario, se debe reasignar proyectos (usar `ON DELETE RESTRICT`).

2. **`projects.plan_id` → `project_plans.id`**
    - Relación 1:1 opcional (el plan se crea después).
    - `NULL` inicial, se actualiza cuando se crea el plan.

3. **`project_members.project_id` → `projects.id` ON DELETE CASCADE**
    - Si se elimina proyecto, se eliminan membresías automáticamente.

4. **`phases.project_id` → `projects.id` ON DELETE CASCADE**
    - Las fases pertenecen exclusivamente a un proyecto.

5. **`artifacts.phase_id` → `phases.id` ON DELETE CASCADE**
    - Un artefacto está ligado a una fase específica.

6. **`artifacts.artifact_type_id` → `artifact_types.id`**
    - Sin `ON DELETE CASCADE`: Si se elimina un tipo, los artefactos existentes se mantienen (usar `ON DELETE RESTRICT`).

7. **`iterations.phase_id` → `phases.id`**
    - Sin `ON DELETE CASCADE`: Si se elimina fase, se debe reasignar iteraciones.

---

## 🛠️ CONSTRAINTS ADICIONALES

### **CHECK Constraints**

```sql
-- En projects
ALTER TABLE projects ADD CONSTRAINT chk_project_dates
  CHECK (end_date IS NULL OR end_date >= start_date);

-- En phases
ALTER TABLE phases ADD CONSTRAINT chk_phase_dates
  CHECK (end_date IS NULL OR end_date >= start_date);

-- En iterations
ALTER TABLE iterations ADD CONSTRAINT chk_iteration_dates
  CHECK (end_date >= start_date);

-- En project_plans
ALTER TABLE project_plans ADD CONSTRAINT chk_plan_version
  CHECK (version > 0);
```

### **Unique Constraints**

```sql
-- Solo una fase de cada tipo por proyecto
ALTER TABLE phases ADD CONSTRAINT unique_project_phase_code
  UNIQUE (project_id, phase_code);

-- Solo un plan por proyecto
ALTER TABLE project_plans ADD CONSTRAINT unique_project_plan
  UNIQUE (project_id);

-- Un usuario solo puede estar una vez en un proyecto
ALTER TABLE project_members ADD CONSTRAINT unique_project_member
  UNIQUE (project_id, user_id);

-- Un tag no puede repetirse en el mismo proyecto
ALTER TABLE project_tags ADD CONSTRAINT unique_project_tag
  UNIQUE (project_id, tag);
```

---

## 🔄 TRIGGERS RECOMENDADOS

### **1. Auto-crear fases al crear proyecto**

```sql
-- Trigger para crear automáticamente las 4 fases cuando se crea un proyecto
CREATE TRIGGER after_project_insert
AFTER INSERT ON projects
FOR EACH ROW
BEGIN
  INSERT INTO phases (id, project_id, phase_code, name, order_index) VALUES
    (UUID(), NEW.id, 'INCEPTION', 'Inicio', 1),
    (UUID(), NEW.id, 'ELABORATION', 'Elaboración', 2),
    (UUID(), NEW.id, 'CONSTRUCTION', 'Construcción', 3),
    (UUID(), NEW.id, 'TRANSITION', 'Transición', 4);
END;
```

### **2. Actualizar timestamps**

```sql
CREATE TRIGGER before_project_update
BEFORE UPDATE ON projects
FOR EACH ROW
SET NEW.updated_at = NOW();
```

---

## 📦 SEED DATA - TIPOS DE ARTEFACTOS INCEPTION

```sql
INSERT INTO artifact_types (id, phase_code, code, name, description, is_mandatory, default_format) VALUES
  (UUID(), 'INCEPTION', 'VISION_DOC', 'Documento de Visión', 'Define la visión del producto', TRUE, 'TEXT'),
  (UUID(), 'INCEPTION', 'STAKEHOLDERS', 'Lista de Stakeholders', 'Identifica actores clave', TRUE, 'TEXT'),
  (UUID(), 'INCEPTION', 'INITIAL_RISKS', 'Lista de Riesgos Iniciales', 'Riesgos tempranos del proyecto', TRUE, 'TEXT'),
  (UUID(), 'INCEPTION', 'PROJECT_PLAN_V1', 'Plan de Proyecto (v1)', 'Versión inicial del plan', TRUE, 'TEXT'),
  (UUID(), 'INCEPTION', 'HL_USE_CASES', 'Modelo Casos de Uso Alto Nivel', 'Casos de uso principales', FALSE, 'TEXT');
```

---

## 🎯 CONSIDERACIONES PARA EL EQUIPO BACKEND

### **Para los desarrolladores de endpoints:**

1. **Autenticación JWT**:
    - Usar `users.id` como subject del token.
    - Incluir `role` en el payload para autorización.

2. **Endpoints sugeridos**:

    ```
    POST   /api/auth/register
    POST   /api/auth/login
    GET    /api/projects
    POST   /api/projects
    GET    /api/projects/:id
    PATCH  /api/projects/:id
    DELETE /api/projects/:id
    GET    /api/projects/:id/phases
    POST   /api/projects/:id/plan
    GET    /api/projects/:id/artifacts
    POST   /api/projects/:id/artifacts
    PATCH  /api/artifacts/:id
    GET    /api/projects/:id/iterations
    POST   /api/projects/:id/iterations
    GET    /api/artifact-types?phase=INCEPTION
    ```

3. **Validaciones backend**:
    - Verificar que `project.owner_id` exista antes de crear proyecto.
    - Verificar que usuario tenga permisos en proyecto antes de crear artefactos/iteraciones.
    - No permitir crear plan si ya existe uno (verificar `project_plans.project_id UNIQUE`).
    - Validar fechas (end >= start).

4. **Transacciones recomendadas**:
    - Crear proyecto + fases (usar trigger o transaction manual).
    - Crear plan + milestones (transaction).
    - Eliminar proyecto (cascade automático con FK).

5. **Paginación**:
    - Implementar paginación en listados de proyectos, artefactos e iteraciones.
    - Usar `LIMIT/OFFSET` o cursor-based pagination.

---

## 🔐 SEGURIDAD Y PERMISOS

### **Niveles de acceso**

1. **Global (users.role)**:
    - `ADMIN`: Full access a todos los proyectos
    - `MANAGER`: Puede crear proyectos
    - `MEMBER`: Solo acceso a proyectos asignados

2. **Por proyecto (project_members.role)**:
    - `OWNER`: Control total del proyecto
    - `MANAGER`: Gestión de artefactos, iteraciones, plan
    - `DEVELOPER`: Crear/editar artefactos asignados
    - `VIEWER`: Solo lectura

### **Reglas de negocio sugeridas**

- Solo `OWNER` puede eliminar proyecto.
- Solo `OWNER` y `MANAGER` pueden agregar miembros.
- Solo `OWNER` y `MANAGER` pueden crear plan inicial.
- Cualquier miembro puede crear artefactos.
- Solo `author_id` del artefacto o roles superiores pueden editarlo.

---

## 📈 ESCALABILIDAD FUTURA

### **Preparado para**:

1. **Versionamiento de planes**:
    - Campo `version` en `project_plans` permite crear nueva versión.
    - Modificar FK `projects.plan_id` para apuntar a versión activa.

2. **Archivos adjuntos**:
    - Campo `file_url` en `artifacts` para almacenamiento S3/Azure Blob.
    - Tabla adicional `artifact_attachments` si se necesitan múltiples archivos.

3. **Comentarios y colaboración**:
    - Tabla `artifact_comments` (artifact_id, user_id, comment, created_at).
    - Tabla `iteration_comments` para retrospectivas.

4. **Auditoría completa**:
    - Tabla `audit_log` (entity_type, entity_id, action, user_id, changes_json, timestamp).

5. **Notificaciones**:
    - Tabla `notifications` (user_id, type, entity_id, is_read, created_at).

---

## ✅ DIAGRAMA SQL DDL (PostgreSQL)

```sql
-- =============================================
-- SCHEMA: OpenUP Project Management System
-- =============================================

-- EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'MEMBER');
CREATE TYPE project_status AS ENUM ('CREATED', 'PLANNED', 'IN_PROGRESS', 'CLOSED', 'CANCELLED');
CREATE TYPE project_member_role AS ENUM ('OWNER', 'MANAGER', 'DEVELOPER', 'VIEWER');
CREATE TYPE phase_code AS ENUM ('INCEPTION', 'ELABORATION', 'CONSTRUCTION', 'TRANSITION');
CREATE TYPE phase_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');
CREATE TYPE artifact_format AS ENUM ('TEXT', 'FILE', 'MIXED');
CREATE TYPE artifact_status AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED');
CREATE TYPE iteration_status AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED');

-- =============================================
-- TABLA: users
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'MEMBER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);

-- =============================================
-- TABLA: projects
-- =============================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    identifier VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    status project_status NOT NULL DEFAULT 'CREATED',
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    plan_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_project_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_projects_identifier ON projects(identifier);
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);

-- =============================================
-- TABLA: project_tags
-- =============================================
CREATE TABLE project_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_project_tag UNIQUE (project_id, tag)
);

CREATE INDEX idx_project_tags_project ON project_tags(project_id);
CREATE INDEX idx_project_tags_tag ON project_tags(tag);

-- =============================================
-- TABLA: project_members
-- =============================================
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role project_member_role NOT NULL DEFAULT 'DEVELOPER',
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_project_member UNIQUE (project_id, user_id)
);

CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);

-- =============================================
-- TABLA: phases
-- =============================================
CREATE TABLE phases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    phase_code phase_code NOT NULL,
    name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    actual_start DATE,
    actual_end DATE,
    status phase_status NOT NULL DEFAULT 'PENDING',
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_project_phase_code UNIQUE (project_id, phase_code),
    CONSTRAINT chk_phase_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_phases_project ON phases(project_id, order_index);

-- =============================================
-- TABLA: project_plans
-- =============================================
CREATE TABLE project_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
    objectives TEXT NOT NULL,
    scope TEXT NOT NULL,
    observations TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_plan_version CHECK (version > 0)
);

CREATE INDEX idx_project_plans_project ON project_plans(project_id);

-- Agregar FK desde projects a project_plans
ALTER TABLE projects ADD CONSTRAINT fk_projects_plan
    FOREIGN KEY (plan_id) REFERENCES project_plans(id) ON DELETE SET NULL;

-- =============================================
-- TABLA: plan_milestones
-- =============================================
CREATE TABLE plan_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES project_plans(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_milestones_plan ON plan_milestones(plan_id, order_index);

-- =============================================
-- TABLA: artifact_types
-- =============================================
CREATE TABLE artifact_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase_code phase_code NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    default_format artifact_format NOT NULL DEFAULT 'TEXT',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_artifact_types_phase ON artifact_types(phase_code);
CREATE INDEX idx_artifact_types_code ON artifact_types(code);

-- =============================================
-- TABLA: artifacts
-- =============================================
CREATE TABLE artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    phase_id UUID NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
    artifact_type_id UUID NOT NULL REFERENCES artifact_types(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_text TEXT,
    file_url VARCHAR(500),
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status artifact_status NOT NULL DEFAULT 'PENDING',
    is_mandatory BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_artifacts_project ON artifacts(project_id);
CREATE INDEX idx_artifacts_phase ON artifacts(phase_id);
CREATE INDEX idx_artifacts_type ON artifacts(artifact_type_id);
CREATE INDEX idx_artifacts_status ON artifacts(status);

-- =============================================
-- TABLA: iterations
-- =============================================
CREATE TABLE iterations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    phase_id UUID NOT NULL REFERENCES phases(id),
    name VARCHAR(255) NOT NULL,
    objective TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status iteration_status NOT NULL DEFAULT 'PLANNED',
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_iteration_dates CHECK (end_date >= start_date)
);

CREATE INDEX idx_iterations_project ON iterations(project_id, order_index);
CREATE INDEX idx_iterations_phase ON iterations(phase_id);
CREATE INDEX idx_iterations_status ON iterations(status);

-- =============================================
-- TRIGGERS: Auto-actualizar updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_plans_updated_at BEFORE UPDATE ON project_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artifact_types_updated_at BEFORE UPDATE ON artifact_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artifacts_updated_at BEFORE UPDATE ON artifacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_iterations_updated_at BEFORE UPDATE ON iterations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TRIGGER: Auto-crear fases al crear proyecto
-- =============================================
CREATE OR REPLACE FUNCTION create_project_phases()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO phases (project_id, phase_code, name, order_index) VALUES
        (NEW.id, 'INCEPTION', 'Inicio', 1),
        (NEW.id, 'ELABORATION', 'Elaboración', 2),
        (NEW.id, 'CONSTRUCTION', 'Construcción', 3),
        (NEW.id, 'TRANSITION', 'Transición', 4);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_project_insert
AFTER INSERT ON projects
FOR EACH ROW EXECUTE FUNCTION create_project_phases();

-- =============================================
-- SEED DATA: Tipos de artefactos Inception
-- =============================================
INSERT INTO artifact_types (phase_code, code, name, description, is_mandatory, default_format) VALUES
    ('INCEPTION', 'VISION_DOC', 'Documento de Visión', 'Define la visión del producto', TRUE, 'TEXT'),
    ('INCEPTION', 'STAKEHOLDERS', 'Lista de Stakeholders', 'Identifica actores clave', TRUE, 'TEXT'),
    ('INCEPTION', 'INITIAL_RISKS', 'Lista de Riesgos Iniciales', 'Riesgos tempranos del proyecto', TRUE, 'TEXT'),
    ('INCEPTION', 'PROJECT_PLAN_V1', 'Plan de Proyecto (v1)', 'Versión inicial del plan', TRUE, 'TEXT'),
    ('INCEPTION', 'HL_USE_CASES', 'Modelo Casos de Uso Alto Nivel', 'Casos de uso principales', FALSE, 'TEXT');
```

---

## 📝 NOTAS FINALES

Este esquema está diseñado para ser robusto, escalable y alineado con la metodología OpenUP. Considera:

1. ✅ **Integridad referencial**: Todas las FK están definidas con políticas de eliminación apropiadas.
2. ✅ **Normalización**: 3NF aplicada, evitando redundancia.
3. ✅ **Índices estratégicos**: Optimizados para consultas comunes (listados, filtros, búsquedas).
4. ✅ **Flexibilidad**: Preparado para futuras extensiones (versionamiento, archivos, auditoría).
5. ✅ **Triggers útiles**: Automatización de tareas repetitivas (fases, timestamps).

**El equipo backend puede iniciar con este esquema y el frontend se conectará mediante los endpoints REST sugeridos.**
