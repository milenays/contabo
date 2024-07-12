import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getOrderDetail, updateOrderStatusToPicking, changeCargo, fetchTrendyolOrders } from '../api/orderApi';
import { getProducts } from '../api/productApi';
import { ArrowLeftIcon, PrinterIcon, ShoppingCartIcon, UserIcon, MapPinIcon, DollarSignIcon, TruckIcon, CalendarIcon, PackageIcon } from 'lucide-react';
import ReactToPrint from 'react-to-print';
import CargoSlipWrapper from './CargoSlipWrapper';
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { useToast } from "../components/ui/use-toast"
import { Badge } from "../components/ui/badge"
import { Skeleton } from "./ui/skeleton.jsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChangeCargoModalOpen, setIsChangeCargoModalOpen] = useState(false);
  const [selectedCargoProvider, setSelectedCargoProvider] = useState('');
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const history = useHistory();
  const printRef = useRef();
  const cargoSlipRef = useRef();
  const { toast } = useToast();

  const cargoProviders = useMemo(() => [
    { value: "YKMP", label: "Yurtiçi Kargo" },
    { value: "ARASMP", label: "Aras Kargo" },
    { value: "SURATMP", label: "Sürat Kargo" },
    { value: "HOROZMP", label: "Horoz Lojistik" },
    { value: "MNGMP", label: "MNG Kargo by DHL" },
    { value: "PTTMP", label: "PTT Kargo" },
    { value: "CEVAMP", label: "Ceva Lojistik" },
    { value: "TEXMP", label: "Trendyol Express" },
    { value: "SENDEOMP", label: "Sendeo by OÇ" }
  ], []);

  const getReadableCargoName = useCallback((value) => {
    const provider = cargoProviders.find(p => p.value === value);
    return provider ? provider.label : value;
  }, [cargoProviders]);

  const fetchOrderDetail = useCallback(async () => {
    try {
      const orderDetail = await getOrderDetail(orderId);
      setOrder(orderDetail);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch order details",
      });
    } finally {
      setLoading(false);
    }
  }, [orderId, toast]);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch products",
      });
    } finally {
      setLoadingProducts(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOrderDetail();
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrepareOrder = async () => {
    try {
      await updateOrderStatusToPicking(order.orderNumber);
      toast({
        title: "Success",
        description: "Order updated to Picking status",
      });
      fetchOrderDetail();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status",
      });
    }
  };

  const handleChangeCargo = async () => {
    try {
      await changeCargo(order.shipmentPackageId, selectedCargoProvider);
      toast({
        title: "Success",
        description: "Cargo provider update request sent to Trendyol successfully",
      });
      await fetchTrendyolOrders();
      fetchOrderDetail();
      setIsChangeCargoModalOpen(false);
    } catch (error) {
      console.error('Error changing cargo provider:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to change cargo provider",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderInfoItem = (label, value, link = false) => (
    <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
        {link && value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
            {value}
          </a>
        ) : (
          value || 'N/A'
        )}
      </dd>
    </div>
  );

  const getProductImage = (barcode) => {
    const product = products.find(p => p.barcode === barcode);
    return product && product.images && product.images.length > 0 ? product.images[0] : null;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-background text-foreground">
        <Skeleton className="h-8 w-1/4" />
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!order) {
    return <div className="flex justify-center items-center h-screen bg-background text-foreground">Order not found</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-background text-foreground">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => history.push('/orders')}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
        <h2 className="text-3xl font-bold">Order Details: #{order.orderNumber}</h2>
        <div className="space-x-2">
          {order.status === 'Yeni' && (
            <Button onClick={handlePrepareOrder}>
              <ShoppingCartIcon className="mr-2 h-4 w-4" /> Prepare Order
            </Button>
          )}
          <Dialog open={isChangeCargoModalOpen} onOpenChange={setIsChangeCargoModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <TruckIcon className="mr-2 h-4 w-4" /> Change Cargo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Cargo Provider</DialogTitle>
                <DialogDescription>
                  Select a new cargo provider for this order.
                </DialogDescription>
              </DialogHeader>
              <Select onValueChange={setSelectedCargoProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cargo provider" />
                </SelectTrigger>
                <SelectContent>
                  {cargoProviders.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button onClick={handleChangeCargo} disabled={!selectedCargoProvider}>
                  Confirm Change
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <ReactToPrint
            trigger={() => (
              <Button variant="outline">
                <PrinterIcon className="mr-2 h-4 w-4" /> Print
              </Button>
            )}
            content={() => cargoSlipRef.current}
          />
        </div>
      </div>

      <div ref={printRef} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle><UserIcon className="inline-block mr-2" /> Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                {renderInfoItem("Name", `${order.customerFirstName} ${order.customerLastName}`)}
                {renderInfoItem("Order Number", order.orderNumber)}
                {renderInfoItem("Email", order.customerEmail)}
                {renderInfoItem("Phone", order.customerPhone)}
                {renderInfoItem("Status", <Badge>{order.status}</Badge>)}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle><MapPinIcon className="inline-block mr-2" /> Shipping Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                {renderInfoItem("Address", order.shipmentAddress)}
                {renderInfoItem("City", order.shipmentCity)}
                {renderInfoItem("District", order.shipmentDistrict)}
                {renderInfoItem("Postal Code", order.shipmentPostalCode)}
                {renderInfoItem("Address Type", order.shipmentAddressType)}
                {renderInfoItem("Cargo Company", getReadableCargoName(order.cargoCompany))}
                {renderInfoItem("Tracking Number", order.packageTracking, true)}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle><DollarSignIcon className="inline-block mr-2" /> Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                {renderInfoItem("Subtotal", `₺${order.grossAmount?.toFixed(2) || '0.00'}`)}
                {renderInfoItem("Discount", `₺${order.totalDiscount?.toFixed(2) || '0.00'}`)}
                {renderInfoItem("Total", `₺${order.totalPrice.toFixed(2)}`)}
                {renderInfoItem("Payment Type", order.paymentType)}
              </dl>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.lines.map((line) => (
                  <TableRow key={line.orderLineId}>
                    <TableCell>
                      {loadingProducts ? (
                        <Skeleton className="w-16 h-16 rounded" />
                      ) : getProductImage(line.barcode) ? (
                        <img src={getProductImage(line.barcode)} alt={line.productName} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">No Image</div>
                      )}
                    </TableCell>
                    <TableCell>{line.productName}</TableCell>
                    <TableCell>{line.quantity}</TableCell>
                    <TableCell>₺{line.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>₺{(line.quantity * line.unitPrice).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle><CalendarIcon className="inline-block mr-2" /> Delivery Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              {renderInfoItem("Delivery Type", order.deliveryType)}
              {renderInfoItem("Estimated Delivery Start", formatDate(order.estimatedDeliveryStartDate))}
              {renderInfoItem("Estimated Delivery End", formatDate(order.estimatedDeliveryEndDate))}
              {renderInfoItem("Order Date", formatDate(order.orderDate))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle><PackageIcon className="inline-block mr-2" /> Package Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              {renderInfoItem("Package Number", order.packageNumber)}
              {renderInfoItem("Cargo Tracking Number", order.cargoTrackingNumber)}
              {renderInfoItem("Cargo Tracking Link", order.cargoTrackingLink, true)}
              {renderInfoItem("Cargo Sender Number", order.cargoSenderNumber)}
              {renderInfoItem("Cargo Barcode", order.cargoBarcode)}
            </dl>
          </CardContent>
        </Card>
      </div>

      <CargoSlipWrapper ref={cargoSlipRef} order={order} />
    </div>
  );
};

export default OrderDetail;