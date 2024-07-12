import React, { useState, useMemo, useCallback } from 'react';
import { Edit2Icon, ChevronLeftIcon, ChevronRightIcon, SearchIcon, Loader2Icon } from 'lucide-react';
import { deleteProduct } from '../api/productApi';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useToast } from "../components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const renderImage = (images) => {
  const imageUrl = images && images.length > 0 ? images[0] : 'http://localhost:5000/uploads/default.jpg';
  return (
    <div className="flex justify-center items-center">
      <img src={imageUrl} alt="Product" className="w-12 h-12 object-cover rounded-md shadow-sm" />
    </div>
  );
};

const ProductList = ({ products, onEditClick, onViewClick, onDeleteSuccess, isLoading, onEditV2Click }) => {
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const { toast } = useToast();

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      (product.productName && product.productName.toLowerCase().includes(searchText.toLowerCase())) ||
      (product.stockCode && product.stockCode.toLowerCase().includes(searchText.toLowerCase())) ||
      (product.barcode && product.barcode.toLowerCase().includes(searchText.toLowerCase()))
    );
  }, [products, searchText]);

  const onDeleteClick = useCallback(async (productId) => {
    try {
      await deleteProduct(productId);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      onDeleteSuccess(productId);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product",
      });
    }
  }, [toast, onDeleteSuccess]);

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

  const columns = useMemo(() => [
    { header: "Image", accessorKey: "images", cell: ({ row }) => renderImage(row.original.images) },
    { header: "Name", accessorKey: "productName" },
    { header: "Stock Code", accessorKey: "stockCode" },
    { header: "Barcode", accessorKey: "barcode" },
    {
       header: "Brand",
       accessorKey: "brand",
      cell: ({ row }) => row.original.brand?.name || 'N/A'
    },
    {
       header: "Category",
       accessorKey: "category",
      cell: ({ row }) => row.original.category?.name || 'N/A'
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Edit2Icon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditClick(row.original)}>
              Edit (v1)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewClick(row.original)}>
              View/Edit (v2)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteClick(row.original._id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [onEditClick, onViewClick, onDeleteClick]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <SearchIcon className="text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchText}
          onChange={handleSearch}
          className="max-w-sm"
        />
      </div>
      {products.length === 0 ? (
        <div className="text-center py-10 bg-muted rounded-lg">
          <p className="text-xl font-semibold text-muted-foreground">No products found.</p>
          <p className="text-muted-foreground">Try adding some products to get started.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-10 bg-muted rounded-lg">
          <p className="text-xl font-semibold text-muted-foreground">No matching products found.</p>
          <p className="text-muted-foreground">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.accessorKey} className="font-semibold">
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.map((product) => (
                <TableRow key={product._id} className="hover:bg-muted/50 transition-colors">
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      {column.cell ? column.cell({ row: { original: product } }) : product[column.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between bg-background px-4 py-3 rounded-lg shadow-sm border border-border">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
              variant="outline"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastProduct, filteredProducts.length)}
                </span>{' '}
                of <span className="font-medium">{filteredProducts.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-background text-sm font-medium hover:bg-muted"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </Button>
                <Button
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-background text-sm font-medium hover:bg-muted"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;