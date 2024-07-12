import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

const TaxForm = ({ tax, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      name: tax ? tax.name : '',
      rate: tax ? tax.rate : '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      rate: Yup.number().required('Required').min(0, 'Must be 0 or greater').max(100, 'Must be 100 or less'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Tax Name</Label>
        <Input
          id="name"
          name="name"
          {...formik.getFieldProps('name')}
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
        ) : null}
      </div>
      <div>
        <Label htmlFor="rate">Rate (%)</Label>
        <Input
          id="rate"
          name="rate"
          type="number"
          {...formik.getFieldProps('rate')}
        />
        {formik.touched.rate && formik.errors.rate ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.rate}</div>
        ) : null}
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
};

export default TaxForm;