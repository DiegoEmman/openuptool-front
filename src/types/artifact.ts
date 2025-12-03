export type PhaseCode =
    | "INCEPTION"
    | "ELABORATION"
    | "CONSTRUCTION"
    | "TRANSITION";

export interface ArtifactType {
    id: string;
    phase: PhaseCode;
    code: string;
    name: string;
    description: string;
    isMandatory: boolean;
    defaultFormat: "TEXT" | "FILE" | "MIXED";
}

export interface Artifact {
    id: string;
    projectId: string;
    phaseId: PhaseCode;
    artifactTypeId: string;
    artifactType?: ArtifactType;
    title: string;
    description?: string;
    author?: string;
    createdAt: string;
    status: "Pendiente" | "En revisión" | "Aprobado";
    isMandatory: boolean;
    contentText?: string;
    // Campos para archivos
    filePath?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    fileCategory?: "DIAGRAM" | "PROTOTYPE" | "DOCUMENT";
    // Campos para repositorio
    repositoryUrl?: string;
    repositoryVersion?: string;
    buildNumber?: string;
    // Campos estructurados para Construction
    testCases?: TestCaseDto[];
    testResults?: TestResultDto[];
    iterationActivities?: IterationActivityDto[];
}

export interface TestCaseDto {
    testId: string;
    title: string;
    description?: string;
    steps?: string[];
    expectedResult?: string;
    priority?: number;
    createdAt: string;
}

export interface TestResultDto {
    testCaseId: string;
    result: "PASSED" | "FAILED" | "BLOCKED" | "SKIPPED";
    executedBy?: string;
    executedAt: string;
    notes?: string;
    defects?: string[];
}

export interface IterationActivityDto {
    id: string;
    type: "MEETING" | "REVIEW" | "DEMO" | "RETROSPECTIVE" | "OTHER";
    description: string;
    participants?: string[];
    createdAt: string;
    tags?: string[];
}

export interface CreateArtifactInput {
    projectId: string;
    phaseId: PhaseCode;
    artifactTypeId: string;
    title: string;
    description?: string;
    author?: string;
    isMandatory?: boolean;
    contentText?: string;
    fileCategory?: "DIAGRAM" | "PROTOTYPE" | "DOCUMENT";
    repositoryUrl?: string;
    repositoryVersion?: string;
    buildNumber?: string;
    file?: File;
}

export interface UpdateArtifactInput {
    title?: string;
    description?: string;
    author?: string;
    status?: Artifact["status"];
    isMandatory?: boolean;
    contentText?: string;
    fileCategory?: "DIAGRAM" | "PROTOTYPE" | "DOCUMENT";
    repositoryUrl?: string;
    repositoryVersion?: string;
    buildNumber?: string;
    file?: File;
}

// Tipos para el sistema de versiones
export interface ArtifactVersion {
    id: string;
    artifactId: string;
    versionNumber: number;
    filePath?: string;
    fileName?: string;
    fileSize?: number;
    uploadedBy: string;
    uploadedAt: string;
    changeDescription?: string;
    createdAt: string;
}

export interface CreateVersionInput {
    changeDescription: string;
    uploadedBy?: string;
    file?: File;
}

export interface VersionHistory {
    artifactId: string;
    artifactTitle: string;
    totalVersions: number;
    versions: ArtifactVersion[];
}

export interface VersionDifferences {
    fileChanged: boolean;
    fileSizeChanged: boolean;
    fileSizeDifference?: number;
    authorChanged: boolean;
    timeDifference: string;
    changeDescription?: string;
}

export interface VersionComparison {
    version1: ArtifactVersion;
    version2: ArtifactVersion;
    differences: VersionDifferences;
}
