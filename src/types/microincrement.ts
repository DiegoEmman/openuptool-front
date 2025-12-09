export interface Microincrement {
    id: string;
    title: string;
    description?: string;
    date: string;
    author: string;
    type: "tecnico" | "funcional";
    evidenceUrl?: string;
    evidenceFilePath?: string;
    iterationId?: string;
    iterationName?: string;
    artifactId: string;
    artifactTitle: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMicroincrementInput {
    title: string;
    description?: string;
    date: string;
    author: string;
    type: "tecnico" | "funcional";
    evidenceUrl?: string;
    iterationId?: string;
    artifactId: string;
}

export interface UpdateMicroincrementInput {
    title?: string;
    description?: string;
    date?: string;
    author?: string;
    type?: "tecnico" | "funcional";
    evidenceUrl?: string;
    iterationId?: string;
    artifactId?: string;
}

export interface MicroincrementFilters {
    iterationId?: string;
    artifactId?: string;
    author?: string;
    type?: "tecnico" | "funcional";
}
