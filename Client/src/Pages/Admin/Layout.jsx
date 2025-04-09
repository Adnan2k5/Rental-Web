// components/admin/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '../../components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { BarChart3, Bell, ChevronDown,  FileCheck, LogOut, Mountain, Package, TicketCheck, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';
export default function AdminLayout() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const colors = {
    primary: "#FF8A65",
    secondary: "#FFB74D",
  }

  const admin = {
    name: "Sarah Johnson",
    role: "Super Admin",
    avatar: "/placeholder.svg?height=40&width=40",
  };


  const shimmerAnimation = {
    initial: { backgroundPosition: "0 0" },
    animate: {
      backgroundPosition: ["0 0", "100% 100%"],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      },
    },
  }


  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar pathname={pathname} />
        <SidebarInset className="bg-muted/40">
          <div className="flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
          </div>
          <header className="bg-white border-b border-gray-100 py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="md:hidden">
              <motion.div
                className="text-xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                {...shimmerAnimation}
              >
                Rental Admin
              </motion.div>
            </div>
          </div>
        </header>
          <main className="lg:w-[83vw] w-full flex-1  overflow-y-auto p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function AdminSidebar({ pathname }) {
  return (
    <Sidebar>
      <SidebarHeader className="flex h-16 items-center justify-center border-b px-6">
        <div className="flex items-items gap-2 font-semibold justify-center">
          <span>Rental Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                  <Link to="/admin">
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Other sidebar groups with Link components instead of <a> tags */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/items"}>
                  <Link to="/admin/items">
                    <Package className="h-4 w-4" />
                    <span>Items Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/users"}>
                  <Link to="/admin/users">
                    <Users className="h-4 w-4" />
                    <span>User Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/tickets"}>
                  <Link to="/admin/tickets">
                    <TicketCheck className="h-4 w-4" />
                    <span>Tickets & Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/terms"}>
                  <Link to="/admin/terms">
                    <FileCheck className="h-4 w-4" />
                    <span>Terms & Condition</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Continue with other sidebar groups */}
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <Button variant="outline" className="w-full justify-start" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}