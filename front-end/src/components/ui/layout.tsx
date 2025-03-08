import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb.tsx";
import { useLocation } from "@tanstack/react-router";

function capitalizeFirstLetter(val: string): string {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const currentPagePath = useLocation().pathname;
  const lastPage = currentPagePath.split("/").slice(-1)[0];

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 items-center w-screen">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {capitalizeFirstLetter(lastPage)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {children}
      </main>
    </SidebarProvider>
  );
}
