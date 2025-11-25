import { nanoid } from 'nanoid';
import type {
    Artifact,
    CreateArtifactInput,
    UpdateArtifactInput,
    PhaseCode,
} from '../types/artifact';
import { artifactCatalogService } from './artifactCatalogService';

const artifacts: Artifact[] = [];

export const artifactService = {
    getArtifacts(projectId: string, phaseId: PhaseCode): Artifact[] {
        return artifacts.filter((a) => a.projectId === projectId && a.phaseId === phaseId);
    },
    createArtifact(input: CreateArtifactInput): Artifact {
        const type = artifactCatalogService
            .getArtifactTypesByPhase(input.phaseId)
            .find((t) => t.id === input.artifactTypeId);
        if (!type) throw new Error('Tipo de artefacto no encontrado para la fase');
        const artifact: Artifact = {
            id: nanoid(),
            projectId: input.projectId,
            phaseId: input.phaseId,
            artifactTypeId: input.artifactTypeId,
            title: input.title.trim(),
            description: input.description?.trim(),
            author: input.author?.trim(),
            createdAt: new Date().toISOString(),
            status: 'Pendiente',
            isMandatory: type.isMandatory,
            contentText: type.defaultFormat === 'TEXT' ? '' : undefined,
        };
        artifacts.push(artifact);
        return artifact;
    },
    updateArtifact(id: string, changes: UpdateArtifactInput): Artifact | undefined {
        const idx = artifacts.findIndex((a) => a.id === id);
        if (idx === -1) return undefined;
        artifacts[idx] = { ...artifacts[idx], ...changes };
        return artifacts[idx];
    },
};

// TODO: Reemplazar por llamadas HTTP reales al backend.
