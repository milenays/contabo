import React, { useState, useEffect, useCallback } from 'react';
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier, addPurchase, addPayment, getSupplierDetails } from '../api/supplierApi';
import SupplierForm from '../components/SupplierForm';
import SupplierList from '../components/SupplierList';
import { Button } from "../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { useToast } from "../components/ui/use-toast"
import { PlusIcon } from 'lucide-react';
import PurchaseForm from '../components/PurchaseForm';
import PaymentForm from '../components/PaymentForm';
import SupplierDetails from '../components/SupplierDetails';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const itemsPerPage = 10;

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch suppliers",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setSelectedSupplier(null);
    setDialogContent('supplierForm');
    setDialogOpen(true);
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setDialogContent('supplierForm');
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSupplier(id);
      await fetchSuppliers();
      toast({
        title: "Success",
        description: "Supplier deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete supplier",
      });
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (selectedSupplier) {
        await updateSupplier(selectedSupplier._id, values);
      } else {
        await addSupplier(values);
      }
      await fetchSuppliers();
      setDialogOpen(false);
      toast({
        title: "Success",
        description: "Supplier saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save supplier",
      });
    }
  };

  const handleAddPurchase = (supplier) => {
    console.log('Adding purchase for supplier:', supplier);
    setSelectedSupplier(supplier);
    setDialogContent('purchaseForm');
    setDialogOpen(true);
  };

  const handleAddPayment = (supplier) => {
    setSelectedSupplier(supplier);
    setDialogContent('paymentForm');
    setDialogOpen(true);
  };

  const handlePurchaseSubmit = async (values) => {
    console.log('Submitting purchase with values:', values);
    console.log('Selected supplier:', selectedSupplier);
    try {
      if (!selectedSupplier || !selectedSupplier._id) {
        throw new Error('No supplier selected');
      }
      const purchaseData = { 
        ...values, 
        supplierId: selectedSupplier._id,
        totalAmount: parseFloat(values.totalAmount)
      };
      console.log('Purchase data being sent to API:', purchaseData);
      const response = await addPurchase(purchaseData);
      console.log('API response:', response);
      await fetchSuppliers();
      setDialogOpen(false);
      toast({
        title: "Success",
        description: "Purchase added successfully",
      });
    } catch (error) {
      console.error('Error adding purchase:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add purchase",
      });
    }
  };

  const handlePaymentSubmit = async (values) => {
    try {
      await addPayment({ ...values, supplierId: selectedSupplier._id });
      await fetchSuppliers();
      setDialogOpen(false);
      toast({
        title: "Success",
        description: "Payment added successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add payment",
      });
    }
  };

  const handleViewDetails = async (supplier) => {
    try {
      const details = await getSupplierDetails(supplier._id);
      setSelectedSupplier({ ...supplier, ...details });
      setDialogContent('supplierDetails');
      setDialogOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch supplier details",
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSuppliers = suppliers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(suppliers.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Suppliers</h2>
        <Button onClick={handleAdd}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Supplier
        </Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <SupplierList
          suppliers={currentSuppliers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddPurchase={handleAddPurchase}
          onAddPayment={handleAddPayment}
          onViewDetails={handleViewDetails}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {dialogContent === 'supplierForm' && (selectedSupplier ? 'Edit Supplier' : 'Add Supplier')}
              {dialogContent === 'purchaseForm' && 'Add Purchase'}
              {dialogContent === 'paymentForm' && 'Add Payment'}
              {dialogContent === 'supplierDetails' && 'Supplier Details'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto pr-6">
            {dialogContent === 'supplierForm' && (
              <SupplierForm
                supplier={selectedSupplier}
                onSubmit={handleFormSubmit}
              />
            )}
            {dialogContent === 'purchaseForm' && (
              <PurchaseForm onSubmit={handlePurchaseSubmit} />
            )}
            {dialogContent === 'paymentForm' && (
              <PaymentForm onSubmit={handlePaymentSubmit} />
            )}
            {dialogContent === 'supplierDetails' && (
              <SupplierDetails supplier={selectedSupplier} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuppliersPage;