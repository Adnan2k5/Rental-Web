import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Plus, Upload, X, Edit, Trash2, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../../Components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../Components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../Components/ui/select"
import { Badge } from "../../Components/ui/badge"
import { Label } from "../../Components/ui/label"
import { Input } from "../../Components/ui/input"
import { Textarea } from "../../Components/ui/textarea"
import { createItems, deleteItem, fetchByUserId, updateItem } from "../../api/items.api"
import { toast } from "sonner"
import { useAuth } from "../../Middleware/AuthProvider"
import { colors } from "../../assets/Color"
import { itemFadeIn, floatAnimation, buttonHover } from "../../assets/Animations"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../Components/ui/pagination"

import { useCategories } from "../../hooks/useCategories"
import { useTranslation } from "react-i18next"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

export default function Dashboard() {
  const [viewMode, setViewMode] = useState("grid")
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState("post") // "post" or "edit"
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const user = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [editingItem, setEditingItem] = useState(null)
  const ITEMS_PER_PAGE = 8
  const { categories } = useCategories()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [locationInput, setLocationInput] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      category: "Electronics",
      location: "",
      price: "",
      available: true,
      availableQuantity: 1,
    },
  })

  // Map marker icon fix for leaflet in React
  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  })

  // Map click handler component
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setSelectedPosition([e.latlng.lat, e.latlng.lng])
        setLocationInput(`${e.latlng.lat},${e.latlng.lng}`)
        setValue("location", `${e.latlng.lat},${e.latlng.lng}`)
      },
    })
    return selectedPosition ? <Marker position={selectedPosition} icon={markerIcon} /> : null
  }

  // Helper component to recenter map
  function RecenterMap({ position }) {
    const map = useMap()
    useEffect(() => {
      if (position) {
        map.setView(position)
      }
    }, [position, map])
    return null
  }

  useEffect(() => {
    const setDefaultLocation = (lat, lng) => {
      setSelectedPosition([lat, lng])
      setLocationInput(`${lat},${lng}`)
      setValue("location", `${lat},${lng}`, { shouldValidate: true })
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setDefaultLocation(latitude, longitude)
        },
        () => {
          // Default to Lithuania if geolocation fails
          setDefaultLocation(55.1694, 23.8813)
        }
      )
    } else {
      // Default to Lithuania if geolocation is not available
      setDefaultLocation(55.1694, 23.8813)
    }
  }, [setValue])

  const handleItemSubmit = async (data) => {
    setLoading(true)
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("price", data.price)
    formData.append("category", data.category)
    formData.append("availableQuantity", data.availableQuantity || 1)
    formData.append("location", data.location || locationInput)
    formData.append("available", data.available)

    // Handle images
    uploadedFiles.forEach((image) => {
      if (image.file) {
        formData.append("images", image.file)
      }
    })

    try {
      if (dialogMode === "post") {
        await createItems(formData)
        toast.success("Item posted successfully!")
      } else {
        await updateItem(editingItem._id, formData)
        toast.success("Item updated successfully!")
      }

      setIsItemDialogOpen(false)
      setUploadedFiles([])
      reset()
      fetchItems()
    } catch (error) {
      toast.error(`Failed to ${dialogMode === "post" ? "post" : "update"} item`)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const [fetchItemsfrombackend, setFetchItems] = useState([])
  const [totalPages, setTotalPages] = useState(1)

  const fetchItems = async () => {
    try {
      const res = await fetchByUserId(user.user._id)
      setFetchItems(res.data.message)
      setTotalPages(Math.ceil(res.data.message.length / ITEMS_PER_PAGE))
    } catch (error) {
      console.error("Error fetching items:", error)
      toast.error("Failed to fetch items")
    }
  }

  useEffect(() => {
    if (user?.user?._id) {
      fetchItems()
    }
  }, [user])

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    if (files.length + uploadedFiles.length > 5) {
      alert("You can upload up to 5 images only.")
      return
    }
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }))
    setUploadedFiles((prev) => [...prev, ...newImages])
  }

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files)
      if (newFiles.length + uploadedFiles.length > 5) {
        alert("You can upload up to 5 images only.")
        return
      }
      const newImages = newFiles.map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }))
      setUploadedFiles((prev) => [...prev, ...newImages])
    }
  }

  // Remove file from upload list
  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleItemDelete = async (id) => {
    try {
      const res = await deleteItem(id)
      if (res.status === 200) {
        toast.success("Item deleted successfully!")
        fetchItems()
      } else {
        toast.error("Failed to delete item.")
      }
    } catch (error) {
      toast.error("Failed to delete item.")
      console.error(error)
    }
  }

  const openEditDialog = (item) => {
    setDialogMode("edit")
    setEditingItem(item)

    // Set form values
    setValue("name", item.name)
    setValue("description", item.description)
    setValue("price", item.price)
    setValue("category", item.category)
    setValue("location", item.location)
    setValue("availableQuantity", item.availableQuantity || 1)
    setValue("available", item.available)

    // Set uploaded files from item images
    const itemImages = item.images.map((url, index) => ({
      url,
      isExisting: true,
      id: `existing-${index}`,
    }))
    setUploadedFiles(itemImages)
    setIsItemDialogOpen(true)
  }

  // Get current items for pagination
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
  const currentItems = fetchItemsfrombackend.slice(indexOfFirstItem, indexOfLastItem)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <motion.h1
            className="text-2xl font-bold text-dark mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t("dashboard.myitems")}
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t("dashboard.myitemsdesc")}
          </motion.p>
        </div>

        <motion.div
          className="flex items-center space-x-3 mt-4 md:mt-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div variants={buttonHover} initial="rest" whileHover="hover">
            <Button
              onClick={() => {
                setDialogMode("post")
                reset()
                // Set default location after reset
                if (selectedPosition) {
                  const [lat, lng] = selectedPosition
                  setLocationInput(`${lat},${lng}`)
                  setValue("location", `${lat},${lng}`, { shouldValidate: true })
                }
                setIsItemDialogOpen(true)
              }}
              className="relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              <motion.span
                className="absolute inset-0 bg-white/20 rounded-md"
                initial={{ x: "-100%", opacity: 0 }}
                whileHover={{ x: "100%", opacity: 0.3 }}
                transition={{ duration: 0.6 }}
              />
              <Plus className="h-4 w-4 mr-2" />
              <span className="relative">{t("dashboard.newItem")}</span>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" variants={itemFadeIn}>
        {[
          {
            label: t("dashboard.totalitems"),
            value: fetchItemsfrombackend.length,
            icon: <Plus className="h-5 w-5 text-primary" />,
          },
          {
            label: t("dashboard.activeListings"),
            value: fetchItemsfrombackend.length,
            icon: <Sparkles className="h-5 w-5 text-primary" />,
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg p-6 border border-gray-100 relative overflow-hidden"
            whileHover={{
              y: -5,
              boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-bl-full" />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-muted-foreground text-sm mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-dark">{stat.value}</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Items Grid/List */}
      <motion.div variants={itemFadeIn}>
        <AnimatePresence mode="wait">
          <motion.div
            key="grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {currentItems.map((item) => (
              <motion.div
                key={item._id}
                className="bg-white rounded-lg overflow-hidden border border-gray-100"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={item.images[0] || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant={item.status === "active" ? "default" : "secondary"} className="capitalize">
                      {item.status || "active"}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-muted-foreground">{item.category}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1 text-dark">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-primary font-semibold">${item.price}</div>
                    <div className="flex space-x-2">
                      <button className="p-1.5 rounded-md hover:bg-gray-100" onClick={() => openEditDialog(item)}>
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleItemDelete(item._id)}
                        className="p-1.5 rounded-md hover:bg-gray-100"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, index) => {
                  // Show first page, last page, and pages around current page
                  const pageNumber = index + 1
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink isActive={currentPage === pageNumber} onClick={() => paginate(pageNumber)}>
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  }

                  // Show ellipsis for skipped pages
                  if (
                    (pageNumber === 2 && currentPage > 3) ||
                    (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={`ellipsis-${pageNumber}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }

                  return null
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </motion.div>

      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl">
              {dialogMode === "post" ? t("addItem.title") : t("addItem.edit")}
            </DialogTitle>
            <DialogDescription>{dialogMode === "post" ? t("addItem.desc") : t("addItem.editdesc")}</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
            <form id="item-form" onSubmit={handleSubmit(handleItemSubmit)} className="space-y-6">
              {/* Item Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="Name">{t("addItem.name")}</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Professional DSLR Camera"
                    className="mt-1.5"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <Label htmlFor="description">{t("addItem.description")}</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item in detail..."
                    className="mt-1.5 min-h-[100px]"
                    {...register("description", {
                      required: "Description is required",
                    })}
                  />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                </div>

                <div>
                  <Label htmlFor="category">{t("addItem.category")}</Label>
                  <Select
                    defaultValue={editingItem?.category || "Electronics"}
                    onValueChange={(value) => {
                      const event = { target: { name: "category", value } }
                      register("category").onChange(event)
                    }}
                  >
                    <SelectTrigger id="category" className="mt-1.5">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories &&
                        categories.length > 0 &&
                        categories.map((category) => (
                          <SelectItem key={category.name} value={`${category.name}`}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...register("category")} />
                </div>

                <div>
                  <Label htmlFor="price">{t("addItem.price")} ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    className="mt-1.5"
                    {...register("price", {
                      required: "Price is required",
                      min: {
                        value: 0.01,
                        message: "Price must be greater than 0",
                      },
                    })}
                  />
                  {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
                </div>
              </div>

              {/* Media Upload */}
              <div>
                <Label className="block mb-2">{t("addItem.upload")}</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? "border-primary bg-primary/5" : "border-gray-200"
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />

                  <motion.div
                    className="flex flex-col items-center"
                    variants={floatAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium mb-1">{t("uploadContaier.desc")}</p>
                    <p className="text-xs text-muted-foreground mb-3">{t("uploadContaier.support")}</p>
                    <Button type="button" variant="outline" onClick={triggerFileInput} className="text-sm">
                      {t("uploadContaier.browse")}
                    </Button>
                  </motion.div>
                </div>

                {/* Preview uploaded files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <AnimatePresence>
                      {uploadedFiles.map((file, index) => (
                        <motion.div
                          key={file.id || index}
                          className="relative rounded-md overflow-hidden bg-gray-100 aspect-square"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        >
                          <img
                            src={file.url || "/placeholder.svg"}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-3 w-3 text-gray-700" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Location Selection */}
              <div>
                <Label htmlFor="location">{t("addItem.location") || "Location"}</Label>
                <Input
                  id="location"
                  placeholder="Click on map or enter coordinates (lat,lng)"
                  className="mt-1.5"
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value)
                    setValue("location", e.target.value)
                  }}
                  {...register("location", { required: "Location is required" })}
                />
                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
                <div className="mt-3 rounded overflow-hidden" style={{ height: 250 }}>
                  <MapContainer
                    center={selectedPosition || [55.1694, 23.8813]} // Lithuania as fallback
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <RecenterMap position={selectedPosition} />
                    <LocationMarker />
                  </MapContainer>
                </div>
              </div>
            </form>
          </div>

          <DialogFooter className="px-6 py-4 bg-gray-50">
            <Button variant="outline" onClick={() => setIsItemDialogOpen(false)}>
              {t("dialogbox.cancel")}
            </Button>
            <motion.div variants={buttonHover} initial="rest" whileHover="hover">
              <Button
                type="submit"
                form="item-form"
                className="relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                <motion.span
                  className="absolute inset-0 bg-white/20 rounded-md"
                  initial={{ x: "-100%", opacity: 0 }}
                  whileHover={{ x: "100%", opacity: 0.3 }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative">
                  {loading ? "Processing..." : dialogMode === "post" ? t("addItem.post") : t("addItem.update")}
                </span>
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
