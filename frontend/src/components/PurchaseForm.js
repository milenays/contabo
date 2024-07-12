import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardFooter } from "../components/ui/card"
import { PlusIcon, MinusIcon, CalendarIcon } from 'lucide-react';

const PurchaseForm = ({ onSubmit }) => {
  const [items, setItems] = useState([{ product: '', quantity: '', price: '' }]);

  const formik = useFormik({
    initialValues: {
      date: new Date().toISOString().split('T')[0],
      receiptNumber: '',
      invoiceNumber: '',
    },
    validationSchema: Yup.object({
      date: Yup.date().required('Required'),
      receiptNumber: Yup.string(),
      invoiceNumber: Yup.string(),
    }),
    onSubmit: (values) => {
      const totalAmount = calculateTotalAmount();
      console.log('Form submitted with values:', { ...values, items, totalAmount });
      onSubmit({ ...values, items, totalAmount });
    },
  });

  const addItem = () => {
    setItems([...items, { product: '', quantity: '', price: '' }]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateTotalAmount = () => {
    return items.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      return sum + (quantity * price);
    }, 0);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 mb-4">
            <CalendarIcon className="text-gray-400" />
            <div className="flex-grow">
              <Label htmlFor="date">Purchase Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                {...formik.getFieldProps('date')}
              />
              {formik.touched.date && formik.errors.date && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.date}</div>
              )}
            </div>
          </div>

          {items.map((item, index) => (
            <Card key={index} className="mb-4">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-grow">
                    <Input
                      placeholder="Product name"
                      value={item.product}
                      onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                    />
                  </div>
                  <div className="w-20">
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    />
                  </div>
                  <div className="w-24 text-right">
                    ₺{((Number(item.quantity) || 0) * (Number(item.price) || 0)).toFixed(2)}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => removeItem(index)}
                >
                  <MinusIcon className="h-4 w-4 mr-2" /> Remove
                </Button>
              </CardFooter>
            </Card>
          ))}

          <Button type="button" onClick={addItem} className="w-full">
            <PlusIcon className="h-4 w-4 mr-2" /> Add Item
          </Button>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="receiptNumber">Receipt Number</Label>
              <Input
                id="receiptNumber"
                name="receiptNumber"
                {...formik.getFieldProps('receiptNumber')}
                placeholder="Enter receipt number"
              />
            </div>
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                name="invoiceNumber"
                {...formik.getFieldProps('invoiceNumber')}
                placeholder="Enter invoice number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">
            Total Amount: ₺{calculateTotalAmount().toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">Save Purchase</Button>
    </form>
  );
};

export default PurchaseForm;