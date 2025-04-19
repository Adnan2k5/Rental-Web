"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Plus, Clock, CheckCircle, AlertCircle, HelpCircle, RefreshCw } from "lucide-react"
import { getUserTickets } from "../../api/tickets.api"
import { Button } from "../../Components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../Components/ui/card"
import { Badge } from "../../Components/ui/badge"
import { Separator } from "../../Components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "../../Components/ui/tabs"
import { itemFadeIn } from "../../assets/Animations"
import { Loader } from "../../Components/loader"

export const UserTickets = () => {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState("all")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true)
                const response = await getUserTickets()
                if (response && response.data) {
                    setTickets(response.data)
                }
                setLoading(false)
            } catch (err) {
                console.error("Error fetching tickets:", err)
                setError("No tickets found.")
                setLoading(false)
            }
        }

        fetchTickets()
    }, [])

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
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
        switch (status.toLowerCase()) {
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
        switch (priority.toLowerCase()) {
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

    const filteredTickets = tickets.filter((ticket) => {
        if (activeTab === "all") return true
        return ticket.status.toLowerCase() === activeTab.toLowerCase()
    })

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

    if (loading) {
        return <Loader />
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Support Tickets</h1>
                    <p className="text-muted-foreground">Manage and track your support requests</p>
                </div>
                <Button onClick={() => navigate("/dashboard/tickets/create")}>
                    <Plus className="mr-2 h-4 w-4" /> New Ticket
                </Button>
            </div>

            <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 md:w-[400px]">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="open">Open</TabsTrigger>
                    <TabsTrigger value="in progress">In Progress</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
            </Tabs>

            {error && (
                <Card className="mb-6 border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {filteredTickets.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <div className="flex flex-col items-center justify-center">
                            <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No tickets found</h3>
                            <p className="text-muted-foreground mb-4">
                                {activeTab === "all"
                                    ? "You haven't created any support tickets yet."
                                    : `You don't have any ${activeTab} tickets.`}
                            </p>
                            <Button onClick={() => navigate("/dashboard/tickets/create")}>Create Your First Ticket</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredTickets.map((ticket) => (
                        <motion.div key={ticket._id} variants={itemFadeIn}>
                            <Card className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                                            <CardDescription>Ticket #{ticket._id.substring(ticket._id.length - 8)}</CardDescription>
                                        </div>
                                        <Badge className={getStatusColor(ticket.status)}>
                                            <div className="flex items-center">
                                                {getStatusIcon(ticket.status)}
                                                <span className="ml-1">{ticket.status}</span>
                                            </div>
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{ticket.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className="bg-gray-50">
                                            {ticket.category}
                                        </Badge>
                                        {ticket.priority && (
                                            <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                                {ticket.priority} Priority
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                                <Separator />
                                <CardFooter className="flex justify-between pt-3">
                                    <div className="text-xs text-muted-foreground">Created: {formatDate(ticket.createdAt)}</div>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link to={`/dashboard/tickets/${ticket._id}`}>View Details</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
