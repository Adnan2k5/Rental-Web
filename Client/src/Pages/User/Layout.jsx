"use client"

import { useState } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, Package, Settings, LogOut, ChevronDown, LayoutGrid, Box, TicketCheck, Menu, X, Badge } from 'lucide-react'
import { Button } from "../../Components/ui/button"
import { Input } from "../../Components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../Components/ui/dropdown-menu"
import { Separator } from "../../Components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../../Components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "../../Components/ui/sheet"
import { useAuth } from "../../Middleware/AuthProvider"
import { colors } from "../../assets/Color"
import { pageTransition, itemFadeIn, shimmerAnimation } from "../../assets/Animations"
import { Particles } from "../../Components/Particles"
import { useNavigate } from "react-router-dom"
import { logout } from "../../Store/UserSlice"
import { useDispatch } from 'react-redux';
import { logoutUser } from "../../api/auth.api"


/**
 * UserDashboardLayout - A layout component that wraps all user dashboard pages
 * Provides consistent navigation, header, and structure for user dashboard pages
 */
const UserDashboardLayout = () => {
    const { user } = useAuth()
    const dispatch = useDispatch()
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const navigate = useNavigate()

    // Navigation items configuration
    const navItems = [
        {
            icon: <Package className="h-4 w-4 mr-3" />,
            label: "My Dashboard",
            path: "/dashboard",
        },
        {
            icon: <Box className="h-4 w-4 mr-3" />,
            label: "My Bookings",
            path: "/dashboard/myitems",
        },
        {
            icon: <LayoutGrid className="h-4 w-4 mr-3" />,
            label: "Browse",
            path: "/browse",
        },
        {
            icon: <Badge className="h-4 w-4 mr-3" />,
            label: "Get Verified",
            path: "/dashboard/verification",
        },
        {
            icon: <Settings className="h-4 w-4 mr-3" />,
            label: "Settings",
            path: "/dashboard/settings",
        },
        {
            icon: <TicketCheck className="h-4 w-4 mr-3" />,
            label: "Tickets & Support",
            path: "/dashboard/tickets",
        },
    ]

    // Check if a navigation item is active
    const isActive = (path) => {
        if (path === "/dashboard" && location.pathname === "/dashboard") {
            return true
        }
        return location.pathname.startsWith(path) && path !== "/dashboard"
    }

    // Handle logout
    const handleLogout = async () => {
        try {
            const res = await logoutUser()
            if (res) {
                dispatch(logout())
                navigate("/login")
            } else {
                console.error("Logout failed")
            }
        }
        catch (error) {
            console.error("Logout error:", error)
        }
    }

    return (
        <motion.div className="min-h-screen bg-light flex" initial="hidden" animate="visible" variants={pageTransition}>
            {/* Desktop Sidebar */}
            <motion.div className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col" variants={itemFadeIn}>
                <div className="p-6">
                    <Link to="/">
                        <motion.div
                            className="text-2xl font-bold"
                            style={{
                                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                            {...shimmerAnimation}
                        >
                            Rental
                        </motion.div>
                    </Link>
                </div>

                <div className="flex-1 py-6">
                    <div className="px-3 mb-6">
                        <div className="text-xs font-semibold text-muted-foreground mb-2 px-3">MENU</div>
                        {navItems.map((item, index) => (
                            <Link to={item.path} key={index}>
                                <motion.button
                                    className={`flex items-center w-full px-3 py-2 mb-1 rounded-md text-sm ${isActive(item.path)
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:bg-gray-100"
                                        }`}
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    {item.icon}
                                    {item.label}
                                    {isActive(item.path) && (
                                        <motion.div
                                            className="ml-auto h-2 w-2 rounded-full bg-primary"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{
                                                duration: 2,
                                                repeat: Number.POSITIVE_INFINITY,
                                            }}
                                        />
                                    )}
                                </motion.button>
                            </Link>
                        ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="px-3">
                        <div className="text-xs font-semibold text-muted-foreground mb-2 px-3">ACCOUNT</div>
                        <motion.button
                            className="flex items-center w-full px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-gray-100"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 mr-3" />
                            Logout
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Sidebar */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="w-64 p-0">
                    <div className="p-6">
                        <div className="flex justify-between items-center">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                                <motion.div
                                    className="text-2xl font-bold"
                                    style={{
                                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    Rental
                                </motion.div>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 py-6">
                        <div className="px-3 mb-6">
                            <div className="text-xs font-semibold text-muted-foreground mb-2 px-3">MENU</div>
                            {navItems.map((item, index) => (
                                <Link to={item.path} key={index} onClick={() => setIsMobileMenuOpen(false)}>
                                    <motion.button
                                        className={`flex items-center w-full px-3 py-2 mb-1 rounded-md text-sm ${isActive(item.path)
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:bg-gray-100"
                                            }`}
                                    >
                                        {item.icon}
                                        {item.label}
                                        {isActive(item.path) && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
                                    </motion.button>
                                </Link>
                            ))}
                        </div>
                        <Separator className="my-6" />
                        <div className="px-3">
                            <div className="text-xs font-semibold text-muted-foreground mb-2 px-3">ACCOUNT</div>
                            <motion.button
                                className="flex items-center w-full px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-gray-100"
                                onClick={() => {
                                    handleLogout()
                                    setIsMobileMenuOpen(false)
                                }}
                            >
                                <LogOut className="h-4 w-4 mr-3" />
                                Logout
                            </motion.button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <motion.div className="flex-1 flex flex-col" variants={itemFadeIn}>
                {/* Header */}
                <header className="bg-white border-b border-gray-100 py-4 px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {/* Mobile menu trigger */}
                            <Button variant="ghost" size="icon" className="md:hidden mr-4" onClick={() => setIsMobileMenuOpen(true)}>
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>

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
                                    Rental
                                </motion.div>
                            </div>
                        </div>


                        <div className="flex items-center space-x-4">

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <motion.button
                                        className="flex items-center space-x-2"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Avatar>
                                            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.email} />
                                            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="hidden md:block text-sm font-medium">{user?.name}</div>
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    </motion.button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem asChild>
                                        <Link to="/dashboard/settings" className="w-full">
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 overflow-auto relative">
                    <Particles />
                    <div className="relative z-10">
                        {/* This is where child components will be rendered */}
                        <Outlet />
                    </div>
                </main>
            </motion.div>
        </motion.div>
    )
}

export default UserDashboardLayout
