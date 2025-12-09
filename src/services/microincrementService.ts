import type {
    Microincrement,
    CreateMicroincrementInput,
    UpdateMicroincrementInput,
    MicroincrementFilters,
} from "../types/microincrement";
import { httpClient } from "./api/httpClient";

export const microincrementService = {
    async list(): Promise<Microincrement[]> {
        return httpClient<Microincrement[]>("/microincrements");
    },

    async getFiltered(
        filters: MicroincrementFilters
    ): Promise<Microincrement[]> {
        const params = new URLSearchParams();
        if (filters.iterationId)
            params.append("iterationId", filters.iterationId);
        if (filters.artifactId) params.append("artifactId", filters.artifactId);
        if (filters.author) params.append("author", filters.author);
        if (filters.type) params.append("type", filters.type);

        const query = params.toString();
        return httpClient<Microincrement[]>(
            `/microincrements/filter${query ? `?${query}` : ""}`
        );
    },

    async getByIteration(iterationId: string): Promise<Microincrement[]> {
        return httpClient<Microincrement[]>(
            `/microincrements/iteration/${iterationId}`
        );
    },

    async getByArtifact(artifactId: string): Promise<Microincrement[]> {
        return httpClient<Microincrement[]>(
            `/microincrements/artifact/${artifactId}`
        );
    },

    async getByAuthor(author: string): Promise<Microincrement[]> {
        return httpClient<Microincrement[]>(
            `/microincrements/author/${encodeURIComponent(author)}`
        );
    },

    async getByType(type: "tecnico" | "funcional"): Promise<Microincrement[]> {
        return httpClient<Microincrement[]>(`/microincrements/type/${type}`);
    },

    async getById(id: string): Promise<Microincrement | undefined> {
        try {
            return await httpClient<Microincrement>(`/microincrements/${id}`);
        } catch (error) {
            console.error("Error fetching microincrement:", error);
            return undefined;
        }
    },

    async create(input: CreateMicroincrementInput): Promise<Microincrement> {
        return httpClient<Microincrement>("/microincrements", {
            method: "POST",
            body: JSON.stringify(input),
        });
    },

    async update(
        id: string,
        input: UpdateMicroincrementInput
    ): Promise<Microincrement | undefined> {
        try {
            return await httpClient<Microincrement>(`/microincrements/${id}`, {
                method: "PUT",
                body: JSON.stringify(input),
            });
        } catch (error) {
            console.error("Error updating microincrement:", error);
            return undefined;
        }
    },

    async delete(id: string): Promise<boolean> {
        try {
            await httpClient<void>(`/microincrements/${id}`, {
                method: "DELETE",
            });
            return true;
        } catch (error) {
            console.error("Error deleting microincrement:", error);
            return false;
        }
    },
};
