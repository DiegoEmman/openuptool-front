import { ENV } from "../config/environment";
import type {
    ArtifactVersion,
    CreateArtifactVersionInput,
    VersionHistory,
    VersionComparison,
} from "../types/artifactVersion";

export const artifactVersionService = {
    async createVersion(
        projectId: string,
        artifactId: string,
        input: CreateArtifactVersionInput
    ): Promise<ArtifactVersion> {
        const formData = new FormData();

        if (input.changeDescription) {
            formData.append("changeDescription", input.changeDescription);
        }

        if (input.file) {
            formData.append("file", input.file);
        }

        const token = localStorage.getItem("token");
        const response = await fetch(
            `${ENV.API_BASE_URL}/projects/${projectId}/artifacts/${artifactId}/versions`,
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
            throw new Error(error.message || "Failed to create version");
        }

        return response.json();
    },

    async getVersionHistory(
        projectId: string,
        artifactId: string
    ): Promise<VersionHistory> {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `${ENV.API_BASE_URL}/projects/${projectId}/artifacts/${artifactId}/versions`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch version history");
        }

        return response.json();
    },

    async getVersionById(
        projectId: string,
        artifactId: string,
        versionId: string
    ): Promise<ArtifactVersion> {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `${ENV.API_BASE_URL}/projects/${projectId}/artifacts/${artifactId}/versions/${versionId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch version");
        }

        return response.json();
    },

    async compareVersions(
        projectId: string,
        artifactId: string,
        v1: string,
        v2: string
    ): Promise<VersionComparison> {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `${ENV.API_BASE_URL}/projects/${projectId}/artifacts/${artifactId}/versions/compare?v1=${v1}&v2=${v2}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to compare versions");
        }

        return response.json();
    },

    async downloadVersion(
        projectId: string,
        artifactId: string,
        versionId: string
    ): Promise<Blob> {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `${ENV.API_BASE_URL}/projects/${projectId}/artifacts/${artifactId}/versions/${versionId}/download`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to download version");
        }

        return response.blob();
    },
};
