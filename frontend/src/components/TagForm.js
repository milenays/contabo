import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

const TagForm = ({ tag, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      name: tag ? tag.name : '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Tag Name</Label>
        <Input
          id="name"
          name="name"
          {...formik.getFieldProps('name')}
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
        ) : null}
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
};

export default TagForm;