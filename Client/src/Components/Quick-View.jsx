import { useState } from "react"
import { Minus, Plus, Star, ShoppingCart, X } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { addItemToCartApi } from "../api/carts.api"
import { toast } from "sonner"
import { Label } from "./ui/label"
import { Link } from "react-router-dom"
import DateRangePicker from "./DateRangePicker"

export default function ProductQuickView({ isOpen, onClose, product }) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [duration, setDuration] = useState(1);

  // Calculate days between two dates
  const calculateDaysBetween = (start, end) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diff = e.getTime() - s.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  const updateQuantity = (value) => {
    if (value >= 1) {
      setQuantity(value)
    }
  }

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      setDuration(calculateDaysBetween(start, end));
    }
  };

  const handleAddToCart = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select a rental period.");
      return;
    }
    const days = calculateDaysBetween(startDate, endDate);
    setDuration(days);
    try {
      setIsLoading(true)
      await addItemToCartApi(product._id, quantity, days)
      toast.success("Item added to cart successfully", {
        description: `${quantity} ${quantity > 1 ? "items" : "item"} for ${days} ${days > 1 ? "Days" : "Day"}`,
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
      <DialogContent className="sm:max-w-[650px] md:max-w-[900px] max-h-[90vh] md:max-h-[800px] overflow-y-auto bg-gradient-to-br from-white to-gray-100 border border-gray-200 shadow-2xl rounded-2xl p-0">
        <div className="flex items-center justify-between px-8 pt-8 pb-0">
          <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">{product.name}</DialogTitle>
        </div>
        <div className="p-8 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Product Image */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-square group shadow-lg border border-gray-200">
              <Link to={product.images[0]} target="_blank" className="block">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 rounded-2xl"
                /></Link>
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.tags?.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-primary text-white border-none shadow"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-3 text-base text-gray-600 mb-2 font-medium">
                  <span className="capitalize">{product.category}</span>
                  <span className="text-gray-400">•</span>
                  <span className="capitalize">{product.brand}</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="ml-1 font-semibold text-lg text-amber-500">{product.avgRating}</span>
                    <Star className="h-5 w-5 text-amber-400 fill-current" />
                  </div>
                  <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>
                </div>

                <div className="mb-4">
                  <div className="text-3xl font-extrabold text-primary mb-1">€{product.price}</div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className={`text-xs font-semibold px-3 py-1 rounded-full ${product.availableQuantity > 0 ? "text-green-700 border-green-400 bg-green-50" : "text-red-600 border-red-400 bg-red-50"}`}>
                    {product.availableQuantity > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <label className="text-sm font-semibold mb-1 block text-gray-700">Quantity</label>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-r-none border-gray-300 text-gray-700 hover:bg-primary hover:text-white"
                        onClick={() => updateQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="h-9 px-5 flex items-center justify-center border-y border-gray-300 bg-white text-lg font-semibold text-gray-900">
                        {quantity}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-l-none border-gray-300 text-gray-700 hover:bg-primary hover:text-white"
                        onClick={() => updateQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <Label className="text-sm font-semibold block text-gray-700">Rental Period</Label>
                    <DateRangePicker
                      startDate={startDate}
                      endDate={endDate}
                      onChange={handleDateChange}
                      className="w-[300px] mt-2"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  {product.availableQuantity > 0 && (
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2 text-lg font-semibold py-3 rounded-xl shadow"
                      onClick={handleAddToCart}
                      disabled={isLoading}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {isLoading ? "Adding..." : "Add to Cart"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description first, then map below */}
          <div className="bg-white rounded-xl p-5 min-h-[80px] max-h-64 overflow-y-auto text-gray-700 text-base leading-relaxed shadow-inner mb-8 mt-10 border border-gray-100">
            {product.description}
          </div>
          {product.location && product.location.coordinates && (
            <div className="mb-6 w-full h-56 md:h-64 rounded-2xl overflow-hidden shadow border border-gray-200">
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
