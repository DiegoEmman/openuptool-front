import type { Route } from "./+types/projects.$id.construction";
import { ConstructionPhasePage } from "~/pages/Construction/ConstructionPhasePage";

export function meta({ params }: Route.MetaArgs) {
    return [{ title: `OpenUP – Construcción – Proyecto ${params.id}` }];
}

export default function ProjectConstruction({ params }: Route.ComponentProps) {
    return <ConstructionPhasePage projectId={params.id} />;
}
