import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/solfege.tsx"),
    route("intervals", "./routes/intervals.tsx")
] satisfies RouteConfig;
