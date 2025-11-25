export type ProjectStatus = 'Creado' | 'Planificado' | 'En curso' | 'Cerrado';

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
}

export interface CreateProjectInput {
    name: string;
    identifier: string;
    startDate: string;
    owner?: string;
    description?: string;
    tags: string[];
}
