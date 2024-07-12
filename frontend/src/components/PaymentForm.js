import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Card, CardContent } from "../components/ui/card"
import { CalendarIcon, FileTextIcon } from 'lucide-react';

const PaymentForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      date: new Date().toISOString().split('T')[0],
      amount: '',
      paymentMethod: '',
      notes: '',
    },
    validationSchema: Yup.object({
      date: Yup.date().required('Required'),
      amount: Yup.number().min(0, 'Must be greater than or equal to 0').required('Required'),
      paymentMethod: Yup.string().required('Required'),
      notes: Yup.string(),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 mb-4">
            <CalendarIcon className="text-gray-400" />
            <div className="flex-grow">
              <Label htmlFor="date">Payment Date</Label>
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

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-grow">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                {...formik.getFieldProps('amount')}
                placeholder="Enter payment amount"
              />
              {formik.touched.amount && formik.errors.amount && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.amount}</div>
              )}
            </div>
            <div className="flex-grow">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                onValueChange={(value) => formik.setFieldValue('paymentMethod', value)}
                defaultValue={formik.values.paymentMethod}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.paymentMethod && formik.errors.paymentMethod && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.paymentMethod}</div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <FileTextIcon className="text-gray-400" />
            <div className="flex-grow">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                name="notes"
                {...formik.getFieldProps('notes')}
                placeholder="Add any additional notes"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">
            Amount: ₺{formik.values.amount || '0.00'}
          </div>
          <div className="text-xl mt-2">
            Method: {formik.values.paymentMethod || 'Not selected'}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">Save Payment</Button>
    </form>
  );
};

export default PaymentForm;