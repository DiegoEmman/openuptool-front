import { nanoid } from 'nanoid';
import type { CreateIterationInput, Iteration } from '../types/iteration';

const iterations: Iteration[] = [];

export const iterationService = {
    getIterations(projectId: string): Iteration[] {
        return iterations.filter((i) => i.projectId === projectId);
    },
    createIteration(projectId: string, input: CreateIterationInput): Iteration {
        const iteration: Iteration = {
            id: nanoid(),
            projectId,
            name: input.name.trim(),
            objective: input.objective?.trim(),
            phase: input.phase,
            startDate: input.startDate,
            endDate: input.endDate,
            status: 'Planeada',
        };
        iterations.push(iteration);
        return iteration;
    },
    updateStatus(id: string, status: Iteration['status']): Iteration | undefined {
        const idx = iterations.findIndex((i) => i.id === id);
        if (idx === -1) return undefined;
        iterations[idx] = { ...iterations[idx], status };
        return iterations[idx];
    },
};

// TODO: Persistir en backend.
