import React, { useEffect, useState, useCallback, useMemo, Suspense, lazy } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { useToast } from "../components/ui/use-toast"
import { getBrands, searchTrendyolBrands } from '../api/brandApi';
import { getCategories, getTrendyolCategoryAttributes, searchTrendyolCategories } from '../api/categoryApi';
import debounce from 'lodash/debounce';
import { Skeleton } from "../components/ui/skeleton"

const LazySearchSelect = lazy(() => import('../components/LazySearchSelect'));

const ProductForm = ({ onClose, onSubmit, initialValues, isSubmitting }) => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [trendyolAddresses] = useState([]);
  const [trendyolCategoryAttributes, setTrendyolCategoryAttributes] = useState([]);
  const [trendyolCategories, setTrendyolCategories] = useState([]);
  const [trendyolBrands, setTrendyolBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trendyolBrandSearch, setTrendyolBrandSearch] = useState("");
  const [trendyolCategorySearch, setTrendyolCategorySearch] = useState("");
  const { toast } = useToast();

  const validationSchema = Yup.object({
    productName: Yup.string().required("Required"),
    stockCode: Yup.string().required("Required"),
    barcode: Yup.string().required("Required"),
    brand: Yup.string().required("Required"),
    category: Yup.string().required("Required"),
    salePrice: Yup.number().required("Required"),
    purchasePrice: Yup.number(),
    stock: Yup.number().required("Required"),
    fakeStock: Yup.number(),
    criticalStock: Yup.number(),
  });

  const formik = useFormik({
    initialValues: {
      productName: initialValues?.productName || "",
      stockCode: initialValues?.stockCode || "",
      barcode: initialValues?.barcode || "",
      brand: initialValues?.brand?._id || "",
      category: initialValues?.category?._id || "",
      weight: initialValues?.weight || "",
      description: initialValues?.description || "",
      marketPrice: initialValues?.marketPrice || "",
      salePrice: initialValues?.salePrice || "",
      purchasePrice: initialValues?.purchasePrice || "",
      stock: initialValues?.stock || "",
      fakeStock: initialValues?.fakeStock || "",
      criticalStock: initialValues?.criticalStock || "",
      warehouseShelfCode: initialValues?.warehouseShelfCode || "",
      warehouseAreaCode: initialValues?.warehouseAreaCode || "",
      trendyolEnabled: initialValues?.trendyolEnabled || false,
      trendyolBrandId: initialValues?.trendyolBrandId || "",
      trendyolCategoryId: initialValues?.trendyolCategoryId || "",
      trendyolShipmentAddressId: initialValues?.trendyolShipmentAddressId || "",
      trendyolReturningAddressId: initialValues?.trendyolReturningAddressId || "",
      trendyolAttributes: initialValues?.trendyolAttributes || {},
      trendyolDeliveryOption: initialValues?.trendyolDeliveryOption || {
        deliveryDuration: "",
        fastDeliveryType: ""
      },
      trendyolListPrice: initialValues?.trendyolListPrice || "",
      trendyolSalePrice: initialValues?.trendyolSalePrice || "",
      trendyolVatRate: initialValues?.trendyolVatRate || "",
      trendyolCargoCompanyId: initialValues?.trendyolCargoCompanyId || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const productData = {
        ...values,
        images: fileList.map(file => file.url),
      };

      if (values.trendyolEnabled) {
        productData.trendyolAttributes = Object.entries(values.trendyolAttributes).map(([key, value]) => ({
          attributeId: key,
          attributeValueId: value
        }));
      } else {
        delete productData.trendyolBrandId;
        delete productData.trendyolCategoryId;
        delete productData.trendyolShipmentAddressId;
        delete productData.trendyolReturningAddressId;
        delete productData.trendyolListPrice;
        delete productData.trendyolSalePrice;
        delete productData.trendyolVatRate;
        delete productData.trendyolCargoCompanyId;
        delete productData.trendyolAttributes;
        delete productData.trendyolDeliveryOption;
      }

      onSubmit(productData);
    },
  });

  const fetchData = useCallback(async () => {
    try {
      const [brandsData, categoriesData] = await Promise.all([
        getBrands(),
        getCategories()
      ]);
      setBrands(brandsData.brands || []);
      setCategories(categoriesData.categories || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load necessary data",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialValues?.images) {
      setFileList(initialValues.images.map((url, index) => ({
        uid: index.toString(),
        name: `image-${index}`,
        status: 'done',
        url,
      })));
    } else {
      setFileList([]);
    }
  }, [initialValues]);

  const fetchTrendyolCategoryAttributes = useCallback(async (categoryId) => {
    if (!categoryId) return;
    setIsLoading(true);
    try {
      const attributes = await getTrendyolCategoryAttributes(categoryId);
      setTrendyolCategoryAttributes(attributes);
    } catch (error) {
      console.error("Error fetching Trendyol category attributes:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load Trendyol category attributes",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formik.values.trendyolCategoryId) {
      fetchTrendyolCategoryAttributes(formik.values.trendyolCategoryId);
    }
  }, [formik.values.trendyolCategoryId, fetchTrendyolCategoryAttributes]);

  const fetchTrendyolCategories = useCallback(async (search) => {
    if (!search) {
      setTrendyolCategories([]);
      return;
    }
    setIsLoading(true);
    try {
      const result = await searchTrendyolCategories(search, 1);
      setTrendyolCategories(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Error fetching Trendyol categories:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch Trendyol categories",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTrendyolBrands = useCallback(async (search) => {
    if (!search) {
      setTrendyolBrands([]);
      return;
    }
    setIsLoading(true);
    try {
      const result = await searchTrendyolBrands(search, 1);
      setTrendyolBrands(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Error fetching Trendyol brands:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch Trendyol brands",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTrendyolCategories(trendyolCategorySearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [trendyolCategorySearch, fetchTrendyolCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTrendyolBrands(trendyolBrandSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [trendyolBrandSearch, fetchTrendyolBrands]);

  const handleTrendyolCategorySelect = useCallback((categoryId) => {
    formik.setFieldValue('trendyolCategoryId', categoryId);
  }, [formik]);

  const handleTrendyolBrandSelect = useCallback((brandId) => {
    formik.setFieldValue('trendyolBrandId', brandId);
  }, [formik]);

  const handleBarcodeGenerate = useCallback(() => {
    const randomBarcode = '84' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    formik.setFieldValue('barcode', randomBarcode);
  }, [formik]);

  const debouncedBrandSearch = useMemo(
    () => debounce((search) => {
      fetchTrendyolBrands(search);
    }, 300),
    [fetchTrendyolBrands]
  );
  
  const debouncedCategorySearch = useMemo(
    () => debounce((search) => {
      fetchTrendyolCategories(search);
    }, 300),
    [fetchTrendyolCategories]
  );
  
  const handleTrendyolBrandSearch = useCallback((search) => {
    setTrendyolBrandSearch(search);
    debouncedBrandSearch(search);
  }, [debouncedBrandSearch]);
  
  const handleTrendyolCategorySearch = useCallback((search) => {
    setTrendyolCategorySearch(search);
    debouncedCategorySearch(search);
  }, [debouncedCategorySearch]);

  const handleUploadChange = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Image must be smaller than 10MB!",
      })
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        setFileList(prevFileList => [...prevFileList, {
          uid: file.uid,
          name: file.name,
          status: 'done',
          url: response.data.url,
        }]);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Image upload failed",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Image upload failed",
      })
      console.error('Image upload error:', error);
    }
  }, [toast]);

  const memoizedTrendyolTab = useMemo(() => (
    <TabsContent value="trendyol" className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="trendyolEnabled">Enable Trendyol Integration</Label>
        <input
          type="checkbox"
          id="trendyolEnabled"
          checked={formik.values.trendyolEnabled}
          onChange={() => formik.setFieldValue('trendyolEnabled', !formik.values.trendyolEnabled)}
        />
      </div>
      {formik.values.trendyolEnabled && (
        <>
          <div className="space-y-2">
            <Label htmlFor="trendyolBrandId">Trendyol Brand</Label>
            <Suspense fallback={<Skeleton className="h-10 w-full" />}>
              <LazySearchSelect
                options={trendyolBrands.map(brand => ({ id: brand.id, name: brand.name })).filter(brand => brand.id && brand.name)}
                value={formik.values.trendyolBrandId}
                onChange={handleTrendyolBrandSelect}
                onSearch={handleTrendyolBrandSearch}
                placeholder="Select Trendyol brand"
                isLoading={isLoading}
              />
            </Suspense>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trendyolCategoryId">Trendyol Category</Label>
            <Suspense fallback={<Skeleton className="h-10 w-full" />}>
              <LazySearchSelect
                options={trendyolCategories.map(cat => ({ id: cat.id || cat.categoryId, name: cat.name })).filter(cat => cat.id && cat.name)}
                value={formik.values.trendyolCategoryId}
                onChange={handleTrendyolCategorySelect}
                onSearch={handleTrendyolCategorySearch}
                placeholder="Select Trendyol category"
                isLoading={isLoading}
              />
            </Suspense>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trendyolShipmentAddressId">Shipment Address</Label>
              <Select
                onValueChange={(value) => formik.setFieldValue('trendyolShipmentAddressId', value)}
                value={formik.values.trendyolShipmentAddressId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a shipment address" />
                </SelectTrigger>
                <SelectContent>
                {trendyolAddresses.map((address) => (
                    <SelectItem key={address.id} value={address.id.toString()}>
                      {address.addressName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trendyolReturningAddressId">Returning Address</Label>
              <Select
                onValueChange={(value) => formik.setFieldValue('trendyolReturningAddressId', value)}
                value={formik.values.trendyolReturningAddressId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a returning address" />
                </SelectTrigger>
                <SelectContent>
                  {trendyolAddresses.map((address) => (
                    <SelectItem key={address.id} value={address.id.toString()}>
                      {address.addressName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trendyolListPrice">Trendyol List Price</Label>
              <Input
                id="trendyolListPrice"
                type="number"
                {...formik.getFieldProps('trendyolListPrice')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trendyolSalePrice">Trendyol Sale Price</Label>
              <Input
                id="trendyolSalePrice"
                type="number"
                {...formik.getFieldProps('trendyolSalePrice')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trendyolVatRate">VAT Rate</Label>
              <Input
                id="trendyolVatRate"
                type="number"
                {...formik.getFieldProps('trendyolVatRate')}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trendyolCargoCompanyId">Cargo Company</Label>
            <Input
              id="trendyolCargoCompanyId"
              {...formik.getFieldProps('trendyolCargoCompanyId')}
            />
          </div>
          <div className="space-y-2">
            <Label>Delivery Option</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trendyolDeliveryOption.deliveryDuration">Delivery Duration</Label>
                <Input
                  id="trendyolDeliveryOption.deliveryDuration"
                  type="number"
                  {...formik.getFieldProps('trendyolDeliveryOption.deliveryDuration')}
                />
              </div>
              <div>
                <Label htmlFor="trendyolDeliveryOption.fastDeliveryType">Fast Delivery Type</Label>
                <Select
                  onValueChange={(value) => formik.setFieldValue('trendyolDeliveryOption.fastDeliveryType', value)}
                  value={formik.values.trendyolDeliveryOption.fastDeliveryType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fast delivery type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAME_DAY_SHIPPING">Same Day Shipping</SelectItem>
                    <SelectItem value="FAST_DELIVERY">Fast Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {trendyolCategoryAttributes.map((attribute) => (
            <div key={attribute.attributeId} className="space-y-2">
              <Label htmlFor={`trendyolAttributes.${attribute.attributeId}`}>{attribute.name}</Label>
              {attribute.attributeValues && attribute.attributeValues.length > 0 ? (
                <Select
                  onValueChange={(value) => formik.setFieldValue(`trendyolAttributes.${attribute.attributeId}`, value)}
                  value={formik.values.trendyolAttributes[attribute.attributeId] || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${attribute.name}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {attribute.attributeValues.map((value) => (
                      <SelectItem key={value.id} value={value.id.toString()}>
                        {value.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={`trendyolAttributes.${attribute.attributeId}`}
                  {...formik.getFieldProps(`trendyolAttributes.${attribute.attributeId}`)}
                />
              )}
            </div>
          ))}
        </>
      )}
    </TabsContent>
  ), [trendyolBrands, trendyolCategories, trendyolAddresses, trendyolCategoryAttributes, handleTrendyolBrandSelect, handleTrendyolCategorySelect, handleTrendyolBrandSearch, handleTrendyolCategorySearch, isLoading, formik]);

return (
  <form onSubmit={formik.handleSubmit} className="space-y-6">
    <Tabs defaultValue="basic">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="quantity">Quantity and Price</TabsTrigger>
        <TabsTrigger value="warehouse">Warehouse</TabsTrigger>
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="trendyol">Trendyol</TabsTrigger>
      </TabsList>
      <TabsContent value="basic" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            {...formik.getFieldProps('productName')}
          />
          {formik.touched.productName && formik.errors.productName && (
            <p className="text-sm text-red-500">{formik.errors.productName}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode</Label>
            <div className="flex">
              <Input
                id="barcode"
                {...formik.getFieldProps('barcode')}
              />
              <Button onClick={handleBarcodeGenerate} type="button" className="ml-2">
                Generate
              </Button>
            </div>
            {formik.touched.barcode && formik.errors.barcode && (
              <p className="text-sm text-red-500">{formik.errors.barcode}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="stockCode">Stock Code</Label>
            <Input
              id="stockCode"
              {...formik.getFieldProps('stockCode')}
            />
            {formik.touched.stockCode && formik.errors.stockCode && (
              <p className="text-sm text-red-500">{formik.errors.stockCode}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Select
              onValueChange={(value) => formik.setFieldValue('brand', value)}
              value={formik.values.brand}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(brands) && brands.map((brand) => (
                  <SelectItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.brand && formik.errors.brand && (
              <p className="text-sm text-red-500">{formik.errors.brand}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value) => formik.setFieldValue('category', value)}
              value={formik.values.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(categories) && categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.category && formik.errors.category && (
              <p className="text-sm text-red-500">{formik.errors.category}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <ReactQuill
            value={formik.values.description}
            onChange={(value) => formik.setFieldValue("description", value)}
          />
        </div>
      </TabsContent>
      <TabsContent value="quantity" className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="marketPrice">Market Price</Label>
            <Input
              id="marketPrice"
              type="number"
              {...formik.getFieldProps('marketPrice')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salePrice">Sale Price</Label>
            <Input
              id="salePrice"
              type="number"
              {...formik.getFieldProps('salePrice')}
            />
            {formik.touched.salePrice && formik.errors.salePrice && (
              <p className="text-sm text-red-500">{formik.errors.salePrice}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchasePrice">Purchase Price</Label>
            <Input
              id="purchasePrice"
              type="number"
              {...formik.getFieldProps('purchasePrice')}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              {...formik.getFieldProps('stock')}
            />
            {formik.touched.stock && formik.errors.stock && (
              <p className="text-sm text-red-500">{formik.errors.stock}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="fakeStock">Fake Stock</Label>
            <Input
              id="fakeStock"
              type="number"
              {...formik.getFieldProps('fakeStock')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="criticalStock">Critical Stock</Label>
            <Input
              id="criticalStock"
              type="number"
              {...formik.getFieldProps('criticalStock')}
            />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="warehouse" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="warehouseShelfCode">Warehouse Shelf Code</Label>
          <Input
            id="warehouseShelfCode"
            {...formik.getFieldProps('warehouseShelfCode')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="warehouseAreaCode">Warehouse Area Code</Label>
          <Input
            id="warehouseAreaCode"
            {...formik.getFieldProps('warehouseAreaCode')}
          />
        </div>
      </TabsContent>
      <TabsContent value="images" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="images">Upload Images</Label>
          <Input
            id="images"
            type="file"
            onChange={handleUploadChange}
            accept="image/*"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {fileList.map((file, index) => (
            <div key={file.uid} className="relative">
              <img src={file.url} alt={`Product ${index}`} className="w-full h-32 object-cover rounded" />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-0 right-0"
                onClick={() => setFileList(prevFileList => prevFileList.filter(f => f.uid !== file.uid))}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </TabsContent>
      {memoizedTrendyolTab}
    </Tabs>
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </div>
  </form>
);
};

export default React.memo(ProductForm);