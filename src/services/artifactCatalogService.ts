import type { ArtifactType, PhaseCode } from "../types/artifact";
import { httpClient } from "./api/httpClient";

export const artifactCatalogService = {
    async seedDefaultInceptionTypes(): Promise<void> {
        try {
            await httpClient("/artifact-types/seed-inception", {
                method: "POST",
            });
        } catch (error) {
            console.error("Error seeding inception types:", error);
        }
    },

    async getArtifactTypesByPhase(phase: PhaseCode): Promise<ArtifactType[]> {
        return httpClient<ArtifactType[]>(`/artifact-types?phase=${phase}`);
    },

    async getAllArtifactTypes(): Promise<ArtifactType[]> {
        return httpClient<ArtifactType[]>("/artifact-types");
    },

    async updateType(
        id: string,
        changes: Partial<ArtifactType>
    ): Promise<ArtifactType | undefined> {
        try {
            return await httpClient<ArtifactType>(`/artifact-types/${id}`, {
                method: "PATCH",
                body: JSON.stringify(changes),
            });
        } catch (error) {
            console.error("Error updating artifact type:", error);
            return undefined;
        }
    },
};

// No inicializar automáticamente - se debe llamar manualmente después de autenticarse
// artifactCatalogService.seedDefaultInceptionTypes();
