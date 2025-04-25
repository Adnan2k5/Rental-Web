"use client"

import { useEffect, useState } from "react"
import { ChevronRight, CreditCard, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Separator } from "../components/ui/separator"
import { Label } from "../components/ui/label"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { useAuth } from "../Middleware/AuthProvider"
import { addItemToCartApi, fetchCartItemsApi } from "../api/carts.api"
import { toast } from "sonner"
import { Navbar } from "../Components/Navbar"
import DateRangePicker from "../Components/DateRangePicker"
import { createBookingApi } from "../api/bookings.api"
import { fadeIn, staggerChildren } from "../assets/Animations"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([])
  const [promoCode, setPromoCode] = useState("")
  const [refreshCart, setRefreshCart] = useState(false)

  useEffect(() => {
    const fetchCartItems = async () => {
      const response = await fetchCartItemsApi()
      const storedItems = response.data.data
      setCartItems(storedItems)
    }

    fetchCartItems()
  }, [refreshCart])


  // Cart actions
  const removeItem = async (id) => {
    try {
      await addItemToCartApi(id, 0, 0)
      setRefreshCart(!refreshCart)
      toast.success("Item removed from cart", { description: "Item has been removed from your cart." })
    } catch (e) {
      toast.error("Error removing item from cart", { description: e.message })
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
      toast.error("Failed to update quantity", { description: err.message })
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
            : item,
        ),
      )

      // Send API request
      // await addItemToCartApi(id, null, newDuration, startDate, endDate)
      console.log("API call to update duration", id, null, newDuration, startDate, endDate)
    } catch (err) {
      toast.error("Failed to update duration", { description: err.message })
      setRefreshCart(!refreshCart)
    }
  }

  // Clear all items from cart
  const clearCart = async () => {
    try {
      setCartItems([])
      await addItemToCartApi(undefined, undefined, undefined, true) // Assuming this API call clears the cart
      toast.success("Cart cleared successfully")
      setRefreshCart(!refreshCart)
    } catch (err) {
      toast.error("Error clearing cart", { description: err.message })
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
    if (!startDate || !endDate) return 1;

    const start = new Date(startDate)
    const end = new Date(endDate)
    const timeDiff = end.getTime() - start.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) // Convert milliseconds to days
    return daysDiff
  }

  const createBookings = async () => {
    try {
      await createBookingApi(cartItems);
      setCartItems([]) // Clear cart after booking
      toast.success("Bookings created successfully", { description: "Your bookings have been created." })
    } catch (e) {
      toast.error("Error creating bookings", { description: e.message })
    }
  }

  const subtotal = cartItems.reduce((total, item) => total + item.item.price * item.quantity * calculateDaysBetween(item.startDate, item.endDate), 0)
  const discount = 0
  const total = subtotal

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeIn}>
          <div className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Shopping Cart</span>
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
              Your cart is empty
            </motion.h2>
            <motion.p className="text-muted-foreground mb-8" variants={fadeIn}>
              Looks like you haven't added any items to your cart yet.
            </motion.p>
            <motion.div variants={fadeIn}>
              <Link to="/browse">
                <Button size="lg">Browse Products</Button>
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
                    <h2 className="text-xl font-semibold">Cart Items ({cartItems.length})</h2>
                    <Button variant="ghost" size="sm" className="text-sm text-muted-foreground" onClick={clearCart}>
                      Clear All
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
                          <h3 className="font-medium text-lg">{item.item.name}</h3>
                          <div className="flex items-center">
                            <span className="font-bold text-lg text-primary">
                              ${item.item.price * item.quantity * calculateDaysBetween(item.startDate, item.endDate)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">${item.item.price}/day per unit</p>

                        <div className="flex flex-wrap gap-6 mt-2">
                          <div>
                            <Label
                              htmlFor={`quantity-${item.item._id}`}
                              className="text-xs text-muted-foreground mb-1 block"
                            >
                              Quantity
                            </Label>
                            <div className="flex items-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-r-none"
                                onClick={() => updateQuantity(item.item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <div className="h-8 w-10 flex items-center justify-center border-y border-input">
                                {item.quantity}
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-l-none"
                                onClick={() => updateQuantity(item.item._id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label
                              htmlFor={`duration-${item.item._id}`}
                              className="text-xs text-muted-foreground mb-1 block"
                            >
                              Rental Period
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
                  <h3 className="font-medium mb-2">Have a promo code?</h3>
                  <div className="flex">
                    <Input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button className="rounded-l-none">Apply</Button>
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
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <span className="font-bold">Deposite amount should be paid directly to the owner.</span>
                  </div>
                  <Button type="button" className="w-full" size="lg" onClick={createBookings}>
                    Proceed to Checkout
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <CreditCard className="h-3 w-3" />
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Rental. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link to="#" className="text-sm text-gray-500 hover:text-primary">
                Terms
              </Link>
              <Link to="#" className="text-sm text-gray-500 hover:text-primary">
                Privacy
              </Link>
              <Link to="#" className="text-sm text-gray-500 hover:text-primary">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
