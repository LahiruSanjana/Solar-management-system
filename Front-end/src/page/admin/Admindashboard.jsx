import { AppSidebar } from "@/Component/Appslide";
import {icons, LayoutDashboard ,MessageSquareWarning,Settings,CircleUserRound, User} from "lucide-react";
import { SidebarProvider,SidebarTrigger } from "@/components/ui/sidebar";
import Maindashboard from "./Maindashboard";
import Userdetails from "./components/user/Userdetails";

const Admindashboard = () => {
  const items = [
    {
      title:"Dashboard",
      icon:LayoutDashboard,
      url:"/admin"},
    {
      title: "Alert", 
      icon:MessageSquareWarning,
      url: "#"},
    {
      title: "Settings",
      icon:Settings,
      url: "/admin/settings",},
      {
      title: "Users",
      icon:CircleUserRound,
      url: "admin/user",
      }
  ];
  return (
    <SidebarProvider >
        <AppSidebar items={items} />
        <main className="w-full relative px-6 bg-slate-400">
           <SidebarTrigger className="block ml-4" />
           <Maindashboard />
        </main>
    </SidebarProvider>
  );
};
export default Admindashboard;