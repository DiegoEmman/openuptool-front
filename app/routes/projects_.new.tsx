import type { Route } from './+types/projects_.new';
import { NewProjectPage } from '~/pages/Projects/NewProjectPage';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'OpenUP – Nuevo Proyecto' }];
}

export default function NewProject() {
    return <NewProjectPage />;
}
