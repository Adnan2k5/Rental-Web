"use client"

import { useState, useEffect } from "react"
import { Search, Filter, RefreshCw, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../components/ui/pagination"
import { toast } from "sonner"
import { colors } from "../../assets/Color"
import { pageTransition, itemFadeIn } from "../../assets/Animations"
import { Particles } from "../../Components/Particles"

export default function UserVerification() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)


    // Mock data for verification requests
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const mockUsers = [
                {
                    _id: "usr1",
                    name: "John Doe",
                    email: "john.doe@example.com",
                    avatar: "/placeholder.svg?height=40&width=40",
                    status: "pending",
                    submittedAt: new Date("2023-05-15"),
                    documents: {
                        idCard: "/placeholder.svg?height=600&width=400&text=ID+Card",
                        proofOfAddress: "/placeholder.svg?height=600&width=400&text=Proof+of+Address",
                    },
                },
                {
                    _id: "usr2",
                    name: "Jane Smith",
                    email: "jane.smith@example.com",
                    avatar: "/placeholder.svg?height=40&width=40",
                    status: "pending",
                    submittedAt: new Date("2023-05-16"),
                    documents: {
                        idCard: "/placeholder.svg?height=600&width=400&text=ID+Card",
                        proofOfAddress: "/placeholder.svg?height=600&width=400&text=Proof+of+Address",
                    },
                },
                {
                    _id: "usr3",
                    name: "Michael Johnson",
                    email: "michael.johnson@example.com",
                    avatar: "/placeholder.svg?height=40&width=40",
                    status: "approved",
                    submittedAt: new Date("2023-05-10"),
                    verifiedAt: new Date("2023-05-12"),
                    documents: {
                        idCard: "/placeholder.svg?height=600&width=400&text=ID+Card",
                        proofOfAddress: "/placeholder.svg?height=600&width=400&text=Proof+of+Address",
                    },
                },
                {
                    _id: "usr4",
                    name: "Emily Williams",
                    email: "emily.williams@example.com",
                    avatar: "/placeholder.svg?height=40&width=40",
                    status: "declined",
                    submittedAt: new Date("2023-05-08"),
                    verifiedAt: new Date("2023-05-09"),
                    documents: {
                        idCard: "/placeholder.svg?height=600&width=400&text=ID+Card",
                        proofOfAddress: "/placeholder.svg?height=600&width=400&text=Proof+of+Address",
                    },
                    declineReason: "Documents unclear or expired",
                },
                {
                    _id: "usr5",
                    name: "David Brown",
                    email: "david.brown@example.com",
                    avatar: "/placeholder.svg?height=40&width=40",
                    status: "pending",
                    submittedAt: new Date("2023-05-17"),
                    documents: {
                        idCard: "/placeholder.svg?height=600&width=400&text=ID+Card",
                        proofOfAddress: "/placeholder.svg?height=600&width=400&text=Proof+of+Address",
                    },
                },
            ]
            setUsers(mockUsers)
            setLoading(false)
        }, 1000)
    }, [])

    // Filter users based on search query and status
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = selectedStatus === "all" || user.status === selectedStatus
        return matchesSearch && matchesStatus
    })

    // Handle document view
    const handleViewDocuments = (user) => {
        setSelectedUser(user)
        setIsDocumentDialogOpen(true)
    }

    // Get status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case "approved":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
            case "declined":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Declined</Badge>
            case "pending":
                return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    // Handle verification approval
    const handleApprove = async () => {
        try {
            // Simulate API call
            // In a real app, you would call an API endpoint to update the user's verification status
            setTimeout(() => {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === selectedUser._id ? { ...user, status: "approved", verifiedAt: new Date() } : user,
                    ),
                )
                setIsDocumentDialogOpen(false)
                toast.success("User verification approved successfully")
            }, 500)
        } catch (error) {
            toast.error("Failed to approve verification")
        }
    }

    // Handle verification decline
    const handleDecline = async () => {
        try {
            // Simulate API call
            // In a real app, you would call an API endpoint to update the user's verification status
            setTimeout(() => {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === selectedUser._id
                            ? {
                                ...user,
                                status: "declined",
                                verifiedAt: new Date(),
                                declineReason: "Documents do not meet requirements",
                            }
                            : user,
                    ),
                )
                setIsDocumentDialogOpen(false)
                toast.success("User verification declined")
            }, 500)
        } catch (error) {
            toast.error("Failed to decline verification")
        }
    }

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <motion.div className="min-h-screen bg-light flex" initial="hidden" animate="visible" variants={pageTransition}>
            <motion.div className="flex-1 flex flex-col" variants={itemFadeIn}>
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
                                    User Verification
                                </motion.h1>
                                <motion.p
                                    className="text-muted-foreground"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Review and verify user submitted documents
                                </motion.p>
                            </div>

                            <motion.div
                                className="flex items-center space-x-3 mt-4 md:mt-0"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Button
                                    onClick={() => {
                                        setLoading(true)
                                        setTimeout(() => setLoading(false), 1000)
                                    }}
                                    variant="outline"
                                    className="h-9"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh
                                </Button>
                            </motion.div>
                        </div>

                        {/* Filters */}
                        <motion.div className="bg-white p-4 rounded-lg border border-gray-100 mb-6" variants={itemFadeIn}>
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by name or email..."
                                            className="pl-10"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center">
                                        <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="text-sm">Filter:</span>
                                    </div>

                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="declined">Declined</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </motion.div>

                        {/* Verification Requests Table */}
                        <motion.div variants={itemFadeIn}>
                            <Card>
                                <CardContent className="p-0">
                                    {loading ? (
                                        <div className="flex justify-center items-center p-8">
                                            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[50px]">ID</TableHead>
                                                    <TableHead>User</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Submitted Date</TableHead>
                                                    <TableHead className="text-left">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredUsers.map((user) => (
                                                    <TableRow key={user._id} className="hover:bg-gray-50">
                                                        <TableCell className="font-medium">{user._id}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <div className="font-medium">{user.name}</div>
                                                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                                                        <TableCell>{formatDate(user.submittedAt)}</TableCell>
                                                        <TableCell className="">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleViewDocuments(user)}
                                                                className="flex items-center"
                                                            >
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                Open Documents
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Pagination */}
                            <div className="mt-6 flex justify-center">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious href="#" />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#" isActive>
                                                1
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#">2</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationNext href="#" />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </motion.div>
                    </div>
                </main>
            </motion.div>

            {/* Document Verification Dialog */}
            {selectedUser && (
                <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
                    <DialogContent className="sm:max-w-[900px]">
                        <DialogHeader>
                            <DialogTitle>Verify User Documents</DialogTitle>
                            <DialogDescription>
                                Review {selectedUser.name}'s verification documents submitted on {formatDate(selectedUser.submittedAt)}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">ID Card</h3>
                                <div className="border rounded-md overflow-hidden bg-muted h-[300px]">
                                    <img
                                        src={selectedUser.documents.idCard || "/placeholder.svg"}
                                        alt="ID Card"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Proof of Address</h3>
                                <div className="border rounded-md overflow-hidden bg-muted h-[300px]">
                                    <img
                                        src={selectedUser.documents.proofOfAddress || "/placeholder.svg"}
                                        alt="Proof of Address"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 py-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
                                <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">{selectedUser.name}</div>
                                <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                            </div>
                            <div className="ml-auto">{getStatusBadge(selectedUser.status)}</div>
                        </div>

                        {selectedUser.status === "declined" && selectedUser.declineReason && (
                            <div className="bg-red-50 p-3 rounded-md text-sm text-red-800 mb-4">
                                <span className="font-medium">Decline reason:</span> {selectedUser.declineReason}
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDocumentDialogOpen(false)}>
                                Cancel
                            </Button>
                            {selectedUser.status === "pending" && (
                                <>
                                    <Button variant="destructive" onClick={handleDecline}>
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Decline
                                    </Button>
                                    <Button
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                        }}
                                        onClick={handleApprove}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Approve
                                    </Button>
                                </>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </motion.div>
    )
}
