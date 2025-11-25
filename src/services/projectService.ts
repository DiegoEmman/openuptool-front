import { nanoid } from 'nanoid';
import type { CreateProjectInput, Project } from '../types/project';
import { phaseService } from './phaseService';

// Almacenamiento en memoria + localStorage para persistencia ligera
const LS_KEY = 'openup_projects';
let projects: Project[] = load();

function load(): Project[] {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as Project[];
    } catch {
        return [];
    }
}

function persist() {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(projects));
    } catch {
        // Ignorar errores de quota
    }
}

export const projectService = {
    list(): Project[] {
        return projects.slice();
    },
    get(id: string): Project | undefined {
        return projects.find((p) => p.id === id);
    },
    createProject(input: CreateProjectInput): Project {
        const project: Project = {
            id: nanoid(),
            name: input.name.trim(),
            identifier: input.identifier.trim(),
            startDate: input.startDate,
            status: 'Creado',
            owner: input.owner?.trim(),
            description: input.description?.trim(),
            tags: input.tags || [],
            phases: ['INCEPTION', 'ELABORATION', 'CONSTRUCTION', 'TRANSITION'],
        };
        projects.push(project);
        persist();

        // Crear las 4 fases estándar de OpenUP para este proyecto
        phaseService.createDefaultPhases(project.id);

        return project;
    },
    update(id: string, changes: Partial<Project>): Project | undefined {
        const idx = projects.findIndex((p) => p.id === id);
        if (idx === -1) return undefined;
        projects[idx] = { ...projects[idx], ...changes };
        persist();
        return projects[idx];
    },
};

// TODO: Reemplazar por llamadas HTTP al backend real cuando esté disponible.
