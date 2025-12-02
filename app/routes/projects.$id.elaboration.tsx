import type { Route } from "./+types/projects.$id.elaboration";
import { ElaborationPhasePage } from "~/pages/Elaboration/ElaborationPhasePage";
import { useParams } from "react-router";

export function meta({ params }: Route.MetaArgs) {
    return [{ title: `OpenUP – Elaboración – Proyecto ${params.id}` }];
}

export default function ProjectElaboration() {
    return <ElaborationPhasePage />;
}
