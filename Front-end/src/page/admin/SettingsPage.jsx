import { AppSidebar } from "@/Component/Appslide";
import { LayoutDashboard, MessageSquareWarning, Settings, CircleUserRound } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSettings from "./AdminSettings";

const SettingsPage = () => {
  const items = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/admin"
    },
    {
      title: "Alert",
      icon: MessageSquareWarning,
      url: "#"
    },
    {
      title: "Settings",
      icon: Settings,
      url: "/admin/settings"
    },
    {
      title: "Users",
      icon: CircleUserRound,
      url: "/admin/users"
    }
  ];

  return (
    <SidebarProvider>
      <AppSidebar items={items} />
      <main className="w-full relative bg-slate-100 min-h-screen">
        <SidebarTrigger className="block ml-4 mt-4" />
        <AdminSettings />
      </main>
    </SidebarProvider>
  );
};

export default SettingsPage;
