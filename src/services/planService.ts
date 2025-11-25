import { nanoid } from 'nanoid';
import type { CreateInitialPlanInput, ProjectPlan } from '../types/plan';
import { projectService } from './projectService';

const plans: ProjectPlan[] = [];

export const planService = {
    getPlanByProject(projectId: string): ProjectPlan | undefined {
        return plans.find((p) => p.projectId === projectId);
    },
    createInitialPlan(projectId: string, input: CreateInitialPlanInput): ProjectPlan {
        const existing = this.getPlanByProject(projectId);
        if (existing) {
            throw new Error('Plan inicial ya existe para el proyecto');
        }
        const plan: ProjectPlan = {
            id: nanoid(),
            projectId,
            objectives: input.objectives.trim(),
            scope: input.scope.trim(),
            initialSchedule: input.initialSchedule,
            milestones: input.milestones.map((m) => ({ id: nanoid(), ...m })),
            createdAt: new Date().toISOString(),
            version: 1,
            observations: input.observations?.trim(),
        };
        plans.push(plan);
        // Asociar plan al proyecto
        projectService.update(projectId, { planId: plan.id });
        return plan;
    },
};

// TODO: Persistir en backend; actualmente en memoria.
