import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("projects", "routes/projects.tsx"),
    route("projects/new", "routes/projects_.new.tsx"),
    route("projects/:id", "routes/projects.$id.tsx"),
    route("projects/:id/elaboration", "routes/projects.$id.elaboration.tsx"),
] satisfies RouteConfig;
