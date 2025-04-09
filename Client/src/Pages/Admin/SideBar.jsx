import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { Home, Users, Package, BarChart3, Settings, FileText, LogOut, Compass } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../../components/ui/sidebar"

export function SidebarNav() {
  const location = useLocation()
  const pathname = location.pathname
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const colors = {
    primary: "#FF8A65",
    secondary: "#FFB74D",
  }

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

  const navItems = [
    { icon: <Home className="h-4 w-4" />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <Users className="h-4 w-4" />, label: "Manage Users", path: "/admin/users" },
    { icon: <Package className="h-4 w-4" />, label: "Manage Items", path: "/admin/items" },
    { icon: <Compass className="h-4 w-4" />, label: "Adventures", path: "/admin/adventures" },
    { icon: <BarChart3 className="h-4 w-4" />, label: "Analytics", path: "/admin/analytics" },
    { icon: <FileText className="h-4 w-4" />, label: "Reports", path: "/admin/reports" },
    { icon: <Settings className="h-4 w-4" />, label: "Settings", path: "/admin/settings" },
  ]

  if (!isMounted) return null

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/admin/dashboard" className="w-full">
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Package className="size-4" />
                </div>
                <motion.div
                  className="flex flex-col gap-0.5 leading-none"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  {...shimmerAnimation}
                >
                  <span className="font-semibold">Rental Admin</span>
                  <span>v1.0.0</span>
                </motion.div>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Avatar>
                      <AvatarImage src={admin.avatar} alt={admin.name} />
                      <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium">{admin.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {admin.role}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <div className="px-3 mb-6">
          <div className="text-xs font-semibold text-muted-foreground mb-2 px-3">MANAGEMENT</div>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={pathname === item.path}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.label}</span>
                    {pathname === item.path && (
                      <motion.div
                        className="ml-auto h-2 w-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/auth/signin">
                <LogOut className="h-4 w-4 mr-3" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="p-4 m-4 rounded-lg bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg" />
          <motion.div
            className="relative z-10"
            initial={{ y: 0 }}
            animate={{ y: [-5, 5, -5] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="flex items-center mb-3">
              <BarChart3 className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium">Admin Tips</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Check the analytics section for detailed insights on user behavior and revenue trends.
            </p>
          </motion.div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
