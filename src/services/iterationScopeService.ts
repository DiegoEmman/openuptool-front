import { apiClient } from "../services/api/apiClient";
import type { IterationScope, AddToScope, UpdateScopeItem } from "../types";

const BASE_PATH = "/iterations";

export const iterationScopeService = {
    async getByIteration(iterationId: string): Promise<IterationScope[]> {
        return await apiClient.get<IterationScope[]>(
            `${BASE_PATH}/${iterationId}/scope`
        );
    },

    async addToScope(data: AddToScope): Promise<IterationScope> {
        return await apiClient.post<IterationScope>(
            `${BASE_PATH}/${data.iterationId}/scope`,
            data
        );
    },

    async update(
        iterationId: string,
        id: string,
        data: UpdateScopeItem
    ): Promise<IterationScope> {
        return await apiClient.put<IterationScope>(
            `${BASE_PATH}/${iterationId}/scope/${id}`,
            data
        );
    },

    async removeFromScope(iterationId: string, id: string): Promise<void> {
        await apiClient.delete(`${BASE_PATH}/${iterationId}/scope/${id}`);
    },
};
