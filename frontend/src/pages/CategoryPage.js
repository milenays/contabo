import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon } from 'lucide-react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../api/categoryApi';
import CategoryForm from '../components/CategoryForm';
import CategoryList from '../components/CategoryList';
import { Button } from "../components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet"
import { useToast } from "../components/ui/use-toast"
import { Skeleton } from "../components/ui/skeleton"

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = useCallback(async (page) => {
    setLoading(true);
    try {
      const data = await getCategories(page, 10);  // Sayfa başına 10 kategori
      setCategories(data.categories);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch categories",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = () => {
    setSelectedCategory(null);
    setSheetOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setSheetOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      await fetchCategories(currentPage);
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category",
      });
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory._id, values);
      } else {
        await addCategory(values);
      }
      await fetchCategories(currentPage);
      setSheetOpen(false);
      toast({
        title: "Success",
        description: "Category saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save category",
      });
    }
  };

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Categories</h2>
        <Button onClick={handleAdd}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <CategoryList
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedCategory ? 'Edit Category' : 'Add Category'}</SheetTitle>
          </SheetHeader>
          <CategoryForm
            category={selectedCategory}
            onSubmit={handleFormSubmit}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CategoriesPage;