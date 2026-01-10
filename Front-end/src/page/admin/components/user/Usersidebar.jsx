import { AppSidebar } from "@/Component/Appslide";
import { LayoutDashboard, Settings, CircleUserRound, Receipt } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Userdetails from "./Userdetails";

const Usersidebar = () => {
  const items = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/admin"
    },
    {
      title: "Users",
      icon: CircleUserRound,
      url: "admin/user"
    },
    {
      title: "Invoices",
      icon: Receipt,
      url: "admin/invoices",
    }
  ];
  return (
    <SidebarProvider >
      <AppSidebar items={items} />
      <main className="w-full relative px-6 bg-slate-400">
        <SidebarTrigger className="block ml-4" />
        <Userdetails />
      </main>
    </SidebarProvider>
  );
};
export default Usersidebar;