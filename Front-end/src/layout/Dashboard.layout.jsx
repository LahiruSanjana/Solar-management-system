import { SidebarProvider,SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/Component/Appslide"
import { Outlet } from "react-router-dom"
import { Calendar, Home, Inbox, Search, Settings,LayoutDashboard,TriangleAlert,ChartColumn } from "lucide-react"

const NavigationLayout = () => {
  const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Anomaly",
    url: "#",
    icon: TriangleAlert,
  },
  {
    title: "Analytics",
    url: "#",
    icon: ChartColumn,
  },
]
  return (
    <SidebarProvider >
        <AppSidebar items={items} />
        <main className="w-full bg-gray-200 relative">
           <SidebarTrigger className="block ml-4" />
           <Outlet />
        </main>
    </SidebarProvider>
  )
}

export default NavigationLayout
