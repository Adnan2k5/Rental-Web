"use client"

import { useState, useEffect } from "react"
import { Outlet, useLocation, Link } from "react-router-dom"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  SidebarInset,
} from "../../Components/ui/sidebar"

import { FileCheck, Home, LogOut, Package, TicketCheck, Users } from "lucide-react"
import { motion } from "framer-motion"
import { colors } from "../../assets/Color"
import { shimmerAnimation } from "../../assets/Animations"
import { useDispatch } from "react-redux"
import { logout } from "../../Store/UserSlice"
import { useNavigate } from "react-router-dom"
import { logoutUser } from "../../api/auth.api"
import { useTranslation } from "react-i18next"
import LanguageSelector from "../../Components/LanguageSelector"

export default function AdminLayout() {
  const location = useLocation()
  const pathname = location.pathname
  const [isMounted, setIsMounted] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const handleLogout = async () => {
    try {
      const res = await logoutUser()
      if (res) {
        dispatch(logout())
        navigate("/login")
      } else {
        toast.error("Logout failed")
      }
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar pathname={pathname} handleLogout={handleLogout} t={t} />
        <SidebarInset className="flex-1">
          {/* Mobile Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 lg:hidden">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <motion.div
                className="text-lg font-bold"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                {...shimmerAnimation}
              >
                {t("adminSidebar.rentalAdmin")}
              </motion.div>
            </div>
            <LanguageSelector direction="down" className="lg:hidden" />
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

function AdminSidebar({ pathname, handleLogout, t }) {
  const shimmerAnimation = {
    initial: { backgroundPosition: "0 0" },
    animate: {
      backgroundPosition: ["0 0", "100% 100%"],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      },
    },
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Package className="size-4" />
                </div>
                <motion.div
                  className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-700"
                  {...shimmerAnimation}
                >
                  <span className="truncate font-semibold">{t("adminSidebar.rentalAdmin")}</span>
                </motion.div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("adminSidebar.overview")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                  <Link to="/admin">
                    <Home className="h-4 w-4" />
                    <span>{t("adminSidebar.dashboard")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("adminSidebar.management")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/items"}>
                  <Link to="/admin/items">
                    <Package className="h-4 w-4" />
                    <span>{t("adminSidebar.itemsManagement")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/users"}>
                  <Link to="/admin/users">
                    <Users className="h-4 w-4" />
                    <span>{t("adminSidebar.userManagement")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/users/verification"}>
                  <Link to="/admin/users/verification">
                    <Users className="h-4 w-4" />
                    <span>{t("adminSidebar.userVerification")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/tickets"}>
                  <Link to="/admin/tickets">
                    <TicketCheck className="h-4 w-4" />
                    <span>{t("adminSidebar.ticketsSupport")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/terms"}>
                  <Link to="/admin/terms">
                    <FileCheck className="h-4 w-4" />
                    <span>{t("adminSidebar.termsCondition")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="hidden lg:block p-2">
          <LanguageSelector direction="up" />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>{t("adminSidebar.logout")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
