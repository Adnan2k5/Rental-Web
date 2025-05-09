"use client"

import { useState, useEffect, use } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { User, Mail, Phone, MapPin, Camera, Save } from "lucide-react"
import { Button } from "../../Components/ui/button"
import { Input } from "../../Components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../Components/ui/avatar"
import { Label } from "../../Components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../Components/ui/card"
import { toast } from "sonner"
import { useAuth } from "../../Middleware/AuthProvider"
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogFooter } from "../../Components/ui/dialog"
import { Otpresend, Otpsend, updatePassword, UserUpdate, VerifyEmail } from "../../api/auth.api"
import { useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"

export default function Settings() {
    const { user } = useAuth()
    const { t } = useTranslation();
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
            const updatedData = { ...data, _id: user._id, }
            const res = await UserUpdate(updatedData, dispatch)
            if (res) {
                toast.success(t('settings.profileUpdateSuccess'))
            }
        } catch (error) {
            toast.error(t('settings.profileUpdateFail'))
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
                toast.success(t('settings.otpSentSuccess'))
                setemailsent(true)
                setChangePass(true)
            }
        }
        else {
            const res = await Otpresend(user?.email)
            if (res) {
                setChangePass(true)
                toast.success(t('settings.otpSentSuccess'))
            }
            else {
                toast.error(t('settings.otpSentFail'))
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
                toast.success(t('settings.passwordUpdateSuccess'))
            } else {
                toast.error(t('settings.passwordUpdateFail'))
            }
        } catch (error) {
            toast.error(t('settings.passwordUpdateFail'))
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
                toast.success(t('settings.emailUpdateSuccess'))
            } else {
                toast.error(t('settings.emailUpdateFail'))
            }
        }
        catch (error) {
            toast.error(t('settings.emailUpdateFail'))
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
                <h1 className="text-2xl font-bold text-dark mb-2">{t('settings.title')}</h1>
                <p className="text-muted-foreground">{t('settings.subtitle')}</p>
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
                            <CardTitle>{t('settings.profile')}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <div className="relative mb-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarFallback className="text-2xl">
                                        {user?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="text-center">
                                <h3 className="font-medium">{user?.name || t('settings.user')}</h3>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                        </CardContent>
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
                            <CardTitle>{t('settings.personalInfo')}</CardTitle>
                            <CardDescription>{t('settings.updatePersonal')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">{t('settings.fullName')}</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                placeholder={t('settings.fullNamePlaceholder')}
                                                className="pl-10"
                                                {...register("name", { required: t('settings.nameRequired') })}
                                            />
                                        </div>
                                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">{t('settings.email')}</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder={t('settings.emailPlaceholder')}
                                                className="pl-10"
                                                {...register("email", {
                                                    required: t('settings.emailRequired'),
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: t('settings.emailInvalid'),
                                                    },
                                                    onChange: (e) => { setNewEmail(e.target.value) }
                                                })}
                                            />
                                        </div>
                                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                                        {verifyButton ? <Button type="button" onClick={() => handleOpen({ email: true })} variant="outline">{t('settings.verifyEmail')}</Button> : ``}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">{t('settings.phone')}</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input id="phone" value={user.phoneNumber} placeholder={t('settings.phonePlaceholder')} className="pl-10" {...register("phoneNumber")} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">{t('settings.address')}</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input id="address" placeholder={t('settings.addressPlaceholder')} className="pl-10" {...register("address")} />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-end border-t pt-4">
                            <Button type="submit" form="profile-form" disabled={isLoading}>
                                {isLoading ? (
                                    <>{t('settings.saving')}</>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        {t('settings.saveChanges')}
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
                                <CardTitle>{t('settings.security')}</CardTitle>
                                <CardDescription>{t('settings.securityDesc')}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button type="button" onClick={() => handleOpen()} variant="outline">{t('settings.changePassword')}</Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
                <Dialog open={changePass} onOpenChange={setChangePass}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{emailsent ? t('settings.updateEmailTitle') : t('settings.changePasswordTitle')}</DialogTitle>
                        </DialogHeader>
                        {emailsent ? `` : <input
                            type="text"
                            placeholder={t('settings.newPasswordPlaceholder')}
                            className='Input'
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                        />}
                        <input
                            type="text"
                            placeholder={t('settings.otpPlaceholder')}
                            className='Input'
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <DialogFooter>
                            {emailsent ? <Button variant="outline" onClick={() => verifyEmail()}>{t('settings.updateEmail')}</Button> : <Button variant="outline" onClick={() => handleUpdatePass()}>
                                {t('settings.changePassword')}
                            </Button>}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
