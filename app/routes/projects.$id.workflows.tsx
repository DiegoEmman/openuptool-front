import type { Route } from "./+types/projects.$id.workflows";
import { WorkflowsPage } from "~/pages/Workflows/WorkflowsPage";

export function meta({ params }: Route.MetaArgs) {
    return [{ title: `OpenUP – Flujos de Trabajo – Proyecto ${params.id}` }];
}

export default function Workflows({ params }: Route.ComponentProps) {
    return <WorkflowsPage projectId={params.id} />;
}
