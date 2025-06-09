import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/components/ui/layout.tsx";

export const Route = createFileRoute("/spaces")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout>
      <div>Hello "/spaces"!</div>
    </Layout>
  );
}
