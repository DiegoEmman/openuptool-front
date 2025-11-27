import { apiClient } from "../services/api/apiClient";
import type { ProjectInvitation, CreateInvitation } from "../types";

const BASE_PATH = "/invitations";

export const invitationService = {
    async getMyPending(): Promise<ProjectInvitation[]> {
        return await apiClient.get<ProjectInvitation[]>(
            `${BASE_PATH}/my-invitations`
        );
    },

    async getByProject(projectId: string): Promise<ProjectInvitation[]> {
        return await apiClient.get<ProjectInvitation[]>(
            `${BASE_PATH}/project/${projectId}`
        );
    },

    async create(data: CreateInvitation): Promise<ProjectInvitation> {
        return await apiClient.post<ProjectInvitation>(BASE_PATH, data);
    },

    async accept(token: string): Promise<void> {
        await apiClient.post(`${BASE_PATH}/accept/${token}`);
    },

    async reject(token: string): Promise<void> {
        await apiClient.post(`${BASE_PATH}/reject/${token}`);
    },

    async cancel(invitationId: string): Promise<void> {
        await apiClient.delete(`${BASE_PATH}/${invitationId}`);
    },
};
