import { httpClient } from "./api/httpClient";
import type {
    IterationTask,
    CreateIterationTaskInput,
    UpdateIterationTaskInput,
} from "../types/iterationProgress";

export const iterationTaskService = {
    async getTasksByIteration(iterationId: string): Promise<IterationTask[]> {
        return httpClient<IterationTask[]>(`/iterations/${iterationId}/tasks`);
    },

    async createTask(
        iterationId: string,
        input: CreateIterationTaskInput
    ): Promise<IterationTask> {
        return httpClient<IterationTask>(`/iterations/${iterationId}/tasks`, {
            method: "POST",
            body: JSON.stringify(input),
        });
    },

    async updateTask(
        iterationId: string,
        taskId: string,
        changes: UpdateIterationTaskInput
    ): Promise<IterationTask> {
        return httpClient<IterationTask>(
            `/iterations/${iterationId}/tasks/${taskId}`,
            {
                method: "PUT",
                body: JSON.stringify(changes),
            }
        );
    },

    async deleteTask(iterationId: string, taskId: string): Promise<void> {
        return httpClient<void>(`/iterations/${iterationId}/tasks/${taskId}`, {
            method: "DELETE",
        });
    },
};
