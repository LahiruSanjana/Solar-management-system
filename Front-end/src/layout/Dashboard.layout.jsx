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
    url: "/dashboard/anomaly",
    icon: TriangleAlert,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: ChartColumn,
  },
  {
    title: "Invoices",
    url: "/dashboard/invoices",
    icon: Inbox,
  }
]
  return (
    <SidebarProvider >
        <AppSidebar items={items} />
        <main className="w-full bg-slate-50 relative">
           <SidebarTrigger className="block ml-4" />
           <Outlet />
        </main>
    </SidebarProvider>
  )
}

export default NavigationLayout
