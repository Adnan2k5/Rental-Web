"use client"

import { useState, useEffect } from "react"
import { Search, Bell, Package, Settings, LogOut, ChevronDown, LayoutGrid, Box, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Separator } from "../../components/ui/separator"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { fetchByUserId } from "../../api/items.api"
import { toast } from "sonner"
import { useAuth } from "../../Middleware/AuthProvider"
import { Link } from "react-router-dom"
import { colors } from "../../assets/Color"
import { pageTransition, itemFadeIn, shimmerAnimation } from "../../assets/Animations"
import { Particles } from "../../Components/Particles"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "../../Components/ui/dialog"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../components/ui/pagination"

export default function UserItems() {
    const user = useAuth()
    const [fetchItemsfrombackend, setFetchItems] = useState([])
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState(false)
    const [hover, setHover] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const ITEMS_PER_PAGE = 10

    const fetchItems = async () => {
        try {
            const res = await fetchByUserId(user.user._id)
            setFetchItems(res.data.message)
            setTotalPages(Math.ceil(res.data.message.length / ITEMS_PER_PAGE))
        } catch (error) {
            console.error("Error fetching items:", error)
            toast.error("Failed to fetch items")
        }
    }

    useEffect(() => {
        if (user?.user?._id) {
            fetchItems()
        }
    }, [user])

    // Get current items for pagination
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
    const currentItems = fetchItemsfrombackend.slice(indexOfFirstItem, indexOfLastItem)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <motion.div className="min-h-screen bg-light flex" initial="hidden" animate="visible" variants={pageTransition}>
            {/* Sidebar */}
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
                                active: true,
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

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                            <div>
                                <motion.h1
                                    className="text-2xl font-bold text-dark mb-1"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Items Rented
                                </motion.h1>
                                <motion.p
                                    className="text-muted-foreground"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Manage your rented items
                                </motion.p>
                            </div>
                        </div>

                        {/* Stats */}
                        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" variants={itemFadeIn}>
                            {[
                                {
                                    label: "Total Items",
                                    value: fetchItemsfrombackend.length,
                                    icon: <Package className="h-5 w-5 text-primary" />,
                                },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white rounded-lg p-6 border border-gray-100 relative overflow-hidden"
                                    whileHover={{
                                        y: -5,
                                        boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)",
                                    }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-bl-full" />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-muted-foreground text-sm mb-1">{stat.label}</div>
                                            <div className="text-2xl font-bold text-dark">{stat.value}</div>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
                                            {stat.icon}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Items Grid/List */}
                        <motion.div variants={itemFadeIn}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key="grid"
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {currentItems.map((item) => (
                                        <motion.div
                                            key={item._id}
                                            className="bg-white rounded-lg overflow-hidden border border-gray-100"
                                            whileHover={{
                                                y: -5,
                                                boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)",
                                            }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <div className="relative h-48 bg-gray-100">
                                                <img
                                                    src={item.images[0] || "/placeholder.svg"}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-3 right-3">
                                                    <Badge variant={item.status === "active" ? "default" : "secondary"} className="capitalize">
                                                        {item.status || "active"}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="text-xs text-muted-foreground">{item.category}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <h3 className="font-semibold mb-1 text-dark">{item.name}</h3>
                                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-primary font-semibold">${item.price}</div>
                                                    <div className="flex space-x-2">
                                                        <Button onClick={() => setReview(true)} className="p-1.5 rounded-md">
                                                            Add Review
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-8">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                                />
                                            </PaginationItem>

                                            {Array.from({ length: totalPages }).map((_, index) => {
                                                // Show first page, last page, and pages around current page
                                                const pageNumber = index + 1
                                                if (
                                                    pageNumber === 1 ||
                                                    pageNumber === totalPages ||
                                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                                ) {
                                                    return (
                                                        <PaginationItem key={pageNumber}>
                                                            <PaginationLink
                                                                isActive={currentPage === pageNumber}
                                                                onClick={() => paginate(pageNumber)}
                                                            >
                                                                {pageNumber}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    )
                                                }

                                                // Show ellipsis for skipped pages
                                                if (
                                                    (pageNumber === 2 && currentPage > 3) ||
                                                    (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                                                ) {
                                                    return (
                                                        <PaginationItem key={`ellipsis-${pageNumber}`}>
                                                            <PaginationEllipsis />
                                                        </PaginationItem>
                                                    )
                                                }

                                                return null
                                            })}

                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </motion.div>
                    </div>
                    <Dialog open={review} onOpenChange={setReview}>
                        <DialogContent className="sm:max-w-[600px] p-10 overflow-hidden flex flex-col items-center justify-center">
                            <DialogHeader className="px-6 pb-2">
                                <DialogTitle className="text-xl">Post Review</DialogTitle>
                            </DialogHeader>
                            <DialogDescription className="px-3 w-full text-center mb-2">Add Review For this Item</DialogDescription>
                            <div className="flex justify-center space-x-2 px-4 w-full  mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${(hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
                                            }`}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        onClick={() => setRating(star)}
                                        fill={(hover || rating) >= star ? "#facc15" : "none"}
                                    />
                                ))}
                                {rating > 0 && <span className="text-sm text-gray-600 ml-2">{rating} / 5</span>}
                            </div>
                            <input className="Input" type="text" placeholder="Write your review here" />
                            {rating > 0 && (
                                <Button
                                    variant="primary"
                                    className="mr-2 bg-black text-white w-full"
                                    onClick={() => {
                                        toast.success("Review added successfully")
                                        setRating(0)
                                        setReview(false)
                                    }}
                                >
                                    Submit Review
                                </Button>
                            )}

                            <DialogFooter className="px-6 py-4 bg-gray-50 w-full">
                                <Button variant="outline" className="w-full" onClick={() => setReview(false)}>
                                    Cancel
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </main>
            </motion.div>
        </motion.div>
    )
}
