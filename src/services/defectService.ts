import { httpClient } from "./api/httpClient";
import type {
    Defect,
    CreateDefectInput,
    UpdateDefectInput,
    DefectSummary,
} from "../types/defect";

export const defectService = {
    async getByProject(projectId: string): Promise<Defect[]> {
        return httpClient<Defect[]>(`/defects/project/${projectId}`);
    },

    async getByStatus(projectId: string, status: string): Promise<Defect[]> {
        return httpClient<Defect[]>(
            `/defects/project/${projectId}/status/${status}`
        );
    },

    async getByArtifact(artifactId: string): Promise<Defect[]> {
        return httpClient<Defect[]>(`/defects/artifact/${artifactId}`);
    },

    async getByTestExecution(testExecutionId: string): Promise<Defect[]> {
        return httpClient<Defect[]>(
            `/defects/test-execution/${testExecutionId}`
        );
    },

    async getByAssignee(assigneeId: string): Promise<Defect[]> {
        return httpClient<Defect[]>(`/defects/assignee/${assigneeId}`);
    },

    async getById(id: string): Promise<Defect> {
        return httpClient<Defect>(`/defects/${id}`);
    },

    async getByNumber(
        projectId: string,
        defectNumber: string
    ): Promise<Defect> {
        return httpClient<Defect>(
            `/defects/project/${projectId}/number/${defectNumber}`
        );
    },

    async getSummary(projectId: string): Promise<DefectSummary> {
        return httpClient<DefectSummary>(
            `/defects/project/${projectId}/summary`
        );
    },

    async create(input: CreateDefectInput): Promise<Defect> {
        return httpClient<Defect>("/defects", {
            method: "POST",
            body: JSON.stringify(input),
        });
    },

    async update(id: string, changes: UpdateDefectInput): Promise<Defect> {
        return httpClient<Defect>(`/defects/${id}`, {
            method: "PUT",
            body: JSON.stringify(changes),
        });
    },

    async assign(id: string, assigneeId: string): Promise<Defect> {
        return httpClient<Defect>(`/defects/${id}/assign/${assigneeId}`, {
            method: "PUT",
        });
    },

    async updateStatus(id: string, status: string): Promise<Defect> {
        return httpClient<Defect>(`/defects/${id}/status/${status}`, {
            method: "PUT",
        });
    },

    async resolve(id: string, resolution: string): Promise<Defect> {
        return httpClient<Defect>(`/defects/${id}/resolve`, {
            method: "PUT",
            body: JSON.stringify({ resolution }),
        });
    },

    async close(id: string): Promise<Defect> {
        return httpClient<Defect>(`/defects/${id}/close`, {
            method: "PUT",
        });
    },

    async reopen(id: string): Promise<Defect> {
        return httpClient<Defect>(`/defects/${id}/reopen`, {
            method: "PUT",
        });
    },

    async delete(id: string): Promise<void> {
        return httpClient<void>(`/defects/${id}`, {
            method: "DELETE",
        });
    },
};
