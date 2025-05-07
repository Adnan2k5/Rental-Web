import { useState, useRef, useEffect } from 'react';
import { Search, Grid, List, Filter, Plus, Edit, MoreHorizontal, Upload, X, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../../assets/Color';
import { Button } from '../../Components/ui/button';
import { Input } from '../../Components/ui/input';
import { Textarea } from '../../Components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../../Components/ui/avatar';
import { pageTransition, itemFadeIn, shimmerAnimation, buttonHover } from '../../assets/Animations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../Components/ui/dropdown-menu';
import { Badge } from '../../Components/ui/badge';
import { Card, CardContent } from '../../Components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../Components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../Components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../Components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../Components/ui/pagination';
import { Switch } from '../../Components/ui/switch';
import { Label } from '../../Components/ui/label';
import { Skeleton } from '../../Components/ui/skeleton';
import { fetchAllItems } from '../../api/items.api';
import { toast } from 'sonner';
import { createCategoryApi } from '../../api/category.api';
import { useCategories } from '../../hooks/useCategories';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../Middleware/AxiosClient';

export default function ManageItems() {
  const { t } = useTranslation();
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;
  const [subCategoryInputs, setSubCategoryInputs] = useState({});
  const [subCategoryLoading, setSubCategoryLoading] = useState({});
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [subCategoryInput, setSubCategoryInput] = useState('');
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);

  const { categories, setCategories } = useCategories();

  // Fetch items from API
  const fetchItems = async (page = currentPage) => {
    try {
      const res = await fetchAllItems({ page, limit: itemsPerPage });
      setItems(res.data.message.items);
      setTotalItems(res.data.message.totalItems || 0);
    } catch (err) {
      toast.error('Error Fetching Items');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchItems(currentPage);
      } catch (err) { }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, [currentPage]);

  useEffect(() => {
    const selectedCat = categories?.find(
      (cat) => cat.name.toLowerCase() === selectedCategoryName.toLowerCase()
    );
    setSubCategoryOptions(selectedCat?.subCategories || []);
    setSubCategoryInput('');
  }, [selectedCategoryName, categories, isNewItemDialogOpen]);

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

  // Particle effect Components
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

  // Add subcategory API
  const addSubCategory = async (categoryId, subCategoryName) => {
    if (!subCategoryName.trim()) return;
    setSubCategoryLoading((prev) => ({ ...prev, [categoryId]: true }));
    try {
      await axiosClient.post(`/api/category/${categoryId}/subcategories`, { subCategory: subCategoryName });
      setCategories((prev) => prev.map((cat) =>
        cat._id === categoryId
          ? { ...cat, subCategories: [...(cat.subCategories || []), subCategoryName] }
          : cat
      ));
      setSubCategoryInputs((prev) => ({ ...prev, [categoryId]: '' }));
      toast.success('Subcategory added');
    } catch (e) {
      toast.error('Error adding subcategory');
    } finally {
      setSubCategoryLoading((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  // Delete subcategory API
  const deleteSubCategory = async (categoryId, subCategoryName) => {
    setSubCategoryLoading((prev) => ({ ...prev, [categoryId]: true }));
    try {
      await axiosClient.delete(`/api/category/${categoryId}/subcategories/${encodeURIComponent(subCategoryName)}`);
      setCategories((prev) => prev.map((cat) =>
        cat._id === categoryId
          ? { ...cat, subCategories: (cat.subCategories || []).filter((s) => s !== subCategoryName) }
          : cat
      ));
      toast.success('Subcategory deleted');
    } catch (e) {
      toast.error('Error deleting subcategory');
    } finally {
      setSubCategoryLoading((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  // Grid Skeleton Components
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

  // List Skeleton Components
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

  // Category Skeleton Components
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
      className="min-h-screen bg-light flex flex-col"
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
                  {t('adminSidebar.itemsManagement')}
                </motion.h1>
                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {t('manageItems.desc', 'View, edit and manage all rental items')}
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
                  {t('manageItems.addCategory', 'Add Category')}
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
                  <span className="relative">{t('manageItems.addItem', 'Add Item')}</span>
                </Button>
              </motion.div>
            </div>

            {/* Categories */}
            <motion.div className="mb-6 overflow-x-auto" variants={itemFadeIn}>
              {loading ? (
                <CategorySkeleton />
              ) : (
                <div className="flex flex-col gap-4 pb-2">
                  <div className="flex space-x-3">
                    <motion.button
                      className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${selectedCategory === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-white text-muted-foreground hover:bg-gray-50'
                        }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedCategory('all')}
                    >
                      {t('manageItems.allCategories', 'All Categories')}
                    </motion.button>
                    {categories && categories.length > 0 && categories.map((category) => (
                      <motion.button
                        key={category._id}
                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap flex items-center ${selectedCategory === category.name.toLowerCase()
                          ? 'bg-primary text-white'
                          : 'bg-white text-muted-foreground hover:bg-gray-50'
                          }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedCategory(category.name.toLowerCase())}
                      >
                        <span
                          className="h-2 w-2 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </motion.button>
                    ))}
                  </div>
                  {/* Subcategory management UI */}
                  {categories && categories.length > 0 && categories.map((category) => (
                    <div key={category._id} className="bg-white rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-dark">{category.name}</div>
                        <div className="flex items-center gap-2">
                          <Input
                            size="sm"
                            placeholder="Add subcategory"
                            value={subCategoryInputs[category._id] || ''}
                            onChange={e => setSubCategoryInputs((prev) => ({ ...prev, [category._id]: e.target.value }))}
                            className="w-40"
                          />
                          <Button
                            size="sm"
                            disabled={subCategoryLoading[category._id]}
                            onClick={() => addSubCategory(category._id, subCategoryInputs[category._id] || '')}
                          >
                            {subCategoryLoading[category._id] ? 'Adding...' : 'Add'}
                          </Button>
                        </div>
                      </div>
                      {category.subCategories && category.subCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {category.subCategories.map((sub, idx) => (
                            <Badge key={sub + idx} variant="secondary" className="flex items-center gap-1">
                              {sub}
                              <button
                                type="button"
                                className="ml-1 text-xs text-red-600 hover:text-red-800"
                                disabled={subCategoryLoading[category._id]}
                                onClick={() => deleteSubCategory(category._id, sub)}
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
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
                      placeholder={t('manageItems.searchPlaceholder', 'Search by title or description...')}
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{t('manageItems.filter', 'Filter:')}</span>
                  </div>

                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder={t('manageItems.status', 'Status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('manageItems.all', 'All')}</SelectItem>
                      <SelectItem value="available">{t('manageItems.available', 'Available')}</SelectItem>
                      <SelectItem value="unavailable">{t('manageItems.unavailable', 'Unavailable')}</SelectItem>
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
                                {t('manageItems.featured', 'Featured')}
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
                                    {t('manageItems.viewDetails', 'View Details')}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    {t('manageItems.deleteItem', 'Delete Item')}
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
                              <TableHead>{t('manageItems.item', 'Item')}</TableHead>
                              <TableHead>{t('manageItems.category', 'Category')}</TableHead>
                              <TableHead>{t('manageItems.price', 'Price')}</TableHead>
                              <TableHead>{t('manageItems.status', 'Status')}</TableHead>
                              <TableHead>{t('manageItems.owner', 'Owner')}</TableHead>
                              <TableHead className="text-right">
                                {t('manageItems.actions', 'Actions')}
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
                                            {t('manageItems.featured', 'Featured')}
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
                                          {t('manageItems.viewDetails', 'View Details')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">
                                          {t('manageItems.deleteItem', 'Delete Item')}
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
            {!loading && totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      // Show first, last, and pages around current
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              isActive={currentPage === pageNum}
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      // Ellipsis for skipped pages
                      if (
                        (pageNum === 2 && currentPage > 3) ||
                        (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <PaginationItem key={`ellipsis-${pageNum}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
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
            <DialogTitle className="text-xl">{t('manageItems.addNewItem', 'Add New Item')}</DialogTitle>
            <DialogDescription>
              {t('manageItems.addNewItemDesc', 'Fill in the details and upload images of the item')}
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
                  <Label htmlFor="title">{t('addItem.name')}</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder={t('addItem.namePlaceholder', 'e.g. Professional DSLR Camera')}
                    className="mt-1.5"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">{t('addItem.description')}</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder={t('addItem.descriptionPlaceholder', 'Describe the item in detail...')}
                    className="mt-1.5 min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">{t('addItem.category')}</Label>
                    <Select
                      value={selectedCategoryName}
                      onValueChange={(val) => setSelectedCategoryName(val)}
                      name="category"
                    >
                      <SelectTrigger id="category" className="mt-1.5">
                        <SelectValue placeholder={t('addItem.categoryPlaceholder', 'Select category')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories && categories.length > 0 && categories.map((category) => (
                          <SelectItem
                            key={category._id}
                            value={category.name}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subCategory">Subcategory</Label>
                    <Select
                      value={subCategoryInput}
                      onValueChange={setSubCategoryInput}
                      name="subCategory"
                    >
                      <SelectTrigger id="subCategory" className="mt-1.5">
                        <SelectValue placeholder="Select or type subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategoryOptions.map((sub) => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                        <div className="p-2">
                          <Input
                            placeholder="Add new subcategory"
                            value={subCategoryInput}
                            onChange={e => setSubCategoryInput(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">{t('addItem.price')} ($)</Label>
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
                    <Label htmlFor="period">{t('manageItems.rentalPeriod', 'Rental Period')}</Label>
                    <Select defaultValue="day" name="period">
                      <SelectTrigger id="period" className="mt-1.5">
                        <SelectValue placeholder={t('manageItems.periodPlaceholder', 'Select period')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">{t('manageItems.day', 'Day')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="featured" name="featured" />
                  <Label htmlFor="featured">{t('manageItems.markFeatured', 'Mark as featured item')}</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="available" name="available" defaultChecked />
                  <Label htmlFor="available">
                    {t('manageItems.listAvailable', 'List as available immediately')}
                  </Label>
                </div>
              </div>

              {/* Media Upload */}
              <div>
                <Label className="block mb-2">{t('addItem.upload')}</Label>
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
                      {t('uploadContaier.desc')}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {t('uploadContaier.support')}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={triggerFileInput}
                      className="text-sm"
                    >
                      {t('uploadContaier.browse')}
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
              {t('dialogbox.cancel')}
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
                <span className="relative">{t('manageItems.addItem', 'Add Item')}</span>
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
            <DialogTitle>{t('manageItems.addNewCategory', 'Add New Category')}</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>

          <form
            id="add-category-form"
            onSubmit={handleAddCategory}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <Label htmlFor="categoryName">{t('manageItems.categoryName', 'Category Name')}</Label>
              <Input
                id="categoryName"
                name="categoryName"
                placeholder={t('manageItems.categoryNamePlaceholder', 'e.g. Electronics, Furniture')}
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
              {t('dialogbox.cancel')}
            </Button>
            <Button
              type="submit"
              form="add-category-form"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              {t('manageItems.addCategory', 'Add Category')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
