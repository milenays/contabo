import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"
import { MailIcon, PhoneIcon, MapPinIcon, DollarSignIcon, ShoppingBagIcon, CreditCardIcon, EyeIcon } from 'lucide-react';

const SupplierDetails = ({ supplier }) => {
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const handleViewPurchase = (purchase) => {
    setSelectedPurchase(purchase);
    setIsPurchaseDialogOpen(true);
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setIsPaymentDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Avatar className="h-10 w-10 mr-2">
              <AvatarFallback>{supplier.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {supplier.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <MailIcon className="mr-2 text-gray-400" />
                    <span>{supplier.email}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Email Address</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <PhoneIcon className="mr-2 text-gray-400" />
                    <span>{supplier.phone}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Phone Number</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <MapPinIcon className="mr-2 text-gray-400" />
                    <span>{supplier.address}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Address</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSignIcon className="mr-2" />
            Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Badge variant="secondary" className="mb-2">Total Purchase Amount</Badge>
              <p className="text-2xl font-bold">₺{supplier.totalPurchaseAmount.toFixed(2)}</p>
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">Total Payment Amount</Badge>
              <p className="text-2xl font-bold">₺{supplier.totalPaymentAmount.toFixed(2)}</p>
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">Balance</Badge>
              <p className={`text-2xl font-bold ${supplier.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                ₺{supplier.balance.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingBagIcon className="mr-2" />
            Purchase History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Receipt/Invoice Number</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplier.purchases && supplier.purchases.map((purchase, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                  <TableCell>₺{purchase.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{purchase.receiptNumber || purchase.invoiceNumber || 'N/A'}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleViewPurchase(purchase)}>
                      <EyeIcon className="mr-2 h-4 w-4" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCardIcon className="mr-2" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplier.payments && supplier.payments.map((payment, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                  <TableCell>₺{payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleViewPayment(payment)}>
                      <EyeIcon className="mr-2 h-4 w-4" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Purchase Details Dialog */}
      <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase Details</DialogTitle>
          </DialogHeader>
          {selectedPurchase && (
            <div>
              <p><strong>Date:</strong> {new Date(selectedPurchase.date).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> ₺{selectedPurchase.totalAmount.toFixed(2)}</p>
              <p><strong>Receipt/Invoice Number:</strong> {selectedPurchase.receiptNumber || selectedPurchase.invoiceNumber || 'N/A'}</p>
              <h4 className="font-semibold mt-4 mb-2">Items:</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPurchase.items && selectedPurchase.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₺{item.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Details Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div>
              <p><strong>Date:</strong> {new Date(selectedPayment.date).toLocaleDateString()}</p>
              <p><strong>Amount:</strong> ₺{selectedPayment.amount.toFixed(2)}</p>
              <p><strong>Payment Method:</strong> {selectedPayment.paymentMethod}</p>
              <p><strong>Transaction ID:</strong> {selectedPayment.transactionId || 'N/A'}</p>
              <p><strong>Notes:</strong> {selectedPayment.notes || 'N/A'}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierDetails;