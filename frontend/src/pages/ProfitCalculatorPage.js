import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import PriceGenerator from '../components/PriceGenerator';
import ProfitAnalyzer from '../components/ProfitAnalyzer';

const ProfitCalculatorPage = () => {
  const [activeTab, setActiveTab] = useState("price-generator");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Profit Calculator</h1>
      <Card>
        <CardHeader>
          <CardTitle>E-commerce Seller's Calculator</CardTitle>
          <CardDescription>Generate prices or analyze profits for your products</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="price-generator" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="price-generator">Price Generator</TabsTrigger>
              <TabsTrigger value="profit-analyzer">Profit Analyzer</TabsTrigger>
            </TabsList>
            <TabsContent value="price-generator">
              <PriceGenerator activeTab={activeTab} />
            </TabsContent>
            <TabsContent value="profit-analyzer">
              <ProfitAnalyzer activeTab={activeTab} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitCalculatorPage;