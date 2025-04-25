"use client"

import { useState, useEffect, use } from "react"
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
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogFooter } from "../../Components/ui/dialog"
import { Otpresend, Otpsend, updatePassword, UserUpdate, VerifyEmail } from "../../api/auth.api"
import { useDispatch } from "react-redux"
import { set } from "date-fns"

export default function Settings() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [changePass, setChangePass] = useState(false)
    const [otp, setOtp] = useState("")
    const [newPass, setNewPass] = useState("")
    const [newEmail, setNewEmail] = useState(user?.email)
    const [verifyButton, setVerifyButton] = useState(false)
    const [emailsent, setemailsent] = useState(false)


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
        },
    })

    useEffect(() => {
        if (user) {
            setValue("name", user.name || "")
            setValue("email", user.email || "")
            setValue("phone", user.phone || "")
            setValue("address", user.address || "")
        }
    }, [user, setValue])

    useEffect(() => {
        if (user?.email !== newEmail) {
            setVerifyButton(true)
        }
        else {
            setVerifyButton(false)
        }
    }, [newEmail])


    const dispatch = useDispatch();
    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            // Simulate API call
            const updatedData = { ...data, _id: user._id, }
            const res = await UserUpdate(updatedData, dispatch)
            if (res) {
                toast.success("Profile updated successfully!")
            }
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }
    const handleOpen = async (email) => {
        if (email) {
            const data = { email: newEmail, id: user._id }
            const res = await Otpsend(data)
            if (res) {
                setVerifyButton(false)
                toast.success("Otp sent successfully!")
                setemailsent(true)
                setChangePass(true)
            }
        }
        else {
            const res = await Otpresend(user?.email)
            if (res) {
                setChangePass(true)
                toast.success("Otp sent successfully!")
            }
            else {
                toast.error("Failed to send Otp")
            }
        }
    }

    const handleUpdatePass = async () => {
        setIsLoading(true)
        try {
            const data = { email: user?.email, password: newPass, otp: otp }
            const res = await updatePassword(data);
            if (res) {
                setChangePass(false)
                toast.success("Password updated successfully!")
            } else {
                toast.error("Failed to update password")
            }
        } catch (error) {
            console.error("Error updating password:", error)
            toast.error("Failed to update password")
        } finally {
            setIsLoading(false)
        }
    }

    const verifyEmail = async () => {
        try {
            const data = { email: newEmail, otp: otp, id: user._id }
            const res = await VerifyEmail(data, dispatch)
            if (res) {
                setChangePass(false)
                toast.success("Email updated successfully!")
            } else {
                toast.error("Failed to update email")
            }
        }
        catch (error) {
            console.error("Error updating email:", error)
            toast.error("Failed to update email")
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
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <div className="relative mb-4">
                                <Avatar className="h-24 w-24">

                                    <AvatarFallback className="text-2xl">
                                        {user?.name?.charAt(0) || user?.email?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
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
                                                    onChange: (e) => { setNewEmail(e.target.value) }
                                                })}
                                            />
                                        </div>
                                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                                        {verifyButton ? <Button type="button" onClick={() => handleOpen({ email: true })} variant="outline">Verify Email</Button> : ``}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input id="phone" value={user.phoneNumber} placeholder="Your phone number" className="pl-10" {...register("phoneNumber")} />
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
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-end border-t pt-4">
                            <Button type="submit" form="profile-form" disabled={isLoading}>
                                {isLoading ? (
                                    <>Saving...</>
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
                                <Button type="button" onClick={() => handleOpen()} variant="outline">Change Password</Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
                <Dialog open={changePass} onOpenChange={setChangePass}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{emailsent ? 'Update Your Email' : 'Change Password'}</DialogTitle>
                        </DialogHeader>
                        {emailsent ? `` : <input
                            type="text"
                            placeholder="New Password"
                            className='Input'
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                        />}
                        <input
                            type="text"
                            placeholder="Enter Otp"
                            className='Input'
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <DialogFooter>
                            {emailsent ? <Button variant="outline" onClick={() => verifyEmail()}>Update Email</Button> : <Button variant="outline" onClick={() => handleUpdatePass()}>
                                Change Password
                            </Button>}

                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
