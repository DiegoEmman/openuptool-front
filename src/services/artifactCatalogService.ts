import { nanoid } from 'nanoid';
import type { ArtifactType, PhaseCode } from '../types/artifact';

let types: ArtifactType[] = [];

export const artifactCatalogService = {
    seedDefaultInceptionTypes() {
        if (types.some((t) => t.phase === 'INCEPTION')) return;
        const inception: Omit<ArtifactType, 'id'>[] = [
            {
                phase: 'INCEPTION',
                code: 'VISION_DOC',
                name: 'Documento de Visión',
                description: 'Define la visión del producto.',
                isMandatory: true,
                defaultFormat: 'TEXT',
            },
            {
                phase: 'INCEPTION',
                code: 'STAKEHOLDERS',
                name: 'Lista de Stakeholders',
                description: 'Identifica actores clave.',
                isMandatory: true,
                defaultFormat: 'TEXT',
            },
            {
                phase: 'INCEPTION',
                code: 'INITIAL_RISKS',
                name: 'Lista de Riesgos Iniciales',
                description: 'Riesgos tempranos.',
                isMandatory: true,
                defaultFormat: 'TEXT',
            },
            {
                phase: 'INCEPTION',
                code: 'PROJECT_PLAN_V1',
                name: 'Plan de Proyecto (v1)',
                description: 'Versión inicial del plan.',
                isMandatory: true,
                defaultFormat: 'TEXT',
            },
            {
                phase: 'INCEPTION',
                code: 'HL_USE_CASES',
                name: 'Modelo Casos de Uso Alto Nivel',
                description: 'Casos de uso principales.',
                isMandatory: false,
                defaultFormat: 'TEXT',
            },
        ];
        types.push(...inception.map((t) => ({ id: nanoid(), ...t })));
    },
    getArtifactTypesByPhase(phase: PhaseCode): ArtifactType[] {
        return types.filter((t) => t.phase === phase);
    },
    updateType(id: string, changes: Partial<ArtifactType>): ArtifactType | undefined {
        const idx = types.findIndex((t) => t.id === id);
        if (idx === -1) return undefined;
        types[idx] = { ...types[idx], ...changes };
        return types[idx];
    },
};

// Inicializar catálogo Inception por defecto.
artifactCatalogService.seedDefaultInceptionTypes();

// TODO: Persistir catálogo en backend / base de datos.
