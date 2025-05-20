import { useEffect, useState } from "react"
import { ChevronRight, CreditCard, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from "../Components/ui/button"
import { Input } from "../Components/ui/input"
import { Separator } from "../Components/ui/separator"
import { Label } from "../Components/ui/label"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { addItemToCartApi, fetchCartItemsApi } from "../api/carts.api"
import { toast } from "sonner"
import { Navbar } from "../Components/Navbar"
import DateRangePicker from "../Components/DateRangePicker"
import { createBookingApi } from "../api/bookings.api"
import { fadeIn, staggerChildren } from "../assets/Animations"
import { useTranslation } from "react-i18next"
import { Footer } from "../Components/Footer"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogOverlay,
  DialogClose,
} from "../Components/ui/dialog"
import i18n from "../i18"

export default function CartPage() {
  const { t } = useTranslation()
  const [cartItems, setCartItems] = useState([])
  const [promoCode, setPromoCode] = useState("")
  const [refreshCart, setRefreshCart] = useState(false)
  const [showNameModal, setShowNameModal] = useState(false)
  const [fullName, setFullName] = useState("")
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => {
    const fetchCartItems = async () => {
      const response = await fetchCartItemsApi()
      const storedItems = response.data.data
      setCartItems(storedItems)
    }

    fetchCartItems()
  }, [refreshCart])

  const handleCheckoutClick = () => {
    setShowNameModal(true)
  }
  // Cart actions
  const removeItem = async (id) => {
    try {
      await addItemToCartApi(id, 0, 0)
      setRefreshCart(!refreshCart)
      toast.success(t("cartPage.itemRemoved"), { description: t("cartPage.itemRemovedDesc") })
    } catch (e) {
      toast.error(t("cartPage.errorRemovingItem"), { description: e.message })
    }
  }

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id)
      return
    }

    try {
      // Optimistically update UI
      setCartItems(cartItems.map((item) => (item.item._id === id ? { ...item, quantity: newQuantity } : item)))

      // Send API request
      await addItemToCartApi(id, newQuantity, null)
    } catch (err) {
      toast.error(t("cartPage.failedUpdateQuantity"), { description: err.message })
      setRefreshCart(!refreshCart)
    }
  }

  const updateDuration = async (id, startDate, endDate, newDuration) => {
    try {
      // Optimistically update UI
      setCartItems(
        cartItems.map((item) =>
          item.item._id === id
            ? {
              ...item,
              duration: newDuration,
              startDate: startDate,
              endDate: endDate
            }
            : item
        )
      )
    } catch (err) {
      toast.error(t("cartPage.failedUpdateDuration"), { description: err.message })
      setRefreshCart(!refreshCart)
    }
  }

  // Clear all items from cart
  const clearCart = async () => {
    try {
      setCartItems([])
      await addItemToCartApi(undefined, undefined, undefined, true) // Assuming this API call clears the cart
      toast.success(t("cartPage.cartCleared"))
      setRefreshCart(!refreshCart)
    } catch (err) {
      toast.error(t("cartPage.errorClearingCart"), { description: err.message })
      setRefreshCart(!refreshCart)
    }
  }

  // Is cart empty
  const isCartEmpty = cartItems.length === 0

  // Calculate months between two dates
  const calculateMonthsBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return 1

    const start = new Date(startDate)
    const end = new Date(endDate)
    const daysDiff = end.getDate() - start.getDate()
    return daysDiff
  }

  const calculateDaysBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return 1

    const start = new Date(startDate)
    const end = new Date(endDate)
    const timeDiff = end.getTime() - start.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) // Convert milliseconds to days
    return daysDiff
  }

  const createBookings = async () => {
    if (!fullName.trim()) {
      toast.error(t("cartPage.enterFullName"))
      return
    }
    setIsBooking(true)
    try {
      // Instead of creating bookings immediately, we'll store the name and redirect to payment
      localStorage.setItem('bookingName', fullName);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      localStorage.setItem('cartTotal', total.toFixed(2));

      // Redirect to payment page
      window.location.href = '/payment';

      setShowNameModal(false)
      setFullName("")
    } catch (e) {
      toast.error(t("cartPage.errorRedirectingToPayment"), { description: e.message })
    }
    finally {
      setIsBooking(false)
    }
  }

  const subtotal = cartItems.reduce(
    (total, item) => total + item.item.price * item.quantity * calculateDaysBetween(item.startDate, item.endDate),
    0
  )
  const discount = 0
  const total = subtotal

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeIn}>
          <div className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              {t("cartPage.breadcrumbHome")}
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>{t("cartPage.breadcrumbCart")}</span>
          </div>
        </motion.div>

        {isCartEmpty ? (
          <motion.div
            className="text-center py-16 max-w-md mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.div
              className="bg-gray-50 rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6"
              variants={fadeIn}
            >
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </motion.div>
            <motion.h2 className="text-2xl font-bold mb-2" variants={fadeIn}>
              {t("cartPage.emptyTitle")}
            </motion.h2>
            <motion.p className="text-muted-foreground mb-8" variants={fadeIn}>
              {t("cartPage.emptyDesc")}
            </motion.p>
            <motion.div variants={fadeIn}>
              <Link to="/browse">
                <Button size="lg">{t("cartPage.browseProducts")}</Button>
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Column */}
            <motion.div className="lg:col-span-2" initial="hidden" animate="visible" variants={staggerChildren}>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{t("cartPage.cartItems", { count: cartItems.length })}</h2>
                    <Button variant="ghost" size="sm" className="text-sm text-muted-foreground" onClick={clearCart}>
                      {t("cartPage.clearAll")}
                    </Button>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.item._id}
                      className="p-6 flex flex-col sm:flex-row items-start gap-4"
                      variants={fadeIn}
                      layout
                    >
                      <div className="h-20 w-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.item.images[0] || "/placeholder.svg"}
                          alt={item.item.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h3 className="font-medium text-lg">{i18n.language === 'it' ? item.item.name_it : item.item.name}</h3>
                          <div className="flex items-center">
                            <span className="font-bold text-lg text-primary">
                              €{item.item.price * item.quantity * calculateDaysBetween(item.startDate, item.endDate)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {t("cartPage.pricePerDay", { price: item.item.price })}
                        </p>

                        <div className="flex flex-wrap gap-6 mt-2">
                          <div>
                            <Label
                              htmlFor={`duration-${item.item._id}`}
                              className="text-xs text-muted-foreground mb-1 block"
                            >
                              {t("cartPage.rentalPeriod")}
                            </Label>
                            <DateRangePicker
                              startDate={item.startDate ? new Date(item.startDate) : null}
                              endDate={item.endDate ? new Date(item.endDate) : null}
                              onChange={(start, end) => {
                                if (start && end) {
                                  // Calculate duration in months
                                  const newDuration = calculateMonthsBetween(start, end)
                                  updateDuration(item.item._id, start, end, newDuration)
                                }
                              }}
                              className="w-[300px]"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-500"
                          onClick={() => removeItem(item.item._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <h3 className="font-medium mb-2">{t("cartPage.havePromo")}</h3>
                  <div className="flex">
                    <Input
                      type="text"
                      placeholder={t("cartPage.promoPlaceholder")}
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button className="rounded-l-none">{t("cartPage.applyPromo")}</Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Summary Column */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold">{t("cartPage.orderSummary")}</h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cartPage.subtotal")}</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{t("cartPage.discount")}</span>
                      <span>-€{discount.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>{t("cartPage.total")}</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <span className="font-bold">{t("cartPage.depositNote")}</span>
                  </div>
                  <Button type="button" className="w-full" size="lg" onClick={handleCheckoutClick}>
                    {t("cartPage.proceedCheckout")}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <CreditCard className="h-3 w-3" />
                    <span>{t("cartPage.secureCheckout")}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </main>
      {/* Full Name Modal */}
      <Dialog open={showNameModal} onOpenChange={setShowNameModal}>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>{t("cartPage.enterFullNameTitle")}</DialogTitle>
          <Input
            type="text"
            placeholder={t("cartPage.enterFullNamePlaceholder")}
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowNameModal(false)}>{t("cartPage.cancel")}</Button>
            <Button onClick={createBookings} disabled={isBooking || !fullName.trim()}>
              {isBooking ? t("cartPage.bookingInProgress") : t("cartPage.confirmBooking")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
