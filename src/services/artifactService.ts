import type {
    Artifact,
    CreateArtifactInput,
    UpdateArtifactInput,
    PhaseCode,
    ArtifactVersion,
    CreateVersionInput,
    VersionHistory,
    VersionComparison,
} from "../types/artifact";
import { httpClient } from "./api/httpClient";
import { ENV } from "../config/environment";

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
        const formData = new FormData();
        formData.append("projectId", input.projectId);
        formData.append("phaseId", input.phaseId);
        formData.append("artifactTypeId", input.artifactTypeId);
        formData.append("title", input.title.trim());

        if (input.description)
            formData.append("description", input.description.trim());
        if (input.author) formData.append("author", input.author.trim());
        if (input.isMandatory !== undefined)
            formData.append("isMandatory", String(input.isMandatory));
        if (input.contentText)
            formData.append("contentText", input.contentText);
        if (input.fileCategory)
            formData.append("fileCategory", input.fileCategory);
        if (input.repositoryUrl)
            formData.append("repositoryUrl", input.repositoryUrl);
        if (input.repositoryVersion)
            formData.append("repositoryVersion", input.repositoryVersion);
        if (input.buildNumber)
            formData.append("buildNumber", input.buildNumber);
        if (input.file) formData.append("file", input.file);

        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("openuptool_token")
                : null;
        const response = await fetch(
            `${ENV.API_BASE_URL}/projects/${input.projectId}/artifacts`,
            {
                method: "POST",
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }

        return response.json();
    },

    async updateArtifact(
        projectId: string,
        id: string,
        changes: UpdateArtifactInput
    ): Promise<Artifact | undefined> {
        try {
            const formData = new FormData();

            if (changes.title) formData.append("title", changes.title.trim());
            if (changes.description)
                formData.append("description", changes.description.trim());
            if (changes.author)
                formData.append("author", changes.author.trim());
            if (changes.status) formData.append("status", changes.status);
            if (changes.isMandatory !== undefined)
                formData.append("isMandatory", String(changes.isMandatory));
            if (changes.contentText)
                formData.append("contentText", changes.contentText);
            if (changes.fileCategory)
                formData.append("fileCategory", changes.fileCategory);
            if (changes.repositoryUrl)
                formData.append("repositoryUrl", changes.repositoryUrl);
            if (changes.repositoryVersion)
                formData.append("repositoryVersion", changes.repositoryVersion);
            if (changes.buildNumber)
                formData.append("buildNumber", changes.buildNumber);
            if (changes.file) formData.append("file", changes.file);

            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("openuptool_token")
                    : null;
            const response = await fetch(
                `${ENV.API_BASE_URL}/projects/${projectId}/artifacts/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error("Error updating artifact:", error);
            return undefined;
        }
    },

    async downloadFile(projectId: string, artifactId: string): Promise<Blob> {
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("openuptool_token")
                : null;
        const response = await fetch(
            `${ENV.API_BASE_URL}/projects/${projectId}/artifacts/${artifactId}/file`,
            {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }

        return response.blob();
    },

    async getAllowedFormats(): Promise<any[]> {
        return httpClient<any[]>(`/projects/0/artifacts/allowed-formats`);
    },

    async linkRepository(
        projectId: string,
        artifactId: string,
        data: {
            repositoryUrl: string;
            repositoryVersion?: string;
            buildNumber?: string;
        }
    ): Promise<Artifact> {
        return httpClient<Artifact>(
            `/projects/${projectId}/artifacts/${artifactId}/link-repository`,
            {
                method: "POST",
                body: JSON.stringify(data),
            }
        );
    },

    async validatePhase(projectId: string, phaseId: string): Promise<any> {
        return httpClient<any>(
            `/projects/${projectId}/phases/${phaseId}/validate`
        );
    },

    async addTestCase(
        projectId: string,
        artifactId: string,
        testCase: {
            testId: string;
            title: string;
            description?: string;
            steps?: string[];
            expectedResult?: string;
            priority?: number;
        }
    ): Promise<Artifact> {
        return httpClient<Artifact>(
            `/projects/${projectId}/artifacts/${artifactId}/test-cases`,
            {
                method: "POST",
                body: JSON.stringify(testCase),
            }
        );
    },

    async addTestResult(
        projectId: string,
        artifactId: string,
        testResult: {
            testCaseId: string;
            result: "PASSED" | "FAILED" | "BLOCKED" | "SKIPPED";
            executedBy?: string;
            notes?: string;
            defects?: string[];
        }
    ): Promise<Artifact> {
        return httpClient<Artifact>(
            `/projects/${projectId}/artifacts/${artifactId}/test-results`,
            {
                method: "POST",
                body: JSON.stringify(testResult),
            }
        );
    },

    async addIterationActivity(
        projectId: string,
        artifactId: string,
        activity: {
            type: "MEETING" | "REVIEW" | "DEMO" | "RETROSPECTIVE" | "OTHER";
            description: string;
            participants?: string[];
            tags?: string[];
        }
    ): Promise<Artifact> {
        return httpClient<Artifact>(
            `/projects/${projectId}/artifacts/${artifactId}/iteration-activities`,
            {
                method: "POST",
                body: JSON.stringify(activity),
            }
        );
    },

    // Métodos para versionado de artefactos
    async createVersion(
        projectId: string,
        artifactId: string,
        input: CreateVersionInput
    ): Promise<ArtifactVersion> {
        const formData = new FormData();
        formData.append("changeDescription", input.changeDescription);
        if (input.uploadedBy) formData.append("uploadedBy", input.uploadedBy);
        if (input.file) formData.append("file", input.file);

        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("openuptool_token")
                : null;
        const response = await fetch(
            `${ENV.API_BASE_URL}/projects/${projectId}/artifacts/${artifactId}/versions`,
            {
                method: "POST",
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }

        return response.json();
    },

    async getVersionHistory(
        projectId: string,
        artifactId: string
    ): Promise<VersionHistory> {
        return httpClient<VersionHistory>(
            `/projects/${projectId}/artifacts/${artifactId}/versions`
        );
    },

    async getVersion(
        projectId: string,
        artifactId: string,
        versionId: string
    ): Promise<ArtifactVersion> {
        return httpClient<ArtifactVersion>(
            `/projects/${projectId}/artifacts/${artifactId}/versions/${versionId}`
        );
    },

    async compareVersions(
        projectId: string,
        artifactId: string,
        versionId1: string,
        versionId2: string
    ): Promise<VersionComparison> {
        return httpClient<VersionComparison>(
            `/projects/${projectId}/artifacts/${artifactId}/versions/compare?v1=${versionId1}&v2=${versionId2}`
        );
    },

    async downloadVersion(
        projectId: string,
        artifactId: string,
        versionId: string
    ): Promise<Blob> {
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("openuptool_token")
                : null;
        const response = await fetch(
            `${ENV.API_BASE_URL}/projects/${projectId}/artifacts/${artifactId}/versions/${versionId}/download`,
            {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }

        return response.blob();
    },
};
