"use client"

import { useState, useEffect } from "react"
import { Filter, Search, ShoppingCart, Star, X } from "lucide-react"
import { Button } from "../Components/ui/button"
import { Input } from "../Components/ui/input"
import { Checkbox } from "../Components/ui/checkbox"
import { Slider } from "../Components/ui/slider"
import { Badge } from "../Components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "../Components/ui/sheet"
import { Link, useNavigate } from "react-router-dom"
import ProductQuickView from "../Components/Quick-View"
import { useAuth } from "../Middleware/AuthProvider"
import { fetchAllItems } from "../api/items.api"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { ProductCard } from "../Components/ui/product"
import { Navbar } from "../Components/Navbar"
import { fadeIn, staggerChildren } from "../assets/Animations"
import { Footer } from "../Components/Footer"
import { Loader } from "../Components/loader"
import { useCategories } from "../hooks/useCategories"
import { useTranslation } from "react-i18next"

export default function BrowsePage() {
  const [products, setitems] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuth()
  const [filters, setFilters] = useState({
    priceRange: [0, 200],
    categories: [],
    brands: [],
    availability: [],
    rating: null,
    query: "",
    page: 1,
    limit: 10,
    lat: undefined,
    long: undefined,
  })
  const [countItems, setCountItems] = useState(0)
  const [locationChecked, setLocationChecked] = useState(false)
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [openquickview, setOpenQuickView] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const { categories } = useCategories() || []

  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

  // Get user location once on mount, then set filters accordingly
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocationChecked(true)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFilters((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          long: position.coords.longitude,
        }))
        setLocationChecked(true)
      },
      (err) => {
        setFilters((prev) => ({
          ...prev,
          lat: undefined,
          long: undefined,
        }))
        setLocationChecked(true)
      },
    )
  }, [])

  // Only fetch products after location is checked (so filters are correct)
  useEffect(() => {
    if (!locationChecked) return
    const FetchProducts = async () => {
      setLoading(true)
      try {
        const res = await fetchAllItems(filters)
        setitems(res.data.message.items)
        setCountItems(res.data.message.totalItems)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    FetchProducts()
  }, [filters, locationChecked])

  const openQuickView = (product) => {
    setQuickViewProduct(product)
    setOpenQuickView(true)
  }

  const closeQuickView = () => {
    setQuickViewProduct(null)
  }

  // Filter handlers
  const handleCategoryChange = (category, isSubCategory = false) => {
    // If it's a subcategory, don't change the selectedCategory state
    if (!isSubCategory) {
      setSelectedCategory((prev) => (prev === category ? null : category))

      // If deselecting a main category, also remove all its subcategories from filters
      if (filters.categories.includes(category)) {
        const categoryObj = categories.find((cat) => cat.name === category)
        if (categoryObj && categoryObj.subCategories && categoryObj.subCategories.length > 0) {
          setFilters((prev) => ({
            ...prev,
            categories: prev.categories.filter((c) => c !== category && !categoryObj.subCategories.includes(c)),
            page: 1,
          }))
          return
        }
      }
    }

    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
      page: 1,
    }))
  }
  const handleAvailabilityChange = (status) => {
    setFilters((prev) => ({
      ...prev,
      availability: prev.availability.includes(status)
        ? prev.availability.filter((a) => a !== status)
        : [...prev.availability, status],
      page: 1,
    }))
  }

  const handlePriceChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: value,
      page: 1,
    }))
  }

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({
      ...prev,
      rating,
      page: 1,
    }))
  }

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 200],
      categories: [],
      brands: [],
      availability: [],
      rating: null,
    })
  }

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }))
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const FilterPanel = () => (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("filterPanel.filters")}</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs text-muted-foreground">
          {t("filterPanel.clearall")}
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-3">{t("filterPanel.priceRange")}</h4>
          <div className="px-2">
            <Slider
              defaultValue={50}
              value={filters.priceRange}
              max={200}
              step={1}
              onValueChange={handlePriceChange}
              className="my-6"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm">${filters.priceRange[0]}</span>
              <span className="text-sm">${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-3">{t("filterPanel.category")}</h4>
          <div className="space-y-2">
            {categories &&
              categories.length !== 0 &&
              categories.map((category) => (
                <div key={category._id}>
                  <div className="flex items-center">
                    <Checkbox
                      id={`category-${category._id}`}
                      checked={filters.categories.includes(category.name)}
                      onCheckedChange={() => handleCategoryChange(category.name)}
                    />
                    <label
                      htmlFor={`category-${category._id}`}
                      className="ml-2 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                  {selectedCategory === category.name &&
                    category.subCategories &&
                    category.subCategories.length > 0 && (
                      <div className="ml-6 mt-2 space-y-2">
                        {category.subCategories.map((subCategory) => (
                          <div key={`${category._id}-${subCategory}`} className="flex items-center">
                            <Checkbox
                              id={`subcategory-${category._id}-${subCategory}`}
                              checked={filters.categories.includes(subCategory)}
                              onCheckedChange={() => handleCategoryChange(subCategory, true)}
                            />
                            <label
                              htmlFor={`subcategory-${category._id}-${subCategory}`}
                              className="ml-2 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {subCategory}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
          </div>
        </div>


        <div>
          <h4 className="font-medium mb-3">{t("filterPanel.rating")}</h4>
          <div className="flex flex-wrap gap-2">
            {[4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={filters.rating === rating ? "default" : "outline"}
                size="sm"
                onClick={() => handleRatingChange(filters.rating === rating ? null : rating)}
                className="h-8"
              >
                {rating}+ <Star className="h-3 w-3 ml-1  fill-amber-400" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          className="mb-8 flex justify-between items-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div>
            <p className="text-gray-600">{t("browsePage.title")}</p>
          </div>
          <Link to="/cart" className="relative">
            <Button variant="outline" className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span>{t("browsePage.cart")}</span>
            </Button>
          </Link>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop */}
          <motion.div
            className="hidden lg:block w-64 shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="sticky top-24 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <FilterPanel />
            </div>
          </motion.div>
          <div className="lg:hidden mb-4">
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <Filter className="h-4 w-4" />
                  {t("filterPanel.filters")}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
                <FilterPanel />
              </SheetContent>
            </Sheet>
          </div>

          {/* Products */}
          <motion.div className="flex-1" initial="hidden" animate="visible" variants={staggerChildren}>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10"
                    onChange={(e) => {
                      const value = e.target.value
                      setFilters((prev) => ({
                        ...prev,
                        query: value,
                      }))
                    }}
                    value={filters.query || ""}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Active filters */}
            {(filters.categories.length > 0 ||
              filters.brands.length > 0 ||
              filters.availability.length > 0 ||
              filters.rating !== null ||
              filters.priceRange[0] > 0 ||
              filters.priceRange[1] < 200) && (
                <div className="mb-6 flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-muted-foreground">{t("filterPanel.activeFilters")}</span>

                  {filters.priceRange[0] > 0 || filters.priceRange[1] < 200 ? (
                    <Badge variant="outline" className="font-normal">
                      ${filters.priceRange[0]} - ${filters.priceRange[1]}/month
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => handlePriceChange([0, 200])}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ) : null}

                  {filters.rating !== null && (
                    <Badge variant="outline" className="font-normal">
                      {filters.rating}+ Stars
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => handleRatingChange(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}

                  {filters.categories.map((category) => (
                    <Badge key={category} variant="outline" className="font-normal">
                      {category}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => handleCategoryChange(category)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}

                  {filters.availability.map((availability) => (
                    <Badge key={availability} variant="outline" className="font-normal">
                      {availability}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => handleAvailabilityChange(availability)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}

                  <Button variant="a" size="sm" className="h-8 px-2 text-xs text-muted-foreground" onClick={clearFilters}>
                    {t("filterPanel.clearall")}
                  </Button>
                </div>
              )}

            {/* Product count */}
            <p className="text-sm text-muted-foreground mb-6">
              Showing {products.length} {products.length === 1 ? "product" : "products"}
            </p>

            {loading ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <ProductCard key={index} product={product} onQuickView={() => openQuickView(product)} />
                ))}
              </div>
            )}

            {products.length === 0 && (
              <motion.div
                className="py-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-gray-50 inline-flex rounded-full p-4 mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">{t("browsePage.noproducts")}</h3>
                <p className="text-muted-foreground mb-6">{t("browsePage.noproductsdesc")}</p>
                <Button onClick={clearFilters}>{t("filterPanel.clearall")}</Button>
              </motion.div>
            )}

            {/* Pagination */}
            {products.length > 0 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-1">
                  {/* Previous page button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                    disabled={filters.page <= 1}
                  >
                    {t("pagination.previous")}
                  </Button>

                  {/* Page numbers */}
                  {(() => {
                    const totalPages = Math.max(1, Math.ceil(countItems / filters.limit))
                    const pageNumbers = []
                    const maxVisiblePages = 5

                    let startPage = Math.max(1, filters.page - Math.floor(maxVisiblePages / 2))
                    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1)
                    }

                    if (startPage > 1) {
                      pageNumbers.push(
                        <Button
                          key={1}
                          variant={filters.page === 1 ? "default" : "ghost"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </Button>,
                      )
                      if (startPage > 2) {
                        pageNumbers.push(
                          <span key="ellipsis-start" className="px-1">
                            ...
                          </span>,
                        )
                      }
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pageNumbers.push(
                        <Button
                          key={i}
                          variant={filters.page === i ? "default" : "ghost"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handlePageChange(i)}
                        >
                          {i}
                        </Button>,
                      )
                    }

                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pageNumbers.push(
                          <span key="ellipsis-end" className="px-1">
                            ...
                          </span>,
                        )
                      }
                      pageNumbers.push(
                        <Button
                          key={totalPages}
                          variant={filters.page === totalPages ? "default" : "ghost"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </Button>,
                      )
                    }

                    return pageNumbers
                  })()}

                  {/* Next page button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page >= Math.ceil(countItems / filters.limit)}
                  >
                    {t("pagination.next")}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
      {quickViewProduct && (
        <ProductQuickView isOpen={openquickview} onClose={closeQuickView} product={quickViewProduct} />
      )}
    </div>
  )
}
