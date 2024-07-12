import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { PlusIcon, ChevronDownIcon } from 'lucide-react';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import { getProducts, addProduct, updateProduct } from '../api/productApi';
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

const ProductPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const history = useHistory();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const products = await getProducts();
      setAllProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch products",
      });
      setAllProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddProductV1 = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleAddProductV2 = () => {
    history.push('/products/new');
  };

  const handleEditProductV1 = (product) => {
    setSelectedProduct({ ...product });
    setDialogOpen(true);
  };

  const handleEditProductV2 = (product) => {
    history.push(`/products/edit/${product._id}`);
  };

  const handleViewProduct = (product) => {
    history.push(`/products/view/${product._id}`);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const handleDeleteSuccess = useCallback((deletedProductId) => {
    setAllProducts(prevProducts => prevProducts.filter(product => product._id !== deletedProductId));
  }, []);

  const handleFormSubmit = async (product) => {
    setIsSubmitting(true);
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct._id, product);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await addProduct(product);
        toast({
          title: "Success",
          description: "Product added successfully",
        });
      }
      await fetchProducts();
      handleDialogClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save product",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Products</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> Add Product <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleAddProductV1}>Add v1 (Form)</DropdownMenuItem>
            <DropdownMenuItem onClick={handleAddProductV2}>Add v2 (Detail)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ProductList
          products={allProducts}
          onEditClick={handleEditProductV1}
          onViewClick={handleViewProduct}
          onDeleteSuccess={handleDeleteSuccess}
          onEditV2Click={handleEditProductV2}
        />
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto pr-6">
            <ProductForm
              key={selectedProduct ? selectedProduct._id : 'new'}
              onClose={handleDialogClose}
              onSubmit={handleFormSubmit}
              initialValues={selectedProduct}
              isSubmitting={isSubmitting}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductPage;