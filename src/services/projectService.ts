import type { AuditLog, CreateProjectInput, Project } from "../types/project";
import { httpClient } from "./api/httpClient";

export const projectService = {
    async list(): Promise<Project[]> {
        return httpClient<Project[]>("/projects");
    },

    async get(id: string): Promise<Project | undefined> {
        try {
            return await httpClient<Project>(`/projects/${id}`);
        } catch (error) {
            console.error("Error fetching project:", error);
            return undefined;
        }
    },

    async createProject(input: CreateProjectInput): Promise<Project> {
        return httpClient<Project>("/projects", {
            method: "POST",
            body: JSON.stringify({
                name: input.name.trim(),
                identifier: input.identifier.trim(),
                startDate: input.startDate,
                owner: input.owner?.trim(),
                description: input.description?.trim(),
                tags: input.tags || [],
            }),
        });
    },

    async update(
        id: string,
        changes: Partial<Project>
    ): Promise<Project | undefined> {
        try {
            return await httpClient<Project>(`/projects/${id}`, {
                method: "PATCH",
                body: JSON.stringify(changes),
            });
        } catch (error) {
            console.error("Error updating project:", error);
            return undefined;
        }
    },

    async archive(id: string): Promise<Project> {
        return httpClient<Project>(`/projects/${id}/archive`, {
            method: "POST",
        });
    },

    async unarchive(id: string): Promise<Project> {
        return httpClient<Project>(`/projects/${id}/unarchive`, {
            method: "POST",
        });
    },

    async getArchivedProjects(): Promise<Project[]> {
        return httpClient<Project[]>("/projects/archived");
    },

    async deletePermanently(id: string): Promise<void> {
        return httpClient<void>(`/projects/${id}/permanent?confirm=true`, {
            method: "DELETE",
        });
    },

    async getAuditLogs(id: string): Promise<AuditLog[]> {
        return httpClient<AuditLog[]>(`/projects/${id}/audit-logs`);
    },
};
