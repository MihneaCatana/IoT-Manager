import { createFileRoute, redirect } from "@tanstack/react-router";
import Layout from "@/components/ui/layout.tsx";

export const Route = createFileRoute("/homepage")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout>
      <div>Hello "/homepage"!</div>
    </Layout>
  );
}
