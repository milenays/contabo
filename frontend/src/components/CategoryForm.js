import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { searchTrendyolCategories, getTrendyolCategoryById, getTrendyolCategoryAttributes } from '../api/categoryApi';
import debounce from 'lodash/debounce';
import { Skeleton } from "../components/ui/skeleton"

const LazySearchSelect = lazy(() => import('../components/LazySearchSelect'));

const AttributeInput = React.memo(({ attribute, formik }) => {
  const { attributeId, name, allowCustom, attributeValues } = attribute;
  const fieldName = `trendyolAttributes.${attributeId}`;
  const value = formik.values.trendyolAttributes[attributeId] || '';

  if (attributeValues && attributeValues.length > 0) {
    if (attributeValues.length > 20) {
      return (
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <LazySearchSelect
            options={attributeValues.map(v => ({ id: v.id, name: v.name })).filter(v => v.id && v.name) || []}
            value={value}
            onChange={(newValue) => formik.setFieldValue(fieldName, newValue)}
            placeholder={`Search ${name}`}
          />
        </Suspense>
      );
    }

    return (
      <Select
        onValueChange={(newValue) => formik.setFieldValue(fieldName, newValue)}
        value={value}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Select ${name}`}>
            {attributeValues.find(v => v.id.toString() === value)?.name || `Select ${name}`}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {attributeValues.map((val) => (
            <SelectItem key={val.id} value={val.id.toString()}>
              {val.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  } else if (allowCustom) {
    return (
      <Input
        id={fieldName}
        name={fieldName}
        placeholder={name}
        value={value}
        onChange={(e) => formik.setFieldValue(fieldName, e.target.value)}
      />
    );
  }

  return null;
});

const CategoryForm = ({ category, onSubmit }) => {
  const [trendyolCategories, setTrendyolCategories] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedTrendyolCategory, setSelectedTrendyolCategory] = useState(null);
  const [isAttributesLoading, setIsAttributesLoading] = useState(false);
  const [categoryAttributes, setCategoryAttributes] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: category?.name || '',
      description: category?.description || '',
      trendyolCategoryId: category?.trendyolCategoryId ? category.trendyolCategoryId.toString() : '',
      trendyolCategoryName: category?.trendyolCategoryName || '',
      trendyolAttributes: {},
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string(),
      trendyolCategoryId: Yup.string(),
      trendyolCategoryName: Yup.string(),
      trendyolAttributes: Yup.object(),
    }),
    onSubmit: (values) => {
      onSubmit({
        ...values,
        trendyolCategoryId: values.trendyolCategoryId ? parseInt(values.trendyolCategoryId, 10) : null,
        trendyolAttributes: categoryAttributes.map(attr => ({
          ...attr,
          value: values.trendyolAttributes[attr.attributeId] || ''
        }))
      });
    },
  });

  const fetchCategories = useCallback(async (search, pageNum) => {
    if (!search && pageNum === 1) return;
    setIsLoading(true);
    try {
      const result = await searchTrendyolCategories(search, pageNum);
      if (pageNum === 1) {
        setTrendyolCategories(result.categories);
      } else {
        setTrendyolCategories(prev => [...prev, ...result.categories]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTrendyolCategory = useCallback(async (categoryId) => {
    if (!categoryId) return;
    setIsAttributesLoading(true);
    try {
      const result = await getTrendyolCategoryById(categoryId);
      setSelectedTrendyolCategory(result);
      formik.setFieldValue('trendyolCategoryName', result.name);
  
      const attributes = await getTrendyolCategoryAttributes(categoryId);
      setCategoryAttributes(attributes);
  
      const updatedAttributes = {};
      attributes.forEach(attr => {
        updatedAttributes[attr.attributeId] = attr.value || '';
      });
      formik.setFieldValue('trendyolAttributes', updatedAttributes);
    } catch (error) {
      console.error('Error fetching Trendyol category:', error);
    } finally {
      setIsAttributesLoading(false);
    }
  }, []);

  const debouncedFetchCategories = useMemo(
    () => debounce((search) => {
      setPage(1);
      fetchCategories(search, 1);
    }, 500),
    [fetchCategories]
  );

  useEffect(() => {
    if (category) {
      formik.setValues({
        name: category.name || '',
        description: category.description || '',
        trendyolCategoryId: category.trendyolCategoryId ? category.trendyolCategoryId.toString() : '',
        trendyolCategoryName: category.trendyolCategoryName || '',
        trendyolAttributes: {},
      });

      if (category.trendyolAttributes && category.trendyolAttributes.length > 0) {
        setCategoryAttributes(category.trendyolAttributes);
        const updatedAttributes = {};
        category.trendyolAttributes.forEach(attr => {
          updatedAttributes[attr.attributeId] = attr.value || '';
        });
        formik.setFieldValue('trendyolAttributes', updatedAttributes);
      } else if (category.trendyolCategoryId) {
        fetchTrendyolCategory(category.trendyolCategoryId);
      }
    }
  }, [category, fetchTrendyolCategory]);

  useEffect(() => {
    if (searchValue) {
      debouncedFetchCategories(searchValue);
    } else {
      setTrendyolCategories([]);
    }
  }, [searchValue, debouncedFetchCategories]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCategories(searchValue, nextPage);
  };

  const handleCategorySelect = (categoryId) => {
    if (categoryId !== formik.values.trendyolCategoryId) {
      formik.setFieldValue('trendyolCategoryId', categoryId);
      fetchTrendyolCategory(categoryId);
    }
  };

  const getSelectedCategoryName = () => {
    if (selectedTrendyolCategory) {
      return selectedTrendyolCategory.name;
    }
    return formik.values.trendyolCategoryId ? "Loading..." : "Select Trendyol category";
  };

  const sortedAttributes = useMemo(() => {
    if (!categoryAttributes) {
      return [];
    }
    return [...categoryAttributes].sort((a, b) => {
      if (a.required === b.required) return 0;
      return a.required ? -1 : 1;
    });
  }, [categoryAttributes]);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Category Name</Label>
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
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          {...formik.getFieldProps('description')}
        />
        {formik.touched.description && formik.errors.description ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
        ) : null}
      </div>
      <div>
        <Label htmlFor="trendyolCategoryId">Trendyol Category</Label>
        <Select
          onValueChange={handleCategorySelect}
          value={formik.values.trendyolCategoryId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Trendyol category">
              {getSelectedCategoryName()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <Input
                placeholder="Search categories..."
                onChange={handleSearchChange}
                value={searchValue}
                className="mb-2"
              />
              {trendyolCategories.map((category) => (
                <SelectItem key={category.categoryId} value={category.categoryId.toString()}>
                  {category.name}
                </SelectItem>
              ))}
              {!isLoading && trendyolCategories.length >= 20 && (
                <div className="pt-2">
                  <Button onClick={handleLoadMore} className="w-full">
                    Load More
                  </Button>
                </div>
              )}
              {isLoading && <div className="text-center py-2">Loading...</div>}
            </div>
          </SelectContent>
        </Select>
      </div>
      {categoryAttributes.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Trendyol Attributes</h3>
          {isAttributesLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="mb-2">
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))
          ) : (
            sortedAttributes.map((attribute) => (
              <div key={attribute.attributeId} className="mb-2">
                <Label htmlFor={`trendyolAttributes.${attribute.attributeId}`}>
                  {attribute.name}{attribute.required && <span className="text-red-500">*</span>}
                </Label>
                <AttributeInput
                  attribute={attribute}
                  formik={formik}
                />
              </div>
            ))
          )}
        </div>
      )}
      <Button type="submit">Save</Button>
    </form>
  );
};

export default React.memo(CategoryForm);