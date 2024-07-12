import React, { useState, useEffect, useCallback } from 'react';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '../api/customerApi';
import CustomerForm from '../components/CustomerForm';
import CustomerList from '../components/CustomerList';
import { Button } from "../components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet"
import { useToast } from "../components/ui/use-toast"
import { PlusIcon } from 'lucide-react';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const itemsPerPage = 10;

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch customers",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setSelectedCustomer(null);
    setSheetOpen(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setSheetOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      await fetchCustomers();
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete customer",
      });
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer._id, values);
      } else {
        await addCustomer(values);
      }
      await fetchCustomers();
      setSheetOpen(false);
      toast({
        title: "Success",
        description: "Customer saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save customer",
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Customers</h2>
        <Button onClick={handleAdd}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <CustomerList
          customers={currentCustomers}
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
            <SheetTitle>{selectedCustomer ? 'Edit Customer' : 'Add Customer'}</SheetTitle>
          </SheetHeader>
          <CustomerForm
            customer={selectedCustomer}
            onSubmit={handleFormSubmit}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CustomersPage;