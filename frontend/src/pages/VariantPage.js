import React, { useState, useEffect, useCallback } from 'react';
import { getVariants, addVariant, updateVariant, deleteVariant } from '../api/variantApi';
import VariantForm from '../components/VariantForm';
import VariantList from '../components/VariantList';
import { Button } from "../components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet"
import { useToast } from "../components/ui/use-toast"
import { PlusIcon } from 'lucide-react';

const VariantsPage = () => {
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const itemsPerPage = 10;

  const fetchVariants = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getVariants();
      setVariants(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch variants",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchVariants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setSelectedVariant(null);
    setSheetOpen(true);
  };

  const handleEdit = (variant) => {
    setSelectedVariant(variant);
    setSheetOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteVariant(id);
      await fetchVariants();
      toast({
        title: "Success",
        description: "Variant deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete variant",
      });
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (selectedVariant) {
        await updateVariant(selectedVariant._id, values);
      } else {
        await addVariant(values);
      }
      await fetchVariants();
      setSheetOpen(false);
      toast({
        title: "Success",
        description: "Variant saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save variant",
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVariants = variants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(variants.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Variants</h2>
        <Button onClick={handleAdd}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Variant
        </Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <VariantList
          variants={currentVariants}
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
            <SheetTitle>{selectedVariant ? 'Edit Variant' : 'Add Variant'}</SheetTitle>
          </SheetHeader>
          <VariantForm
            variant={selectedVariant}
            onSubmit={handleFormSubmit}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default VariantsPage;