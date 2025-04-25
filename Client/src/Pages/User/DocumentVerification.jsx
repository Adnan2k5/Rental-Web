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

// Mock API function - replace with your actual API call
const fetchVerificationStatus = async () => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            // For demo purposes, return a status
            // In a real app, this would come from your backend
            const statuses = ["not_submitted", "pending", "verified", "declined"]
            const randomStatus = statuses[0] // Change index to test different states
            resolve({
                status: randomStatus,
                message: "Your verification is being processed",
                submittedAt: new Date().toISOString(),
                verifiedAt: randomStatus === "verified" ? new Date().toISOString() : null,
                declinedReason: randomStatus === "declined" ? "The ID document was not clearly visible" : null,
            })
        }, 1000)
    })
}

// Mock submit function - replace with your actual API call
const submitDocuments = async (formData) => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                status: "pending",
                message: "Your verification is being processed",
                submittedAt: new Date().toISOString(),
            })
        }, 1500)
    })
}

export default function DocumentVerification() {
    const [verificationStatus, setVerificationStatus] = useState("loading")
    const [statusDetails, setStatusDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    // Document upload state
    const [governmentId, setGovernmentId] = useState(null)
    const [selfie, setSelfie] = useState(null)
    const [governmentIdPreview, setGovernmentIdPreview] = useState(null)
    const [selfiePreview, setSelfiePreview] = useState(null)
    const [errors, setErrors] = useState({})

    const governmentIdRef = useRef(null)
    const selfieRef = useRef(null)

    useEffect(() => {
        const getStatus = async () => {
            try {
                setLoading(true)
                const result = await fetchVerificationStatus()
                setVerificationStatus(result.status)
                setStatusDetails(result)
            } catch (err) {
                console.error("Error fetching verification status:", err)
                setError("Failed to load verification status. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        getStatus()
    }, [])

    const handleGovernmentIdChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type and size
            if (!["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(file.type)) {
                setErrors((prev) => ({ ...prev, governmentId: "Please upload a valid image (JPEG, PNG) or PDF file" }))
                return
            }

            if (file.size > 5 * 1024 * 1024) {
                // 5MB limit
                setErrors((prev) => ({ ...prev, governmentId: "File size should be less than 5MB" }))
                return
            }

            setGovernmentId(file)
            setErrors((prev) => ({ ...prev, governmentId: null }))

            // Create preview for image files
            if (file.type.startsWith("image/")) {
                const reader = new FileReader()
                reader.onload = () => {
                    setGovernmentIdPreview(reader.result)
                }
                reader.readAsDataURL(file)
            } else {
                // For PDF, just show an icon
                setGovernmentIdPreview("pdf")
            }
        }
    }

    const handleSelfieChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type and size
            if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
                setErrors((prev) => ({ ...prev, selfie: "Please upload a valid image (JPEG, PNG)" }))
                return
            }

            if (file.size > 5 * 1024 * 1024) {
                // 5MB limit
                setErrors((prev) => ({ ...prev, selfie: "File size should be less than 5MB" }))
                return
            }

            setSelfie(file)
            setErrors((prev) => ({ ...prev, selfie: null }))

            // Create preview
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

        // Validate form
        const newErrors = {}
        if (!governmentId) {
            newErrors.governmentId = "Government ID is required"
        }
        if (!selfie) {
            newErrors.selfie = "Selfie photo is required"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsSubmitting(true)

        // Create form data
        const formData = new FormData()
        formData.append("governmentId", governmentId)
        formData.append("selfie", selfie)

        try {
            const result = await submitDocuments(formData)
            if (result.success) {
                setVerificationStatus("pending")
                setStatusDetails(result)
                toast.success("Documents submitted successfully!")
            } else {
                throw new Error(result.error || "Failed to submit documents")
            }
        } catch (error) {
            setErrors((prev) => ({ ...prev, submit: error.message }))
            toast.error("Failed to submit documents. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResubmit = () => {
        setVerificationStatus("not_submitted")
        setGovernmentId(null)
        setSelfie(null)
        setGovernmentIdPreview(null)
        setSelfiePreview(null)
        setErrors({})
    }

    const getStatusBadge = () => {
        switch (verificationStatus) {
            case "loading":
                return (
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                        <div className="animate-spin h-3 w-3 border-b-2 border-current rounded-full mr-1"></div>
                        <span>Loading...</span>
                    </Badge>
                )
            case "not_submitted":
                return (
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        <span>Not Verified</span>
                    </Badge>
                )
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Pending Review</span>
                    </Badge>
                )
            case "verified":
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        <span>Verified</span>
                    </Badge>
                )
            case "declined":
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        <span>Declined</span>
                    </Badge>
                )
            default:
                return null
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date)
    }

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
                    <motion.p
                        className="text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Verify your identity to unlock all features
                    </motion.p>
                </div>
                <div className="mt-4 md:mt-0">{getStatusBadge()}</div>
            </div>

            <motion.div variants={itemFadeIn}>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Document Verification</CardTitle>
                        <CardDescription>We need to verify your identity to ensure the security of your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading && verificationStatus === "loading" ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : verificationStatus === "not_submitted" ? (
                            <div className="space-y-6">
                                {errors.submit && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{errors.submit}</AlertDescription>
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="government-id" className="text-base font-medium">
                                                Government ID
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
                                                        <p className="mb-2 text-sm font-medium">Click to upload or drag and drop</p>
                                                        <p className="text-xs text-muted-foreground mb-3">JPG, PNG or PDF (max. 5MB)</p>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => governmentIdRef.current?.click()}
                                                        >
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            Select File
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
                                                Selfie Photo
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
                                                        <p className="mb-2 text-sm font-medium">Click to upload or drag and drop</p>
                                                        <p className="text-xs text-muted-foreground mb-3">JPG or PNG (max. 5MB)</p>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => selfieRef.current?.click()}
                                                        >
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            Select File
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
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit Documents for Verification"
                                        )}
                                    </Button>
                                </form>
                            </div>
                        ) : verificationStatus === "pending" ? (
                            <div className="flex flex-col items-center text-center py-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
                                    <Clock className="h-8 w-8 text-amber-500" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Verification in Progress</h3>
                                <p className="text-muted-foreground mb-6">
                                    Your documents have been submitted and are currently being reviewed. This process typically takes
                                    24-48 hours.
                                </p>

                                <div className="bg-muted/30 rounded-lg p-4 w-full max-w-md">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Submitted on:</span>
                                        <span className="font-medium">{formatDate(statusDetails?.submittedAt)}</span>
                                    </div>
                                    <div className="w-full bg-muted/50 rounded-full h-2.5 mb-4">
                                        <div className="bg-amber-500 h-2.5 rounded-full w-1/2"></div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        We'll notify you once the verification process is complete.
                                    </p>
                                </div>
                            </div>
                        ) : verificationStatus === "verified" ? (
                            <div className="flex flex-col items-center text-center py-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Verification Successful</h3>
                                <p className="text-muted-foreground mb-6">
                                    Congratulations! Your identity has been successfully verified. You now have full access to all
                                    features.
                                </p>

                                <Alert className="bg-green-50 border-green-200 w-full max-w-md">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <AlertDescription className="text-green-700">Your account is now fully verified.</AlertDescription>
                                </Alert>

                                <div className="mt-6 bg-muted/30 rounded-lg p-4 w-full max-w-md">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-muted-foreground">Submitted on:</span>
                                        <span className="font-medium">{formatDate(statusDetails?.submittedAt)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Verified on:</span>
                                        <span className="font-medium">{formatDate(statusDetails?.verifiedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ) : verificationStatus === "declined" ? (
                            <div className="flex flex-col items-center text-center py-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                                    <AlertCircle className="h-8 w-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Verification Declined</h3>
                                <p className="text-muted-foreground mb-6">
                                    Unfortunately, your verification was declined. Please review the reason below and resubmit your
                                    documents.
                                </p>

                                <Alert variant="destructive" className="w-full max-w-md mb-6">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {statusDetails?.declinedReason || "Your documents did not meet our verification requirements."}
                                    </AlertDescription>
                                </Alert>

                                <Button
                                    onClick={handleResubmit}
                                    className="mb-6"
                                    style={{
                                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                    }}
                                >
                                    Resubmit Documents
                                </Button>
                            </div>
                        ) : (
                            <div>Unknown status</div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                        {
                            icon: <Upload className="h-8 w-8 text-primary mb-2" />,
                            title: "Upload Documents",
                            description: "Submit your government ID and a selfie photo",
                        },
                        {
                            icon: <Clock className="h-8 w-8 text-amber-500 mb-2" />,
                            title: "Verification Review",
                            description: "Our team will review your documents within 24-48 hours",
                        },
                        {
                            icon: <CheckCircle className="h-8 w-8 text-green-500 mb-2" />,
                            title: "Get Verified",
                            description: "Once approved, your account will be fully verified",
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
