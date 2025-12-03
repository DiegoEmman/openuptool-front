// Artifact Version types based on backend DTOs

export interface ArtifactVersion {
    id: string;
    artifactId: string;
    versionNumber: number;
    filePath: string;
    fileName: string;
    fileSize: number;
    uploadedBy: string;
    uploadedAt: string;
    changeDescription?: string;
    createdAt: string;
}

export interface CreateArtifactVersionInput {
    changeDescription?: string;
    file?: File;
}

export interface VersionHistory {
    artifactId: string;
    artifactTitle: string;
    totalVersions: number;
    currentVersion: number;
    versions: ArtifactVersion[];
}

export interface VersionComparison {
    version1: ArtifactVersion;
    version2: ArtifactVersion;
    timeDifference: number;
    sizeDifference: number;
    changes: string[];
}
