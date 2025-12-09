import type {
    FinalBuild,
    CreateFinalBuildInput,
    UpdateFinalBuildInput,
    ProjectClosure,
    CreateProjectClosureInput,
    UpdateProjectClosureInput,
    ApproveClosureInput,
    ClosureValidation,
} from "../types/transition";
import { httpClient } from "./api/httpClient";

// ============= FINAL BUILD SERVICE =============

export const finalBuildService = {
    async list(): Promise<FinalBuild[]> {
        return httpClient<FinalBuild[]>("/finalbuilds");
    },

    async getByProject(projectId: string): Promise<FinalBuild[]> {
        return httpClient<FinalBuild[]>(`/finalbuilds/project/${projectId}`);
    },

    async getById(id: string): Promise<FinalBuild | undefined> {
        try {
            return await httpClient<FinalBuild>(`/finalbuilds/${id}`);
        } catch (error) {
            console.error("Error fetching final build:", error);
            return undefined;
        }
    },

    async getByNumber(
        projectId: string,
        buildNumber: string
    ): Promise<FinalBuild | undefined> {
        try {
            return await httpClient<FinalBuild>(
                `/finalbuilds/project/${projectId}/number/${buildNumber}`
            );
        } catch (error) {
            console.error("Error fetching final build by number:", error);
            return undefined;
        }
    },

    async create(input: CreateFinalBuildInput): Promise<FinalBuild> {
        return httpClient<FinalBuild>("/finalbuilds", {
            method: "POST",
            body: JSON.stringify(input),
        });
    },

    async update(
        id: string,
        input: UpdateFinalBuildInput
    ): Promise<FinalBuild | undefined> {
        try {
            return await httpClient<FinalBuild>(`/finalbuilds/${id}`, {
                method: "PUT",
                body: JSON.stringify(input),
            });
        } catch (error) {
            console.error("Error updating final build:", error);
            return undefined;
        }
    },

    async delete(id: string): Promise<boolean> {
        try {
            await httpClient<void>(`/finalbuilds/${id}`, {
                method: "DELETE",
            });
            return true;
        } catch (error) {
            console.error("Error deleting final build:", error);
            return false;
        }
    },
};

// ============= PROJECT CLOSURE SERVICE =============

export const projectClosureService = {
    async list(): Promise<ProjectClosure[]> {
        return httpClient<ProjectClosure[]>("/projectclosures");
    },

    async getByProject(projectId: string): Promise<ProjectClosure | undefined> {
        try {
            return await httpClient<ProjectClosure>(
                `/projectclosures/project/${projectId}`
            );
        } catch (error) {
            console.error("Error fetching project closure:", error);
            return undefined;
        }
    },

    async getById(id: string): Promise<ProjectClosure | undefined> {
        try {
            return await httpClient<ProjectClosure>(`/projectclosures/${id}`);
        } catch (error) {
            console.error("Error fetching project closure:", error);
            return undefined;
        }
    },

    async validate(projectId: string): Promise<ClosureValidation> {
        return httpClient<ClosureValidation>(
            `/projectclosures/validate/${projectId}`
        );
    },

    async create(input: CreateProjectClosureInput): Promise<ProjectClosure> {
        return httpClient<ProjectClosure>("/projectclosures", {
            method: "POST",
            body: JSON.stringify(input),
        });
    },

    async update(
        id: string,
        input: UpdateProjectClosureInput
    ): Promise<ProjectClosure | undefined> {
        try {
            return await httpClient<ProjectClosure>(`/projectclosures/${id}`, {
                method: "PUT",
                body: JSON.stringify(input),
            });
        } catch (error) {
            console.error("Error updating project closure:", error);
            return undefined;
        }
    },

    async approve(
        id: string,
        input: ApproveClosureInput
    ): Promise<ProjectClosure | undefined> {
        try {
            return await httpClient<ProjectClosure>(
                `/projectclosures/${id}/approve`,
                {
                    method: "POST",
                    body: JSON.stringify(input),
                }
            );
        } catch (error) {
            console.error("Error approving project closure:", error);
            return undefined;
        }
    },

    async delete(id: string): Promise<boolean> {
        try {
            await httpClient<void>(`/projectclosures/${id}`, {
                method: "DELETE",
            });
            return true;
        } catch (error) {
            console.error("Error deleting project closure:", error);
            return false;
        }
    },
};
