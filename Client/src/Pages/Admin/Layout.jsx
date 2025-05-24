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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '../../Components/ui/sidebar';

import {
  FileCheck,
  Home,
  LogOut,
  Package,
  TicketCheck,
  Users,
} from 'lucide-react';
import { Button } from '../../Components/ui/button';
import { motion } from 'framer-motion';
import { colors } from '../../assets/Color';
import { shimmerAnimation } from '../../assets/Animations';
import { useDispatch } from 'react-redux';
import { logout } from "../../Store/UserSlice"
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../api/auth.api';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../Components/LanguageSelector';

export default function AdminLayout() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
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
    }
    catch (error) {
      toast.error("Logout failed");
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar pathname={pathname} handleLogout={handleLogout} t={t} />
        <header className="bg-white border-b border-gray-100 py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="md:hidden">
              <motion.div
                className="text-xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                {...shimmerAnimation}
              >
                {t('adminSidebar.rentalAdmin')}
              </motion.div>
            </div>
          </div>
        </header>
        <main className="lg:w-[100vw] w-full flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}

function AdminSidebar({ pathname, handleLogout, t }) {

  const shimmerAnimation = {
    initial: { backgroundPosition: '0 0' },
    animate: {
      backgroundPosition: ['0 0', '100% 100%'],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex h-16 items-center justify-center border-b px-6">
        <div className="p-6">
          <motion.div
            className="text-2xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            {...shimmerAnimation}
          >
            {t('adminSidebar.rentalAdmin')}
          </motion.div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('adminSidebar.overview')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/admin'}>
                  <Link to="/admin">
                    <Home className="h-4 w-4" />
                    <span>{t('adminSidebar.dashboard')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Other sidebar groups with Link Components instead of <a> tags */}
        <SidebarGroup>
          <SidebarGroupLabel>{t('adminSidebar.management')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/admin/items'}
                >
                  <Link to="/admin/items">
                    <Package className="h-4 w-4" />
                    <span>{t('adminSidebar.itemsManagement')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/admin/users'}
                >
                  <Link to="/admin/users">
                    <Users className="h-4 w-4" />
                    <span>{t('adminSidebar.userManagement')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/admin/users/verification'}
                >
                  <Link to="/admin/users/verification">
                    <Users className="h-4 w-4" />
                    <span>{t('adminSidebar.userVerification')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/admin/tickets'}
                >
                  <Link to="/admin/tickets">
                    <TicketCheck className="h-4 w-4" />
                    <span>{t('adminSidebar.ticketsSupport')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/admin/terms'}
                >
                  <Link to="/admin/terms">
                    <FileCheck className="h-4 w-4" />
                    <span>{t('adminSidebar.termsCondition')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Continue with other sidebar groups */}
      </SidebarContent>
      <LanguageSelector direction='up' className="ml-5" />
      <SidebarFooter className="border-t p-4">
        <Button variant="outline" className="w-full justify-start" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          {t('adminSidebar.logout')}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
