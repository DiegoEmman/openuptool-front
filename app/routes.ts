import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("configuration", "routes/configuration.tsx"),
    route("configuration/templates", "routes/configuration.templates.tsx"),
    route("projects", "routes/projects.tsx"),
    route("projects/new", "routes/projects_.new.tsx"),
    route("projects/:id", "routes/projects.$id.tsx"),
    route("projects/:id/elaboration", "routes/projects.$id.elaboration.tsx"),
    route("projects/:id/construction", "routes/projects.$id.construction.tsx"),
    route("projects/:id/testing", "routes/projects.$id.testing.tsx"),
    route("projects/:id/workflows", "routes/projects.$id.workflows.tsx"),
    route(
        "projects/:id/iterations/:iterationId",
        "routes/projects.$id.iterations.$iterationId.tsx"
    ),
] satisfies RouteConfig;
