import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ProjectsListPage } from "../pages/Projects/ProjectsListPage";
import { NewProjectPage } from "../pages/Projects/NewProjectPage";
import { ProjectDetailPage } from "../pages/Projects/ProjectDetailPage";
import { ElaborationPhasePage } from "../pages/Elaboration/ElaborationPhasePage";
import { LoginPage } from "../pages/Login";
import { ProtectedRoute } from "../components/common/ProtectedRoute";

const router = createBrowserRouter([
    { path: "/login", element: <LoginPage /> },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <ProjectsListPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/projects",
        element: (
            <ProtectedRoute>
                <ProjectsListPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/projects/new",
        element: (
            <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
                <NewProjectPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/projects/:id",
        element: (
            <ProtectedRoute>
                <ProjectDetailPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/projects/:projectId/elaboration",
        element: (
            <ProtectedRoute>
                <ElaborationPhasePage />
            </ProtectedRoute>
        ),
    },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
