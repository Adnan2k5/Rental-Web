"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Upload, X, CheckCircle, AlertCircle, Clock, Camera, FileText } from "lucide-react"
import { Button } from "../../Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../Components/ui/card"
import { Input } from "../../Components/ui/input"
import { Label } from "../../Components/ui/label"
import { Badge } from "../../Components/ui/badge"
import { Alert, AlertDescription } from "../../Components/ui/alert"
import { itemFadeIn, pageTransition } from "../../assets/Animations"
import { colors } from "../../assets/Color"
import { toast } from "sonner"
import { useAuth } from "../../Middleware/AuthProvider"
import { getDocumentByUserId, submitDocument } from "../../api/documents.api"
import { useTranslation } from "react-i18next"

export default function DocumentVerification() {
    const [verificationStatus, setVerificationStatus] = useState("loading")
    const [statusDetails, setStatusDetails] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [document, setDocument] = useState(null)

    // Document upload state
    const [governmentId, setGovernmentId] = useState(null)
    const [selfie, setSelfie] = useState(null)
    const [governmentIdPreview, setGovernmentIdPreview] = useState(null)
    const [selfiePreview, setSelfiePreview] = useState(null)
    const [errors, setErrors] = useState({})
    const [country, setCountry] = useState("")
    const { t } = useTranslation();

    const governmentIdRef = useRef(null)
    const selfieRef = useRef(null)

    const handleGovernmentIdChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (!["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(file.type)) {
                setErrors((prev) => ({ ...prev, governmentId: t('userverification.governmentid_invalid') }))
                return
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({ ...prev, governmentId: t('userverification.file_too_large') }))
                return
            }
            setGovernmentId(file)
            setErrors((prev) => ({ ...prev, governmentId: null }))
            if (file.type.startsWith("image/")) {
                const reader = new FileReader()
                reader.onload = () => {
                    setGovernmentIdPreview(reader.result)
                }
                reader.readAsDataURL(file)
            } else {
                setGovernmentIdPreview("pdf")
            }
        }
    }

    const handleSelfieChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
                setErrors((prev) => ({ ...prev, selfie: t('userverification.selfie_invalid') }))
                return
            }

            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({ ...prev, selfie: t('userverification.file_too_large') }))
                return
            }

            setSelfie(file)
            setErrors((prev) => ({ ...prev, selfie: null }))

            const reader = new FileReader()
            reader.onload = () => {
                setSelfiePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeGovernmentId = () => {
        setGovernmentId(null)
        setGovernmentIdPreview(null)
        if (governmentIdRef.current) {
            governmentIdRef.current.value = ""
        }
    }

    const removeSelfie = () => {
        setSelfie(null)
        setSelfiePreview(null)
        if (selfieRef.current) {
            selfieRef.current.value = ""
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = {}
        if (!governmentId) {
            newErrors.governmentId = t('userverification.governmentid_required')
        }
        if (!selfie) {
            newErrors.selfie = t('userverification.selfie_required')
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
        setIsSubmitting(true)
        const formData = new FormData();
        formData.append("document", governmentId)
        formData.append("image", selfie)
        formData.append("country", country)
        if (!country) {
            toast.error(t('userverification.country_required'))
            setIsSubmitting(false)
        }
        try {
            const result = await submitDocument(formData)
            if (result.status === 201) {
                toast.success(t('userverification.submit_success'))
                window.location.reload()
            } else {
                throw new Error(result.error || t('userverification.submit_failed'))
            }
        } catch (error) {
            setErrors((prev) => ({ ...prev, submit: error.message }))
            toast.error(t('userverification.submit_failed'))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResubmit = () => {
        setVerificationStatus("")
        setGovernmentId(null)
        setSelfie(null)
        setGovernmentIdPreview(null)
        setSelfiePreview(null)
        setErrors({})
    }

    const { user } = useAuth()
    const getStatusBadge = () => {
        try {
            if (user.documentVerified === "verified") {
                return <Badge variant="success">{t('userverification.verified')}</Badge>
            }
            else if (document && document.verified === "verified") {
                return <Badge variant="success">{t('userverification.verified')}</Badge>
            }
            else if (document && document.verified === "pending") {
                return <Badge variant="">{t('userverification.pending')}</Badge>
            }
            else if (document && document.verified === "declined") {
                return <Badge variant="destructive">{t('userverification.statusDeclined')}</Badge>

            }
        }
        catch (error) {
            return <Badge variant="destructive">{t('userverification.unknown')}</Badge>
        }
        finally {
        }
    }

    useEffect(() => {
        getStatusBadge()
    }, [user.documentVerified])

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date)
    }

    const fetchDocuments = async () => {
        const res = await getDocumentByUserId(user._id);
        if (res.status === 200) {
            setDocument(res.data.message.documents[0])
        }
    }

    useEffect(() => {
        if (user && user._id) {
            fetchDocuments()
        }
    }, [user])


    useEffect(() => {
        if (document) {
            if (document.verified === "verified") {
                setVerificationStatus("verified")
            }
            else if (document.verified === "pending") {
                setVerificationStatus("pending")
            }
            else if (document.verified === "declined") {
                setVerificationStatus("declined")
                setStatusDetails(document)
            }
            else {
                setVerificationStatus("not_submitted")
            }
        }
    })
    return (
        <motion.div initial="hidden" animate="visible" variants={pageTransition}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <motion.h1
                        className="text-2xl font-bold text-dark mb-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Identity Verification
                    </motion.h1>
                </div>
                <div className="mt-4 md:mt-0">{getStatusBadge()}</div>
            </div>
            <motion.div variants={itemFadeIn}>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>{t('userverification.doctitle')}</CardTitle>
                        <CardDescription>{t('userverification.docdesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {document == null ? (
                            <div className="space-y-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="country" className="text-base font-medium">
                                                {t('userverification.country')}
                                            </Label>
                                            <input
                                                id="country"
                                                type="text"
                                                placeholder={t('userverification.country_placeholder')}
                                                className="mt-2 Input"
                                                onChange={(e) => setCountry(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="government-id" className="text-base font-medium">
                                                {t('userverification.governmentid')}
                                            </Label>
                                            {!governmentIdPreview ? (
                                                <div
                                                    className={`border-2 border-dashed rounded-lg p-6 mt-2 transition-colors ${errors.governmentId
                                                        ? "border-red-300 bg-red-50"
                                                        : "border-muted-foreground/25 hover:border-muted-foreground/50"
                                                        }`}
                                                >
                                                    <div className="flex flex-col items-center justify-center text-center">
                                                        <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                                                        <p className="mb-2 text-sm font-medium">{t('userverification.upload_instruction')}</p>
                                                        <p className="text-xs text-muted-foreground mb-3">{t('userverification.governmentid_hint')}</p>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => governmentIdRef.current?.click()}
                                                        >
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            {t('userverification.selectfile')}
                                                        </Button>
                                                        <Input
                                                            id="government-id"
                                                            ref={governmentIdRef}
                                                            type="file"
                                                            accept=".jpg,.jpeg,.png,.pdf"
                                                            className="hidden"
                                                            onChange={handleGovernmentIdChange}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative border rounded-lg overflow-hidden mt-2">
                                                    {governmentIdPreview === "pdf" ? (
                                                        <div className="flex items-center p-4 bg-muted/30">
                                                            <FileText className="h-10 w-10 text-muted-foreground mr-3" />
                                                            <div>
                                                                <p className="font-medium">{governmentId.name}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {(governmentId.size / 1024 / 1024).toFixed(2)} MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={governmentIdPreview || "/placeholder.svg"}
                                                            alt="Government ID Preview"
                                                            className="w-full h-48 object-contain bg-muted/30"
                                                        />
                                                    )}
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                                        onClick={removeGovernmentId}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}

                                            {errors.governmentId && <p className="text-sm text-red-500 mt-1">{errors.governmentId}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="selfie" className="text-base font-medium">
                                                {t('userverification.selfie')}
                                            </Label>

                                            {!selfiePreview ? (
                                                <div
                                                    className={`border-2 border-dashed rounded-lg p-6 mt-2 transition-colors ${errors.selfie
                                                        ? "border-red-300 bg-red-50"
                                                        : "border-muted-foreground/25 hover:border-muted-foreground/50"
                                                        }`}
                                                >
                                                    <div className="flex flex-col items-center justify-center text-center">
                                                        <Camera className="h-10 w-10 text-muted-foreground mb-2" />
                                                        <p className="mb-2 text-sm font-medium">{t('userverification.upload_instruction')}</p>
                                                        <p className="text-xs text-muted-foreground mb-3">{t('userverification.selfie_hint')}</p>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => selfieRef.current?.click()}
                                                        >
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            {t('userverification.selectfile')}
                                                        </Button>
                                                        <Input
                                                            id="selfie"
                                                            ref={selfieRef}
                                                            type="file"
                                                            accept=".jpg,.jpeg,.png"
                                                            className="hidden"
                                                            onChange={handleSelfieChange}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative border rounded-lg overflow-hidden mt-2">
                                                    <img
                                                        src={selfiePreview || "/placeholder.svg"}
                                                        alt="Selfie Preview"
                                                        className="w-full h-48 object-contain bg-muted/30"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                                        onClick={removeSelfie}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}

                                            {errors.selfie && <p className="text-sm text-red-500 mt-1">{errors.selfie}</p>}
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isSubmitting}
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                                                {t('userverification.submitting')}
                                            </>
                                        ) : (
                                            t('userverification.submit')
                                        )}
                                    </Button>
                                </form>
                            </div>
                        ) : verificationStatus === "pending" ? (
                            <div className="flex flex-col items-center text-center py-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
                                    <Clock className="h-8 w-8 text-amber-500" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{t('userverification.inprogress')}</h3>
                                <p className="text-muted-foreground mb-6">
                                    {t('userverification.inprogdesc')}
                                </p>

                                <div className="bg-muted/30 rounded-lg p-4 w-full max-w-md">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground"> {t('userverification.submittedon')} </span>
                                        <span className="font-medium">{formatDate(document.createdAt)}</span>
                                    </div>
                                    <div className="w-full bg-muted/50 rounded-full h-2.5 mb-4">
                                        <div className="bg-amber-500 h-2.5 rounded-full w-1/2"></div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {t('userverification.inprogdesc')}
                                    </p>
                                </div>
                            </div>
                        ) : verificationStatus === "verified" ? (
                            <div className="flex flex-col items-center text-center py-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{t('userverification.success')}</h3>
                                <p className="text-muted-foreground mb-6">
                                    {t('userverification.successdesc')}
                                </p>

                                <Alert className="bg-green-50 border-green-200 w-full max-w-md">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <AlertDescription className="text-green-700">{t('userverification.fully')}</AlertDescription>
                                </Alert>

                                <div className="mt-6 bg-muted/30 rounded-lg p-4 w-full max-w-md">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-muted-foreground">{t('userverification.submittedon')}</span>
                                        <span className="font-medium">{formatDate(document?.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{t('userverification.verifiedon')}</span>
                                        <span className="font-medium">{formatDate(document?.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ) : verificationStatus === "declined" ? (
                            <div className="flex flex-col items-center text-center py-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                                    <AlertCircle className="h-8 w-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{t('userverification.declined')}</h3>
                                <p className="text-muted-foreground mb-6">
                                    {t('userverification.declineddesc')}
                                </p>
                            </div>
                        ) : (
                            <div>{t('userverification.unknown')}</div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                        {
                            icon: <Upload className="h-8 w-8 text-primary mb-2" />,
                            title: t('userverification.step_upload_title'),
                            description: t('userverification.step_upload_desc'),
                        },
                        {
                            icon: <Clock className="h-8 w-8 text-amber-500 mb-2" />,
                            title: t('userverification.step_review_title'),
                            description: t('userverification.step_review_desc'),
                        },
                        {
                            icon: <CheckCircle className="h-8 w-8 text-green-500 mb-2" />,
                            title: t('userverification.step_verified_title'),
                            description: t('userverification.step_verified_desc'),
                        },
                    ].map((step, index) => (
                        <Card key={index} className="bg-muted/30">
                            <CardContent className="pt-6 text-center">
                                <div className="flex flex-col items-center">
                                    {step.icon}
                                    <h3 className="font-medium mb-1">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}
