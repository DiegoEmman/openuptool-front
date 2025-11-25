import type { Route } from './+types/home';
import { ProjectsListPage } from '~/pages/Projects/ProjectsListPage';
import { Navigate } from 'react-router';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'OpenUP – Sistema de Gestión de Proyectos' }];
}

export default function Home() {
    return <Navigate to="/projects" replace />;
}
