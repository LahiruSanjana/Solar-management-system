import SolarUnitView from "./components/SolarUnitView";
import { AppSidebar } from "@/Component/Appslide";
import { LayoutDashboard ,MessageSquareWarning,Settings,CircleUserRound,Receipt} from "lucide-react";
import { SidebarProvider,SidebarTrigger } from "@/components/ui/sidebar";
const View = () => {

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
        <main className="w-full relative bg-slate-50">
           <SidebarTrigger className="block " />
           <SolarUnitView />
        </main>
    </SidebarProvider>
    );
}
export default View;