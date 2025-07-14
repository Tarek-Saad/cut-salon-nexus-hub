import { 
  Users, 
  UserCheck, 
  DollarSign, 
  ShoppingCart, 
  BarChart3, 
  Calendar,
  Settings,
  Home,
  Calculator
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home, section: "main" },
  { title: "العملاء", url: "/customers", icon: Users, section: "management" },
  { title: "الموظفين", url: "/staff", icon: UserCheck, section: "management" },
  { title: "الإيرادات", url: "/revenue", icon: DollarSign, section: "financial" },
  { title: "المصروفات", url: "/expenses", icon: ShoppingCart, section: "financial" },
  { title: "كشف الحساب", url: "/accounting", icon: Calculator, section: "financial" },
  { title: "التقارير", url: "/reports", icon: BarChart3, section: "analytics" },
  { title: "الحضور", url: "/attendance", icon: Calendar, section: "analytics" },
  { title: "الإعدادات", url: "/settings", icon: Settings, section: "system" },
];

const sections = {
  main: "الرئيسية",
  management: "إدارة العملاء والموظفين",
  financial: "المالية",
  analytics: "التقارير والتحليل",
  system: "النظام"
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path || (currentPath === "/" && path === "/");
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  const groupedItems = Object.entries(sections).map(([sectionKey, sectionLabel]) => ({
    key: sectionKey,
    label: sectionLabel,
    items: navigationItems.filter(item => item.section === sectionKey)
  }));

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-gradient-to-b from-card to-card/95">
        {groupedItems.map((section) => (
          <SidebarGroup key={section.key}>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2 py-2">
                {section.label}
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={getNavCls({ isActive: isActive(item.url) })}
                        title={item.title}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!isCollapsed && (
                          <span className="ml-3 text-sm font-medium">
                            {item.title}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}