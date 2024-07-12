import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders, fetchTrendyolOrders } from '../api/orderApi';
import { RefreshCw, BoxIcon, TruckIcon, CheckCircleIcon, AlertCircleIcon, XCircleIcon, RotateCcwIcon, DollarSignIcon, ShoppingCartIcon, TrendingUpIcon, PackageIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react';
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { useToast } from "../components/ui/use-toast"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    completionRate: 0,
    shippedOrderValue: 0
  });
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchOrders();
      setOrders(result);
      setFilteredOrders(result);
      calculateStats(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch orders",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order => {
      const customerName = `${order.customerFirstName || ''} ${order.customerLastName || ''}`.toLowerCase();
      const hasMatchingCustomerName = customerName.includes(searchTerm.toLowerCase());
      
      const hasMatchingProduct = order.lines && order.lines.some(line => 
        (line.productName || '').toLowerCase().includes(searchTerm.toLowerCase())
      );

      return hasMatchingCustomerName || hasMatchingProduct;
    });
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, orders]);

  const calculateStats = (orderData) => {
    const totalOrders = orderData.length;
    const totalRevenue = orderData.reduce((sum, order) => sum + order.totalPrice, 0);
    const averageOrderValue = totalRevenue / totalOrders;
    const completedOrders = orderData.filter(order => order.status === 'Teslim Edildi').length;
    const completionRate = (completedOrders / totalOrders) * 100;
    const shippedOrderValue = orderData
      .filter(order => order.status === 'Kargoda')
      .reduce((sum, order) => sum + order.totalPrice, 0);

    setStats({
      totalOrders,
      totalRevenue,
      averageOrderValue,
      completionRate,
      shippedOrderValue
    });
  };

  const handleFetchTrendyolOrders = async () => {
    setLoading(true);
    try {
      await fetchTrendyolOrders();
      await fetchData();
      toast({
        title: "Success",
        description: "Trendyol orders fetched successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch Trendyol orders",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (ordersToRender) => {
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = ordersToRender.slice(indexOfFirstOrder, indexOfLastOrder);

    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Platform</TableHead>
              <TableHead>Order Number</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Cargo Provider</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <img src="/uploads/trendyol.png" alt="Trendyol" className="w-6 h-6" />
                </TableCell>
                <TableCell>
                  <Link to={`/orders/${order._id}`}>{order.orderNumber}</Link>
                </TableCell>
                <TableCell>{`${order.customerFirstName || ''} ${order.customerLastName || ''}`}</TableCell>
                <TableCell>
                  <Badge variant="secondary">₺{order.totalPrice}</Badge>
                </TableCell>
                <TableCell>
                  <img src="/uploads/surat.png" alt="Surat Kargo" className="w-10 h-10" />
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-4">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <span>
            Page {currentPage} of {Math.ceil(ordersToRender.length / ordersPerPage)}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(ordersToRender.length / ordersPerPage)))}
            disabled={currentPage === Math.ceil(ordersToRender.length / ordersPerPage)}
            variant="outline"
          >
            Next
            <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </>
    );
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Teslim Edildi': return "success";
      case 'Kargoda': return "secondary";
      case 'İptal': return "destructive";
      default: return "default";
    }
  };

  const orderTabs = [
    { label: 'All', value: 'all', icon: BoxIcon },
    { label: 'New', value: 'Yeni', icon: BoxIcon },
    { label: 'Preparing', value: 'Hazırlanıyor', icon: BoxIcon },
    { label: 'Shipped', value: 'Kargoda', icon: TruckIcon },
    { label: 'Delivered', value: 'Teslim Edildi', icon: CheckCircleIcon },
    { label: 'Delivery Problem', value: 'Teslim Problemi', icon: AlertCircleIcon },
    { label: 'Canceled', value: 'İptal', icon: XCircleIcon },
    { label: 'Returned', value: 'İade Edildi', icon: RotateCcwIcon },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Order Management</h2>
        <Button onClick={handleFetchTrendyolOrders} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" /> Fetch Trendyol Orders
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{stats.averageOrderValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate.toFixed(2)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped Order Value</CardTitle>
            <PackageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{stats.shippedOrderValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <SearchIcon className="w-5 h-5 text-gray-500" />
        <Input
          type="text"
          placeholder="Search by customer name or product"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs value={selectedTab} onValueChange={(value) => { setSelectedTab(value); setCurrentPage(1); }}>
        <TabsList>
          {orderTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {orderTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {renderTable(tab.value === 'all' 
              ? filteredOrders 
              : filteredOrders.filter((order) => order.status === tab.value)
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default OrderPage;