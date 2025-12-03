import type { Route } from "./+types/projects.$id.iterations.$iterationId";
import { IterationTrackingPage } from "~/pages/Iterations/IterationTrackingPage";

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: `OpenUP – Seguimiento de Iteración – ${params.iterationId}` },
    ];
}

export default function IterationTracking({ params }: Route.ComponentProps) {
    return (
        <IterationTrackingPage
            projectId={params.id}
            iterationId={params.iterationId}
        />
    );
}
