import type { Route } from "./+types/projects.$id.elaboration";
import { ElaborationPhasePage } from "~/pages/Elaboration/ElaborationPhasePage";

export function meta({ params }: Route.MetaArgs) {
    return [{ title: `OpenUP – Elaboración – Proyecto ${params.id}` }];
}

export default function ProjectElaboration({ params }: Route.ComponentProps) {
    return <ElaborationPhasePage projectId={params.id} />;
}
