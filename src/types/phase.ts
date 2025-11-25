export type PhaseCode = 'INCEPTION' | 'ELABORATION' | 'CONSTRUCTION' | 'TRANSITION';
export type PhaseStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Phase {
    id: string;
    projectId: string;
    phaseCode: PhaseCode;
    name: string;
    startDate?: string; // ISO date
    endDate?: string; // ISO date
    actualStart?: string; // Fecha inicio real
    actualEnd?: string; // Fecha fin real
    status: PhaseStatus;
    orderIndex: number; // 1-4
}

export interface CreatePhaseInput {
    projectId: string;
    phaseCode: PhaseCode;
    name: string;
    orderIndex: number;
}

export interface UpdatePhaseInput {
    name?: string;
    startDate?: string;
    endDate?: string;
    actualStart?: string;
    actualEnd?: string;
    status?: PhaseStatus;
}
