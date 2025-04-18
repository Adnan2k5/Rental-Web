"use client"

import { useState } from "react"
import { Minus, Plus, Star, Truck, Clock, Shield, X } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Link } from "react-router-dom"
import { addItemToCartApi } from "../api/carts.api"
import { toast } from "sonner"
import DateRangePicker from "./DateRangePicker"

export default function ProductQuickView({ isOpen, onClose, product }) {
  const [quantity, setQuantity] = useState(1)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [duration, setDuration] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const updateQuantity = (value) => {
    if (value >= 1) {
      setQuantity(value)
    }
  }
  const updateDuration = async (id, newDuration, startDate, endDate) => {
    if (newDuration < 1) {
      removeItem(id)
      return
    }
  }

  const handleDateRangeChange = (start, end) => {
    setStartDate(start)
    setEndDate(end)

    // Calculate duration in months
    let months = (end.getFullYear() - start.getFullYear()) * 12
    months += end.getMonth() - start.getMonth()

    // If end date day is greater than or equal to start date day, add 1 more month
    if (end.getDate() >= start.getDate()) {
      months += 1
    }

    setDuration(Math.max(1, months)) // Minimum 1 month
  }



  const handleAddToCart = async () => {
    try {
      setIsLoading(true)
      await addItemToCartApi(product._id, quantity, duration, startDate, endDate)
      toast.success("Item added to cart successfully", {
        description: `${quantity} ${quantity > 1 ? "items" : "item"} for ${duration} ${duration > 1 ? "months" : "month"}`,
      })
      onClose() // Close the dialog after adding to cart
    } catch (error) {
      toast.error("Failed to add item to cart", {
        description: error.message || "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Product description - would come from the API in a real app
  const description =
    product.description ||
    "Experience premium quality with this high-demand rental item. Perfect for both personal and professional use, this product offers exceptional performance and reliability. Rent now and enjoy the benefits without the commitment of ownership."

  // Product features - would come from the API in a real app
  const features = [
    "High-quality build and materials",
    "Energy efficient design",
    "Latest technology and features",
    "Regular maintenance included",
    "Free delivery and setup",
  ]

  // Product specifications - would come from the API in a real app
  const specifications = {
    Dimensions: "Variable based on model",
    Weight: "Depends on configuration",
    Power: "Standard electrical requirements",
    Warranty: "Covered during rental period",
    Condition: "Excellent (regularly maintained)",
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] max-h-[90vh] md:max-h-[800px] overflow-y-auto">
        <DialogHeader className="p-8 pb-0 top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">{product.name}</DialogTitle>
            <DialogClose className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="relative rounded-lg overflow-hidden bg-gray-50 aspect-square">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill="true"
                className="object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                {product.tags?.map((tag, index) => (
                  <Badge key={index} variant={tag === "New" ? "default" : "secondary"} className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span>{product.category}</span>
                  <span>•</span>
                  <span>{product.brand}</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                    <span className="ml-1 font-medium">{product.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">({product.reviews} reviews)</span>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-primary mb-1">${product.price}</div>
                  <div className="text-sm text-muted-foreground">Rental price per unit, billed monthly</div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="text-xs font-normal">
                    {product.availability}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-6">{description}</p>
              </div>

              <Separator className="mb-4" />

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-1 block">Quantity</label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-r-none"
                      onClick={() => updateQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="h-8 px-4 flex items-center justify-center border-y border-input">{quantity}</div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-l-none"
                      onClick={() => updateQuantity(quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                // Date Range Picker
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <Button className="flex-1" onClick={handleAddToCart} disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add to Cart"}
                </Button>
                <Link to={`/product/${product.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Full Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <Tabs defaultValue="features" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="features" className="pt-4">
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="specifications" className="pt-4">
              <div className="space-y-2">
                {Object.entries(specifications).map(([key, value], index) => (
                  <div key={index} className="grid grid-cols-2 gap-2 py-2 border-b border-gray-100 last:border-0">
                    <div className="font-medium">{key}</div>
                    <div className="text-gray-600">{value}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="pt-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Free Delivery</h4>
                    <p className="text-sm text-gray-600">
                      We offer free delivery for all rental items. Our team will handle setup and installation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Flexible Returns</h4>
                    <p className="text-sm text-gray-600">
                      Return or exchange your rental items with ease. Schedule a pickup at your convenience.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Damage Protection</h4>
                    <p className="text-sm text-gray-600">
                      Optional damage protection available for peace of mind during your rental period.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}



// <div>
//                   <label className="text-sm font-medium mb-1 block">Rental Duration</label>
//                   {/* <DateRangePicker startDate={startDate} endDate={endDate} onChange={handleDateRangeChange} /> */}
//                   <DateRangePicker
//                     startDate={product.startDate ? new Date(product.startDate) : null}
//                     endDate={product.endDate ? new Date(product.endDate) : null}
//                     onChange={(start, end) => {
//                       let months = (end.getFullYear() - start.getFullYear()) * 12
//                       months += end.getMonth() - start.getMonth()

//                       // If end date day is greater than or equal to start date day, add 1 more month
//                       if (end.getDate() >= start.getDate()) {
//                         months += 1
//                       }

//                       const newDuration = Math.max(1, months)
//                       updateDuration(product._id, newDuration, start, end)
//                     }}
//                     className="w-[220px]"
//                   />
//                 </div>
//               </div>