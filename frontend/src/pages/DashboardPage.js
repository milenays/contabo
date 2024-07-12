import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveHeatMap } from '@nivo/heatmap'
import { DollarSign, Users, ShoppingBag, TrendingUp } from 'lucide-react'
import '../styles//Dashboard.css'  // CSS dosyasını import ediyoruz

const DashboardPage = () => {
  // Örnek veriler
  const salesData = [
    { id: "sales", data: [
      { x: "Jan", y: 100 },
      { x: "Feb", y: 120 },
      { x: "Mar", y: 150 },
      { x: "Apr", y: 180 },
      { x: "May", y: 220 },
      { x: "Jun", y: 250 },
    ]}
  ]

  const productData = [
    { product: "Product A", sales: 120 },
    { product: "Product B", sales: 80 },
    { product: "Product C", sales: 150 },
    { product: "Product D", sales: 90 },
  ]

  const categoryData = [
    { id: "Electronics", value: 35 },
    { id: "Clothing", value: 25 },
    { id: "Books", value: 20 },
    { id: "Home", value: 15 },
    { id: "Sports", value: 5 },
  ]

  // Isı haritası için veri formatını düzeltiyoruz
  const stockData = [
    { id: "Product A", data: [
      { x: "In Stock", y: 50 },
      { x: "Low Stock", y: 20 },
      { x: "Out of Stock", y: 5 },
    ]},
    { id: "Product B", data: [
      { x: "In Stock", y: 80 },
      { x: "Low Stock", y: 10 },
      { x: "Out of Stock", y: 2 },
    ]},
    { id: "Product C", data: [
      { x: "In Stock", y: 30 },
      { x: "Low Stock", y: 40 },
      { x: "Out of Stock", y: 15 },
    ]},
    { id: "Product D", data: [
      { x: "In Stock", y: 70 },
      { x: "Low Stock", y: 25 },
      { x: "Out of Stock", y: 0 },
    ]},
    { id: "Product E", data: [
      { x: "In Stock", y: 45 },
      { x: "Low Stock", y: 30 },
      { x: "Out of Stock", y: 8 },
    ]},
  ]

  return (
    <div className="dashboard-container">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveLine
                data={salesData}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                axisTop={null}
                axisRight={null}
                axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Month', legendOffset: 36, legendPosition: 'middle' }}
                axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Sales', legendOffset: -40, legendPosition: 'middle' }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveBar
                data={productData}
                keys={['sales']}
                indexBy="product"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'nivo' }}
                axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Product', legendPosition: 'middle', legendOffset: 32 }}
                axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Sales', legendPosition: 'middle', legendOffset: -40 }}
                labelSkipWidth={12}
                labelSkipHeight={12}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsivePie
                data={categoryData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 2 ] ] }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveHeatMap
                data={stockData}
                margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
                valueFormat=">-.2s"
                axisTop={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -90,
                  legend: '',
                  legendOffset: 46
                }}
                axisRight={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Product',
                  legendPosition: 'middle',
                  legendOffset: 70
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Product',
                  legendPosition: 'middle',
                  legendOffset: -72
                }}
                colors={{
                  type: 'diverging',
                  scheme: 'red_yellow_blue',
                  divergeAt: 0.5,
                  minValue: 0,
                  maxValue: 100
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;