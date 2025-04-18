"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { User, Mail, Phone, MapPin, Camera, Save } from "lucide-react"
import { Button } from "../../Components/ui/button"
import { Input } from "../../Components/ui/input"
import { Textarea } from "../../Components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "../../Components/ui/avatar"
import { Label } from "../../Components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../Components/ui/card"
import { toast } from "sonner"
import { useAuth } from "../../Middleware/AuthProvider"
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
            toast.success("Profile updated successfully!")
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
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
                                            <Input id="phone" placeholder="Your phone number" className="pl-10" {...register("phone")} />
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
    )
}
