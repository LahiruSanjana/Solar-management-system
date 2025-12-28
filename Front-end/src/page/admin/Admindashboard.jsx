import { AppSidebar } from "@/Component/Appslide";
import { LayoutDashboard ,Settings,CircleUserRound,Receipt} from "lucide-react";
import { SidebarProvider,SidebarTrigger } from "@/components/ui/sidebar";
import Maindashboard from "./Maindashboard";


const Admindashboard = () => {
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
      url: "admin/Invoices",
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