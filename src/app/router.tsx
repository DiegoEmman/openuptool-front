import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { ProjectsListPage } from '../pages/Projects/ProjectsListPage';
import { NewProjectPage } from '../pages/Projects/NewProjectPage';
import { ProjectDetailPage } from '../pages/Projects/ProjectDetailPage';

const router = createBrowserRouter([
    { path: '/', element: <ProjectsListPage /> },
    { path: '/projects', element: <ProjectsListPage /> },
    { path: '/projects/new', element: <NewProjectPage /> },
    { path: '/projects/:id', element: <ProjectDetailPage /> },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
