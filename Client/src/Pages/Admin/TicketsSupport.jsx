"use client"

import { Label } from "../../Components/ui/label"
import { useTranslation } from "react-i18next"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
    Search,
    Filter,
    RefreshCw,
    MessageSquare,
    CheckCircle,
    Clock,
    ChevronRight,
    AlertCircle,
    MoreHorizontal,
} from "lucide-react"
import { Button } from "../../Components/ui/button"
import { Input } from "../../Components/ui/input"
import { Card, CardContent, CardHeader } from "../../Components/ui/card"
import { Badge } from "../../Components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../Components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../Components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../Components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../Components/ui/dialog"
import { Textarea } from "../../Components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../Components/ui/tabs"
import { Separator } from "../../Components/ui/separator"
import { getAllTickets, addTicketResponse, updateTicketStatus } from "../../api/tickets.api"
import { toast } from "sonner"

export default function TicketsSupport() {
    const { t } = useTranslation();
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [replyText, setReplyText] = useState("")
    const [isReplying, setIsReplying] = useState(false)
    const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);
    const dialogRef = useRef(null);

    const fetchTickets = async (page = 1) => {
        setLoading(true)
        const filters = {};
        if (statusFilter !== "all") filters.status = statusFilter;
        filters.page = page;
        filters.limit = pageSize;
        const ticketsRes = await getAllTickets(filters);
        setTickets(ticketsRes.data.tickets);
        setTotalPages(ticketsRes.data.totalPages || 1);
        setLoading(false)
    }

    useEffect(() => {
        fetchTickets(currentPage);
        // eslint-disable-next-line
    }, [currentPage, statusFilter]);

    const pageTransition = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    }

    const itemFadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleStatusFilter = (value) => {
        setStatusFilter(value)
        setCurrentPage(1);
    }

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket)
        setTicketDialogOpen(true)
    }

    const handleReply = async () => {
        setIsReplying(true)
        const response = await addTicketResponse(selectedTicket._id, replyText)
        if (response && response.data) {
            setSelectedTicket(prev => ({
                ...prev,
                responses: response.data.responses
            }));
            setReplyText("")
        }
        setIsReplying(false)
    }

    const handleStatusChange = async (status) => {
        try {
            await updateTicketStatus(selectedTicket._id, status);
            setSelectedTicket(prev => ({
                ...prev,
                status: status
            }));
            toast.success(t("adminTickets.statusUpdated", { status: t(`adminTickets.status.${status}`) }));
        } catch (err) {
            toast.error(t("adminTickets.statusUpdateFailed"));
        }
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case "open":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        <Clock className="h-3 w-3 mr-1" />
                        {t("adminTickets.status.open")}
                    </Badge>
                )
            case "in-progress":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        {t("adminTickets.status.inProgress")}
                    </Badge>
                )
            case "closed":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {t("adminTickets.status.closed")}
                    </Badge>
                )
            default:
                return <Badge variant="outline">{t(`adminTickets.status.${status}`)}</Badge>
        }
    }

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case "high":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                        {t("adminTickets.priority.high")}
                    </Badge>
                )
            case "medium":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                        {t("adminTickets.priority.medium")}
                    </Badge>
                )
            case "low":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        {t("adminTickets.priority.low")}
                    </Badge>
                )
            default:
                return <Badge variant="outline">{t(`adminTickets.priority.${priority}`)}</Badge>
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    return (
        <motion.div className="p-6 flex flex-col justify-baseline " initial="hidden" animate="visible" variants={pageTransition}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <motion.h1
                        className="text-2xl font-bold text-dark mb-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {t("adminTickets.title")}
                    </motion.h1>
                    <motion.p
                        className="text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {t("adminTickets.subtitle")}
                    </motion.p>
                </div>
            </div>

            <motion.div className="grid gap-6" variants={itemFadeIn}>
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder={t("adminTickets.searchPlaceholder")}
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder={t("adminTickets.filterByStatus")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t("adminTickets.status.all")}</SelectItem>
                                        <SelectItem value="open">{t("adminTickets.status.open")}</SelectItem>
                                        <SelectItem value="in-progress">{t("adminTickets.status.inProgress")}</SelectItem>
                                        <SelectItem value="closed">{t("adminTickets.status.closed")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                                <h3 className="font-medium text-lg">{t("adminTickets.noTicketsTitle")}</h3>
                                <p className="text-muted-foreground">
                                    {searchQuery
                                        ? t("adminTickets.noTicketsSearch")
                                        : t("adminTickets.noTicketsDesc")}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="rounded-md border">
                                    <div className="grid grid-cols-12 bg-muted p-3 text-sm font-medium">
                                        <div className="col-span-5 md:col-span-4">{t("adminTickets.table.ticket")}</div>
                                        <div className="col-span-3 hidden md:block">{t("adminTickets.table.customer")}</div>
                                        <div className="col-span-3 md:col-span-2">{t("adminTickets.table.status")}</div>
                                        <div className="col-span-2 hidden md:block">{t("adminTickets.table.priority")}</div>
                                        <div className="col-span-4 md:col-span-1 text-right">{t("adminTickets.table.actions")}</div>
                                    </div>
                                    <div className="divide-y">
                                        {tickets.filter((ticket) => {
                                            const matchesSearch =
                                                ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase())
                                            return matchesSearch;
                                        }).map((ticket) => (
                                            <motion.div
                                                key={ticket._id}
                                                className="grid grid-cols-12 items-center p-3 hover:bg-muted/50 cursor-pointer"
                                                onClick={() => handleTicketClick(ticket)}
                                                whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                                            >
                                                <div className="col-span-5 md:col-span-4">
                                                    <div className="font-medium">{ticket.subject}</div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <span>{ticket.id}</span>
                                                        <span>•</span>
                                                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="col-span-3 hidden md:block">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={"/placeholder.svg"} alt={ticket.user.name} />
                                                            <AvatarFallback>{ticket.user.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="truncate">{ticket.user.name}</span>
                                                    </div>
                                                </div>
                                                <div className="col-span-3 md:col-span-2">{getStatusBadge(ticket.status)}</div>
                                                <div className="col-span-2 hidden md:block">{getPriorityBadge(ticket.priority)}</div>
                                                <div className="col-span-4 md:col-span-1 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleTicketClick(ticket)
                                                        }}
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                {/* Pagination Controls */}
                                <div className="flex justify-center items-center gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    >
                                        {t("pagination.previous")}
                                    </Button>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <Button
                                            key={i + 1}
                                            variant={currentPage === i + 1 ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    >
                                        {t("pagination.next")}
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Ticket Detail Dialog */}
            <Dialog open={ticketDialogOpen} onOpenChange={(open) => {
                setTicketDialogOpen(open);
                if (!open) {
                    setTimeout(() => setSelectedTicket(null), 100);
                }
            }}>
                {selectedTicket && (
                    <DialogContent
                        ref={dialogRef}
                        onOpenAutoFocus={(e) => {
                            e.preventDefault();
                            if (dialogRef.current) {
                                const safeToFocus = dialogRef.current.querySelector('[role="dialog"]');
                                if (safeToFocus) safeToFocus.focus();
                            }
                        }}
                        onEscapeKeyDown={() => setTicketDialogOpen(false)}
                        className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DialogTitle>{selectedTicket.subject}</DialogTitle>
                                    <span className="text-sm text-muted-foreground">({selectedTicket.id})</span>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleStatusChange("open")}>{t("adminTickets.markOpen")}</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>{t("adminTickets.markInProgress")}</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange("closed")}>{t("adminTickets.markClosed")}</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <DialogDescription>
                                {t("adminTickets.statusLabel", { status: t(`adminTickets.status.${selectedTicket.status}`), priority: t(`adminTickets.priority.${selectedTicket.priority}`), category: selectedTicket.category })}
                            </DialogDescription>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {getStatusBadge(selectedTicket.status)}
                                {getPriorityBadge(selectedTicket.priority)}
                            </div>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto py-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Avatar>
                                    <AvatarImage src={"/placeholder.svg"} alt={selectedTicket.user.name} />
                                    <AvatarFallback>{selectedTicket.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{selectedTicket.user.name}</div>
                                    <div className="text-sm text-muted-foreground">{selectedTicket.user.email}</div>
                                </div>
                            </div>
                            <Tabs defaultValue="conversation" className="w-full">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="conversation">{t("adminTickets.tabs.conversation")}</TabsTrigger>
                                    <TabsTrigger value="details">{t("adminTickets.tabs.details")}</TabsTrigger>
                                </TabsList>
                                <TabsContent value="conversation" className="space-y-4">
                                    {selectedTicket.responses.map((message) => (
                                        <div
                                            key={message.timestamp}
                                            className={`flex ${message.isAdmin ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-lg p-3 ${message.isAdmin ? "bg-primary text-primary-foreground" : "bg-muted"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={"/placeholder.svg"} alt={selectedTicket.user.name} />
                                                        <AvatarFallback>{selectedTicket.user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm font-medium">{message.isAdmin ? t("adminTickets.staff") : selectedTicket.user.name}</span>
                                                    <span className="text-xs opacity-70">{formatDate(message.timestamp)}</span>
                                                </div>
                                                <div className="whitespace-pre-wrap">{message.message}</div>
                                            </div>
                                        </div>
                                    ))}
                                </TabsContent>
                                <TabsContent value="details">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium mb-1">{t("adminTickets.details.description")}</h3>
                                            <p className="text-sm text-muted-foreground">{selectedTicket.description}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium mb-1">{t("adminTickets.details.created")}</h3>
                                            <p className="text-sm text-muted-foreground">{formatDate(selectedTicket.createdAt)}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium mb-1">{t("adminTickets.details.lastUpdated")}</h3>
                                            <p className="text-sm text-muted-foreground">{formatDate(selectedTicket.updatedAt)}</p>
                                        </div>
                                        {selectedTicket.attachments.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-medium mb-1">{t("adminTickets.details.attachments")}</h3>
                                                <div className="space-y-2">
                                                    {selectedTicket.attachments.map((attachment, index) => (
                                                        <div key={index} className="flex items-center gap-2 p-2 rounded border">
                                                            <div className="h-8 w-8 bg-muted rounded flex items-center justify-center text-xs font-medium">
                                                                {index + 1}
                                                            </div>
                                                            <Button variant="ghost" size="sm" onClick={() => window.open(attachment, "_blank")}>
                                                                {t("adminTickets.details.view")}
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                        <Separator />
                        <div className="pt-4">
                            <div className="mb-2">
                                <Label htmlFor="reply">{t("adminTickets.reply")}</Label>
                            </div>
                            <Textarea
                                id="reply"
                                placeholder={t("adminTickets.replyPlaceholder")}
                                className="min-h-[100px]"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            <div className="flex justify-end mt-4 gap-2">
                                <Button variant="outline" onClick={() => setTicketDialogOpen(false)}>
                                    {t("adminTickets.close")}
                                </Button>
                                <Button onClick={handleReply} disabled={!replyText.trim() || isReplying}>
                                    {isReplying ? (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            {t("adminTickets.sending")}
                                        </>
                                    ) : (
                                        <>
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            {t("adminTickets.sendReply")}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </motion.div>
    )
}
