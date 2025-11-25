import type { CreateInitialPlanInput, ProjectPlan } from "../types/plan";
import { httpClient } from "./api/httpClient";

export const planService = {
    async getPlanByProject(
        projectId: string
    ): Promise<ProjectPlan | undefined> {
        try {
            return await httpClient<ProjectPlan>(`/projects/${projectId}/plan`);
        } catch (error) {
            console.error("Error fetching plan:", error);
            return undefined;
        }
    },

    async createInitialPlan(
        projectId: string,
        input: CreateInitialPlanInput
    ): Promise<ProjectPlan> {
        return httpClient<ProjectPlan>(`/projects/${projectId}/plan`, {
            method: "POST",
            body: JSON.stringify({
                objectives: input.objectives.trim(),
                scope: input.scope.trim(),
                initialSchedule: input.initialSchedule,
                milestones: input.milestones,
                observations: input.observations?.trim(),
            }),
        });
    },
};
