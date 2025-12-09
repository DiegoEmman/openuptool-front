import type {
    Workflow,
    CreateWorkflowInput,
    UpdateWorkflowInput,
    WorkflowState,
    CreateWorkflowStateInput,
    UpdateWorkflowStateInput,
    WorkflowStateResponsible,
    CreateWorkflowStateResponsibleInput,
    ArtifactStateHistory,
    ChangeArtifactStateInput,
    ArtifactWithWorkflow,
    WorkflowPermission,
    CreateWorkflowPermissionInput,
    UpdateWorkflowPermissionInput,
    WorkflowPermissionMatrix,
    CheckPermissionResult,
} from "../types/workflow";
import { httpClient } from "./api/httpClient";

// ============= WORKFLOW SERVICE =============

export const workflowService = {
    async list(): Promise<Workflow[]> {
        return httpClient<Workflow[]>("/workflows");
    },

    async getByProject(projectId: string): Promise<Workflow[]> {
        return httpClient<Workflow[]>(`/workflows/project/${projectId}`);
    },

    async getById(id: string): Promise<Workflow | undefined> {
        try {
            return await httpClient<Workflow>(`/workflows/${id}`);
        } catch (error) {
            console.error("Error fetching workflow:", error);
            return undefined;
        }
    },

    async create(input: CreateWorkflowInput): Promise<Workflow> {
        return httpClient<Workflow>("/workflows", {
            method: "POST",
            body: JSON.stringify(input),
        });
    },

    async update(
        id: string,
        input: UpdateWorkflowInput
    ): Promise<Workflow | undefined> {
        try {
            return await httpClient<Workflow>(`/workflows/${id}`, {
                method: "PUT",
                body: JSON.stringify(input),
            });
        } catch (error) {
            console.error("Error updating workflow:", error);
            return undefined;
        }
    },

    async delete(id: string): Promise<boolean> {
        try {
            await httpClient<void>(`/workflows/${id}`, {
                method: "DELETE",
            });
            return true;
        } catch (error) {
            console.error("Error deleting workflow:", error);
            return false;
        }
    },
};

// ============= WORKFLOW STATE SERVICE =============

export const workflowStateService = {
    async getByWorkflow(workflowId: string): Promise<WorkflowState[]> {
        console.log(
            "🔍 [workflowStateService] Calling getByWorkflow with ID:",
            workflowId
        );
        const result = await httpClient<WorkflowState[]>(
            `/workflows/${workflowId}/states`
        );
        console.log("🔍 [workflowStateService] Result:", result);
        return result;
    },

    async getById(stateId: string): Promise<WorkflowState | undefined> {
        try {
            return await httpClient<WorkflowState>(
                `/workflows/states/${stateId}`
            );
        } catch (error) {
            console.error("Error fetching state:", error);
            return undefined;
        }
    },

    async create(input: CreateWorkflowStateInput): Promise<WorkflowState> {
        return httpClient<WorkflowState>("/workflows/states", {
            method: "POST",
            body: JSON.stringify(input),
        });
    },

    async update(
        stateId: string,
        input: UpdateWorkflowStateInput
    ): Promise<WorkflowState | undefined> {
        try {
            return await httpClient<WorkflowState>(
                `/workflows/states/${stateId}`,
                {
                    method: "PUT",
                    body: JSON.stringify(input),
                }
            );
        } catch (error) {
            console.error("Error updating state:", error);
            return undefined;
        }
    },

    async delete(stateId: string): Promise<boolean> {
        try {
            await httpClient<void>(`/workflows/states/${stateId}`, {
                method: "DELETE",
            });
            return true;
        } catch (error) {
            console.error("Error deleting state:", error);
            return false;
        }
    },

    async addResponsible(
        input: CreateWorkflowStateResponsibleInput
    ): Promise<WorkflowStateResponsible> {
        return httpClient<WorkflowStateResponsible>(
            "/workflows/states/responsibles",
            {
                method: "POST",
                body: JSON.stringify(input),
            }
        );
    },

    async removeResponsible(responsibleId: string): Promise<boolean> {
        try {
            await httpClient<void>(
                `/workflows/states/responsibles/${responsibleId}`,
                {
                    method: "DELETE",
                }
            );
            return true;
        } catch (error) {
            console.error("Error removing responsible:", error);
            return false;
        }
    },
};

// ============= ARTIFACT STATE SERVICE =============

export const artifactStateService = {
    async getArtifactWithWorkflow(
        artifactId: string
    ): Promise<ArtifactWithWorkflow | undefined> {
        try {
            return await httpClient<ArtifactWithWorkflow>(
                `/workflows/artifacts/${artifactId}/workflow`
            );
        } catch (error) {
            console.error("Error fetching artifact workflow:", error);
            return undefined;
        }
    },

    async getHistory(artifactId: string): Promise<ArtifactStateHistory[]> {
        try {
            return await httpClient<ArtifactStateHistory[]>(
                `/workflows/artifacts/${artifactId}/history`
            );
        } catch (error) {
            console.error("Error fetching history:", error);
            return [];
        }
    },

    async changeState(
        input: ChangeArtifactStateInput
    ): Promise<ArtifactStateHistory> {
        return httpClient<ArtifactStateHistory>(
            "/workflows/artifacts/change-state",
            {
                method: "POST",
                body: JSON.stringify(input),
            }
        );
    },

    async assignWorkflow(
        artifactId: string,
        workflowId: string
    ): Promise<boolean> {
        try {
            await httpClient<void>(
                `/workflows/artifacts/${artifactId}/assign-workflow/${workflowId}`,
                {
                    method: "POST",
                }
            );
            return true;
        } catch (error) {
            console.error("Error assigning workflow:", error);
            return false;
        }
    },
};

// ============= WORKFLOW PERMISSION SERVICE (HU-013) =============

export const workflowPermissionService = {
    async getMatrix(workflowId: string): Promise<WorkflowPermissionMatrix> {
        return httpClient<WorkflowPermissionMatrix>(
            `/workflows/${workflowId}/permissions/matrix`
        );
    },

    async getByWorkflow(workflowId: string): Promise<WorkflowPermission[]> {
        return httpClient<WorkflowPermission[]>(
            `/workflows/${workflowId}/permissions`
        );
    },

    async checkPermission(
        workflowId: string,
        role: string,
        action: string
    ): Promise<CheckPermissionResult> {
        return httpClient<CheckPermissionResult>(
            `/workflows/${workflowId}/permissions/check?role=${role}&action=${action}`
        );
    },

    async create(
        input: CreateWorkflowPermissionInput
    ): Promise<WorkflowPermission> {
        return httpClient<WorkflowPermission>("/workflows/permissions", {
            method: "POST",
            body: JSON.stringify(input),
        });
    },

    async update(
        permissionId: string,
        input: UpdateWorkflowPermissionInput
    ): Promise<WorkflowPermission | undefined> {
        try {
            return await httpClient<WorkflowPermission>(
                `/workflows/permissions/${permissionId}`,
                {
                    method: "PUT",
                    body: JSON.stringify(input),
                }
            );
        } catch (error) {
            console.error("Error updating permission:", error);
            return undefined;
        }
    },

    async delete(permissionId: string): Promise<boolean> {
        try {
            await httpClient<void>(`/workflows/permissions/${permissionId}`, {
                method: "DELETE",
            });
            return true;
        } catch (error) {
            console.error("Error deleting permission:", error);
            return false;
        }
    },
};
