"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, RefreshCw, Clock, CheckCircle, History, AlertTriangle, Eye, Globe } from "lucide-react"
import { Button } from "../../Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../Components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../Components/ui/tabs"
import { Badge } from "../../Components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../Components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "../../Components/ui/alert"
import { useAuth } from "../../Middleware/AuthProvider"

export default function TermsConditions() {
    const user = useAuth();
    const [terms, setTerms] = useState({
        current: {
            id: "v1.2",
            content: "",
            publishedAt: "2023-03-15T10:00:00Z",
            status: "published",
        },
        draft: {
            id: "v1.3-draft",
            content: "",
            updatedAt: "2023-04-18T14:30:00Z",
            status: "draft",
        },
        history: [
            {
                id: "v1.2",
                publishedAt: "2023-03-15T10:00:00Z",
                publishedBy: user?.user?.name
            },
        ],
    })

    const [editor, setEditor] = useState("")
    const [activeTab, setActiveTab] = useState("current")
    const [saving, setSaving] = useState(false)
    const [publishing, setPublishing] = useState(false)
    const [showPublishDialog, setShowPublishDialog] = useState(false)
    const [showHistoryDialog, setShowHistoryDialog] = useState(false)
    const [selectedVersion, setSelectedVersion] = useState(null)
    const [showPreviewDialog, setShowPreviewDialog] = useState(false)
    const mockCurrentTerms = `# Terms and Conditions

## 1. Introduction

Welcome to our rental platform. These Terms and Conditions govern your use of our website and services.
Last Updated: March 15, 2023`

    const mockDraftTerms = `# Terms and Conditions

## 1. Introduction

Welcome to our rental platform. These Terms and Conditions govern your use of our website and services.

Last Updated: [Draft Version]`

    useEffect(() => {
        // Simulate loading terms content
        setTimeout(() => {
            setTerms({
                ...terms,
                current: {
                    ...terms.current,
                    content: mockCurrentTerms,
                },
                draft: {
                    ...terms.draft,
                    content: mockDraftTerms,
                },
            })
            setEditor(mockDraftTerms)
        }, 1000)
    }, [])

    const pageTransition = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    }

    const itemFadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    }

    const handleSaveDraft = () => {
        setSaving(true)

        // Simulate API call to save draft
        setTimeout(() => {
            setTerms({
                ...terms,
                draft: {
                    ...terms.draft,
                    content: editor,
                    updatedAt: new Date().toISOString(),
                },
            })
            setSaving(false)
        }, 1500)
    }

    const handlePublish = () => {
        setPublishing(true)

        // Simulate API call to publish terms
        setTimeout(() => {
            const newVersion = `v${Number.parseFloat(terms.current.id.replace("v", "")) + 0.1}`

            setTerms({
                ...terms,
                current: {
                    id: newVersion,
                    content: editor,
                    publishedAt: new Date().toISOString(),
                    status: "published",
                },
                draft: {
                    id: `${newVersion}-draft`,
                    content: editor,
                    updatedAt: new Date().toISOString(),
                    status: "draft",
                },
                history: [
                    {
                        id: newVersion,
                        publishedAt: new Date().toISOString(),
                        publishedBy: "Sarah Johnson",
                    },
                    ...terms.history,
                ],
            })

            setPublishing(false)
            setShowPublishDialog(false)
        }, 2000)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    const handleViewVersion = (version) => {
        setSelectedVersion(version)
        setShowHistoryDialog(true)
    }

    return (
        <motion.div className="p-6" initial="hidden" animate="visible" variants={pageTransition}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <motion.h1
                        className="text-2xl font-bold text-dark mb-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Terms & Conditions
                    </motion.h1>
                    <motion.p
                        className="text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Manage your platform's terms and conditions
                    </motion.p>
                </div>
            </div>

            <motion.div className="grid gap-6" variants={itemFadeIn}>
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle>Terms & Conditions Editor</CardTitle>
                                <CardDescription>Edit and publish your platform's terms and conditions</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="mb-4">
                                <TabsTrigger value="current">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Published
                                </TabsTrigger>

                                <TabsTrigger value="history">
                                    <History className="h-4 w-4 mr-2" />
                                    History
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="current" className="mt-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Published
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                            Version {terms.current.id} • Published on {formatDate(terms.current.publishedAt)}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setEditor(terms.current.content)
                                                setActiveTab("draft")
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                                <div className="border rounded-md p-4 bg-muted/30 min-h-[500px] whitespace-pre-wrap font-mono text-sm overflow-auto">
                                    {terms.current.content || (
                                        <div className="flex justify-center items-center h-full">
                                            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value="history" className="mt-0">
                                <div className="border rounded-md overflow-hidden">
                                    <div className="grid grid-cols-12 bg-muted p-3 text-sm font-medium">
                                        <div className="col-span-3">Version</div>
                                        <div className="col-span-5">Published Date</div>
                                        <div className="col-span-3">Published By</div>
                                        <div className="col-span-1 text-right">Actions</div>
                                    </div>
                                    <div className="divide-y">
                                        {terms.history.map((version) => (
                                            <motion.div
                                                key={version.id}
                                                className="grid grid-cols-12 items-center p-3 hover:bg-muted/50"
                                                whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                                            >
                                                <div className="col-span-3 font-medium">{version.id}</div>
                                                <div className="col-span-5">{formatDate(version.publishedAt)}</div>
                                                <div className="col-span-3">{version.publishedBy}</div>
                                                <div className="col-span-1 text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleViewVersion(version)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Publish Confirmation Dialog */}
            <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Publish Terms & Conditions</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to publish this version? This will make it immediately visible to all users.
                        </DialogDescription>
                    </DialogHeader>

                    <Alert variant="warning" className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                            Publishing new terms may require notifying users according to your privacy policy and applicable laws.
                        </AlertDescription>
                    </Alert>

                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setShowPublishDialog(false)} disabled={publishing}>
                            Cancel
                        </Button>
                        <Button onClick={handlePublish} disabled={publishing}>
                            {publishing ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                "Publish"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Version History Dialog */}
            <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
                {selectedVersion && (
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Version {selectedVersion.id}</DialogTitle>
                            <DialogDescription>
                                Published on {formatDate(selectedVersion.publishedAt)} by {selectedVersion.publishedBy}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto py-4">
                            <div className="border rounded-md p-4 bg-muted/30 min-h-[400px] whitespace-pre-wrap font-mono text-sm">
                                {terms.current.content}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowHistoryDialog(false)}>
                                Close
                            </Button>
                            <Button
                                onClick={() => {
                                    setEditor(terms.current.content)
                                    setActiveTab("draft")
                                    setShowHistoryDialog(false)
                                }}
                            >
                                Restore This Version
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>

            {/* Preview Dialog */}
            <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Preview Terms & Conditions</DialogTitle>
                        <DialogDescription>This is how your terms will appear to users</DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto py-4">
                        <div className="prose max-w-none">
                            <div className="whitespace-pre-wrap font-sans text-sm">
                                {activeTab === "current" ? terms.current.content : editor}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
