"use client"

import { useState } from "react"
import { AlertCircle, ChevronRight, CreditCard, Minus, Plus, ShoppingCart, Trash2, Truck } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Separator } from "../components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Label } from "../components/ui/label"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'MacBook Pro 16"',
      price: 35,
      duration: 1,
      image: "/placeholder.svg?height=80&width=80",
      quantity: 1,
    },
    {
      id: 3,
      name: "Sony PlayStation 5",
      price: 29,
      duration: 3,
      image: "/placeholder.svg?height=80&width=80",
      quantity: 1,
    },
    {
      id: 5,
      name: 'Samsung 75" QLED 4K TV',
      price: 65,
      duration: 1,
      image: "/placeholder.svg?height=80&width=80",
      quantity: 1,
    },
  ])

  const [promoCode, setPromoCode] = useState("")
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [checkoutStep, setCheckoutStep] = useState(1)

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Cart actions
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const updateDuration = (id, newDuration) => {
    if (newDuration < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, duration: newDuration } : item)))
  }

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity * item.duration, 0)
  const shippingCost = shippingMethod === "express" ? 15 : 0
  const discount = 0 // In a real app, this would calculate discounts from promo codes
  const total = subtotal + shippingCost - discount

  // Is cart empty
  const isCartEmpty = cartItems.length === 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600"
          >
            Rental
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
              Home
            </Link>
            <Link to="/browse" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
              Browse
            </Link>
            <Link to="#" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
              How It Works
            </Link>
            <Link to="#" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        </div>
      </header>

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
                    <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
                      Clear All
                    </Button>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="p-6 flex flex-col sm:flex-row items-start gap-4"
                      variants={fadeIn}
                      layout
                    >
                      <div className="h-20 w-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h3 className="font-medium text-lg">{item.name}</h3>
                          <div className="flex items-center">
                            <span className="font-bold text-lg text-primary">
                              ${item.price * item.quantity * item.duration}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">${item.price}/month per unit</p>

                        <div className="flex flex-wrap gap-6 mt-2">
                          <div>
                            <Label htmlFor={`quantity-${item.id}`} className="text-xs text-muted-foreground mb-1 block">
                              Quantity
                            </Label>
                            <div className="flex items-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-r-none"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor={`duration-${item.id}`} className="text-xs text-muted-foreground mb-1 block">
                              Duration (months)
                            </Label>
                            <div className="flex items-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-r-none"
                                onClick={() => updateDuration(item.id, item.duration - 1)}
                                disabled={item.duration <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <div className="h-8 w-10 flex items-center justify-center border-y border-input">
                                {item.duration}
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-l-none"
                                onClick={() => updateDuration(item.id, item.duration + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-500"
                          onClick={() => removeItem(item.id)}
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
                <div className="flex-1 ml-4">
                  <h3 className="font-medium mb-2 text-start">Choose shipping method</h3>
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="flex-1">
                        Standard (Free)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="flex-1">
                        Express ($15)
                      </Label>
                    </div>
                  </RadioGroup>
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
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
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
                    You'll be charged ${total.toFixed(2)} today, and then ${subtotal.toFixed(2)} per month starting next
                    month.
                  </div>

                  <Alert variant="default" className="bg-primary/5 text-primary border-primary/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Free returns</AlertTitle>
                    <AlertDescription>No long-term commitment. Cancel anytime.</AlertDescription>
                  </Alert>

                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <CreditCard className="h-3 w-3" />
                    <span>Secure Checkout</span>
                    <Truck className="h-3 w-3 ml-2" />
                    <span>Free Delivery & Returns</span>
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