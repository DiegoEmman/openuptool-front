import { httpClient } from "./api/httpClient";
import type {
    IterationProgress,
    CreateIterationProgressInput,
    UpdateIterationProgressInput,
    IterationSummary,
    BurndownData,
} from "../types/iterationProgress";

export const iterationProgressService = {
    async getProgressByIteration(
        iterationId: string
    ): Promise<IterationProgress[]> {
        return httpClient<IterationProgress[]>(
            `/iterations/${iterationId}/progress`
        );
    },

    async getLatestProgress(
        iterationId: string
    ): Promise<IterationProgress | null> {
        try {
            return await httpClient<IterationProgress>(
                `/iterations/${iterationId}/progress/latest`
            );
        } catch {
            return null;
        }
    },

    async getSummary(iterationId: string): Promise<IterationSummary> {
        return httpClient<IterationSummary>(
            `/iterations/${iterationId}/progress/summary`
        );
    },

    async getBurndownData(iterationId: string): Promise<BurndownData> {
        return httpClient<BurndownData>(
            `/iterations/${iterationId}/progress/burndown`
        );
    },

    async createProgressRecord(
        iterationId: string,
        input: CreateIterationProgressInput
    ): Promise<IterationProgress> {
        return httpClient<IterationProgress>(
            `/iterations/${iterationId}/progress`,
            {
                method: "POST",
                body: JSON.stringify(input),
            }
        );
    },

    async updateProgressRecord(
        iterationId: string,
        progressId: string,
        changes: UpdateIterationProgressInput
    ): Promise<IterationProgress> {
        return httpClient<IterationProgress>(
            `/iterations/${iterationId}/progress/${progressId}`,
            {
                method: "PUT",
                body: JSON.stringify(changes),
            }
        );
    },
};
