import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/components/ui/layout.tsx";

export const Route = createFileRoute("/homepage")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Layout>
        <div>Hello "/homepage"!</div>
      </Layout>
    </div>
  );
}
