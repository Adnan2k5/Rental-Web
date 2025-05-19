"use client"

import { getUserById } from "../api/users.api"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card } from "../Components/ui/card"
import { Avatar } from "../Components/ui/avatar"
import { Badge } from "../Components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs"
import { Separator } from "../Components/ui/separator"
import { Button } from "../Components/ui/button"
import { fetchByUserId } from "../api/items.api"
import { ArrowLeft } from "lucide-react"
import { Footer } from "../Components/Footer"

export function ProfilePage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [items, setItems] = useState([])

    useEffect(() => {
        setLoading(true)
        const fetchUserProfile = async () => {
            try {
                const res = await getUserById(id)
                setUser(res)
            } catch (error) {
                console.error("Error fetching user profile:", error)
                setError("Failed to load profile data. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        const fetchUserItems = async () => {
            try {
                const res = await fetchByUserId(id)

                if (res.status === 200) {
                    setItems(res.data.message)
                } else {
                    setError("Failed to load items.")
                }
            } catch (error) {
                console.error("Error fetching user items:", error)
                setError("Failed to load items. Please try again later.")
            }
        }

        fetchUserProfile()
        fetchUserItems()
    }, [id])

    const handleBack = () => {
        navigate(-1)
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <Button variant="ghost" onClick={handleBack} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-32 w-full max-w-2xl bg-gray-200 animate-pulse rounded"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Button variant="ghost" onClick={handleBack} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Card className="p-6 text-center">
                    <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
                    <p>{error}</p>
                    <Button onClick={() => window.location.reload()} className="mt-4">
                        Try Again
                    </Button>
                </Card>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container mx-auto p-6">
                <Button variant="ghost" onClick={handleBack} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Card className="p-6 text-center">
                    <h2 className="text-xl font-bold mb-2">User Not Found</h2>
                    <p>The requested profile could not be found.</p>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6">
            <Button variant="ghost" onClick={handleBack} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>

            <Card className="overflow-hidden border border-gray-200">
                {/* Profile Header */}
                <div className="bg-black p-8 text-white">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <Avatar className="h-24 w-24 border-4 border-white">
                            <div className="flex h-24 w-24 items-center justify-center bg-gray-800 text-2xl font-semibold uppercase text-white">
                                {user.name ? user.name.charAt(0) : "U"}
                            </div>
                        </Avatar>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-2">{user.name || "User"}</h1>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <Badge variant="outline" className="px-3 py-1 text-sm bg-white text-black">
                                    {user.role === "admin" ? "Administrator" : "Member"}
                                </Badge>
                                <Badge variant="outline" className="px-3 py-1 text-sm bg-white text-black">
                                    {user.verified ? "Verified" : "Unverified"}
                                </Badge>
                                <Badge variant="outline" className="px-3 py-1 text-sm bg-white text-black">
                                    {user.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <Tabs defaultValue="info" className="p-6">
                    <TabsList className="grid grid-cols-2 mb-8 bg-gray-100">
                        <TabsTrigger value="info" className="data-[state=active]:bg-black data-[state=active]:text-white">
                            Personal Info
                        </TabsTrigger>
                        <TabsTrigger value="items" className="data-[state=active]:bg-black data-[state=active]:text-white">
                            Items
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="info">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                                <Separator className="mb-4 bg-gray-300" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{user.email || "Not provided"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium">{user.phoneNumber || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-2">Additional Information</h3>
                                <Separator className="mb-4 bg-gray-300" />
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Address</p>
                                        <p className="font-medium">{user.address || "Not provided"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Document Verification</p>
                                        <p className="font-medium">
                                            <Badge variant="outline" className="bg-gray-100">
                                                {user.documentVerified}
                                            </Badge>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Member Since</p>
                                        <p className="font-medium">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })
                                                : "Unknown"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="items">
                        <div>
                            <h3 className="text-lg font-medium mb-2">User Items</h3>
                            <Separator className="mb-4 bg-gray-300" />

                            {items && items.length === 0 ? (
                                <div className="text-center p-8">
                                    <p className="text-gray-500">This user has no items yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {items &&
                                        items.map((item) => (
                                            <Card key={item._id} className="overflow-hidden flex flex-col border border-gray-200">
                                                <div className="h-48 overflow-hidden">
                                                    {item.images && item.images.length > 0 ? (
                                                        <img
                                                            src={item.images[0] || "/placeholder.svg"}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover transition-transform hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Image</div>
                                                    )}
                                                </div>
                                                <div className="p-4 flex flex-col flex-grow">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-semibold text-lg line-clamp-1">{item.name}</h4>
                                                        <Badge variant="outline" className="bg-gray-100">
                                                            {item.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{item.description}</p>
                                                    <div className="mt-auto flex justify-between items-center">
                                                        <p className="font-bold">${item.price.toFixed(2)}</p>
                                                        <div className="flex items-center">
                                                            <span className="text-black mr-1">★</span>
                                                            <span>{item.avgRating.toFixed(1)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </Card>
            <Footer />
        </div>
    )
}
