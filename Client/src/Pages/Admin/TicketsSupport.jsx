"use client"

import { Label } from "../../components/ui/label"

import { useState, useEffect } from "react"
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

export default function TicketsSupport() {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [replyText, setReplyText] = useState("")
    const [isReplying, setIsReplying] = useState(false)
    const [ticketDialogOpen, setTicketDialogOpen] = useState(false);

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
    }

    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch =
            ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === "all" || ticket.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket)
        setTicketDialogOpen(true)
    }

    const handleReply = () => {
        console.log("replyed")
    }

    const handleStatusChange = (status) => {
        console.log("status changed", status)
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case "open":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Open
                    </Badge>
                )
            case "in_progress":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        In Progress
                    </Badge>
                )
            case "closed":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Closed
                    </Badge>
                )
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case "high":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                        High
                    </Badge>
                )
            case "medium":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                        Medium
                    </Badge>
                )
            case "low":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        Low
                    </Badge>
                )
            default:
                return <Badge variant="outline">{priority}</Badge>
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
        <motion.div className="p-6" initial="hidden" animate="visible" variants={pageTransition}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <motion.h1
                        className="text-2xl font-bold text-dark mb-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Tickets & Support
                    </motion.h1>
                    <motion.p
                        className="text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Manage customer support tickets and inquiries
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
                                        placeholder="Search tickets by ID, subject, or customer..."
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
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Tickets</SelectItem>
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
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
                        ) : filteredTickets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                                <h3 className="font-medium text-lg">No tickets found</h3>
                                <p className="text-muted-foreground">
                                    {searchQuery
                                        ? "Try adjusting your search or filter criteria"
                                        : "There are no support tickets to display"}
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <div className="grid grid-cols-12 bg-muted p-3 text-sm font-medium">
                                    <div className="col-span-5 md:col-span-4">Ticket</div>
                                    <div className="col-span-3 hidden md:block">Customer</div>
                                    <div className="col-span-3 md:col-span-2">Status</div>
                                    <div className="col-span-2 hidden md:block">Priority</div>
                                    <div className="col-span-4 md:col-span-1 text-right">Actions</div>
                                </div>
                                <div className="divide-y">
                                    {filteredTickets.map((ticket) => (
                                        <motion.div
                                            key={ticket.id}
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
                                                        <AvatarImage src={ticket.user.avatar || "/placeholder.svg"} alt={ticket.user.name} />
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
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Ticket Detail Dialog */}
            <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
                {selectedTicket && (
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DialogTitle>{selectedTicket.subject}</DialogTitle>
                                    <div className="text-sm text-muted-foreground">({selectedTicket.id})</div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleStatusChange("open")}>Mark as Open</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange("in_progress")}>
                                            Mark as In Progress
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange("closed")}>Mark as Closed</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <DialogDescription>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {getStatusBadge(selectedTicket.status)}
                                    {getPriorityBadge(selectedTicket.priority)}
                                    <Badge variant="outline" className="bg-gray-50">
                                        {selectedTicket.category}
                                    </Badge>
                                </div>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto py-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Avatar>
                                    <AvatarImage src={selectedTicket.user.avatar || "/placeholder.svg"} alt={selectedTicket.user.name} />
                                    <AvatarFallback>{selectedTicket.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{selectedTicket.user.name}</div>
                                    <div className="text-sm text-muted-foreground">{selectedTicket.user.email}</div>
                                </div>
                            </div>

                            <Tabs defaultValue="conversation" className="w-full">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="conversation">Conversation</TabsTrigger>
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                </TabsList>

                                <TabsContent value="conversation" className="space-y-4">
                                    {selectedTicket.messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-lg p-3 ${message.sender === "admin" ? "bg-primary text-primary-foreground" : "bg-muted"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={message.user.avatar || "/placeholder.svg"} alt={message.user.name} />
                                                        <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm font-medium">{message.user.name}</span>
                                                    <span className="text-xs opacity-70">{formatDate(message.timestamp)}</span>
                                                </div>
                                                <div className="whitespace-pre-wrap">{message.text}</div>
                                            </div>
                                        </div>
                                    ))}
                                </TabsContent>

                                <TabsContent value="details">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium mb-1">Description</h3>
                                            <p className="text-sm text-muted-foreground">{selectedTicket.description}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium mb-1">Created</h3>
                                            <p className="text-sm text-muted-foreground">{formatDate(selectedTicket.createdAt)}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium mb-1">Last Updated</h3>
                                            <p className="text-sm text-muted-foreground">{formatDate(selectedTicket.updatedAt)}</p>
                                        </div>

                                        {selectedTicket.attachments.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-medium mb-1">Attachments</h3>
                                                <div className="space-y-2">
                                                    {selectedTicket.attachments.map((attachment) => (
                                                        <div key={attachment.id} className="flex items-center gap-2 p-2 rounded border">
                                                            <div className="h-8 w-8 bg-muted rounded flex items-center justify-center text-xs font-medium">
                                                                {attachment.name.split(".").pop().toUpperCase()}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium truncate">{attachment.name}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {(attachment.size / 1024 / 1024).toFixed(2)} MB
                                                                </div>
                                                            </div>
                                                            <Button variant="ghost" size="sm">
                                                                View
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
                                <Label htmlFor="reply">Reply</Label>
                            </div>
                            <Textarea
                                id="reply"
                                placeholder="Type your reply here..."
                                className="min-h-[100px]"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            <div className="flex justify-end mt-4 gap-2">
                                <Button variant="outline" onClick={() => setTicketDialogOpen(false)}>
                                    Close
                                </Button>
                                <Button onClick={handleReply} disabled={!replyText.trim() || isReplying}>
                                    {isReplying ? (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            Send Reply
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
