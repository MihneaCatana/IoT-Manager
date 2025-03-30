import { createFileRoute, redirect } from "@tanstack/react-router";
import Layout from "@/components/ui/layout.tsx";

export const Route = createFileRoute("/homepage")({
  component: RouteComponent,
  beforeLoad: () => {
    const JWT = localStorage.getItem("JWT");

    if (!JWT) {
      console.log("test");
      throw redirect({
        to: "/register",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function RouteComponent() {
  return (
    <Layout>
      <div>Hello "/homepage"!</div>
    </Layout>
  );
}
