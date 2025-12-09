import type {
    CreateIterationInput,
    Iteration,
    UpdateIterationCapacityInput,
    UpdateIterationVelocityInput,
    ProjectVelocityStats,
} from "../types/iteration";
import { httpClient } from "./api/httpClient";

export const iterationService = {
    async getIterations(projectId: string): Promise<Iteration[]> {
        return httpClient<Iteration[]>(`/projects/${projectId}/iterations`);
    },

    async createIteration(
        projectId: string,
        input: CreateIterationInput
    ): Promise<Iteration> {
        return httpClient<Iteration>(`/projects/${projectId}/iterations`, {
            method: "POST",
            body: JSON.stringify({
                name: input.name.trim(),
                objective: input.objective?.trim(),
                phase: input.phase,
                startDate: input.startDate,
                endDate: input.endDate,
                plannedCapacityHours: input.plannedCapacityHours,
                teamSize: input.teamSize,
                plannedPoints: input.plannedPoints,
            }),
        });
    },

    async updateStatus(
        projectId: string,
        id: string,
        status: Iteration["status"]
    ): Promise<Iteration | undefined> {
        try {
            return await httpClient<Iteration>(
                `/projects/${projectId}/iterations/${id}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ status }),
                }
            );
        } catch (error) {
            console.error("Error updating iteration status:", error);
            return undefined;
        }
    },

    // HU-016: Capacidad y velocidad
    async updateCapacity(
        projectId: string,
        iterationId: string,
        input: UpdateIterationCapacityInput
    ): Promise<Iteration> {
        return httpClient<Iteration>(
            `/projects/${projectId}/iterations/${iterationId}/capacity`,
            {
                method: "PATCH",
                body: JSON.stringify(input),
            }
        );
    },

    async updateVelocity(
        projectId: string,
        iterationId: string,
        input: UpdateIterationVelocityInput
    ): Promise<Iteration> {
        return httpClient<Iteration>(
            `/projects/${projectId}/iterations/${iterationId}/velocity`,
            {
                method: "PATCH",
                body: JSON.stringify(input),
            }
        );
    },

    async getVelocityStats(projectId: string): Promise<ProjectVelocityStats> {
        return httpClient<ProjectVelocityStats>(
            `/projects/${projectId}/iterations/velocity-stats`
        );
    },
};
