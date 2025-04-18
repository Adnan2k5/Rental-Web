"use client"

import { useState } from "react"
import { Minus, Plus, Star, ShoppingCart, ExternalLink, X } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Link } from "react-router-dom"
import { addItemToCartApi } from "../api/carts.api"
import { toast } from "sonner"

export default function ProductQuickView({ isOpen, onClose, product }) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const updateQuantity = (value) => {
    if (value >= 1) {
      setQuantity(value)
    }
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
  console.log(product)

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
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] max-h-[90vh] md:max-h-[800px] overflow-y-auto bg-white text-black border-none">
        <DialogHeader className="p-8 pb-0 top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-black">{product.name}</DialogTitle>
            <DialogClose className="h-8 w-8 z-50 relative rounded-full  flex items-center justify-center text-black">
              <X />
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="relative rounded-lg overflow-hidden bg-[#2A2D3A] aspect-square group">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                {product.tags?.map((tag, index) => (
                  <Badge
                    key={index}
                    variant={tag === "New" ? "default" : "secondary"}
                    className="text-xs bg-[#4D39EE] text-white border-none"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-[#4FC3F7] mb-1">
                  <span>{product.category}</span>
                  <span>•</span>
                  <span>{product.brand}</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="ml-1 font-medium">{product.avgRating}</span>
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                  </div>
                  <span className="text-gray-400 text-sm">({product.reviews} reviews)</span>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-[#4D39EE] mb-1">${product.price}</div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className={`text-xs font-normal  ${product.availableQuantity > 0 ? `text-[#4FC3F7] border-[#4FC3F7]` : `text-[#d93855] border-red-400`}  `}>
                    {product.availableQuantity > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>

                <p className="text-sm text-gray-800 mb-6">{description}</p>
              </div>

              <Separator className="mb-4 bg-gray-700" />

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-800">Quantity</label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-r-none bg-[#2A2D3A] border-gray-700 text-white hover:bg-[#4D39EE] hover:text-white"
                      onClick={() => updateQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="h-8 px-4 flex items-center justify-center border-y border-gray-700 bg-[#2A2D3A] text-white">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-l-none bg-[#2A2D3A] border-gray-700 text-white hover:bg-[#4D39EE] hover:text-white"
                      onClick={() => updateQuantity(quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Date Range Picker would go here */}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <Button
                  className="flex-1 bg-[#4D39EE] hover:bg-[#3D2EBE] text-white gap-2"
                  onClick={handleAddToCart}
                  disabled={isLoading}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {isLoading ? "Adding..." : "Add to Cart"}
                </Button>
                <Link to={`/product/${product.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-[#191B24] gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <Tabs defaultValue="features" className="mt-8">
            <TabsList className="grid w-full grid-cols-2 bg-[#2A2D3A]">
              <TabsTrigger value="features" className="data-[state=active]:bg-[#4D39EE] data-[state=active]:text-white">
                Features
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="data-[state=active]:bg-[#4D39EE] data-[state=active]:text-white"
              >
                Specifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="features" className="pt-4">
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-[#4D39EE]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="h-3 w-3 text-[#4FC3F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-800">{feature}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="specifications" className="pt-4">
              <div className="space-y-2">
                {Object.entries(specifications).map(([key, value], index) => (
                  <div key={index} className="grid grid-cols-2 gap-2 py-2 border-b border-gray-700 last:border-0">
                    <div className="font-medium text-[#2086b9]">{key}</div>
                    <div className="text-gray-800">{value}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
