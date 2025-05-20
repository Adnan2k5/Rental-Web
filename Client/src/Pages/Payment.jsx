"use client"

import { useEffect, useState } from "react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { ChevronRight, Check, AlertCircle, ArrowLeft, CreditCard, Calendar, Package, User } from "lucide-react"
import { Button } from "../Components/ui/button"
import { Separator } from "../Components/ui/separator"
import { Navbar } from "../Components/Navbar"
import { Footer } from "../Components/Footer"
import { useTranslation } from "react-i18next"
import { createBookingApi } from "../api/bookings.api"
import { toast } from "sonner"
import i18n from "../i18"
import { containerVariants, itemVariants, successVariants } from "../assets/Animations"

const PaymentPage = () => {
    const { t } = useTranslation()
    const [cartItems, setCartItems] = useState([])
    const [fullName, setFullName] = useState("")
    const [total, setTotal] = useState(0)
    const [paymentStatus, setPaymentStatus] = useState("pending") // pending, success, error
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        // Retrieve data from localStorage
        const storedName = localStorage.getItem("bookingName")
        const storedItems = JSON.parse(localStorage.getItem("cartItems") || "[]")
        const storedTotal = localStorage.getItem("cartTotal") || "0"

        setFullName(storedName || "")
        setCartItems(storedItems)
        setTotal(Number.parseFloat(storedTotal))

        // If no items or name, redirect back to cart
        if (!storedItems.length || !storedName) {
            window.location.href = "/cart"
        }
    }, [])

    const calculateDaysBetween = (startDate, endDate) => {
        if (!startDate || !endDate) return 1

        const start = new Date(startDate)
        const end = new Date(endDate)
        const timeDiff = end.getTime() - start.getTime()
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
        return daysDiff
    }

    const formatDate = (dateString) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toLocaleDateString(i18n.language === "it" ? "it-IT" : "en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const createOrder = async () => {
        setIsProcessing(true)
        // This would typically call your backend to create a PayPal order
        return "mock-order-id-" + Math.random().toString(36).substring(2, 15)
    }

    const onApprove = async (data, actions) => {
        try {
            setPaymentStatus("processing")

            // Create the actual booking in your system
            const res = await createBookingApi(fullName)

            if (res) {
                // Show success animation
                setPaymentStatus("success")
                setTimeout(() => {
                    localStorage.removeItem("bookingName")
                    localStorage.removeItem("cartItems")
                    localStorage.removeItem("cartTotal")
                }, 1000)
            } else {
                setPaymentStatus("error")
                toast.error(t("paymentPage.bookingFailed"))
            }
        } catch (error) {
            setPaymentStatus("error")
            toast.error(t("paymentPage.paymentError"), { description: error.message })
        } finally {
            setIsProcessing(false)
        }
    }

    const onError = () => {
        setPaymentStatus("error")
        setIsProcessing(false)
        toast.error(t("paymentPage.paymentFailed"))
    }


    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Link to="/" className="hover:text-primary">
                            {t("paymentPage.breadcrumbHome")}
                        </Link>
                        <ChevronRight className="h-4 w-4 mx-1" />
                        <Link to="/cart" className="hover:text-primary">
                            {t("paymentPage.breadcrumbCart")}
                        </Link>
                        <ChevronRight className="h-4 w-4 mx-1" />
                        <span>{t("paymentPage.breadcrumbPayment")}</span>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {paymentStatus === "success" ? (
                        <motion.div
                            key="success"
                            className="max-w-md mx-auto text-center py-16"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <motion.div
                                className="bg-green-50 rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6"
                                variants={successVariants}
                            >
                                <Check className="h-12 w-12 text-green-500" />
                            </motion.div>
                            <motion.h2 className="text-2xl font-bold mb-2" variants={itemVariants}>
                                {t("paymentPage.paymentSuccessful")}
                            </motion.h2>
                            <motion.p className="text-muted-foreground mb-8" variants={itemVariants}>
                                {t("paymentPage.bookingConfirmed")}
                            </motion.p>
                            <motion.div variants={itemVariants}>
                                <Link to="/user/bookings">
                                    <Button size="lg">{t("paymentPage.viewBookings")}</Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    ) : paymentStatus === "error" ? (
                        <motion.div
                            key="error"
                            className="max-w-md mx-auto text-center py-16"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <motion.div
                                className="bg-red-50 rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6"
                                variants={successVariants}
                            >
                                <AlertCircle className="h-12 w-12 text-red-500" />
                            </motion.div>
                            <motion.h2 className="text-2xl font-bold mb-2" variants={itemVariants}>
                                {t("paymentPage.paymentFailed")}
                            </motion.h2>
                            <motion.p className="text-muted-foreground mb-8" variants={itemVariants}>
                                {t("paymentPage.pleaseTryAgain")}
                            </motion.p>
                            <motion.div variants={itemVariants} className="flex gap-4 justify-center">
                                <Link to="/cart">
                                    <Button variant="outline" size="lg">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        {t("paymentPage.backToCart")}
                                    </Button>
                                </Link>
                                <Button size="lg" onClick={() => setPaymentStatus("pending")}>
                                    {t("paymentPage.tryAgain")}
                                </Button>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="payment"
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            exit={{ opacity: 0 }}
                        >
                            {/* Order Details Column */}
                            <motion.div className="lg:col-span-2" variants={containerVariants}>
                                <motion.div
                                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                                    variants={itemVariants}
                                >
                                    <div className="p-6 border-b border-gray-100">
                                        <h2 className="text-xl font-semibold">{t("paymentPage.orderDetails")}</h2>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        <motion.div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg" variants={itemVariants}>
                                            <User className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">{t("paymentPage.customerName")}</p>
                                                <p className="font-medium">{fullName}</p>
                                            </div>
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <h3 className="font-medium mb-3">{t("paymentPage.itemsInOrder")}</h3>
                                            <div className="space-y-4">
                                                {cartItems.map((item, index) => (
                                                    <motion.div
                                                        key={item.item._id}
                                                        className="flex gap-4 p-4 border border-gray-100 rounded-lg"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.1 * index }}
                                                    >
                                                        <div className="h-16 w-16 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={item.item.images[0] || "/placeholder.svg"}
                                                                alt={item.item.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between">
                                                                <h4 className="font-medium">
                                                                    {i18n.language === "it" ? item.item.name_it : item.item.name}
                                                                </h4>
                                                                <span className="font-bold text-primary">
                                                                    €
                                                                    {(
                                                                        item.item.price *
                                                                        item.quantity *
                                                                        calculateDaysBetween(item.startDate, item.endDate)
                                                                    ).toFixed(2)}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-muted-foreground mt-1">
                                                                <div className="flex items-center gap-1">
                                                                    <Package className="h-3 w-3" />
                                                                    <span>
                                                                        {t("paymentPage.quantity")}: {item.quantity}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    <Calendar className="h-3 w-3" />
                                                                    <span>
                                                                        {formatDate(item.startDate)} - {formatDate(item.endDate)} (
                                                                        {calculateDaysBetween(item.startDate, item.endDate)} {t("paymentPage.days")})
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Payment Column */}
                            <motion.div className="lg:col-span-1" variants={containerVariants}>
                                <motion.div
                                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-24"
                                    variants={itemVariants}
                                >
                                    <div className="p-6 border-b border-gray-100">
                                        <h2 className="text-xl font-semibold">{t("paymentPage.paymentMethod")}</h2>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        <motion.div className="flex justify-between font-bold text-lg" variants={itemVariants}>
                                            <span>{t("paymentPage.totalAmount")}</span>
                                            <span>€{total.toFixed(2)}</span>
                                        </motion.div>

                                        <Separator />

                                        <motion.div className="space-y-4" variants={itemVariants}>
                                            <h3 className="font-medium">{t("paymentPage.selectPaymentMethod")}</h3>

                                            <div className="relative">
                                                {isProcessing && (
                                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                                                        <div className="flex flex-col items-center">
                                                            <div className="loader"></div>
                                                            <p className="mt-2 text-sm font-medium">{t("paymentPage.processing")}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <PayPalScriptProvider
                                                    options={{
                                                        "client-id":
                                                            import.meta.env.VITE_PAYPAL_CLIENT_ID,
                                                        currency: "EUR",
                                                    }}
                                                >
                                                    <PayPalButtons
                                                        style={{
                                                            layout: "vertical",
                                                            color: "gold",
                                                            shape: "pill",
                                                            label: "pay",

                                                        }}
                                                        createOrder={createOrder}
                                                        onApprove={onApprove}
                                                        onError={onError}
                                                        disabled={isProcessing}
                                                    />
                                                </PayPalScriptProvider>
                                            </div>

                                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
                                                <CreditCard className="h-3 w-3" />
                                                <span>{t("paymentPage.securePayment")}</span>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                <motion.div className="mt-4" variants={itemVariants}>
                                    <Link to="/cart">
                                        <Button variant="outline" className="w-full">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            {t("paymentPage.backToCart")}
                                        </Button>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <Footer />

            <style jsx="true">{`
        .loader {
          width: 30px;
          height: 30px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    )
}

export default PaymentPage
