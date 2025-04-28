"use client"

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
import { toast } from "sonner"
import { pageTransition, itemFadeIn } from "../../assets/Animations"
import { Particles } from "../../Components/Particles"
import { getAllDocuments, updateDocument } from "../../api/documents.api"
import { format } from "date-fns"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function UserVerification() {
    const { t } = useTranslation();
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
        console.log(user)
        const matchesSearch =
            user.owner.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.owner.email?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = selectedStatus === "all" || user.verified === selectedStatus
        return matchesSearch && matchesStatus
    })

    const handleViewDocuments = (user) => {
        setSelectedUser(user)
        setIsDocumentDialogOpen(true)
    }

    const getStatusBadge = (verified) => {
        if (verified === "verified") {
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t('userVerificationAdmin.statusApproved')}</Badge>
        } else if (verified === "pending") {
            return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{t('userVerificationAdmin.statusPending')}</Badge>
        }
        else {
            return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{t('userVerificationAdmin.statusDeclined')}</Badge>
        }
    }

    // Handle verification approval
    const handleApprove = async () => {
        const updatedUser = {
            ...selectedUser,
            verified: 'verified',
            verifiedAt: new Date(),
        }
        console.log(updatedUser)
        try {
            const res = await updateDocument(selectedUser._id, updatedUser)
            if (res.status === 200) {
                toast.success("User verification approved")
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
                verified: 'declined',
                verifiedAt: new Date(),
            }
            const res = await updateDocument(selectedUser._id, updatedUser)
            if (res.status === 200) {
                toast.success("User verification declined")
            } else {
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
                                    {t('userVerificationAdmin.title')}
                                </motion.h1>
                                <motion.p
                                    className="text-muted-foreground"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {t('userVerificationAdmin.subtitle')}
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
                                    {t('userVerificationAdmin.refresh')}
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
                                            placeholder={t('userVerificationAdmin.searchPlaceholder')}
                                            className="pl-10"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center">
                                        <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="text-sm">{t('userVerificationAdmin.filter')}:</span>
                                    </div>

                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder={t('userVerificationAdmin.status')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t('userVerificationAdmin.statusAll')}</SelectItem>
                                            <SelectItem value="false">{t('userVerificationAdmin.statusPending')}</SelectItem>
                                            <SelectItem value="true">{t('userVerificationAdmin.statusApproved')}</SelectItem>
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
                                                    <TableHead className="w-[50px]">{t('userVerificationAdmin.table.id')}</TableHead>
                                                    <TableHead>{t('userVerificationAdmin.table.user')}</TableHead>
                                                    <TableHead>{t('userVerificationAdmin.table.status')}</TableHead>
                                                    <TableHead>{t('userVerificationAdmin.table.submittedDate')}</TableHead>
                                                    <TableHead className="text-left">{t('userVerificationAdmin.table.actions')}</TableHead>
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
                                                        <TableCell>{format(user.createdAt, "dd MMM yyyy")}</TableCell>
                                                        <TableCell className="">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleViewDocuments(user)}
                                                                className="flex items-center"
                                                            >
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                {t('userVerificationAdmin.openDocuments')}
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
                <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
                    <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">{t('userVerificationAdmin.dialogTitle')}</DialogTitle>
                            <DialogDescription>
                                {t('userVerificationAdmin.dialogDesc', { name: selectedUser.owner.name })}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="documents grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            <motion.div
                                className="space-y-3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-sm font-medium flex items-center">
                                    <Badge variant="outline" className="mr-2 bg-gray-100 text-gray-800 border-gray-300">
                                        {t('userVerificationAdmin.idCard')}
                                    </Badge>
                                    {t('userVerificationAdmin.idCardDesc')}
                                </h3>
                                <Link to={selectedUser.documentUrl} target="_blank" className="border rounded-lg overflow-hidden bg-muted shadow-sm hover:shadow-md transition-shadow">
                                    <div className="border rounded-lg overflow-hidden bg-muted shadow-sm hover:shadow-md transition-shadow flex items-center justify-center">
                                        <img
                                            src={selectedUser.documentUrl}
                                            alt={t('userVerificationAdmin.idCard')}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </Link>
                            </motion.div>

                            <motion.div
                                className="space-y-3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                <h3 className="text-sm font-medium flex items-center">
                                    <Badge variant="outline" className="mr-2 bg-gray-100 text-gray-800 border-gray-300">
                                        {t('userVerificationAdmin.selfie')}
                                    </Badge>
                                    {t('userVerificationAdmin.selfieDesc')}
                                </h3>
                                <Link to={selectedUser.imageUrl} target="_blank" className="border rounded-lg overflow-hidden bg-muted shadow-sm hover:shadow-md transition-shadow">
                                    <div className="border rounded-lg overflow-hidden bg-muted shadow-sm hover:shadow-md transition-shadow  flex items-center justify-center">
                                        <img
                                            src={selectedUser.imageUrl}
                                            alt={t('userVerificationAdmin.selfie')}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </Link>
                            </motion.div>
                        </div>

                        <motion.div
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-3 px-4 bg-gray-100 rounded-lg my-2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: 0.2 }}
                        >
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarImage src={selectedUser.owner.profileImage || "/placeholder.svg"} />
                                <AvatarFallback className="bg-gray-800 text-white">{selectedUser.owner.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">{selectedUser.owner.name}</div>
                                <div className="text-sm text-muted-foreground">{selectedUser.owner.email}</div>
                            </div>
                            <div className="ml-auto mt-2 sm:mt-0">{getStatusBadge(selectedUser.verified)}</div>
                        </motion.div>

                        <DialogFooter className="flex-col sm:flex-row gap-3 mt-4">
                            <Button variant="outline" onClick={() => setIsDocumentDialogOpen(false)}>
                                {t('dialogbox.cancel')}
                            </Button>
                            <Button
                                variant="destructive"
                                className="bg-red-500 hover:bg-red-600 text-white transition-colors"
                                onClick={handleDecline}
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                {t('userVerificationAdmin.decline')}
                            </Button>
                            <Button
                                variant="default"
                                className="bg-green-500 hover:bg-green-600 text-white transition-colors"
                                onClick={handleApprove}
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {t('userVerificationAdmin.approve')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </motion.div>
    )
}
