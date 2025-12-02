import { AppSidebar } from "@/Component/Appslide";
import {icons, LayoutDashboard ,MessageSquareWarning,Settings} from "lucide-react";
import { SidebarProvider,SidebarTrigger } from "@/components/ui/sidebar";
import Maindashboard from "./Maindashboard";

const Admindashboard = () => {
  const items = [
    {
      title:"Dashboard",
      icon:LayoutDashboard,
      url:"#"},
    {
      title: "Alert", 
      icon:MessageSquareWarning,
      url: "#"},
    {
      title: "Settings",
      icon:Settings,
      url: "#",}
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