"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import {
    User,
    Mail,
    Phone,
    MapPin,
    Camera,
    Package,
    SettingsIcon,
    LogOut,
    LayoutGrid,
    Box,
    Save,
    ArrowLeft,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Separator } from "../../components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { toast } from "sonner"
import { useAuth } from "../../Middleware/AuthProvider"
import { Link } from "react-router-dom"
import { colors } from "../../assets/Color"
import { pageTransition, itemFadeIn, shimmerAnimation } from "../../assets/Animations"
import { Particles } from "../../Components/Particles"
import { Loader } from "../../Components/loader"

export default function Settings() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState(null)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            address: user?.address || "",
            bio: user?.bio || "",
        },
    })

    useEffect(() => {
        if (user) {
            setValue("name", user.name || "")
            setValue("email", user.email || "")
            setValue("phone", user.phone || "")
            setValue("address", user.address || "")
            setValue("bio", user.bio || "")
        }
    }, [user, setValue])

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // In a real app, you would update the user profile here
            // const response = await updateUserProfile(user._id, data)

            toast.success("Profile updated successfully!")
            setIsLoading(false)
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("Failed to update profile")
            setIsLoading(false)
        }
    }

    return (
        <motion.div className="min-h-screen bg-light flex" initial="hidden" animate="visible" variants={pageTransition}>
            {/* Sidebar */}
            <motion.div className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col" variants={itemFadeIn}>
                <div className="p-6">
                    <motion.div
                        className="text-2xl font-bold"
                        style={{
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                        {...shimmerAnimation}
                    >
                        Rental
                    </motion.div>
                </div>

                <div className="flex-1 py-6">
                    <div className="px-3 mb-6">
                        <div className="text-xs font-semibold text-muted-foreground mb-2 px-3">MENU</div>
                        {[
                            {
                                icon: <Package className="h-4 w-4 mr-3" />,
                                label: "My Dashboard",
                                active: false,
                                link: "/dashboard",
                            },
                            {
                                icon: <Box className="h-4 w-4 mr-3" />,
                                label: "My Items",
                                active: false,
                                link: "/dashboard/myitems",
                            },
                            {
                                icon: <LayoutGrid className="h-4 w-4 mr-3" />,
                                label: "Browse",
                                active: false,
                                link: "/browse",
                            },
                            {
                                icon: <SettingsIcon className="h-4 w-4 mr-3" />,
                                label: "Settings",
                                active: true,
                                link: "/dashboard/settings",
                            },
                        ].map((item, index) => (
                            <Link to={item.link || "#"} key={index}>
                                <motion.button
                                    key={index}
                                    className={`flex items-center w-full px-3 py-2 mb-1 rounded-md text-sm ${item.active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-gray-100"
                                        }`}
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    {item.icon}
                                    {item.label}
                                    {item.active && (
                                        <motion.div
                                            className="ml-auto h-2 w-2 rounded-full bg-primary"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{
                                                duration: 2,
                                                repeat: Number.POSITIVE_INFINITY,
                                            }}
                                        />
                                    )}
                                </motion.button>
                            </Link>
                        ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="px-3">
                        <div className="text-xs font-semibold text-muted-foreground mb-2 px-3">ACCOUNT</div>
                        <motion.button
                            className="flex items-center w-full px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-gray-100"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <LogOut className="h-4 w-4 mr-3" />
                            Logout
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <motion.div className="flex-1 flex flex-col" variants={itemFadeIn}>
                {/* Header */}
                <header className="bg-white border-b border-gray-100 py-4 px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link to="/dashboard" className="mr-4 md:hidden">
                                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                            </Link>
                            <div>
                                <motion.div
                                    className="text-xl font-bold"
                                    style={{
                                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                    {...shimmerAnimation}
                                >
                                    Settings
                                </motion.div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src={avatarPreview || user?.avatar} alt={user?.name || user?.email} />
                                <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 overflow-auto relative">
                    <Particles />

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8"
                        >
                            <h1 className="text-2xl font-bold text-dark mb-2">Account Settings</h1>
                            <p className="text-muted-foreground">Manage your account information and preferences</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Profile Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="md:col-span-1"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Profile Picture</CardTitle>
                                        <CardDescription>Update your profile photo</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center">
                                        <div className="relative mb-4">
                                            <Avatar className="h-24 w-24">
                                                <AvatarImage src={avatarPreview || user?.avatar} alt={user?.name || user?.email} />
                                                <AvatarFallback className="text-2xl">
                                                    {user?.name?.charAt(0) || user?.email?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <label
                                                htmlFor="avatar-upload"
                                                className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                                            >
                                                <Camera className="h-4 w-4" />
                                            </label>
                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-medium">{user?.name || "User"}</h3>
                                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-center border-t pt-4">
                                        <Button variant="outline" size="sm" className="w-full">
                                            Remove Photo
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>

                            {/* Profile Form */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="md:col-span-2"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Personal Information</CardTitle>
                                        <CardDescription>Update your personal details</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Full Name</Label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            id="name"
                                                            placeholder="Your full name"
                                                            className="pl-10"
                                                            {...register("name", { required: "Name is required" })}
                                                        />
                                                    </div>
                                                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email Address</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            placeholder="Your email address"
                                                            className="pl-10"
                                                            {...register("email", {
                                                                required: "Email is required",
                                                                pattern: {
                                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                    message: "Invalid email address",
                                                                },
                                                            })}
                                                        />
                                                    </div>
                                                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Phone Number</Label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            id="phone"
                                                            placeholder="Your phone number"
                                                            className="pl-10"
                                                            {...register("phone")}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="address">Address</Label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input id="address" placeholder="Your address" className="pl-10" {...register("address")} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="bio">Bio</Label>
                                                <Textarea
                                                    id="bio"
                                                    placeholder="Tell us a little about yourself"
                                                    className="min-h-[100px]"
                                                    {...register("bio")}
                                                />
                                            </div>
                                        </form>
                                    </CardContent>
                                    <CardFooter className="flex justify-end border-t pt-4">
                                        <Button type="submit" form="profile-form" disabled={isLoading}>
                                            {isLoading ? (
                                                <Loader />
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>

                                {/* Security Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-6"
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Security</CardTitle>
                                            <CardDescription>Manage your password and security settings</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button variant="outline">Change Password</Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </main>
            </motion.div>
        </motion.div>
    )
}
