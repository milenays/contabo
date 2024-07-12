import React, { useState, useEffect, useCallback } from 'react';
import { getTaxes, addTax, updateTax, deleteTax } from '../api/taxApi';
import TaxForm from '../components/TaxForm';
import TaxList from '../components/TaxList';
import { Button } from "../components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet"
import { useToast } from "../components/ui/use-toast"
import { PlusIcon } from 'lucide-react';

const TaxesPage = () => {
  const [taxes, setTaxes] = useState([]);
  const [selectedTax, setSelectedTax] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const itemsPerPage = 10;

  const fetchTaxes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTaxes();
      setTaxes(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch taxes",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTaxes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setSelectedTax(null);
    setSheetOpen(true);
  };

  const handleEdit = (tax) => {
    setSelectedTax(tax);
    setSheetOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTax(id);
      await fetchTaxes();
      toast({
        title: "Success",
        description: "Tax deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete tax",
      });
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (selectedTax) {
        await updateTax(selectedTax._id, values);
      } else {
        await addTax(values);
      }
      await fetchTaxes();
      setSheetOpen(false);
      toast({
        title: "Success",
        description: "Tax saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save tax",
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTaxes = taxes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(taxes.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Taxes</h2>
        <Button onClick={handleAdd}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Tax
        </Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <TaxList
          taxes={currentTaxes}
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
            <SheetTitle>{selectedTax ? 'Edit Tax' : 'Add Tax'}</SheetTitle>
          </SheetHeader>
          <TaxForm
            tax={selectedTax}
            onSubmit={handleFormSubmit}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TaxesPage;