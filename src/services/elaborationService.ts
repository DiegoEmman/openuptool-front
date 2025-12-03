import { httpClient } from "./api/httpClient";
import type { Artifact } from "../types/artifact";

// Re-export Artifact as ElaborationArtifact for backward compatibility
export type ElaborationArtifact = Artifact;

export interface CreateElaborationArtifactInput {
    projectId: string;
    phaseId: "ELABORATION";
    artifactTypeId: string;
    title: string;
    description?: string;
    author?: string;
    isMandatory: boolean;
    contentText?: string;
}

export interface UpdateElaborationArtifactInput {
    title?: string;
    description?: string;
    status?: "Pendiente" | "En revisión" | "Aprobado";
    contentText?: string;
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
        try {
            const url = `/projects/${projectId}/artifacts?phaseId=ELABORATION`;
            console.log(`📡 [elaborationService] Fetching from: ${url}`);
            console.log(
                `📡 [elaborationService] API Base: ${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}`
            );

            const result = await httpClient<ElaborationArtifact[]>(url);

            console.log(
                `✅ [elaborationService] Success! Received ${result.length} artifacts`
            );
            console.log(`📦 [elaborationService] Data:`, result);

            return result;
        } catch (error) {
            console.error(
                "❌ [elaborationService] Error fetching artifacts:",
                error
            );
            console.error("❌ [elaborationService] Error details:", {
                message:
                    error instanceof Error ? error.message : "Unknown error",
                stack: error instanceof Error ? error.stack : undefined,
            });
            throw error;
        }
    },

    async createArtifact(
        projectId: string,
        input: CreateElaborationArtifactInput
    ): Promise<ElaborationArtifact> {
        const formData = new FormData();

        // Agregar todos los campos requeridos
        formData.append("projectId", input.projectId || projectId);
        formData.append("phaseId", "ELABORATION");
        formData.append("artifactTypeId", input.artifactTypeId);
        formData.append("title", input.title);
        formData.append("isMandatory", String(input.isMandatory));

        if (input.description) {
            formData.append("description", input.description);
        }
        if (input.author) {
            formData.append("author", input.author);
        }
        if (input.contentText) {
            formData.append("contentText", input.contentText);
        }

        const token = localStorage.getItem("token");
        const response = await fetch(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/projects/${projectId}/artifacts`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create artifact");
        }

        return response.json();
    },

    async updateArtifact(
        projectId: string,
        artifactId: string,
        changes: UpdateElaborationArtifactInput
    ): Promise<ElaborationArtifact> {
        return httpClient<ElaborationArtifact>(
            `/projects/${projectId}/artifacts/${artifactId}`,
            {
                method: "PATCH",
                body: JSON.stringify(changes),
            }
        );
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
