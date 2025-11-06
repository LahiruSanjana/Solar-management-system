import { SidebarProvider,SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/Component/Appslide"
import { Outlet } from "react-router-dom"

const NavigationLayout = () => {
  return (
    <SidebarProvider>
        <AppSidebar />
        <main className="w-full bg-gray-200 relative">
           <SidebarTrigger className="block ml-4" />
           <Outlet />
        </main>
    </SidebarProvider>
  )
}

export default NavigationLayout
