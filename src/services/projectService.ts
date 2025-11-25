import type { CreateProjectInput, Project } from "../types/project";
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
};
