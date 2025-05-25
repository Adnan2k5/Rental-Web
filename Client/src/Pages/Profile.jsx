"use client"

import { getUserById, uploadUserBanner } from "../api/users.api"
import { updateProfilePicture } from "../api/auth.api"
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card } from "../Components/ui/card"
import { Avatar } from "../Components/ui/avatar"
import { Badge } from "../Components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs"
import { Button } from "../Components/ui/button"
import { fetchByUserId } from "../api/items.api"
import { ArrowLeft, Camera, Upload, Star, MapPin, Calendar, Phone, Mail } from "lucide-react"
import { Footer } from "../Components/Footer"
import { useAuth } from "../Middleware/AuthProvider"
import { toast } from "sonner"

export function ProfilePage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [viewuser, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [items, setItems] = useState([])
    const [uploadingBanner, setUploadingBanner] = useState(false)
    const [uploadingProfilePic, setUploadingProfilePic] = useState(false)
    const { user } = useAuth()
    const fileInputRef = useRef(null)
    const profilePicInputRef = useRef(null)

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

    // Validate file before upload
    const validateFile = (file) => {
        const maxSize = 5 * 1024 * 1024 // 5MB
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

        if (!file) {
            throw new Error("No file selected")
        }

        if (file.size > maxSize) {
            throw new Error("File size must be less than 5MB")
        }

        if (!allowedTypes.includes(file.type)) {
            throw new Error("Only JPEG, PNG, and WebP images are allowed")
        }

        return true
    }

    // Function to handle banner upload
    const handleBannerUpload = async (e) => {
        if (e.target.files && e.target.files[0]) {
            toast.loading("Uploading Banner...")
            setError(null) // Clear previous errors

            try {
                const file = e.target.files[0]
                validateFile(file)

                const updatedUser = await uploadUserBanner(file)
                if (updatedUser) {
                    toast.success("Banner uploaded successfully!")
                }
            } catch (err) {
                toast.error("Banner upload error:", err)
            } finally {
                setUploadingBanner(false)
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }
            }
        }
    }

    // Function to trigger file input
    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    // Function to handle profile picture upload
    const handleProfilePicUpload = async (e) => {
        if (e.target.files && e.target.files[0]) {
            toast.loading("Uploading profile picture...")
            setError(null) // Clear previous errors

            try {
                const file = e.target.files[0]
                validateFile(file)
                const formData = new FormData()
                formData.append("profilePicture", file)
                let updatedUser
                try {
                    updatedUser = await updateProfilePicture(formData)
                } catch (formDataError) {
                    toast.error("FormData failed, trying direct file upload:")
                }

                if (updatedUser) {
                    toast.success("Profile picture uploaded successfully:")
                    window.location.reload() // Reload to reflect changes
                } else {
                    throw new Error("No response from server")
                }
            } catch (err) {
                console.error("Profile picture upload error:", err)
                setError(err.message || "Failed to upload profile picture.")
            } finally {
                setUploadingProfilePic(false)
                // Reset file input
                if (profilePicInputRef.current) {
                    profilePicInputRef.current.value = ""
                }
            }
        }
    }

    // Function to trigger profile picture file input
    const triggerProfilePicInput = () => {
        if (!uploadingProfilePic) {
            profilePicInputRef.current?.click()
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-4 py-6 max-w-6xl">
                    <Button variant="ghost" onClick={handleBack} className="mb-6 hover:bg-white/50">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <div className="space-y-6">
                        {/* Loading skeleton */}
                        <Card className="overflow-hidden border-0 shadow-xl">
                            <div className="h-48 md:h-64 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 animate-pulse"></div>
                                    <div className="space-y-2">
                                        <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
                                        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-4 py-6 max-w-6xl">
                    <Button variant="ghost" onClick={handleBack} className="mb-6 hover:bg-white/50">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <Card className="p-8 text-center border-0 shadow-xl">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-500 text-2xl">⚠</span>
                        </div>
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600">
                                Try Again
                            </Button>
                            <Button onClick={() => setError(null)} variant="outline">
                                Dismiss
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    if (!viewuser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-4 py-6 max-w-6xl">
                    <Button variant="ghost" onClick={handleBack} className="mb-6 hover:bg-white/50">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <Card className="p-8 text-center border-0 shadow-xl">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-400 text-2xl">👤</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h2>
                        <p className="text-gray-600">The requested profile could not be found.</p>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                <Button variant="ghost" onClick={handleBack} className="mb-6 hover:bg-white/50 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-5 h-5 text-red-500 mr-2">⚠</div>
                                <p className="text-red-700">{error}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setError(null)}
                                className="text-red-500 hover:text-red-700"
                            >
                                ×
                            </Button>
                        </div>
                    </div>
                )}

                <Card className="overflow-hidden border-0 shadow-xl bg-white">
                    {/* Banner Section */}
                    <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                        {viewuser?.profileBanner && (
                            <img
                                src={viewuser.profileBanner || "/placeholder.svg"}
                                alt="User Banner"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/20"></div>

                        {/* Upload Banner Button */}
                        {user?._id === viewuser._id && (
                            <>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    className="hidden"
                                    onChange={handleBannerUpload}
                                />
                                <Button
                                    onClick={triggerFileInput}
                                    disabled={uploadingBanner}
                                    size="sm"
                                    variant="secondary"
                                    className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-800 shadow-lg backdrop-blur-sm"
                                >
                                    {uploadingBanner ? (
                                        <>
                                            <div className="w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Camera className="w-4 h-4 mr-2" />
                                            Change Banner
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Profile Header */}
                    <div className="relative px-6 pb-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 sm:-mt-16">
                            <div className="relative group">
                                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-xl bg-white">
                                    {viewuser.profilePicture ? (
                                        <img
                                            src={viewuser.profilePicture || "/placeholder.svg"}
                                            alt={`${viewuser.name || "User"}'s profile`}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl sm:text-3xl font-bold">
                                            {viewuser.name ? viewuser.name.charAt(0).toUpperCase() : "U"}
                                        </div>
                                    )}
                                    {/* Profile Pic Upload Overlay */}
                                    {user?._id === viewuser._id && (
                                        <>
                                            <input
                                                ref={profilePicInputRef}
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                className="hidden"
                                                onChange={handleProfilePicUpload}
                                            />
                                            <button
                                                type="button"
                                                onClick={triggerProfilePicInput}
                                                disabled={uploadingProfilePic}
                                                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-full disabled:cursor-not-allowed"
                                            >
                                                {uploadingProfilePic ? (
                                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <Camera className="w-6 h-6 text-white" />
                                                )}
                                            </button>
                                        </>
                                    )}
                                </Avatar>
                            </div>

                            <div className="text-center sm:text-left flex-1 mt-4 sm:mt-0">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{viewuser.name || "User"}</h1>
                                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                    <Badge variant="secondary" className="px-3 py-1 bg-blue-100 text-blue-800 border-blue-200">
                                        {viewuser.role === "admin" ? "Administrator" : "Member"}
                                    </Badge>
                                    <Badge
                                        variant={viewuser.verified ? "default" : "outline"}
                                        className={`px-3 py-1 ${viewuser.verified
                                            ? "bg-green-100 text-green-800 border-green-200"
                                            : "bg-gray-100 text-gray-600 border-gray-200"
                                            }`}
                                    >
                                        {viewuser.verified ? "✓ Verified" : "Unverified"}
                                    </Badge>
                                    <Badge
                                        variant={viewuser.status === "active" ? "default" : "destructive"}
                                        className={`px-3 py-1 ${viewuser.status === "active"
                                            ? "bg-green-100 text-green-800 border-green-200"
                                            : "bg-red-100 text-red-800 border-red-200"
                                            }`}
                                    >
                                        {viewuser.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <Tabs defaultValue="info" className="px-6 pb-6">
                        <TabsList className="grid grid-cols-2 mb-8 bg-gray-100 p-1 rounded-lg">
                            <TabsTrigger
                                value="info"
                                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-md transition-all"
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                Personal Info
                            </TabsTrigger>
                            <TabsTrigger
                                value="items"
                                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-md transition-all"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Items ({items?.length || 0})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="info" className="space-y-8">
                            {/* Contact Information */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4 flex items-center">
                                    <Mail className="w-5 h-5 mr-2 text-blue-600" />
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Email</p>
                                            <p className="font-semibold text-gray-900">{viewuser.email || "Not provided"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Phone</p>
                                            <p className="font-semibold text-gray-900">{viewuser.phoneNumber || "Not provided"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4 flex items-center">
                                    <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                                    Additional Information
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Address</p>
                                            <p className="font-semibold text-gray-900">{viewuser.address || "Not provided"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <span className="text-orange-600 font-bold">📄</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Document Status</p>
                                            <Badge variant="outline" className="bg-white border-gray-200">
                                                {viewuser.documentVerified || "Not verified"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 lg:col-span-2">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Member Since</p>
                                            <p className="font-semibold text-gray-900">
                                                {viewuser.createdAt
                                                    ? new Date(viewuser.createdAt).toLocaleDateString("en-US", {
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
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold flex items-center">
                                        <Upload className="w-5 h-5 mr-2 text-blue-600" />
                                        User Items
                                    </h3>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        {items?.length || 0} items
                                    </Badge>
                                </div>

                                {!items || items.length === 0 ? (
                                    <div className="text-center py-16 bg-gray-50 rounded-xl">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                            <Upload className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h4 className="text-lg font-medium text-gray-900 mb-2">No items yet</h4>
                                        <p className="text-gray-500">This user hasn't uploaded any items.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {items.map((item) => (
                                            <Card
                                                key={item._id}
                                                className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                                            >
                                                <div className="h-48 overflow-hidden bg-gray-100">
                                                    {item.images && item.images.length > 0 ? (
                                                        <img
                                                            src={item.images[0] || "/placeholder.svg"}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                                            <span className="text-gray-400 text-sm">No Image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-5">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="font-semibold text-lg text-gray-900 line-clamp-1 flex-1">{item.name}</h4>
                                                        <Badge variant="outline" className="ml-2 bg-gray-50 text-gray-600 border-gray-200 text-xs">
                                                            {item.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-bold text-xl text-gray-900">${item.price?.toFixed(2) || "0.00"}</p>
                                                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                            <span className="text-sm font-medium text-yellow-700">
                                                                {item.avgRating?.toFixed(1) || "0.0"}
                                                            </span>
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

                <div className="mt-8">
                    <Footer />
                </div>
            </div>
        </div>
    )
}
