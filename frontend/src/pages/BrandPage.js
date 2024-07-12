/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getBrands, addBrand, updateBrand, deleteBrand } from '../api/brandApi';
import BrandForm from '../components/BrandForm';
import BrandList from '../components/BrandList';
import { Button } from "../components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet"
import { useToast } from "../components/ui/use-toast"
import { PlusIcon } from 'lucide-react';
import { Skeleton } from "../components/ui/skeleton"

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const abortControllerRef = useRef(null);

  const fetchBrands = useCallback(async (page) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
  
    setLoading(true);
    try {
      const data = await getBrands(page, 10, { signal: abortControllerRef.current.signal });
      setBrands(data.brands); // Doğrudan gelen veriyi kullan
      setTotalPages(data.totalPages);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching brands:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch brands",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBrands(currentPage);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const refreshBrands = () => {
    fetchBrands(currentPage);
  };

  const handleAdd = () => {
    setSelectedBrand(null);
    setSheetOpen(true);
  };

  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    setSheetOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBrand(id);
      refreshBrands();
      toast({
        title: "Success",
        description: "Brand deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete brand",
      });
    }
  };

  const handleFormSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (selectedBrand) {
        await updateBrand(selectedBrand._id, values);
      } else {
        await addBrand(values);
      }
      refreshBrands();
      setSheetOpen(false);
      toast({
        title: "Success",
        description: `Brand ${selectedBrand ? 'updated' : 'added'} successfully`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${selectedBrand ? 'update' : 'add'} brand`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchBrands(page);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Brands</h2>
        <Button onClick={handleAdd}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Brand
        </Button>
      </div>
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <BrandList
          brands={brands}
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
            <SheetTitle>{selectedBrand ? 'Edit Brand' : 'Add Brand'}</SheetTitle>
          </SheetHeader>
          <BrandForm
            brand={selectedBrand}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BrandsPage;