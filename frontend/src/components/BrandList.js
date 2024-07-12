import React from 'react';
import { Edit2Icon, ChevronLeftIcon, ChevronRightIcon, Trash2Icon } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";

const BrandList = React.memo(({ brands, onEdit, onDelete, currentPage, totalPages, onPageChange }) => {
  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Description", accessorKey: "description" },
    {
      header: "Trendyol Marka",
      accessorKey: "trendyolBrandId",
      cell: ({ row }) => {
        const trendyolBrandId = row.original.trendyolBrandId;
        const isMatched = !!trendyolBrandId;

        return (
          <div className="relative inline-block">
            <img 
              src="/uploads/trendyol.png" 
              alt="Trendyol" 
              className="w-8 h-8 rounded-full"
            />
            <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${isMatched ? 'bg-green-500' : 'bg-red-500'} border border-white`}></div>
          </div>
        );
      }
    },
    {
      header: "Trendyol Brand Name",
      accessorKey: "trendyolBrandName",
      cell: ({ row }) => row.original.trendyolBrandName
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
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Edit2Icon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(row.original._id)}>
              <Trash2Icon className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {columns.map((column) => (
              <TableHead key={column.accessorKey}>{column.header}</TableHead>
            ))}
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand._id}>
                {columns.map((column) => (
                  <TableCell key={column.accessorKey}>
                    {column.cell 
                      ? column.cell({ row: { original: brand } }) 
                      : brand[column.accessorKey]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Next
          <ChevronRightIcon className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.brands === nextProps.brands &&
    prevProps.currentPage === nextProps.currentPage &&
    prevProps.totalPages === nextProps.totalPages
  );
});

export default BrandList;