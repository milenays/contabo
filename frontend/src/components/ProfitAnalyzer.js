import React, { useState, useEffect } from 'react';
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { DollarSign, Percent, ShoppingBag, Package, TrendingUp, Truck, Tag } from 'lucide-react';

const ProfitAnalyzer = () => {
  const [formData, setFormData] = useState({
    purchasePrice: '',
    vat: '20',
    commission: '',
    shipping: '',
    packagingCost: '',
    processingFee: '',
    sellingPrice: '',
  });
  const [profitResult, setProfitResult] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('profitAnalyzerData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('profitAnalyzerData', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const calculateProfit = () => {
    const purchasePrice = parseFloat(formData.purchasePrice);
    const sellingPrice = parseFloat(formData.sellingPrice);
    const commission = parseFloat(formData.commission) / 100;
    const shipping = parseFloat(formData.shipping);
    const packagingCost = parseFloat(formData.packagingCost);
    const processingFee = parseFloat(formData.processingFee);

    const revenue = sellingPrice * (1 - commission);
    const costs = purchasePrice + shipping + packagingCost + processingFee;
    const profit = revenue - costs;

    const profitFromPurchase = (profit / purchasePrice) * 100;
    const profitFromSale = (profit / sellingPrice) * 100;

    // Yeni karlılık hesaplaması
    const totalRevenue = purchasePrice + profit;
    const profitabilityFromTotal = (profit / totalRevenue) * 100;

    setProfitResult({
      profit: profit.toFixed(2),
      profitFromPurchase: profitFromPurchase.toFixed(2),
      profitFromSale: profitFromSale.toFixed(2),
      profitabilityFromTotal: profitabilityFromTotal.toFixed(2),
    });
  };

  const handleClearData = () => {
    setFormData({
      purchasePrice: '',
      vat: '20',
      commission: '',
      shipping: '',
      packagingCost: '',
      processingFee: '',
      sellingPrice: '',
    });
    setProfitResult(null);
    localStorage.removeItem('profitAnalyzerData');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="mr-2" />
              Product Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="text-gray-500" />
              <div className="flex-grow">
                <Label htmlFor="purchasePrice">Purchase Price (Inc. VAT)</Label>
                <Input id="purchasePrice" name="purchasePrice" value={formData.purchasePrice} onChange={handleInputChange} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Percent className="text-gray-500" />
              <div className="flex-grow">
                <Label htmlFor="vat">VAT</Label>
                <Select name="vat" value={formData.vat} onValueChange={(value) => handleSelectChange('vat', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select VAT" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="20">20%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Tag className="text-gray-500" />
              <div className="flex-grow">
                <Label htmlFor="commission">Commission (%)</Label>
                <Input id="commission" name="commission" value={formData.commission} onChange={handleInputChange} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2" />
              Pricing and Costs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="text-gray-500" />
              <div className="flex-grow">
                <Label htmlFor="sellingPrice">Selling Price</Label>
                <Input id="sellingPrice" name="sellingPrice" value={formData.sellingPrice} onChange={handleInputChange} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="text-gray-500" />
              <div className="flex-grow">
                <Label htmlFor="shipping">Shipping Cost</Label>
                <Input id="shipping" name="shipping" value={formData.shipping} onChange={handleInputChange} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="text-gray-500" />
              <div className="flex-grow">
                <Label htmlFor="packagingCost">Packaging Cost</Label>
                <Input id="packagingCost" name="packagingCost" value={formData.packagingCost} onChange={handleInputChange} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="text-gray-500" />
              <div className="flex-grow">
                <Label htmlFor="processingFee">Processing Fee</Label>
                <Input id="processingFee" name="processingFee" value={formData.processingFee} onChange={handleInputChange} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex space-x-4">
        <Button onClick={calculateProfit} className="flex-1">Calculate Profit</Button>
        <Button onClick={handleClearData} variant="outline" className="flex-1">Clear Data</Button>
      </div>
      {profitResult && (
  <Card className="bg-primary/10 border-primary/20">
    <CardHeader>
      <CardTitle className="text-primary">Profit Analysis</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Profit:</span>
        <span className="text-2xl font-bold text-primary">₺{profitResult.profit}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Profit from Purchase:</span>
        <span className="text-2xl font-bold text-green-500 dark:text-green-400">{profitResult.profitFromPurchase}%</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Profit from Sale:</span>
        <span className="text-2xl font-bold text-green-500 dark:text-green-400">{profitResult.profitFromSale}%</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Profitability from Total Revenue:</span>
        <span className="text-2xl font-bold text-green-500 dark:text-green-400">{profitResult.profitabilityFromTotal}%</span>
      </div>
    </CardContent>
  </Card>
)}
    </div>
  );
};

export default ProfitAnalyzer;