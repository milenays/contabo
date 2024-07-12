import React, { useState, useEffect, useCallback } from 'react';
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
import { searchTrendyolBrands, getTrendyolBrandById } from '../api/brandApi';
import debounce from 'lodash/debounce';

const BrandForm = ({ brand, onSubmit, isSubmitting }) => {
  const [trendyolBrands, setTrendyolBrands] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedTrendyolBrand, setSelectedTrendyolBrand] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: brand ? brand.name : '',
      description: brand ? brand.description : '',
      trendyolBrandId: brand && brand.trendyolBrandId ? brand.trendyolBrandId : '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Brand name is required'),
      description: Yup.string(),
      trendyolBrandId: Yup.string(),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const fetchBrands = useCallback(async (search, pageNum) => {
    if (!search) return;
    setIsLoading(true);
    try {
      const result = await searchTrendyolBrands(search, pageNum);
      setTrendyolBrands(prevBrands => 
        pageNum === 1 ? result : [...prevBrands, ...result]
      );
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTrendyolBrand = useCallback(async (brandId) => {
    try {
      const result = await getTrendyolBrandById(brandId);
      setSelectedTrendyolBrand(result);
    } catch (error) {
      console.error('Error fetching Trendyol brand:', error);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchBrands = useCallback(
    debounce((search) => {
      setPage(1);
      fetchBrands(search, 1);
    }, 500),
    [fetchBrands]
  );

  useEffect(() => {
    if (searchValue) {
      debouncedFetchBrands(searchValue);
    } else {
      setTrendyolBrands([]);
    }
  }, [searchValue, debouncedFetchBrands]);

  useEffect(() => {
    if (brand && brand.trendyolBrandId) {
      fetchTrendyolBrand(brand.trendyolBrandId);
    }
  }, [brand, fetchTrendyolBrand]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBrands(searchValue, nextPage);
  };

  const handleBrandSelect = (brandId) => {
    formik.setFieldValue('trendyolBrandId', brandId);
    const selected = trendyolBrands.find(b => b.brandId.toString() === brandId);
    setSelectedTrendyolBrand(selected);
  };

  const getSelectedBrandName = () => {
    if (selectedTrendyolBrand) {
      return selectedTrendyolBrand.name;
    }
    return formik.values.trendyolBrandId ? "Loading..." : "Select Trendyol brand";
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Brand Name</Label>
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
        <Label htmlFor="trendyolBrandId">Trendyol Brand</Label>
        <Select 
          onValueChange={handleBrandSelect}
          value={formik.values.trendyolBrandId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Trendyol brand">
              {getSelectedBrandName()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <Input
                placeholder="Search brands..."
                onChange={handleSearchChange}
                value={searchValue}
                className="mb-2"
              />
              {trendyolBrands.map((brand) => (
                <SelectItem key={brand.brandId} value={brand.brandId.toString()}>
                  {brand.name}
                </SelectItem>
              ))}
              {!isLoading && trendyolBrands.length >= 20 && (
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
        {formik.touched.trendyolBrandId && formik.errors.trendyolBrandId ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.trendyolBrandId}</div>
        ) : null}
      </div>
      <Button type="submit" className="mt-4" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
};

export default BrandForm;