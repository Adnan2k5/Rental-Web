"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, CheckCircle, AlertCircle, HelpCircle, RefreshCw, Paperclip, Send, Calendar, User, Tag, Flag } from 'lucide-react'
import { getTicketById, addTicketResponse, updateTicketStatus } from "../../api/tickets.api"
import { Button } from "../../Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../Components/ui/card"
import { Badge } from "../../Components/ui/badge"
import { Separator } from "../../Components/ui/separator"
import { Textarea } from "../../Components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "../../Components/ui/avatar"
import { pageTransition, itemFadeIn } from "../../assets/Animations"
import { Loader } from "../../Components/loader"
import { useAuth } from "../../Middleware/AuthProvider"
import { useTranslation } from "react-i18next"

export const TicketDetails = () => {
    const { ticketId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [ticket, setTicket] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [newResponse, setNewResponse] = useState("")
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                setLoading(true)
                const response = await getTicketById(ticketId)
                if (response && response.data) {
                    setTicket(response.data)
                }
                setLoading(false)
            } catch (err) {
                console.error("Error fetching ticket details:", err)
                setError(t('ticketDetails.errorLoad', 'Failed to load ticket details. Please try again later.'))
                setLoading(false)
            }
        }

        if (ticketId) {
            fetchTicketDetails()
        }
    }, [ticketId])

    const handleSubmitResponse = async (e) => {
        e.preventDefault()
        if (!newResponse.trim()) return

        try {
            setSubmitting(true)
            const response = await addTicketResponse(ticketId, newResponse)
            if (response && response.data) {
                // Update the ticket with the new response
                setTicket(response.data)
                setNewResponse("")
            }
            setSubmitting(false)
        } catch (err) {
            console.error("Error submitting response:", err)
            setError(t('ticketDetails.submitError', 'Failed to submit your response. Please try again.'))
            setSubmitting(false)
        }
    }

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "open":
                return <Clock className="h-4 w-4 text-yellow-500" />
            case "in progress":
                return <RefreshCw className="h-4 w-4 text-blue-500" />
            case "resolved":
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case "closed":
                return <CheckCircle className="h-4 w-4 text-gray-500" />
            default:
                return <HelpCircle className="h-4 w-4 text-gray-500" />
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "open":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "in progress":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "resolved":
                return "bg-green-100 text-green-800 border-green-200"
            case "closed":
                return "bg-gray-100 text-gray-800 border-gray-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case "high":
                return "bg-red-100 text-red-800 border-red-200"
            case "medium":
                return "bg-orange-100 text-orange-800 border-orange-200"
            case "low":
                return "bg-green-100 text-green-800 border-green-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    if (loading) {
        return <Loader />
    }

    if (error) {
        return (
            <Card className="mb-6 border-red-200 bg-red-50">
                <CardContent className="pt-6">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-red-700">{error}</p>
                    </div>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate("/dashboard/tickets")}
                    >
                        {t('ticketDetails.backToTickets', 'Back to Tickets')}
                    </Button>
                </CardContent>
            </Card>
        )
    }

    if (!ticket) {
        return (
            <Card className="text-center py-12">
                <CardContent>
                    <div className="flex flex-col items-center justify-center">
                        <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">{t('ticketDetails.notFoundTitle', "Ticket not found")}</h3>
                        <p className="text-muted-foreground mb-4">
                            {t('ticketDetails.notFoundDesc', "The ticket you're looking for doesn't exist or you don't have permission to view it.")}
                        </p>
                        <Button onClick={() => navigate("/dashboard/tickets")}>
                            {t('ticketDetails.backToTickets', 'Back to Tickets')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <motion.div
            className="container mx-auto"
            initial="hidden"
            animate="visible"
            variants={pageTransition}
        >
            <div className="flex items-center mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    className="mr-2"
                    onClick={() => navigate("/dashboard/tickets")}
                >
                    <ArrowLeft className="h-4 w-4 mr-1" /> {t('ticketDetails.back', 'Back')}
                </Button>
                <h1 className="text-2xl font-bold">{t('ticketDetails.title', 'Ticket Details')}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main ticket content */}
                <div className="md:col-span-2">
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">{ticket.subject}</CardTitle>
                                    <CardDescription>
                                        {t('ticketDetails.ticketId', { id: ticket._id.substring(ticket._id.length - 8) }, 'Ticket #{{id}}')}
                                    </CardDescription>
                                </div>
                                <Badge className={getStatusColor(ticket.status)}>
                                    <div className="flex items-center">
                                        {getStatusIcon(ticket.status)}
                                        <span className="ml-1">{t(`userTickets.status.${ticket.status?.replace(/\s/g, '')?.toLowerCase()}`) || ticket.status}</span>
                                    </div>
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start mb-4">
                                <Avatar className="h-10 w-10 mr-4">
                                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                                    <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="font-medium">{ticket.user?.name || user?.name || t('ticketDetails.you', 'You')}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(ticket.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm">
                                        <p className="whitespace-pre-line">{ticket.description}</p>
                                    </div>
                                    {ticket.attachments && ticket.attachments.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium mb-2">{t('ticketDetails.attachments', 'Attachments')}:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {ticket.attachments.map((attachment, index) => (
                                                    <a
                                                        key={index}
                                                        href={attachment.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center p-2 bg-gray-50 rounded border text-sm hover:bg-gray-100"
                                                    >
                                                        <Paperclip className="h-4 w-4 mr-2" />
                                                        {attachment.filename || `${t('ticketDetails.attachment', 'Attachment')} ${index + 1}`}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator className="my-6" />

                            {/* Responses */}
                            <div className="space-y-6">
                                <h3 className="font-medium">{t('ticketDetails.responses', 'Responses')}</h3>

                                {ticket.responses && ticket.responses.length > 0 ? (
                                    ticket.responses.map((response, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-start"
                                            variants={itemFadeIn}
                                        >
                                            <Avatar className="h-8 w-8 mr-4">
                                                <AvatarImage
                                                    src={response.user?.avatar || "/placeholder.svg"}
                                                    alt={response.user?.name || t('ticketDetails.user', 'User')}
                                                />
                                                <AvatarFallback>
                                                    {response.user?.name?.charAt(0) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <p className="font-medium text-sm">
                                                            {response.isAdmin ? t('ticketDetails.staff', 'Staff') : t('ticketDetails.user', 'User')}
                                                            {response.isAdmin && (
                                                                <Badge className="ml-2 bg-primary/10 text-primary border-primary/20">
                                                                    {t('ticketDetails.staff', 'Staff')}
                                                                </Badge>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatDate(response.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-sm">
                                                    <p className="whitespace-pre-line">{response.message}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">{t('ticketDetails.noResponses', 'No responses yet. Add a response below.')}</p>
                                )}
                            </div>

                            {/* Add response form */}
                            {ticket.status !== "closed" && ticket.status !== "resolved" && (
                                <div className="mt-6">
                                    <form onSubmit={handleSubmitResponse}>
                                        <div className="mb-4">
                                            <Textarea
                                                placeholder={t('ticketDetails.responsePlaceholder', 'Type your response here...')}
                                                value={newResponse}
                                                onChange={(e) => setNewResponse(e.target.value)}
                                                className="min-h-[100px]"
                                                disabled={submitting}
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <Button type="submit" disabled={submitting || !newResponse.trim()}>
                                                {submitting ? (
                                                    <>
                                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                        {t('ticketDetails.sending', 'Sending...')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="mr-2 h-4 w-4" />
                                                        {t('ticketDetails.sendResponse', 'Send Response')}
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Ticket information sidebar */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{t('ticketDetails.infoTitle', 'Ticket Information')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" /> {t('ticketDetails.created', 'Created')}
                                </p>
                                <p className="text-sm">{formatDate(ticket.createdAt)}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" /> {t('ticketDetails.lastUpdated', 'Last Updated')}
                                </p>
                                <p className="text-sm">{formatDate(ticket.updatedAt)}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                                    <User className="h-4 w-4 mr-2" /> {t('ticketDetails.submittedBy', 'Submitted By')}
                                </p>
                                <p className="text-sm">{ticket.user?.name || user?.name || user?.email}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                                    <Tag className="h-4 w-4 mr-2" /> {t('ticketDetails.category', 'Category')}
                                </p>
                                <Badge variant="outline" className="bg-gray-50">
                                    {ticket.category}
                                </Badge>
                            </div>

                            {ticket.priority && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                                        <Flag className="h-4 w-4 mr-2" /> {t('ticketDetails.priority', 'Priority')}
                                    </p>
                                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                        {t(`userTickets.priority.${ticket.priority?.toLowerCase()}`) || ticket.priority}
                                    </Badge>
                                </div>
                            )}

                            <Separator />

                            {ticket.status !== "closed" && (
                                <div className="pt-2">
                                    {ticket.status === "resolved" ? (
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                            onClick={async () => {
                                                try {
                                                    await updateTicketStatus(ticketId, "open");
                                                    setTicket({ ...ticket, status: "open" });
                                                } catch (err) {
                                                    console.error("Error reopening ticket:", err);
                                                    setError(t('ticketDetails.reopenError', 'Failed to reopen ticket. Please try again.'));
                                                }
                                            }}
                                        >
                                            {t('ticketDetails.reopen', 'Reopen Ticket')}
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                            onClick={async () => {
                                                try {
                                                    await updateTicketStatus(ticketId, "resolved");
                                                    setTicket({ ...ticket, status: "resolved" });
                                                } catch (err) {
                                                    console.error("Error resolving ticket:", err);
                                                    setError(t('ticketDetails.resolveError', 'Failed to resolve ticket. Please try again.'));
                                                }
                                            }}
                                        >
                                            {t('ticketDetails.markResolved', 'Mark as Resolved')}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    )
}
