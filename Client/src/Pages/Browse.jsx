import { useState, useEffect } from "react";
import {
  ArrowUpDown,
  Filter,
  Search,
  ShoppingCart,
  Star,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ProductQuickView from "../Components/Quick-View";
import { useAuth } from "../Middleware/AuthProvider";
import { useSelector } from "react-redux";
import { fetchAllItems } from "../api/items.api";
export default function BrowsePage() {
  const [products, setitems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);
  const [activeView, setActiveView] = useState("grid");
  const [filters, setFilters] = useState({
    priceRange: [0, 200],
    categories: [],
    brands: [],
    availability: [],
    rating: null,
  });

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const openQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  const categories = [
    "Electronics",
    "Furniture",
    "Appliances",
    "Fitness Equipment",
    "Home Office",
    "Kitchen",
    "Gaming",
    "Cameras",
  ];
  const availability = [
    "Available Now",
    "Available Within 1 Week",
    "Coming Soon",
  ];
  const FetchProducts = async () => {
    setLoading(true);
    try{
      const res = await fetchAllItems();
      setitems(res.data.message);
    }
    catch(err){
      alert("Error fetching products");
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchProducts();
  }, []);

  // Filter handlers
  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleAvailabilityChange = (status) => {
    setFilters((prev) => ({
      ...prev,
      availability: prev.availability.includes(status)
        ? prev.availability.filter((a) => a !== status)
        : [...prev.availability, status],
    }));
  };

  const handlePriceChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: value,
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({
      ...prev,
      rating,
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 200],
      categories: [],
      brands: [],
      availability: [],
      rating: null,
    });
  };

  const filteredProducts = products.filter((product) => {
    if (
      product.price < filters.priceRange[0] ||
      product.price > filters.priceRange[1]
    )
      return false;
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.category)
    )
      return false;
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand))
      return false;
    if (
      filters.availability.length > 0 &&
      !filters.availability.includes(product.availability)
    )
      return false;
    if (filters.rating !== null && product.rating < filters.rating)
      return false;
    return true;
  });

  const FilterPanel = () => (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 text-xs text-muted-foreground"
        >
          Clear all
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-3">Price Range ($/month)</h4>
          <div className="px-2">
            <Slider
              defaultValue={[0, 200]}
              value={filters.priceRange}
              max={200}
              step={5}
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
          <h4 className="font-medium mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <label
                  htmlFor={`category-${category}`}
                  className="ml-2 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-3">Availability</h4>
          <div className="space-y-2">
            {availability.map((availability) => (
              <div key={availability} className="flex items-center">
                <Checkbox
                  id={`availability-${availability}`}
                  checked={filters.availability.includes(availability)}
                  onCheckedChange={() => handleAvailabilityChange(availability)}
                />
                <label
                  htmlFor={`availability-${availability}`}
                  className="ml-2 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {availability}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Rating</h4>
          <div className="flex flex-wrap gap-2">
            {[4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={filters.rating === rating ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  handleRatingChange(filters.rating === rating ? null : rating)
                }
                className="h-8"
              >
                {rating}+ <Star className="h-3 w-3 ml-1 fill-current" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

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
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="px-3 py-2 text-sm font-medium text-primary"
            >
              Browse
            </Link>
            <Link
              to="#"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary"
            >
              How It Works
            </Link>
            <Link
              to="#"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary"
            >
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Link>
            <Link to="/dashboard">
              <Button
                variant="ghost"
                className="w-8 h-8 bg-accent-foreground hover:bg-accent-foreground/50 duration-[400ms] transition-all hover:text-white rounded-3xl text-white"
                size="sm"
              >
                {user ? user.email.charAt(0).toUpperCase() : ""}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <p className="text-gray-600">
            Find the perfect items to rent for your needs
          </p>
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
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] sm:w-[350px] overflow-y-auto"
              >
                <FilterPanel />
              </SheetContent>
            </Sheet>
          </div>

          {/* Products */}
          <motion.div
            className="flex-1"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10"
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
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>

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
                  <Badge
                    key={category}
                    variant="outline"
                    className="font-normal"
                  >
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
                  <Badge
                    key={availability}
                    variant="outline"
                    className="font-normal"
                  >
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

                <Button
                  variant="a"
                  size="sm"
                  className="h-8 px-2 text-xs text-muted-foreground"
                  onClick={clearFilters}
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* Product count */}
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>

            {!!loading ? (
              <h1>Loading....</h1>
            ) : (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={index}
                      variants={fadeIn}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm group"
                    >
                      <div className="relative">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                          {/* {product.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant={tag === "New" ? "default" : "secondary"} className="text-xs">
                            {tag}
                          </Badge>
                        ))} */}
                        </div>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openQuickView(product);
                            }}
                            className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition"
                          >
                            Quick View
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">
                            {product.category}
                          </span>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1 truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          by {product.brand}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-primary">
                            ${product.price}/mo
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
            )}

            {filteredProducts.length === 0 && (
              <motion.div
                className="py-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-gray-50 inline-flex rounded-full p-4 mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to find what you're looking for.
                </p>
                <Button onClick={clearFilters}>Clear all filters</Button>
              </motion.div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    1
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    2
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    3
                  </Button>
                  <span>...</span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    8
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Rental. All rights reserved.
            </p>
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
      {quickViewProduct && (
        <ProductQuickView
          isOpen={!!quickViewProduct}
          onClose={closeQuickView}
          product={quickViewProduct}
        />
      )}
    </div>
  );
}
