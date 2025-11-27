export interface IterationScope {
    id: string;
    iterationId: string;
    itemType: "story" | "artifact";
    itemId: string;
    itemTitle?: string;
    description?: string;
    estimatedHours?: number;
    status: "pending" | "in_progress" | "completed" | "blocked";
    assignedTo?: string;
    assignedToName?: string;
    createdAt: string;
}

export interface AddToScope {
    iterationId: string;
    itemType: "story" | "artifact";
    itemId: string;
    description?: string;
    estimatedHours?: number;
    assignedTo?: string;
}

export interface UpdateScopeItem {
    description?: string;
    estimatedHours?: number;
    status?: "pending" | "in_progress" | "completed" | "blocked";
    assignedTo?: string;
}
