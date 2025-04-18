
import { Search, Bell, Package, Settings, LogOut, ChevronDown, LayoutGrid, Box, Star, TicketCheck } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "../../components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Separator } from "../../components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { useAuth } from "../../Middleware/AuthProvider"
import { Link } from "react-router-dom"
import { colors } from "../../assets/Color"
import { pageTransition, itemFadeIn, shimmerAnimation } from "../../assets/Animations"
import { Particles } from "../../Components/Particles"

export const UserSupprt = () => {
    const { user } = useAuth()
    return (
        <motion.div className="min-h-screen bg-light flex" initial="hidden" animate="visible" variants={pageTransition}>
            <motion.div className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col" variants={itemFadeIn}>
                <div className="p-6">
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
                </div>
                <div className="flex-1 py-6">
                    <div className="px-3 mb-6">
                        <div className="text-xs font-semibold text-muted-foreground mb-2 px-3">MENU</div>
                        {[
                            {
                                icon: <Package className="h-4 w-4 mr-3" />,
                                label: "My Dashboard",
                                active: false,
                                link: "/dashboard",
                            },
                            {
                                icon: <Box className="h-4 w-4 mr-3" />,
                                label: "My Items",
                                active: false,
                            },
                            {
                                icon: <LayoutGrid className="h-4 w-4 mr-3" />,
                                label: "Browse",
                                active: false,
                                link: "/browse",
                            },
                            {
                                icon: <Settings className="h-4 w-4 mr-3" />,
                                label: "Settings",
                                active: false,
                                link: "/settings",
                            },
                            {
                                icon: <TicketCheck className="h-4 w-4 mr-3" />,
                                label: "Tickets & Support",
                                active: true,
                                link: "/dashboard/tickets",
                            }
                        ].map((item, index) => (
                            <Link to={item.link || "#"} key={index}>
                                <motion.button
                                    key={index}
                                    className={`flex items-center w-full px-3 py-2 mb-1 rounded-md text-sm ${item.active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-gray-100"
                                        }`}
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    {item.icon}
                                    {item.label}
                                    {item.active && (
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
                        >
                            <LogOut className="h-4 w-4 mr-3" />
                            Logout
                        </motion.button>
                    </div>
                </div>
            </motion.div>
            {/* Main Content */}
            <motion.div className="flex-1 flex flex-col" variants={itemFadeIn}>
                {/* Header */}
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
                                Rental
                            </motion.div>
                        </div>

                        <div className="relative max-w-md w-full hidden md:block">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search items..."
                                className="pl-10 bg-gray-50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <motion.button
                                className="relative p-2 rounded-full hover:bg-gray-100"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                            </motion.button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <motion.button
                                        className="flex items-center space-x-2"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Avatar>
                                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.user?.email} />
                                            <AvatarFallback>{user.user?.email?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="hidden md:block text-sm font-medium">{user.user?.email}</div>
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    </motion.button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link to="/settings" className="w-full">
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 overflow-auto relative">
                    <Particles />
                </main>
            </motion.div>
        </motion.div>
    )
}
