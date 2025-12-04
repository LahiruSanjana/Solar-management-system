import Logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


export function AppSidebar(props) {
  return (
    <Sidebar className="py-4 bg-helios-primary">
      <SidebarContent className="bg-helios-primary text-white">
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link to="/" className="flex items-start ">
                 <div className="flex w-20 h-10 rounded-full text-white">
                  <img src={Logo} alt="Logo" className="w-20 h-10"/>
                </div>
                <span className="text-xl font-bold font-sans text-lime-400 shadow-md ">HELIOS ENERGY</span>
            </Link> 
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-10">
            <SidebarMenu>
              {props.items.map((item) => (
                <SidebarMenuItem key={item.title} className="mb-1 text-white font-semibold  text-9xl" size="2xl">
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}