import { useState } from "react"
import { Minus, Plus, Star, ShoppingCart, X } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { addItemToCartApi } from "../api/carts.api"
import { toast } from "sonner"
import { Label } from "./ui/label"

export default function ProductQuickView({ isOpen, onClose, product }) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStart] = useState(new Date());
  const [endDate, setEnd] = useState(new Date());
  const [duration, setDuration] = useState(1);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const updateQuantity = (value) => {
    if (value >= 1) {
      setQuantity(value)
    }
  }

  const handleAddToCart = async () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDuration(diffDays);
    }
    try {
      setIsLoading(true)
      await addItemToCartApi(product._id, quantity, duration)
      toast.success("Item added to cart successfully", {
        description: `${quantity} ${quantity > 1 ? "items" : "item"} for ${duration} ${duration > 1 ? "Days" : "Day"}`,
      })
      onClose()
    } catch (error) {
      toast.error("Failed to add item to cart", {
        description: error.message || "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] max-h-[90vh] md:max-h-[800px] overflow-y-auto bg-white text-black border-none">
        <DialogHeader className="p-8 pb-0 bg-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-black">{product.name}</DialogTitle>
            <DialogClose className="h-8 w-8 rounded-full flex items-center justify-center text-black">
              <X />
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square group shadow-md">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                {product.tags?.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-black text-white border-none"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <span>{product.category}</span>
                  <span>•</span>
                  <span>{product.brand}</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="ml-1 font-medium">{product.avgRating}</span>
                    <Star className="h-4 w-4 text-black fill-current" />
                  </div>
                  <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-black mb-1">${product.price}</div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className={`text-xs font-normal ${product.availableQuantity > 0 ? "text-black border-black" : "text-red-600 border-red-600"}`}>
                    {product.availableQuantity > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium mb-1 block text-black">Quantity</label>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-r-none border-gray-400 text-black hover:bg-black hover:text-white"
                        onClick={() => updateQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="h-8 px-4 flex items-center justify-center border-y border-gray-400 bg-white text-black">
                        {quantity}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-l-none border-gray-400 text-black hover:bg-black hover:text-white"
                        onClick={() => updateQuantity(quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <Label className="text-sm font-medium  block text-black">Rental Duration (Days)</Label>
                    <div className="inputs flex flex-col gap-5">
                      <Label className="text-sm font-medium  block text-black">Starting Date</Label>
                      <input placeholder="Start Date" type="date" min={today} onChange={(e) => { setStart(e.target.value) }} className="h-8 px-4 border border-gray-400 text-black rounded-md " />
                      <Label className="text-sm font-medium  block text-black">Ending Date</Label>
                      <input placeholder="End Date" type="date" min={today} onChange={(e) => { setEnd(e.target.value) }} className="h-8 px-4 border border-gray-400 text-black rounded-md" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  {product.availableQuantity > 0 && (
                    <Button
                      className="flex-1 bg-black hover:bg-gray-900 text-white gap-2"
                      onClick={handleAddToCart}
                      disabled={isLoading}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {isLoading ? "Adding..." : "Add to Cart"}
                    </Button>
                  )}

                </div>
              </div>
            </div>
          </div>

          {/* Description first, then map below */}
          <div className="bg-gray-50 rounded-lg p-4 min-h-[80px] max-h-64 overflow-y-auto text-black text-sm leading-relaxed shadow-inner mb-6 mt-6">
            {product.description}
          </div>
          {product.location && product.location.coordinates && (
            <div className="mb-6 w-full h-56 md:h-64 rounded overflow-hidden shadow-sm">
              <iframe
                title="Item Location"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 180 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${product.location.coordinates[1]},${product.location.coordinates[0]}&z=15&output=embed`}
              ></iframe>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
