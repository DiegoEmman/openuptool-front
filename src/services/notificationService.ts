import { apiClient } from "../services/api/apiClient";
import type { Notification } from "../types";

const BASE_PATH = "/notifications";

export const notificationService = {
    async getAll(isRead?: boolean): Promise<Notification[]> {
        const params = isRead !== undefined ? { isRead } : {};
        return await apiClient.get<Notification[]>(BASE_PATH, {
            params,
        });
    },

    async getUnreadCount(): Promise<number> {
        const response = await apiClient.get<{ count: number }>(
            `${BASE_PATH}/unread-count`
        );
        return response.count;
    },

    async markAsRead(id: string): Promise<void> {
        await apiClient.post(`${BASE_PATH}/${id}/read`);
    },

    async markAllAsRead(): Promise<void> {
        await apiClient.post(`${BASE_PATH}/read-all`);
    },
};
