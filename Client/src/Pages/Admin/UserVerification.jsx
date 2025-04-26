import { useState, useEffect } from "react"
import { Search, Filter, RefreshCw, Eye, CheckCircle, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../../Components/ui/button"
import { Input } from "../../Components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../Components/ui/avatar"
import { Badge } from "../../Components/ui/badge"
import { Card, CardContent } from "../../Components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../Components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../Components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../Components/ui/dialog"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../Components/ui/pagination"
import { toast } from "sonner"
import { colors } from "../../assets/Color"
import { pageTransition, itemFadeIn } from "../../assets/Animations"
import { Particles } from "../../Components/Particles"
import { getAllDocuments, updateDocument } from "../../api/documents.api"
import { format } from "date-fns"

export default function UserVerification() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)


    const fetchDocuments = async () => {
        const res = await getAllDocuments()
        if (res.status === 200) {
            setUsers(res.data.message.documents)
            setLoading(false)
        }
        if (res.status === 400) {
            toast.error("Failed to fetch documents")
        }
    }

    useEffect(() => {
        fetchDocuments()
    }, [])

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.owner.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = selectedStatus === "all" || user.verified === selectedStatus
        return matchesSearch && matchesStatus
    })

    const handleViewDocuments = (user) => {
        setSelectedUser(user)
        setIsDocumentDialogOpen(true)
    }

    const getStatusBadge = (verified) => {
        if (verified) {
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
        }
        else {
            return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>
        }
    }

    // Handle verification approval
    const handleApprove = async () => {
        const updatedUser = {
            ...selectedUser,
            verified: true,
            verifiedAt: new Date(),
        }
        console.log(updatedUser)
        try {
            const res = await updateDocument(selectedUser._id, updatedUser);
            if (res.status === 200) {
                toast.success("User verification approved")
                location.reload()
            }
        } catch (error) {
            toast.error("Failed to approve verification")
        }
    }
    // Handle verification decline
    const handleDecline = async () => {
        try {
            const updatedUser = {
                ...selectedUser,
                verified: false,
                verifiedAt: new Date(),
            }
            const res = await updateDocument(updatedUser.owner._id, updatedUser);
            if (res.status === 200) {
                toast.success("User verification declined")
            }
            else {
                toast.error("Failed to decline verification")
            }
        } catch (error) {
            toast.error("Failed to decline verification")
        }
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
                                            <SelectItem value="false">Pending</SelectItem>
                                            <SelectItem value="true">Approved</SelectItem>
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
                                                {filteredUsers.map((user, index) => (
                                                    <TableRow key={index} className="hover:bg-gray-50">
                                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback>{user.owner.name.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <div className="font-medium">{user.owner.name}</div>
                                                                    <div className="text-sm text-muted-foreground">{user.owner.email}</div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{getStatusBadge(user.verified)}</TableCell>
                                                        <TableCell>
                                                            {format(user.createdAt, "dd MMM yyyy")}
                                                        </TableCell>
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



                        </motion.div>
                    </div>
                </main>
            </motion.div>

            {/* Document Verification Dialog */}
            {selectedUser && (
                <Dialog open={isDocumentDialogOpen} className="sm:max-w-[300px] w-full" onOpenChange={setIsDocumentDialogOpen}>
                    <DialogContent className="">
                        <DialogHeader>
                            <DialogTitle>Verify User Documents</DialogTitle>
                            <DialogDescription>
                                Review {selectedUser.owner.name}'s verification documents and take action.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="documents flex flex-col">
                            <div className="gap-4 py-4">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">ID Card</h3>
                                    <div className="border rounded-md overflow-hidden bg-muted">
                                        <img
                                            src={selectedUser.documentUrl}
                                            alt="ID Card"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className=" gap-4 py-4">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">User Selfie</h3>
                                    <div className="border rounded-md overflow-hidden bg-muted">
                                        <img
                                            src={selectedUser.imageUrl}
                                            alt="ID Card"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 py-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{selectedUser.owner.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">{selectedUser.owner.name}</div>
                                <div className="text-sm text-muted-foreground">{selectedUser.owner.email}</div>
                            </div>
                            <div className="ml-auto">{getStatusBadge(selectedUser.verified)}</div>
                        </div>

                        {/* {selectedUser.status === "declined" && selectedUser.declineReason && (
                            <div className="bg-red-50 p-3 rounded-md text-sm text-red-800 mb-4">
                                <span className="font-medium">Decline reason:</span> {selectedUser.declineReason}
                            </div>
                        )} */}

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDocumentDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={handleDecline}
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Decline
                            </Button>
                            <Button
                                variant="default"
                                className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={handleApprove}
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </motion.div>
    )
}
