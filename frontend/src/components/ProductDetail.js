import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { getProductById, addProduct, updateProduct } from '../api/productApi';
import { getBrands } from '../api/brandApi';
import { getCategories } from '../api/categoryApi';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { useToast } from "../components/ui/use-toast";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { RefreshCw } from 'lucide-react';
import ProductTrendyol from './ProductTrendyol';

const ProductDetail = () => {
    const { id } = useParams();
    const history = useHistory();
    const { toast } = useToast();
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fileList, setFileList] = useState([]);
    const [showTrendyolModal, setShowTrendyolModal] = useState(false);

    const validationSchema = Yup.object({
        productName: Yup.string().required("Required"),
        stockCode: Yup.string().required("Required"),
        barcode: Yup.string().required("Required"),
        brand: Yup.string().required("Required"),
        category: Yup.string().required("Required"),
        weight: Yup.string().required("Required"),
        salePrice: Yup.number().required("Required"),
        marketPrice: Yup.number().required("Required"),
        purchasePrice: Yup.number().required("Required"),
        stock: Yup.number().required("Required"),
        fakeStock: Yup.number().required("Required"),
        criticalStock: Yup.number().required("Required"),
    });

    const formik = useFormik({
        initialValues: {
            productName: "",
            stockCode: "",
            barcode: "",
            brand: "",
            category: "",
            weight: "",
            description: "",
            salePrice: "",
            marketPrice: "",
            purchasePrice: "",
            stock: "",
            fakeStock: "",
            criticalStock: "",
            warehouseShelfCode: "",
            warehouseAreaCode: "",
            status: "draft",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const productData = {
                    ...values,
                    images: fileList.map(file => file.url),
                };
                if (id) {
                    await updateProduct(id, productData);
                    toast({ title: "Success", description: "Product updated successfully" });
                } else {
                    await addProduct(productData);
                    toast({ title: "Success", description: "Product added successfully" });
                }
                history.push('/products');
            } catch (error) {
                toast({ variant: "destructive", title: "Error", description: "Failed to save product" });
            }
        },
    });

    const fetchProductData = useCallback(async () => {
        if (id) {
            try {
                const product = await getProductById(id);
                formik.setValues({
                    productName: product.productName || "",
                    stockCode: product.stockCode || "",
                    barcode: product.barcode || "",
                    brand: product.brand?._id || "",
                    category: product.category?._id || "",
                    weight: product.weight || "",
                    description: product.description || "",
                    salePrice: product.salePrice || "",
                    marketPrice: product.marketPrice || "",
                    purchasePrice: product.purchasePrice || "",
                    stock: product.stock || "",
                    fakeStock: product.fakeStock || "",
                    criticalStock: product.criticalStock || "",
                    warehouseShelfCode: product.warehouseShelfCode || "",
                    warehouseAreaCode: product.warehouseAreaCode || "",
                    status: product.status || "draft",
                });
                setFileList(product.images?.map((url, index) => ({
                    uid: index.toString(),
                    name: `image-${index}`,
                    status: 'done',
                    url,
                })) || []);
            } catch (error) {
                toast({ variant: "destructive", title: "Error", description: "Failed to fetch product details" });
            }
        }
    }, [id, toast, formik]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [brandsData, categoriesData] = await Promise.all([getBrands(), getCategories()]);
                setBrands(brandsData.brands || []);
                setCategories(categoriesData.categories || []);
                await fetchProductData();
            } catch (error) {
                toast({ variant: "destructive", title: "Error", description: "Failed to load necessary data" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCategoryChange = (categoryId) => {
        formik.setFieldValue('category', categoryId);
    };

    const handleTrendyolManage = () => {
        setShowTrendyolModal(true);
    };

    const handleUploadChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Image must be smaller than 10MB!",
            });
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
                    uid: Date.now(),
                    name: file.name,
                    status: 'done',
                    url: response.data.url,
                }]);
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Image upload failed",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Image upload failed",
            });
            console.error('Image upload error:', error);
        }
    };

    const handleRemoveImage = (uid) => {
        setFileList(prevFileList => prevFileList.filter(file => file.uid !== uid));
    };

    const handleBarcodeGenerate = () => {
        const randomBarcode = '84' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
        formik.setFieldValue('barcode', randomBarcode);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => history.goBack()}>
                        <ChevronLeftIcon className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="text-2xl font-semibold">
                        {id ? 'Edit Product' : 'New Product'}
                    </h1>
                </div>
                <Badge variant="outline">
                    {formik.values.stock > 0 ? "In stock" : "Out of stock"}
                </Badge>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => history.goBack()}>
                        Discard
                    </Button>
                    <Button onClick={formik.handleSubmit}>Save Product</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Details</CardTitle>
                            <CardDescription>Basic information about the product</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="productName">Name</Label>
                                    <Input
                                        id="productName"
                                        {...formik.getFieldProps('productName')}
                                    />
                                    {formik.touched.productName && formik.errors.productName && (
                                        <p className="text-sm text-red-500">{formik.errors.productName}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="barcode">Barcode</Label>
                                    <div className="flex items-center">
                                        <Input
                                            id="barcode"
                                            {...formik.getFieldProps('barcode')}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="ml-2"
                                            onClick={handleBarcodeGenerate}
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {formik.touched.barcode && formik.errors.barcode && (
                                        <p className="text-sm text-red-500">{formik.errors.barcode}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="stockCode">Stock Code</Label>
                                        <Input
                                            id="stockCode"
                                            {...formik.getFieldProps('stockCode')}
                                        />
                                        {formik.touched.stockCode && formik.errors.stockCode && (
                                            <p className="text-sm text-red-500">{formik.errors.stockCode}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="weight">Weight</Label>
                                        <Input
                                            id="weight"
                                            {...formik.getFieldProps('weight')}
                                        />
                                        {formik.touched.weight && formik.errors.weight && (
                                            <p className="text-sm text-red-500">{formik.errors.weight}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <ReactQuill
                                        value={formik.values.description}
                                        onChange={(value) => formik.setFieldValue("description", value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Stock</CardTitle>
                            <CardDescription>Manage product stock</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Fake Stock</TableHead>
                                        <TableHead>Critical Stock</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                {...formik.getFieldProps('stock')}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                {...formik.getFieldProps('fakeStock')}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                {...formik.getFieldProps('criticalStock')}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                            <CardDescription>Manage product pricing</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="salePrice">Sale Price</Label>
                                    <Input
                                        id="salePrice"
                                        type="number"
                                        {...formik.getFieldProps('salePrice')}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="marketPrice">Market Price</Label>
                                    <Input
                                        id="marketPrice"
                                        type="number"
                                        {...formik.getFieldProps('marketPrice')}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="purchasePrice">Purchase Price</Label>
                                    <Input
                                        id="purchasePrice"
                                        type="number"
                                        {...formik.getFieldProps('purchasePrice')}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Warehouse</CardTitle>
                            <CardDescription>Warehouse information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="warehouseAreaCode">Area Code</Label>
                                    <Input
                                        id="warehouseAreaCode"
                                        {...formik.getFieldProps('warehouseAreaCode')}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="warehouseShelfCode">Shelf Code</Label>
                                    <Input
                                        id="warehouseShelfCode"
                                        {...formik.getFieldProps('warehouseShelfCode')}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select onValueChange={(value) => formik.setFieldValue('status', value)} value={formik.values.status}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales Channels</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <Button onClick={handleTrendyolManage} variant="outline">
                                    Manage Trendyol
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Product Category and Brand</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Select onValueChange={handleCategoryChange} value={formik.values.category}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category._id} value={category._id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="brand">Brand</Label>
                                    <Select onValueChange={(value) => formik.setFieldValue('brand', value)} value={formik.values.brand}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a brand" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {brands.map((brand) => (
                                                <SelectItem key={brand._id} value={brand._id}>
                                                    {brand.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Product Images</CardTitle>
                            <CardDescription>Upload and manage product images</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {fileList.map((file, index) => (
                                    <div key={file.uid} className="relative">
                                        <img
                                            src={file.url}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-md"
                                        />
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={() => handleRemoveImage(file.uid)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer">
                                    <input
                                        type="file"
                                        onChange={handleUploadChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <span>Upload Image</span>
                                </label>
                            </div>
                        </CardContent>
                    </Card>
                    {showTrendyolModal && (
                        <ProductTrendyol
                            isOpen={showTrendyolModal}
                            onClose={() => setShowTrendyolModal(false)}
                            productData={formik.values}
                            categoryId={formik.values.category}
                            brandId={formik.values.brand}
                            onSave={(trendyolData) => {
                                console.log('Trendyol data:', trendyolData);
                                setShowTrendyolModal(false);
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
function ChevronLeftIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m15 18-6-6 6-6" />
        </svg>
    )
}
export default ProductDetail;