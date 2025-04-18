"use client"

import { useState, useEffect } from "react"
import { Star } from 'lucide-react'
import { motion } from "framer-motion"
import { Button } from "../../Components/ui/button"
import { Badge } from "../../Components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../Components/ui/dialog"
import { fetchByUserId, fetchUserBookings } from "../../api/items.api"
import { toast } from "sonner"
import { useAuth } from "../../Middleware/AuthProvider"
import { itemFadeIn } from "../../assets/Animations"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../Components/ui/pagination"

export default function UserItems() {
    const { user } = useAuth()
    const [fetchItemsfrombackend, setFetchItems] = useState([])
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState(false)
    const [hover, setHover] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const ITEMS_PER_PAGE = 10

    // Fetch user items
    const fetchItems = async () => {
        try {
            const res = await fetchUserBookings(user?.user?._id)
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

    const handleReviewSubmit = async () => {

    }

    // Get current items for pagination
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
    const currentItems = fetchItemsfrombackend.slice(indexOfFirstItem, indexOfLastItem)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <div>
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
            <motion.div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8" variants={itemFadeIn}>
                <motion.div
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
                            <div className="text-muted-foreground text-sm mb-1">Total Items</div>
                            <div className="text-2xl font-bold text-dark">{fetchItemsfrombackend.length}</div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Items Grid */}
            <motion.div variants={itemFadeIn}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                </div>

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

            {/* Review Dialog */}
            <Dialog open={review} onOpenChange={setReview}>
                <DialogContent className="sm:max-w-[600px] p-10 overflow-hidden flex flex-col items-center justify-center">
                    <DialogHeader className="px-6 pb-2">
                        <DialogTitle className="text-xl">Post Review</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center space-x-2 px-4 w-full mb-2">
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
                            className="mr-2 bg-black text-white w-full mt-4"
                            onClick={() => {

                                setRating(0)
                                setReview(false)
                            }}
                        >
                            Submit Review
                        </Button>
                    )}

                    <DialogFooter className="px-6 py-4 bg-gray-50 w-full mt-4">
                        <Button variant="outline" className="w-full" onClick={() => setReview(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
