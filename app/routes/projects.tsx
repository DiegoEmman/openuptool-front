import type { Route } from './+types/projects';
import { ProjectsListPage } from '~/pages/Projects/ProjectsListPage';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'OpenUP – Proyectos' }];
}

export default function Projects() {
    return <ProjectsListPage />;
}
