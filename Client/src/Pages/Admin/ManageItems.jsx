import { useState, useRef, useEffect } from 'react';
import { Search, Grid, List, Filter, Plus, Edit, MoreHorizontal, Upload, X, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../../assets/Color';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { pageTransition, itemFadeIn, shimmerAnimation, buttonHover } from '../../assets/Animations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Skeleton } from '../../components/ui/skeleton';
import { fetchAllItems } from '../../api/items.api';
import { toast } from 'sonner';
import { createCategoryApi } from '../../api/category.api';
import { useCategories } from '../../hooks/useCategories';

export default function ManageItems() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false);
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { categories, setCategories } = useCategories();


  // Rental Color Palette
  const colors = {
    primary: '#4D39EE', // Coral
    secondary: '#191B24', // Amber
    accent: '#4FC3F7', // Light Blue
    light: '#FAFAFA', // Almost White
    dark: '#455A64', // Blue Grey
  };
  // Fetch items from API
  const fetchItems = async () => {
    try {
      setTimeout(async () => {
        const res = await fetchAllItems();
        setItems(res.data.message.items);
      }, 100);
    } catch (err) {
      toast.error('Error Fetching Items');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchItems();
      } catch (err) {
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Animation variants
  const pageTransition = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const buttonHover = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  // Particle effect component
  const Particles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary/10 to-secondary/10"
            style={{
              width: Math.random() * 40 + 10,
              height: Math.random() * 40 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0.1, scale: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [0, 1, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    );
  };

  // Filter items based on search query, category and status
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus =
      selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle file upload
  const handleFileUpload = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Remove file from upload list
  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle form submission for new item
  const handleAddItem = (e) => {
    e.preventDefault();
    // Process form data and uploaded files
    console.log('Form submitted', e.target.elements);
    console.log('Uploaded files', uploadedFiles);

    // Close dialog and reset state
    setIsNewItemDialogOpen(false);
    setUploadedFiles([]);
  };

  // Handle form submission for new category
  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (categoryName.trim() === '') return;
    // Process form data
    try {
      await createCategoryApi(categoryName);
      setCategories((prev) => [
        ...prev,
        { id: Date.now(), name: categoryName, color: colors.primary },
      ]);
      console.log(categories);
      toast.success('Category created successfully!');
    }
    catch (e) {
      console.log(e);
      toast.error('Error creating category');
    }
    // Close dialog
    setIsNewCategoryDialogOpen(false);
  };



  // Grid Skeleton Component
  const GridSkeleton = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden border border-gray-100"
          >
            <div className="relative h-48 bg-gray-100">
              <Skeleton className="w-full h-full" />
              <div className="absolute top-3 right-3 flex space-x-2">
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="absolute bottom-3 left-3">
                <Skeleton className="h-5 w-20 rounded-md" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Skeleton className="h-6 w-6 rounded-full mr-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-6 w-3/4 mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6 mb-3" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-16" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // List Skeleton Component
  const ListSkeleton = () => {
    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <div className="w-full">
                        <Skeleton className="h-5 w-3/4 mb-1" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Skeleton className="h-6 w-6 rounded-full mr-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card >
    );
  };

  // Category Skeleton Component
  const CategorySkeleton = () => {
    return (
      <div className="flex space-x-3 pb-2 overflow-x-auto">
        <Skeleton className="h-9 w-32 rounded-full" />
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-9 w-28 rounded-full" />
        ))}
      </div>
    );
  };


  return (
    <motion.div
      className="min-h-screen bg-light flex"
      initial="hidden"
      animate="visible"
      variants={pageTransition}
    >
      <motion.div className="flex-1 flex flex-col" variants={itemFadeIn}>
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
                  Manage Items
                </motion.h1>
                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  View, edit and manage all rental items
                </motion.p>
              </div>

              <motion.div
                className="flex items-center space-x-3 mt-4 md:mt-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center space-x-1 bg-white rounded-md p-1 border border-gray-200">
                  <button
                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                <Button
                  variant="outline"
                  className="h-9"
                  onClick={() => setIsNewCategoryDialogOpen(true)}
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Add Category
                </Button>

                <Button
                  className="relative overflow-hidden h-9"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                  onClick={() => setIsNewItemDialogOpen(true)}
                >
                  <motion.span
                    className="absolute inset-0 bg-white/20 rounded-md"
                    initial={{ x: '-100%', opacity: 0 }}
                    whileHover={{ x: '100%', opacity: 0.3 }}
                    transition={{ duration: 0.6 }}
                  />
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="relative">Add Item</span>
                </Button>
              </motion.div>
            </div>

            {/* Categories */}
            <motion.div className="mb-6 overflow-x-auto" variants={itemFadeIn}>
              {loading ? (
                <CategorySkeleton />
              ) : (
                <div className="flex space-x-3 pb-2">
                  <motion.button
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${selectedCategory === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-white text-muted-foreground hover:bg-gray-50'
                      }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedCategory('all')}
                  >
                    All Categories
                  </motion.button>

                  {categories && categories.length > 0 && categories.map((category) => (
                    <motion.button
                      key={category.id}
                      className={`px-4 py-2 rounded-full text-sm whitespace-nowrap flex items-center ${selectedCategory === category.name.toLowerCase()
                        ? 'bg-primary text-white'
                        : 'bg-white text-muted-foreground hover:bg-gray-50'
                        }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        setSelectedCategory(category.name.toLowerCase())
                      }
                    >
                      <span
                        className="h-2 w-2 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Filters */}
            <motion.div
              className="bg-white p-4 rounded-lg border border-gray-100 mb-6"
              variants={itemFadeIn}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title or description..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Filter:</span>
                  </div>

                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            {/* Items Grid/List View with Skeleton Loading */}
            <motion.div variants={itemFadeIn}>
              <AnimatePresence mode="wait">
                {loading ? (
                  // Show skeleton based on current view mode
                  viewMode === 'grid' ? (
                    <motion.div
                      key="grid-skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <GridSkeleton />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="list-skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ListSkeleton />
                    </motion.div>
                  )
                ) : viewMode === 'grid' ? (
                  // Grid View
                  <motion.div
                    key="grid"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {filteredItems.map((item) => (
                      <motion.div
                        key={item.id || item._id}
                        className="bg-white rounded-lg overflow-hidden border border-gray-100"
                        whileHover={{
                          y: -5,
                          boxShadow: '0 10px 30px -15px rgba(0,0,0,0.1)',
                        }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <div className="relative h-48 bg-gray-100">
                          <img
                            src={
                              item.images?.[0] ||
                              '/placeholder.svg?height=200&width=300'
                            }
                            alt={item.name || item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 flex space-x-2">
                            {item.featured && (
                              <Badge className="bg-secondary text-white">
                                Featured
                              </Badge>
                            )}
                            <Badge
                              variant={
                                item.status === 'active'
                                  ? 'default'
                                  : 'secondary'
                              }
                              className="capitalize"
                            >
                              {item.status}
                            </Badge>
                          </div>
                          <div
                            className="absolute bottom-3 left-3 px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor:
                                categories.find((c) => c.id === item.categoryId)
                                  ?.color || colors.primary,
                              color: 'white',
                            }}
                          >
                            {item.category}
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage
                                  src={item.owner?.avatar}
                                  alt={item.owner?.name || 'Owner'}
                                />
                                <AvatarFallback>
                                  {item.owner?._id?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-xs text-muted-foreground">
                                {item.owner?.name || 'Unknown'}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.postedDate ||
                                (item.createdAt &&
                                  new Date(item.createdAt).toLocaleDateString(
                                    'en-US'
                                  ))}
                            </div>
                          </div>
                          <h3 className="font-semibold mb-1 text-dark">
                            {item.name || item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-primary font-semibold">
                              ${item.price}
                              <span className="text-xs text-muted-foreground font-normal">
                                /{item.period || 'month'}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <button className="p-1.5 rounded-md hover:bg-gray-100">
                                <Edit className="h-4 w-4 text-muted-foreground" />
                              </button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-1.5 rounded-md hover:bg-gray-100">
                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Toggle Featured
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    {item.status === 'active'
                                      ? 'Deactivate'
                                      : 'Activate'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    Delete Item
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  // List View
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]">ID</TableHead>
                              <TableHead>Item</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Owner</TableHead>
                              <TableHead className="text-right">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredItems.map((item) => (
                              <TableRow
                                key={item.id || item._id}
                                className="hover:bg-gray-50"
                              >
                                <TableCell className="font-medium">
                                  {item.id || item._id?.substring(0, 5)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                                      <img
                                        src={
                                          item.images?.[0] ||
                                          '/placeholder.svg?height=100&width=100'
                                        }
                                        alt={item.name || item.title}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <div className="font-medium flex items-center">
                                        {item.name || item.title}
                                        {item.featured && (
                                          <Badge className="ml-2 bg-secondary text-white text-xs">
                                            Featured
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="text-sm text-muted-foreground line-clamp-1">
                                        {item.description}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div
                                    className="px-2 py-1 rounded text-xs font-medium inline-block"
                                    style={{
                                      backgroundColor:
                                        categories.find(
                                          (c) => c.id === item.categoryId
                                        )?.color || colors.primary,
                                      color: 'white',
                                    }}
                                  >
                                    {item.category}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-primary font-semibold">
                                    ${item.price}
                                    <span className="text-xs text-muted-foreground font-normal">
                                      /{item.period || 'month'}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      item.status === 'active'
                                        ? 'default'
                                        : 'secondary'
                                    }
                                    className="capitalize"
                                  >
                                    {item.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Avatar className="h-6 w-6 mr-2">
                                      <AvatarImage
                                        src={item.owner?.avatar}
                                        alt={item.owner?.name || 'Owner'}
                                      />
                                      <AvatarFallback>
                                        {item.owner?._id?.charAt(0) || 'U'}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">
                                      {item.owner?.name || 'Unknown'}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                        >
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                          View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          Toggle Featured
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          {item.status === 'active'
                                            ? 'Deactivate'
                                            : 'Activate'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">
                                          Delete Item
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Pagination - Only show when not loading */}
            {!loading && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </main>
      </motion.div>

      {/* Add Item Dialog */}
      <Dialog open={isNewItemDialogOpen} onOpenChange={setIsNewItemDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl">Add New Item</DialogTitle>
            <DialogDescription>
              Fill in the details and upload images of the item
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
            <form
              id="add-item-form"
              onSubmit={handleAddItem}
              className="space-y-6"
            >
              {/* Item Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Item Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Professional DSLR Camera"
                    className="mt-1.5"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the item in detail..."
                    className="mt-1.5 min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select defaultValue="electronics" name="category">
                      <SelectTrigger id="category" className="mt-1.5">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories && categories.length > 0 && categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.name.toLowerCase()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select defaultValue="excellent" name="condition">
                      <SelectTrigger id="condition" className="mt-1.5">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="0.00"
                      className="mt-1.5"
                      required
                      min="0.01"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor="period">Rental Period</Label>
                    <Select defaultValue="day" name="period">
                      <SelectTrigger id="period" className="mt-1.5">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hour">Hour</SelectItem>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="featured" name="featured" />
                  <Label htmlFor="featured">Mark as featured item</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="available" name="available" defaultChecked />
                  <Label htmlFor="available">
                    List as available immediately
                  </Label>
                </div>
              </div>

              {/* Media Upload */}
              <div>
                <Label className="block mb-2">Upload Images</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200'
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
                    initial={{ y: 0 }}
                    animate={{ y: [-5, 5, -5] }}
                    transition={{
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                    }}
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium mb-1">
                      Drag and drop your images here
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Support for JPG, PNG, WEBP (max 5MB each)
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={triggerFileInput}
                      className="text-sm"
                    >
                      Browse Files
                    </Button>
                  </motion.div>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <AnimatePresence>
                      {uploadedFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          className="relative rounded-md overflow-hidden bg-gray-100 aspect-square"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                          }}
                        >
                          <img
                            src={
                              URL.createObjectURL(file) || '/placeholder.svg'
                            }
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
            <Button
              variant="outline"
              onClick={() => setIsNewItemDialogOpen(false)}
            >
              Cancel
            </Button>
            <motion.div
              variants={buttonHover}
              initial="rest"
              whileHover="hover"
            >
              <Button
                type="submit"
                form="add-item-form"
                className="relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                <motion.span
                  className="absolute inset-0 bg-white/20 rounded-md"
                  initial={{ x: '-100%', opacity: 0 }}
                  whileHover={{ x: '100%', opacity: 0.3 }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative">Add Item</span>
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog
        open={isNewCategoryDialogOpen}
        onOpenChange={setIsNewCategoryDialogOpen}
      >
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>

          <form
            id="add-category-form"
            onSubmit={handleAddCategory}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                name="categoryName"
                placeholder="e.g. Electronics, Furniture"
                onChange={(e) => setCategoryName(e.target.value)}
                value={categoryName}
                required
              />
            </div>
          </form>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-category-form"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
