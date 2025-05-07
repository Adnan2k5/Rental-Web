import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Upload, X } from "lucide-react";

export default function ItemDialog({
  open,
  onOpenChange,
  onSubmit,
  categories = [],
  initialValues = {},
  loading = false,
  dialogTitle = "Add Item",
  dialogDescription = "Fill in the details and upload images of the item",
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialValues.category || "");
  const [subCategoryInput, setSubCategoryInput] = useState(initialValues.subCategory || "");
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState(initialValues.uploadedFiles || []);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: initialValues.name || "",
    description: initialValues.description || "",
    category: initialValues.category || "",
    subCategory: initialValues.subCategory || "",
    price: initialValues.price || "",
    location: initialValues.location || "",
    availableQuantity: initialValues.availableQuantity || 1,
    available: initialValues.available !== undefined ? initialValues.available : true,
  });

  useEffect(() => {
    setForm({
      name: initialValues.name || "",
      description: initialValues.description || "",
      category: initialValues.category || "",
      subCategory: initialValues.subCategory || "",
      price: initialValues.price || "",
      location: initialValues.location || "",
      availableQuantity: initialValues.availableQuantity || 1,
      available: initialValues.available !== undefined ? initialValues.available : true,
    });
    setSelectedCategory(initialValues.category || "");
    setSubCategoryInput(initialValues.subCategory || "");
    setUploadedFiles(initialValues.uploadedFiles || []);
  }, [initialValues, open]);

  useEffect(() => {
    const selectedCat = categories?.find((cat) => cat.name === selectedCategory);
    setSubCategoryOptions(selectedCat?.subCategories || []);
    setSubCategoryInput("");
  }, [selectedCategory, categories, open]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + uploadedFiles.length > 5) {
      alert("You can upload up to 5 images only.");
      return;
    }
    const newImages = files.map((file) => ({ url: URL.createObjectURL(file), file }));
    setUploadedFiles((prev) => [...prev, ...newImages]);
  };

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
      if (newFiles.length + uploadedFiles.length > 5) {
        alert("You can upload up to 5 images only.");
        return;
      }
      const newImages = newFiles.map((file) => ({ url: URL.createObjectURL(file), file }));
      setUploadedFiles((prev) => [...prev, ...newImages]);
    }
  };
  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, category: selectedCategory, subCategory: subCategoryInput, uploadedFiles });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
          <form id="item-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={form.description} onChange={handleChange} required className="mt-1.5 min-h-[100px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={(val) => { setSelectedCategory(val); setForm((prev) => ({ ...prev, category: val })); }}>
                    <SelectTrigger id="category" className="mt-1.5">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories && categories.length > 0 && categories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subCategory">Subcategory</Label>
                  <Select value={subCategoryInput} onValueChange={setSubCategoryInput} name="subCategory">
                    <SelectTrigger id="subCategory" className="mt-1.5">
                      <SelectValue placeholder="Select or type subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategoryOptions.map((sub) => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                      <div className="p-2">
                        <Input placeholder="Add new subcategory" value={subCategoryInput} onChange={e => setSubCategoryInput(e.target.value)} className="mt-1" />
                      </div>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" name="price" type="number" value={form.price} onChange={handleChange} required min="0.01" step="0.01" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="availableQuantity">Available Quantity</Label>
                  <Input id="availableQuantity" name="availableQuantity" type="number" value={form.availableQuantity} onChange={handleChange} min="1" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={form.location} onChange={handleChange} required className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label className="block mb-2">Upload Images</Label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? "border-primary bg-primary/5" : "border-gray-200"}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple accept="image/*" className="hidden" />
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium mb-1">Drag and drop or browse to upload images</p>
                  <Button type="button" variant="outline" onClick={triggerFileInput} className="text-sm">Browse</Button>
                </div>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={file.id || index} className="relative rounded-md overflow-hidden bg-gray-100 aspect-square">
                      <img src={file.url || "/placeholder.svg"} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <button type="button" className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white" onClick={() => removeFile(index)}>
                        <X className="h-3 w-3 text-gray-700" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>
        <DialogFooter className="px-6 py-4 bg-gray-50">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="item-form" disabled={loading} className="relative overflow-hidden">
            {loading ? "Processing..." : dialogTitle}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
