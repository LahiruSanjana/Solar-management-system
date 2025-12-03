import SolarUnitView from "./components/SolarUnitView";
import { AppSidebar } from "@/Component/Appslide";
import { LayoutDashboard ,MessageSquareWarning,Settings,CircleUserRound} from "lucide-react";
import { SidebarProvider,SidebarTrigger } from "@/components/ui/sidebar";
const View = () => {

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
      url: "#",
      }
  ];
    return (
        <SidebarProvider >
        <AppSidebar items={items} />
        <main className="w-full relative px-6 bg-slate-400">
           <SidebarTrigger className="block ml-4" />
           <SolarUnitView />
        </main>
    </SidebarProvider>
    );
}
export default View;