"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
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
import {
    getTerms,
    saveDraft as apiSaveDraft,
    publishTerms as apiPublishTerms,
    restoreVersion as apiRestoreVersion,
    deleteVersion as apiDeleteVersion,
} from "../../api/admin.api"

export default function TermsConditions() {
    const { t } = useTranslation()
    const user = useAuth()
    const [terms, setTerms] = useState({
        current: {
            id: "",
            content: "",
            publishedAt: "",
            status: "published",
        },
        draft: {
            id: "",
            content: "",
            updatedAt: "",
            status: "draft",
        },
        history: [],
    })

    const [editor, setEditor] = useState("")
    const [activeTab, setActiveTab] = useState("current")
    const [saving, setSaving] = useState(false)
    const [publishing, setPublishing] = useState(false)
    const [showPublishDialog, setShowPublishDialog] = useState(false)
    const [showHistoryDialog, setShowHistoryDialog] = useState(false)
    const [selectedVersion, setSelectedVersion] = useState(null)
    const [showPreviewDialog, setShowPreviewDialog] = useState(false)

    useEffect(() => {
        // Fetch terms from backend
        getTerms().then((data) => {
            setTerms({
                current: {
                    id: data?.version || "",
                    content: data?.content || "",
                    publishedAt: data?.publishedAt || "",
                    status: data?.status || "published",
                },
                draft: {
                    id: data.draft?.version || "",
                    content: data.draft?.content || "",
                    updatedAt: data.draft?.updatedAt || "",
                    status: data.draft?.status || "draft",
                },
                history: (data.history || []).map((h) => ({
                    id: h.version,
                    content: h.content, // include content for each version
                    publishedAt: h.publishedAt,
                    publishedBy: h.publishedBy,
                })),
            })
            setEditor(data.draft?.content || "")
        })
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

    const handleSaveDraft = async () => {
        setSaving(true)
        await apiSaveDraft(editor, terms.draft.id || `v${Date.now()}-draft`)
        // Refresh terms after save
        const data = await getTerms()
        setTerms({
            current: {
                id: data.current?.version || "",
                content: data.current?.content || "",
                publishedAt: data.current?.publishedAt || "",
                status: data.current?.status || "published",
            },
            draft: {
                id: data.draft?.version || "",
                content: data.draft?.content || "",
                updatedAt: data.draft?.updatedAt || "",
                status: data.draft?.status || "draft",
            },
            history: (data.history || []).map((h) => ({
                id: h.version,
                content: h.content, // include content for each version
                publishedAt: h.publishedAt,
                publishedBy: h.publishedBy,
            })),
        })
        setSaving(false)
    }

    const handlePublish = async () => {
        setPublishing(true)
        await apiPublishTerms(editor, `v${Number.parseFloat(terms.current.id.replace("v", "")) + 0.1}`, user?.user?.name || "Admin")
        // Refresh terms after publish
        const data = await getTerms()
        setTerms({
            current: {
                id: data.current?.version || "",
                content: data.current?.content || "",
                publishedAt: data.current?.publishedAt || "",
                status: data.current?.status || "published",
            },
            draft: {
                id: data.draft?.version || "",
                content: data.draft?.content || "",
                updatedAt: data.draft?.updatedAt || "",
                status: data.draft?.status || "draft",
            },
            history: (data.history || []).map((h) => ({
                id: h.version,
                content: h.content, // include content for each version
                publishedAt: h.publishedAt,
                publishedBy: h.publishedBy,
            })),
        })
        setPublishing(false)
        setShowPublishDialog(false)
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "N/A";
        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const handleViewVersion = (version) => {
        setSelectedVersion(version)
        setShowHistoryDialog(true)
    }

    const handleRestoreVersion = async (version) => {
        await apiRestoreVersion(version.id)
        // Refresh terms after restore
        const data = await getTerms()
        setTerms({
            current: {
                id: data.current?.version || "",
                content: data.current?.content || "",
                publishedAt: data.current?.publishedAt || "",
                status: data.current?.status || "published",
            },
            draft: {
                id: data.draft?.version || "",
                content: data.draft?.content || "",
                updatedAt: data.draft?.updatedAt || "",
                status: data.draft?.status || "draft",
            },
            history: (data.history || []).map((h) => ({
                id: h.version,
                content: h.content, // include content for each version
                publishedAt: h.publishedAt,
                publishedBy: h.publishedBy,
            })),
        })
        setEditor(data.draft?.content || "") // update editor with restored draft
        setActiveTab("draft") // switch to draft tab
        setShowHistoryDialog(false)
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
                        {t('termsPage.title')}
                    </motion.h1>
                    <motion.p
                        className="text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {t('termsPage.subtitle')}
                    </motion.p>
                </div>
            </div>

            <motion.div className="grid gap-6" variants={itemFadeIn}>
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle>{t('termsPage.editorTitle')}</CardTitle>
                                <CardDescription>{t('termsPage.editorDesc')}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="mb-4">
                                <TabsTrigger value="current">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {t('termsPage.publishedTab')}
                                </TabsTrigger>
                                <TabsTrigger value="draft">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {t('termsPage.draftTab')}
                                </TabsTrigger>
                                <TabsTrigger value="history">
                                    <History className="h-4 w-4 mr-2" />
                                    {t('termsPage.historyTab')}
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="current" className="mt-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            {t('termsPage.published')}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {t('termsPage.versionPublished', { version: terms.current.id, date: formatDate(terms.current.publishedAt) })}
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
                                            {t('termsPage.editBtn')}
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

                            <TabsContent value="draft" className="mt-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {t('termsPage.draft')}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {t('termsPage.versionUpdated', { version: terms.draft.id, date: formatDate(terms.draft.updatedAt) })}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setShowPreviewDialog(true)}>
                                            {t('termsPage.previewBtn')}
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={saving}>
                                            {saving ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />{t('termsPage.saving')}</> : <> <Save className="h-4 w-4 mr-1" /> {t('termsPage.saveDraftBtn')}</>}
                                        </Button>
                                        <Button size="sm" onClick={() => setShowPublishDialog(true)} disabled={publishing}>
                                            <Globe className="h-4 w-4 mr-1" /> {t('termsPage.publishBtn')}
                                        </Button>
                                    </div>
                                </div>
                                <textarea
                                    className="w-full min-h-[300px] border rounded-md p-3 font-mono text-sm bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={editor}
                                    onChange={e => setEditor(e.target.value)}
                                    placeholder={t('termsPage.editorPlaceholder')}
                                />
                            </TabsContent>

                            <TabsContent value="history" className="mt-0">
                                <div className="border rounded-md overflow-hidden">
                                    <div className="grid grid-cols-12 bg-muted p-3 text-sm font-medium">
                                        <div className="col-span-3">{t('termsPage.version')}</div>
                                        <div className="col-span-5">{t('termsPage.publishedDate')}</div>
                                        <div className="col-span-3">{t('termsPage.publishedBy')}</div>
                                        <div className="col-span-1 text-right">{t('termsPage.actions')}</div>
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
                        <DialogTitle>{t('termsPage.publishDialogTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('termsPage.publishDialogDesc')}
                        </DialogDescription>
                    </DialogHeader>

                    <Alert variant="warning" className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>{t('termsPage.important')}</AlertTitle>
                        <AlertDescription>
                            {t('termsPage.importantDesc')}
                        </AlertDescription>
                    </Alert>

                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setShowPublishDialog(false)} disabled={publishing}>
                            {t('dialogbox.cancel')}
                        </Button>
                        <Button onClick={handlePublish} disabled={publishing}>
                            {publishing ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    {t('termsPage.publishing')}
                                </>
                            ) : (
                                t('termsPage.publishBtn')
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
                            <DialogTitle>{t('termsPage.versionDialogTitle', { version: selectedVersion.id })}</DialogTitle>
                            <DialogDescription>
                                {t('termsPage.versionDialogDesc', { date: formatDate(selectedVersion.publishedAt), by: selectedVersion.publishedBy })}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto py-4">
                            <div className="border rounded-md p-4 bg-muted/30 min-h-[400px] whitespace-pre-wrap font-mono text-sm">
                                {selectedVersion.content}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowHistoryDialog(false)}>
                                {t('dialogbox.cancel')}
                            </Button>
                            <Button onClick={() => handleRestoreVersion(selectedVersion)}>
                                {t('termsPage.restoreBtn')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>

            {/* Preview Dialog */}
            <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{t('termsPage.previewDialogTitle')}</DialogTitle>
                        <DialogDescription>{t('termsPage.previewDialogDesc')}</DialogDescription>
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
                            {t('dialogbox.cancel')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
