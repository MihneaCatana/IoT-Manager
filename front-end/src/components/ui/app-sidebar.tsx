import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { VersionSwitcher } from "@/components/ui/version-switcher.tsx";
import { NavUser } from "@/components/ui/nav-user.tsx";

const data = {
  versions: ["Portal"],
  user: {
    name: "John Doe",
    email: "johndoe@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Portal",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Devices",
      url: "#",
      items: [
        {
          title: "Manage Devices",
          url: "/devices",
        },
      ],
    },
    {
      title: "Spaces",
      url: "/",
      items: [
        {
          title: "Manage Spaces",
          url: "/spaces",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <a key={item.title.concat("_")} href={item.url}>
                    <SidebarMenuItem>
                      <SidebarMenuButton>{item.title}</SidebarMenuButton>
                    </SidebarMenuItem>
                  </a>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
