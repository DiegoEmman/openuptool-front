import type { Route } from "./+types/projects.$id.testing";
import { TestingPage } from "~/pages/Testing/TestingPage";

export function meta({ params }: Route.MetaArgs) {
    return [{ title: `OpenUP – Testing – Proyecto ${params.id}` }];
}

export default function Testing({ params }: Route.ComponentProps) {
    return <TestingPage projectId={params.id} />;
}
