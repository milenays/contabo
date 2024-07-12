import React from 'react';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { PlusIcon, MinusIcon } from 'lucide-react';

const VariantForm = ({ variant, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      name: variant ? variant.name : '',
      options: variant ? variant.options : [''],
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      options: Yup.array().of(Yup.string().required('Option is required')).min(1, 'At least one option is required'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Variant Name</Label>
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
          <Label>Options</Label>
          <FieldArray
            name="options"
            render={arrayHelpers => (
              <div className="space-y-2">
                {formik.values.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      name={`options.${index}`}
                      value={option}
                      onChange={formik.handleChange}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => arrayHelpers.remove(index)}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => arrayHelpers.push('')}
                >
                  <PlusIcon className="mr-2 h-4 w-4" /> Add Option
                </Button>
              </div>
            )}
          />
          {formik.touched.options && formik.errors.options ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.options}</div>
          ) : null}
        </div>
        <Button type="submit">Save</Button>
      </form>
    </FormikProvider>
  );
};

export default VariantForm;