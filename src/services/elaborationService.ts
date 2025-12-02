import { httpClient } from "./api/httpClient";

export interface ElaborationArtifact {
    id: string;
    projectId: string;
    phase: "Elaboration";
    type: string;
    title: string;
    description: string;
    authorId: string;
    required: boolean;
    status: "pending" | "in_review" | "delivered";
    createdAt: string;
    updatedAt: string;
}

export interface CreateElaborationArtifactInput {
    type: string;
    title: string;
    description: string;
    authorId: string;
    required: boolean;
}

export interface UpdateElaborationArtifactInput {
    type?: string;
    title?: string;
    description?: string;
    required?: boolean;
    status?: "pending" | "in_review" | "delivered";
}

export interface ArtifactFile {
    id: string;
    artifactId: string;
    filename: string;
    url: string;
    mimetype: string;
    uploadedAt: string;
}

export interface ValidationResult {
    allowAdvance: boolean;
    missingRequiredArtifacts: Array<{
        id: string;
        title: string;
        type: string;
        status: "pending" | "in_review" | "delivered";
    }>;
}

export const elaborationService = {
    async getArtifacts(projectId: string): Promise<ElaborationArtifact[]> {
        return httpClient<ElaborationArtifact[]>(
            `/projects/${projectId}/elaboration/artifacts`
        );
    },

    async createArtifact(
        projectId: string,
        input: CreateElaborationArtifactInput
    ): Promise<ElaborationArtifact> {
        return httpClient<ElaborationArtifact>(
            `/projects/${projectId}/elaboration/artifacts`,
            {
                method: "POST",
                body: JSON.stringify(input),
            }
        );
    },

    async updateArtifact(
        artifactId: string,
        changes: UpdateElaborationArtifactInput
    ): Promise<ElaborationArtifact> {
        return httpClient<ElaborationArtifact>(`/artifacts/${artifactId}`, {
            method: "PUT",
            body: JSON.stringify(changes),
        });
    },

    async uploadFiles(
        artifactId: string,
        files: FileList
    ): Promise<ArtifactFile[]> {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append("files", file);
        });

        const response = await fetch(`/artifacts/${artifactId}/upload`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Error uploading files");
        }

        return response.json();
    },

    async getFiles(artifactId: string): Promise<ArtifactFile[]> {
        return httpClient<ArtifactFile[]>(`/artifacts/${artifactId}/files`);
    },

    async validatePhase(projectId: string): Promise<ValidationResult> {
        return httpClient<ValidationResult>(
            `/projects/${projectId}/phase/Elaboration/validate`
        );
    },
};
