import { apiClient } from "../services/api/apiClient";
import type { UserStory, CreateUserStory, UpdateUserStory } from "../types";

const BASE_PATH = "/projects";

export const userStoryService = {
    async getAll(projectId: string): Promise<UserStory[]> {
        return await apiClient.get<UserStory[]>(
            `${BASE_PATH}/${projectId}/stories`
        );
    },

    async getBacklog(projectId: string): Promise<UserStory[]> {
        return await apiClient.get<UserStory[]>(
            `${BASE_PATH}/${projectId}/stories/backlog`
        );
    },

    async getById(projectId: string, id: string): Promise<UserStory> {
        return await apiClient.get<UserStory>(
            `${BASE_PATH}/${projectId}/stories/${id}`
        );
    },

    async create(projectId: string, data: CreateUserStory): Promise<UserStory> {
        return await apiClient.post<UserStory>(
            `${BASE_PATH}/${projectId}/stories`,
            data
        );
    },

    async update(
        projectId: string,
        id: string,
        data: UpdateUserStory
    ): Promise<UserStory> {
        return await apiClient.put<UserStory>(
            `${BASE_PATH}/${projectId}/stories/${id}`,
            data
        );
    },

    async delete(projectId: string, id: string): Promise<void> {
        await apiClient.delete(`${BASE_PATH}/${projectId}/stories/${id}`);
    },
};
