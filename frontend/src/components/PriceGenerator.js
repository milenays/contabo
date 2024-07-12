import React, { useState, useEffect } from 'react';
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { DollarSign, Percent, ShoppingBag, Package, Calculator, Truck, Tag } from 'lucide-react';

const PriceGenerator = ({ activeTab }) => {
  const [formData, setFormData] = useState({
    purchasePrice: '',
    vat: '20',
    commission: '',
    shipping: '',
    packagingCost: '',
    processingFee: '',
    targetProfit: '',
    profitType: 'fromSale',
  });
  const [sellingPrice, setSellingPrice] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('priceGeneratorData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('priceGeneratorData', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const calculateSellingPrice = () => {
    const purchasePrice = parseFloat(formData.purchasePrice);
    const commission = parseFloat(formData.commission) / 100;
    const shipping = parseFloat(formData.shipping);
    const targetProfit = parseFloat(formData.targetProfit) / 100;
    const packagingCost = parseFloat(formData.packagingCost);
    const processingFee = parseFloat(formData.processingFee);

    const totalCost = purchasePrice + shipping + packagingCost + processingFee;

    let calculatedSellingPrice;
    if (formData.profitType === 'fromPurchase') {
      calculatedSellingPrice = (totalCost + (purchasePrice * targetProfit)) / (1 - commission);
    } else { // fromSale
      calculatedSellingPrice = totalCost / (1 - commission - targetProfit);
    }

    setSellingPrice(calculatedSellingPrice.toFixed(2));
  };

  const handleClearData = () => {
    setFormData({
      purchasePrice: '',
      vat: '20',
      commission: '',
      shipping: '',
      packagingCost: '',
      processingFee: '',
      targetProfit: '',
      profitType: 'fromSale',
    });
    setSellingPrice(null);
    localStorage.removeItem('priceGeneratorData');
  };

  if (activeTab !== "price-generator") return null;

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
              <Calculator className="mr-2" />
              Pricing Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Truck className="text-gray-500" />
              <div className="flex-grow">
                <Label htmlFor="shipping">Shipping Cost</Label>
                <Input id="shipping" name="shipping" value={formData.shipping} onChange={handleInputChange} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Percent className="text-gray-500" />
              <div className="flex-grow">
                <Label htmlFor="targetProfit">Target Profit (%)</Label>
                <Input id="targetProfit" name="targetProfit" value={formData.targetProfit} onChange={handleInputChange} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="text-gray-500" />
              <div className="flex-grow">
                <Label htmlFor="profitType">Profit Type</Label>
                <Select name="profitType" value={formData.profitType} onValueChange={(value) => handleSelectChange('profitType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select profit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fromPurchase">From Purchase</SelectItem>
                    <SelectItem value="fromSale">From Sale</SelectItem>
                  </SelectContent>
                </Select>
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
        <Button onClick={calculateSellingPrice} className="flex-1">Calculate Selling Price</Button>
        <Button onClick={handleClearData} variant="outline" className="flex-1">Clear Data</Button>
      </div>
      {sellingPrice && (
  <Card className="bg-primary/10 border-primary/20">
    <CardHeader>
      <CardTitle className="text-primary">Recommended Selling Price</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-4xl font-bold text-primary">₺{sellingPrice}</p>
    </CardContent>
  </Card>
)}
    </div>
  );
};

export default PriceGenerator;