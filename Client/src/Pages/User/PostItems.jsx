"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  Plus,
  Search,
  Bell,
  Package,
  Settings,
  LogOut,
  Upload,
  X,
  Edit,
  Trash2,
  ChevronDown,
  Sparkles,
  LayoutGrid,
  Box,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Separator } from "../../components/ui/separator"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Label } from "../../components/ui/label"
import { createItems, deleteItem, fetchByUserId, updateItem } from "../../api/items.api"
import { toast } from "sonner"
import { useAuth } from "../../Middleware/AuthProvider"
import { Link } from "react-router-dom"
import { colors } from "../../assets/Color"
import { pageTransition, itemFadeIn, floatAnimation, shimmerAnimation, buttonHover } from "../../assets/Animations"
import { Particles } from "../../Components/Particles"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination"

export default function Dashboard() {
  const [viewMode, setViewMode] = useState("grid")
  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false)
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const user = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [editingItem, setEditingItem] = useState(null)
  const ITEMS_PER_PAGE = 8

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

  const handlePostItem = async (data) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("price", data.price)
    formData.append("category", data.category)
    formData.append("availableQuantity", data.availableQuantity || 1)
    formData.append("location", data.location)
    formData.append("available", data.available)
    uploadedFiles.forEach((image) => {
      formData.append("images", image.file)
    })
    await createItems(formData)
    setIsNewItemDialogOpen(false)
    setUploadedFiles([])
    toast.success("Item posted successfully!")
    reset()
    fetchItems()
  }

  const handleEditItem = async (data) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("price", data.price)
    formData.append("category", data.category)
    formData.append("availableQuantity", data.availableQuantity || 1)
    formData.append("location", data.location)
    formData.append("available", data.available)

    // Only append new images if there are any
    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach((image) => {
        if (image.file) {
          formData.append("images", image.file)
        }
      })
    }

    try {
      await updateItem(editingItem._id, formData)
      setIsEditItemDialogOpen(false)
      setUploadedFiles([])
      toast.success("Item updated successfully!")
      reset()
      fetchItems()
    } catch (error) {
      toast.error("Failed to update item")
      console.error(error)
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

    setIsEditItemDialogOpen(true)
  }

  // Get current items for pagination
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
  const currentItems = fetchItemsfrombackend.slice(indexOfFirstItem, indexOfLastItem)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <motion.div className="min-h-screen bg-light flex" initial="hidden" animate="visible" variants={pageTransition}>
      {/* Sidebar */}
      <motion.div className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col" variants={itemFadeIn}>
        <div className="p-6">
          <motion.div
            className="text-2xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            {...shimmerAnimation}
          >
            Rental
          </motion.div>
        </div>

        <div className="flex-1 py-6">
          <div className="px-3 mb-6">
            <div className="text-xs font-semibold text-muted-foreground mb-2 px-3">MENU</div>
            {[
              {
                icon: <Package className="h-4 w-4 mr-3" />,
                label: "My Dashboard",
                active: true,
                link: "/dashboard"
              },
              {
                icon: <Box className="h-4 w-4 mr-3" />,
                label: "My Items",
                active: false,
                link: "/dashboard/myitems",
              },
              {
                icon: <LayoutGrid className="h-4 w-4 mr-3" />,
                label: "Browse",
                active: false,
                link: "/browse",
              },
              {
                icon: <Settings className="h-4 w-4 mr-3" />,
                label: "Settings",
                active: false,
                link: "/dashboard/settings",
              },
            ].map((item, index) => (
              <Link to={item.link || "#"} key={index}>
                <motion.button
                  key={index}
                  className={`flex items-center w-full px-3 py-2 mb-1 rounded-md text-sm ${item.active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-gray-100"
                    }`}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {item.icon}
                  {item.label}
                  {item.active && (
                    <motion.div
                      className="ml-auto h-2 w-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                  )}
                </motion.button>
              </Link>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="px-3">
            <div className="text-xs font-semibold text-muted-foreground mb-2 px-3">ACCOUNT</div>
            <motion.button
              className="flex items-center w-full px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-gray-100"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </motion.button>
          </div>
        </div>

        <div className="p-4 m-4 rounded-lg bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg" />
          <motion.div className="relative z-10" variants={floatAnimation} initial="initial" animate="animate">
            <div className="flex items-center mb-3">
              <Sparkles className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium">Pro Tips</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Add high-quality photos to increase your item visibility by up to 80%
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div className="flex-1 flex flex-col" variants={itemFadeIn}>
        {/* Header */}
        <header className="bg-white border-b border-gray-100 py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="md:hidden">
              <motion.div
                className="text-xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                {...shimmerAnimation}
              >
                Rental
              </motion.div>
            </div>

            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                className="pl-10 bg-gray-50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                className="relative p-2 rounded-full hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
              </motion.button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.user?.email} />
                      <AvatarFallback>{user.user?.name?.charAt(0) || user.user?.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-sm font-medium">{user.user?.name || user.user?.email}</div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/settings" className="w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto relative">
          <Particles />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <motion.h1
                  className="text-2xl font-bold text-dark mb-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  My Items
                </motion.h1>
                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Manage your rental listings and post new items
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
                      reset()
                      setUploadedFiles([])
                      setIsNewItemDialogOpen(true)
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
                    <span className="relative">New Item</span>
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" variants={itemFadeIn}>
              {[
                {
                  label: "Total Items",
                  value: fetchItemsfrombackend.length,
                  icon: <Package className="h-5 w-5 text-primary" />,
                },
                {
                  label: "Active Listings",
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
                    <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
                      {stat.icon}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Items Grid/List */}
            <motion.div variants={itemFadeIn}>
              <AnimatePresence mode="wait">
                {viewMode === "grid" ? (
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
                              <button
                                className="p-1.5 rounded-md hover:bg-gray-100"
                                onClick={() => openEditDialog(item)}
                              >
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
                ) : (
                  <motion.div
                    key="list"
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {currentItems.map((item) => (
                      <motion.div
                        key={item._id}
                        className="bg-white rounded-lg overflow-hidden border border-gray-100 flex"
                        whileHover={{
                          y: -3,
                          boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)",
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="relative w-32 md:w-48 bg-gray-100">
                          <img
                            src={item.images[0] || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge variant={item.status === "active" ? "default" : "secondary"} className="capitalize">
                              {item.status || "active"}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4 flex-1">
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
                              <button
                                className="p-1.5 rounded-md hover:bg-gray-100"
                                onClick={() => openEditDialog(item)}
                              >
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
                )}
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
                              <PaginationLink
                                isActive={currentPage === pageNumber}
                                onClick={() => paginate(pageNumber)}
                              >
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
          </div>
        </main>
      </motion.div>

      {/* New Item Dialog */}
      <Dialog open={isNewItemDialogOpen} onOpenChange={setIsNewItemDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl">Post New Item</DialogTitle>
            <DialogDescription>Fill in the details and upload images of your item</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
            <form id="post-item-form" onSubmit={handleSubmit(handlePostItem)} className="space-y-6">
              {/* Item Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="Name">Item Title</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Professional DSLR Camera"
                    className="mt-1.5"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <input placeholder="e.g. New York" className="mt-1.5 Input border" {...register("location")} />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      defaultValue="electronics"
                      onValueChange={(value) => {
                        const event = { target: { name: "category", value } }
                        register("category").onChange(event)
                      }}
                    >
                      <SelectTrigger id="category" className="mt-1.5">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="sports">Sports & Outdoors</SelectItem>
                        <SelectItem value="tools">Tools & Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("category")} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
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
              </div>

              {/* Media Upload */}
              <div>
                <Label className="block mb-2">Upload Images</Label>
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
                    <p className="text-sm font-medium mb-1">Drag and drop your images here</p>
                    <p className="text-xs text-muted-foreground mb-3">Support for JPG, PNG, WEBP (max 5MB each)</p>
                    <Button type="button" variant="outline" onClick={triggerFileInput} className="text-sm">
                      Browse Files
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
            </form>
          </div>

          <DialogFooter className="px-6 py-4 bg-gray-50">
            <Button variant="outline" onClick={() => setIsNewItemDialogOpen(false)}>
              Cancel
            </Button>
            <motion.div variants={buttonHover} initial="rest" whileHover="hover">
              <Button
                type="submit"
                form="post-item-form"
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
                <span className="relative">Post Item</span>
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditItemDialogOpen} onOpenChange={setIsEditItemDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl">Edit Item</DialogTitle>
            <DialogDescription>Update the details of your item</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
            <form id="edit-item-form" onSubmit={handleSubmit(handleEditItem)} className="space-y-6">
              {/* Item Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="Name">Item Title</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Professional DSLR Camera"
                    className="mt-1.5"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <input placeholder="e.g. New York" className="mt-1.5 Input border" {...register("location")} />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      defaultValue={editingItem?.category || "electronics"}
                      onValueChange={(value) => {
                        const event = { target: { name: "category", value } }
                        register("category").onChange(event)
                      }}
                    >
                      <SelectTrigger id="category" className="mt-1.5">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="sports">Sports & Outdoors</SelectItem>
                        <SelectItem value="tools">Tools & Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("category")} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
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
              </div>

              {/* Media Upload */}
              <div>
                <Label className="block mb-2">Images</Label>
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
                    <p className="text-sm font-medium mb-1">Add or replace images</p>
                    <p className="text-xs text-muted-foreground mb-3">Support for JPG, PNG, WEBP (max 5MB each)</p>
                    <Button type="button" variant="outline" onClick={triggerFileInput} className="text-sm">
                      Browse Files
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
            </form>
          </div>

          <DialogFooter className="px-6 py-4 bg-gray-50">
            <Button variant="outline" onClick={() => setIsEditItemDialogOpen(false)}>
              Cancel
            </Button>
            <motion.div variants={buttonHover} initial="rest" whileHover="hover">
              <Button
                type="submit"
                form="edit-item-form"
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
                <span className="relative">Update Item</span>
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

// Additional components needed
const EyeIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
