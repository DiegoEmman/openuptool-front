import type {
    Artifact,
    CreateArtifactInput,
    UpdateArtifactInput,
    PhaseCode,
} from "../types/artifact";
import { httpClient } from "./api/httpClient";

export const artifactService = {
    async getArtifacts(
        projectId: string,
        phaseId: PhaseCode
    ): Promise<Artifact[]> {
        return httpClient<Artifact[]>(
            `/projects/${projectId}/artifacts?phaseId=${phaseId}`
        );
    },

    async createArtifact(input: CreateArtifactInput): Promise<Artifact> {
        return httpClient<Artifact>(`/projects/${input.projectId}/artifacts`, {
            method: "POST",
            body: JSON.stringify({
                projectId: input.projectId,
                phaseId: input.phaseId,
                artifactTypeId: input.artifactTypeId,
                title: input.title.trim(),
                description: input.description?.trim(),
                author: input.author?.trim(),
            }),
        });
    },

    async updateArtifact(
        projectId: string,
        id: string,
        changes: UpdateArtifactInput
    ): Promise<Artifact | undefined> {
        try {
            return await httpClient<Artifact>(
                `/projects/${projectId}/artifacts/${id}`,
                {
                    method: "PATCH",
                    body: JSON.stringify(changes),
                }
            );
        } catch (error) {
            console.error("Error updating artifact:", error);
            return undefined;
        }
    },
};
