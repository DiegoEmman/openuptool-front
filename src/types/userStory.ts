export interface UserStory {
    id: string;
    projectId: string;
    title: string;
    description?: string;
    acceptanceCriteria?: string;
    priority: "low" | "medium" | "high" | "critical";
    storyPoints?: number;
    status: "backlog" | "ready" | "in_progress" | "done" | "blocked";
    createdBy?: string;
    createdAt: string;
}

export interface CreateUserStory {
    projectId: string;
    title: string;
    description?: string;
    acceptanceCriteria?: string;
    priority: "low" | "medium" | "high" | "critical";
    storyPoints?: number;
}

export interface UpdateUserStory {
    title?: string;
    description?: string;
    acceptanceCriteria?: string;
    priority?: "low" | "medium" | "high" | "critical";
    storyPoints?: number;
    status?: "backlog" | "ready" | "in_progress" | "done" | "blocked";
}
