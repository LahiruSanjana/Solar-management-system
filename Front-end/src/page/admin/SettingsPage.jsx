import { AppSidebar } from "@/Component/Appslide";
import { LayoutDashboard, MessageSquareWarning, Settings, CircleUserRound,Receipt} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSettings from "./AdminSettings";

const SettingsPage = () => {
  const items = [
    {
      title:"Dashboard",
      icon:LayoutDashboard,
      url:"/admin"},
    {
      title: "Users", 
      icon:CircleUserRound,
      url: "admin/user"},
    {
      title: "Settings",
      icon:Settings,
      url: "/admin/settings",},
      {
      title: "Invoices",
      icon:Receipt,
      url: "/admin/invoices",
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
