export type ProjectStatus = "Creado" | "Planificado" | "En curso" | "Cerrado";

export interface Project {
    id: string;
    name: string;
    identifier: string; // Código corto del proyecto
    startDate: string; // ISO date
    status: ProjectStatus;
    owner?: string;
    description?: string;
    tags: string[];
    planId?: string; // Referencia al plan inicial
    phases?: string[]; // Lista simple de fases
    createdAt?: string; // Fecha de creación desde el backend
    updatedAt?: string; // Fecha de actualización desde el backend
    isArchived?: boolean; // Si el proyecto está archivado
    archivedAt?: string; // Fecha de archivado
    archivedBy?: string; // Usuario que archivó el proyecto
}

export interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    entityType: string;
    entityId: string;
    details: string;
    createdAt: string;
}

export interface CreateProjectInput {
    name: string;
    identifier: string;
    startDate: string;
    owner?: string;
    description?: string;
    tags: string[];
}
