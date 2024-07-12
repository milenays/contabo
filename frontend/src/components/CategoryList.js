import React from 'react';
import { Edit2Icon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

const CategoryList = ({ categories, onEdit, onDelete, currentPage, totalPages, onPageChange }) => {
  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Description", accessorKey: "description" },
    {
      header: "Trendyol Category",
      accessorKey: "trendyolCategoryId",
      cell: ({ row }) => {
        const trendyolCategoryId = row.original.trendyolCategoryId;
        const trendyolCategoryName = row.original.trendyolCategoryName;
        const isMatched = !!trendyolCategoryId;
  
        return (
          <div className="flex items-center">
            <div className="relative inline-block mr-2">
              <img 
                src="/uploads/trendyol.png" 
                alt="Trendyol" 
                className="w-8 h-8 rounded-full"
              />
              <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${isMatched ? 'bg-green-500' : 'bg-red-500'} border border-white`}></div>
            </div>
            {isMatched ? trendyolCategoryName : 'Not matched'}
          </div>
        );
      }
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
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(row.original._id)}>
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
            {categories.map((category) => (
              <TableRow key={category._id}>
                {columns.map((column) => (
                  <TableCell key={column.accessorKey}>
                    {column.cell ? column.cell({ row: { original: category } }) : category[column.accessorKey]}
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
};

export default CategoryList;