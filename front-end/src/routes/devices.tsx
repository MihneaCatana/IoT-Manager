import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/components/ui/layout.tsx";

export const Route = createFileRoute("/devices")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout>
      <div>Hello "/devices"!</div>
    </Layout>
  );
}
