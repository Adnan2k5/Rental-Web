"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Upload, X, AlertCircle, RefreshCw } from "lucide-react"
import { createTicket } from "../../api/tickets.api"
import { Button } from "../../Components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../Components/ui/card"
import { Input } from "../../Components/ui/input"
import { Label } from "../../Components/ui/label"
import { Textarea } from "../../Components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../Components/ui/select"
import { pageTransition } from "../../assets/Animations"
import { Alert, AlertDescription, AlertTitle } from "../../Components/ui/alert"
import { useTranslation } from "react-i18next"

export const CreateTicket = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        category: "",
        priority: "medium",
        attachments: [],
    })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [filePreview, setFilePreview] = useState([])

    const categories = [
        t("createTicket.categories.accountIssues"),
        t("createTicket.categories.billingPayments"),
        t("createTicket.categories.technicalSupport"),
        t("createTicket.categories.productInquiry"),
        t("createTicket.categories.featureRequest"),
        t("createTicket.categories.bugReport"),
        t("createTicket.categories.other"),
    ]

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear error for this field if it exists
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear error for this field if it exists
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)

        // Check file size (limit to 5MB per file)
        const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024)

        if (validFiles.length !== files.length) {
            setError(t("createTicket.fileSizeError"))
        }

        // Update form data with new files
        setFormData((prev) => ({
            ...prev,
            attachments: [...prev.attachments, ...validFiles],
        }))

        // Create preview URLs for the files
        const newPreviews = validFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
        }))

        setFilePreview((prev) => [...prev, ...newPreviews])
    }

    const removeFile = (index) => {
        // Remove file from form data
        const newAttachments = [...formData.attachments]
        newAttachments.splice(index, 1)
        setFormData((prev) => ({ ...prev, attachments: newAttachments }))

        // Remove preview
        const newPreviews = [...filePreview]
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(newPreviews[index].url)
        newPreviews.splice(index, 1)
        setFilePreview(newPreviews)
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.subject.trim()) {
            newErrors.subject = t("createTicket.errors.subject")
        }

        if (!formData.description.trim()) {
            newErrors.description = t("createTicket.errors.description")
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            const response = await createTicket(formData)
            if (response && response.data) {
                // Clean up file preview URLs
                filePreview.forEach((file) => URL.revokeObjectURL(file.url))

                // Navigate to the ticket details page
                navigate(`/dashboard/tickets/${response.data._id}`)
            }
        } catch (err) {
            setError("Failed to create ticket. Please try again later.")
            setSubmitting(false)
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + " bytes"
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
        else return (bytes / 1048576).toFixed(1) + " MB"
    }

    return (
        <motion.div className="container mx-auto" initial="hidden" animate="visible" variants={pageTransition}>
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate("/dashboard/tickets")}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> {t("createTicket.back")}
                </Button>
                <h1 className="text-2xl font-bold">{t("createTicket.title")}</h1>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t("createTicket.errorTitle")}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>{t("createTicket.formTitle")}</CardTitle>
                        <CardDescription>
                            {t("createTicket.formDesc")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="subject" className={errors.subject ? "text-red-500" : ""}>
                                {t("createTicket.subject")} {errors.subject && <span className="text-red-500">*</span>}
                            </Label>
                            <Input
                                id="subject"
                                name="subject"
                                placeholder={t("createTicket.subjectPlaceholder")}
                                value={formData.subject}
                                onChange={handleChange}
                                className={errors.subject ? "border-red-500" : ""}
                            />
                            {errors.subject && <p className="text-red-500 text-xs">{errors.subject}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className={errors.description ? "text-red-500" : ""}>
                                {t("createTicket.description")} {errors.description && <span className="text-red-500">*</span>}
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder={t("createTicket.descriptionPlaceholder")}
                                value={formData.description}
                                onChange={handleChange}
                                className={`min-h-[150px] ${errors.description ? "border-red-500" : ""}`}
                            />
                            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="attachments">{t("createTicket.attachments")}</Label>
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="file-upload"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">{t("createTicket.uploadClick")}</span> {t("createTicket.orDragDrop")}
                                        </p>
                                        <p className="text-xs text-gray-500">{t("createTicket.maxFiles")}</p>
                                    </div>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileChange}
                                        disabled={formData.attachments.length >= 5}
                                    />
                                </label>
                            </div>

                            {filePreview.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium mb-2">{t("createTicket.attachedFiles")}</p>
                                    <div className="space-y-2">
                                        {filePreview.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                                <div className="flex items-center overflow-hidden">
                                                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-200 rounded">
                                                        {file.type.startsWith("image/") ? (
                                                            <img
                                                                src={file.url || "/placeholder.svg"}
                                                                alt={file.name}
                                                                className="w-8 h-8 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="text-xs font-bold text-gray-500">
                                                                {file.name.split(".").pop().toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-2 overflow-hidden">
                                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="p-1 rounded-full hover:bg-gray-200"
                                                >
                                                    <X className="w-4 h-4 text-gray-500" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/dashboard/tickets")}
                            disabled={submitting}
                        >
                            {t("createTicket.cancel")}
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    {t("createTicket.submitting")}
                                </>
                            ) : (
                                t("createTicket.submit")
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </motion.div>
    )
}
