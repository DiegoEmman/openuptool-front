import type { Route } from "./+types/projects.$id";
import { ProjectDetailPage } from "~/pages/Projects/ProjectDetailPage";

export function meta({ params }: Route.MetaArgs) {
    return [{ title: `OpenUP – Proyecto ${params.id}` }];
}

export default function ProjectDetail({ params }: Route.ComponentProps) {
    return <ProjectDetailPage projectId={params.id} />;
}
