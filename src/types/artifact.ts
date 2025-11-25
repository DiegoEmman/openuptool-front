export type PhaseCode = 'INCEPTION' | 'ELABORATION' | 'CONSTRUCTION' | 'TRANSITION';

export interface ArtifactType {
    id: string;
    phase: PhaseCode;
    code: string;
    name: string;
    description: string;
    isMandatory: boolean;
    defaultFormat: 'TEXT' | 'FILE' | 'MIXED';
}

export interface Artifact {
    id: string;
    projectId: string;
    phaseId: PhaseCode; // simplificado: usamos PhaseCode como id de fase
    artifactTypeId: string;
    title: string;
    description?: string;
    author?: string;
    createdAt: string;
    status: 'Pendiente' | 'En revisión' | 'Aprobado';
    isMandatory: boolean; // Copiado desde tipo
    contentText?: string; // Sólo para formatos TEXT / MIXED
}

export interface CreateArtifactInput {
    projectId: string;
    phaseId: PhaseCode;
    artifactTypeId: string;
    title: string;
    description?: string;
    author?: string;
}

export interface UpdateArtifactInput {
    title?: string;
    description?: string;
    author?: string;
    status?: Artifact['status'];
    contentText?: string;
}
