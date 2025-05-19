import { getUserById } from "../api/users.api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../Components/ui/card";
import { Avatar } from "../Components/ui/avatar";
import { Badge } from "../Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs";
import { Separator } from "../Components/ui/separator";
import { Button } from "../Components/ui/button";
import { fetchByUserId } from "../api/items.api";

export function ProfilePage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        setLoading(true);
        const fetchUserProfile = async () => {
            try {
                const res = await getUserById(id);
                setUser(res);
            }
            catch (error) {
                console.error("Error fetching user profile:", error);
                setError("Failed to load profile data. Please try again later.");
            }
            finally {
                setLoading(false);
            }
        }

        const fetchUserItems = async () => {
            try {
                const res = await fetchByUserId(id);

                if (res.status === 200) {
                    setItems(res.data.message);
                } else {
                    setError("Failed to load items.");
                }
            }
            catch (error) {
                console.error("Error fetching user items:", error);
                setError("Failed to load items. Please try again later.");
            }
        }

        fetchUserProfile();
        fetchUserItems();
    }, [id]);


    if (loading) {
        return (
            <div className="container mx-auto p-6 flex justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-32 w-full max-w-2xl bg-gray-200 animate-pulse rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Card className="p-6 text-center">
                    <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
                    <p>{error}</p>
                    <Button 
                        onClick={() => window.location.reload()} 
                        className="mt-4"
                    >
                        Try Again
                    </Button>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto p-6">
                <Card className="p-6 text-center">
                    <h2 className="text-xl font-bold mb-2">User Not Found</h2>
                    <p>The requested profile could not be found.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <Card className="overflow-hidden">
                {/* Profile Header */}
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <Avatar className="h-24 w-24 border-4 border-white">
                                            {user.profilePicture ? (
                                                <img 
                                                    src={user.profilePicture} 
                                                    alt={`${user.name || "User"}'s profile`}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-24 w-24 items-center justify-center bg-muted text-2xl font-semibold uppercase">
                                                    {user.name ? user.name.charAt(0) : "U"}
                                                </div>
                                            )}
                                        </Avatar>
                                        <div className="text-center md:text-left">
                                            <h1 className="text-3xl font-bold mb-2">{user.name || "User"}</h1>
                                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                                <Badge variant="secondary" className="px-3 py-1 text-sm">
                                                    {user.role === "admin" ? "Administrator" : "Member"}
                                                </Badge>
                                                <Badge variant={user.verified ? "success" : "outline"} className="px-3 py-1 text-sm">
                                                    {user.verified ? "Verified" : "Unverified"}
                                                </Badge>
                                                <Badge variant={user.status === "active" ? "success" : "destructive"} className="px-3 py-1 text-sm">
                                                    {user.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Profile Content */}
                <Tabs defaultValue="info" className="p-6">
                    <TabsList className="grid grid-cols-2 mb-8">
                        <TabsTrigger value="info">Personal Info</TabsTrigger>
                        <TabsTrigger value="items">Items</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="info">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                                <Separator className="mb-4" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium">{user.email || "Not provided"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Phone</p>
                                        <p className="font-medium">{user.phoneNumber || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-2">Additional Information</h3>
                                <Separator className="mb-4" />
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Address</p>
                                        <p className="font-medium">{user.address || "Not provided"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Document Verification</p>
                                        <p className="font-medium">
                                            <Badge variant={
                                                user.documentVerified === "verified" ? "success" :
                                                user.documentVerified === "pending" ? "warning" :
                                                user.documentVerified === "declined" ? "destructive" : "outline"
                                            }>
                                                {user.documentVerified}
                                            </Badge>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Member Since</p>
                                        <p className="font-medium">{
                                            user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : "Unknown"
                                        }</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="items">
                        <div>
                            <h3 className="text-lg font-medium mb-2">User Items</h3>
                            <Separator className="mb-4" />
                            
                            {items && items.length === 0 ? (
                                <div className="text-center p-8">
                                    <p className="text-muted-foreground">This user has no items yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {items && items.map((item) => (
                                        <Card key={item._id} className="overflow-hidden flex flex-col">
                                            <div className="h-48 overflow-hidden">
                                                {item.images && item.images.length > 0 ? (
                                                    <img 
                                                        src={item.images[0]} 
                                                        alt={item.name} 
                                                        className="w-full h-full object-cover transition-transform hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 flex flex-col flex-grow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-semibold text-lg line-clamp-1">{item.name}</h4>
                                                    <Badge variant={
                                                        item.status === "available" ? "success" : 
                                                        item.status === "rented" ? "destructive" : "warning"
                                                    }>
                                                        {item.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                    {item.description}
                                                </p>
                                                <div className="mt-auto flex justify-between items-center">
                                                    <p className="font-bold">${item.price.toFixed(2)}</p>
                                                    <div className="flex items-center">
                                                        <span className="text-yellow-500 mr-1">★</span>
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
        </div>
    );
}