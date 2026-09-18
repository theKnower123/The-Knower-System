import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/_public/industries")({
  beforeLoad: () => { throw redirect({ to: "/solutions" }); },
});
