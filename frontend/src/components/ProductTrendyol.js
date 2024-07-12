import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { getCategoryWithTrendyolDetails } from '../api/categoryApi';
import { getTrendyolBrandById, getBrandById } from '../api/brandApi';
import { getTrendyolAddresses } from '../api/trendyolApi';

const cargoCompanies = [
    { id: 42, code: "DHLMP", name: "DHL" },
    { id: 38, code: "SENDEOMP", name: "Sendeo" },
    { id: 30, code: "BORMP", name: "Borusan Lojistik" },
    { id: 14, code: "CAIMP", name: "Cainiao" },
    { id: 10, code: "MNGMP", name: "MNG Kargo" },
    { id: 19, code: "PTTMP", name: "PTT Kargo" },
    { id: 9, code: "SURATMP", name: "Sürat Kargo" },
    { id: 17, code: "TEXMP", name: "Trendyol Express" },
    { id: 6, code: "HOROZMP", name: "Horoz Kargo" },
    { id: 20, code: "CEVAMP", name: "CEVA Lojistik" },
    { id: 4, code: "YKMP", name: "Yurtiçi Kargo" },
    { id: 7, code: "ARASMP", name: "Aras Kargo" }
];

const validationSchema = Yup.object().shape({
    isEnabled: Yup.boolean(),
    trendyolBrandId: Yup.number().when('isEnabled', {
        is: true,
        then: () => Yup.number().required('Required'),
        otherwise: () => Yup.number().nullable(),
    }),
    trendyolCategoryId: Yup.number().when('isEnabled', {
        is: true,
        then: () => Yup.number().required('Required'),
        otherwise: () => Yup.number().nullable(),
    }),
    shipmentAddressId: Yup.string().when('isEnabled', {
        is: true,
        then: () => Yup.string().required('Required'),
        otherwise: () => Yup.string(),
    }),
    returningAddressId: Yup.string().when('isEnabled', {
        is: true,
        then: () => Yup.string().required('Required'),
        otherwise: () => Yup.string(),
    }),
    listPrice: Yup.number().when('isEnabled', {
        is: true,
        then: () => Yup.number().positive('Must be positive').required('Required'),
        otherwise: () => Yup.number().nullable(),
    }),
    salePrice: Yup.number().when('isEnabled', {
        is: true,
        then: () => Yup.number().positive('Must be positive').required('Required'),
        otherwise: () => Yup.number().nullable(),
    }),
    vatRate: Yup.number().when('isEnabled', {
        is: true,
        then: () => Yup.number().positive('Must be positive').required('Required'),
        otherwise: () => Yup.number().nullable(),
    }),
    cargoCompanyId: Yup.string().when('isEnabled', {
        is: true,
        then: () => Yup.string().required('Required'),
        otherwise: () => Yup.string(),
    }),
    deliveryDuration: Yup.number().when('isEnabled', {
        is: true,
        then: () => Yup.number().positive('Must be positive').required('Required'),
        otherwise: () => Yup.number().nullable(),
    }),
    fastDeliveryType: Yup.string().when('isEnabled', {
        is: true,
        then: () => Yup.string().required('Required'),
        otherwise: () => Yup.string(),
    }),
});


const ProductTrendyol = ({ isOpen, onClose, productData, categoryId, brandId, onSave }) => {
    const [category, setCategory] = useState(null);
    const [brand, setBrand] = useState(null);
    const [shipmentAddresses, setShipmentAddresses] = useState([]);
    const [returningAddresses, setReturningAddresses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (categoryId) {
                    const categoryData = await getCategoryWithTrendyolDetails(categoryId);
                    console.log("Fetched category data:", categoryData);
                    setCategory(categoryData.category);
                }
                if (brandId) {
                    const brandData = await getBrandById(brandId);
                    if (brandData && brandData.trendyolBrandId) {
                        const trendyolBrandData = await getTrendyolBrandById(brandData.trendyolBrandId);
                        setBrand(trendyolBrandData);
                    }
                }
            } catch (error) {
                setError('Failed to fetch data');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [categoryId, brandId]);

    const formik = useFormik({
        initialValues: {
            isEnabled: false,
            trendyolBrandId: '',
            trendyolCategoryId: '',
            shipmentAddressId: '',
            returningAddressId: '',
            listPrice: productData.marketPrice || '',
            salePrice: productData.salePrice || '',
            vatRate: '',
            cargoCompanyId: '',
            deliveryDuration: '',
            fastDeliveryType: '',
            trendyolAttributes: {},
        },
        validationSchema,
        onSubmit: (values) => {
            onSave(values);
        },
        enableReinitialize: true,
    });

    useEffect(() => {
        if (category?.trendyolAttributes) {
            console.log("trendyolAttributes:", category.trendyolAttributes);

            const attributeInitialValues = {};
            category.trendyolAttributes.forEach(attr => {
                attributeInitialValues[attr.attributeId] = attr.value || '';
            });

            formik.setValues({ ...formik.values, trendyolAttributes: attributeInitialValues });
        }
    }, [category]);

    useEffect(() => {
        const getAddresses = async () => {
            try {
                const addresses = await getTrendyolAddresses();
                // Tekrarlanan adresleri filtrelemek için Set kullanıyoruz
                const uniqueShipmentAddresses = [...new Set(addresses.filter(addr => addr.shipmentAddress).map(JSON.stringify))].map(JSON.parse);
                const uniqueReturningAddresses = [...new Set(addresses.filter(addr => addr.returningAddress).map(JSON.stringify))].map(JSON.parse);
                setShipmentAddresses(uniqueShipmentAddresses);
                setReturningAddresses(uniqueReturningAddresses);
            } catch (error) {
                console.error('Error getting Trendyol addresses:', error);
                setError('Failed to get Trendyol addresses');
            }
        };

        getAddresses();
    }, []);

    const renderAttributeInput = (attribute) => {
        const { attributeId, name, allowCustom, attributeValues } = attribute;
        const fieldName = `trendyolAttributes.${attributeId}`;

        if (attributeValues && attributeValues.length > 0) {
            return (
                <Select
                    onValueChange={(value) => formik.setFieldValue(fieldName, value)}
                    value={formik.values.trendyolAttributes[attributeId] || ''}
                >
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={`Select ${name}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {attributeValues.map((value) => (
                            <SelectItem key={value.id} value={value.id.toString()}>
                                {value.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        } else if (allowCustom) {
            return (
                <Input
                    id={fieldName}
                    {...formik.getFieldProps(fieldName)}
                    className="col-span-3"
                    placeholder={`Enter ${name}`}
                />
            );
        }

        return null;
    };

    const SelectableCard = ({ address, isSelected, onSelect }) => (
        <Card
            className={`cursor-pointer ${isSelected ? 'border-primary' : ''} flex flex-col p-4 h-24 overflow-hidden`}
            onClick={() => onSelect(address.id)}
        >
            <CardContent className="flex-1 p-0">
                <p className="font-medium text-sm line-clamp-2">{address.fullAddress}</p>
                <p className="text-xs text-muted-foreground mt-1">{address.city}, {address.district}</p>
            </CardContent>
        </Card>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Trendyol Product Integration</DialogTitle>
                </DialogHeader>
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <form onSubmit={formik.handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="trendyol-integration"
                                    checked={formik.values.isEnabled}
                                    onCheckedChange={(checked) => formik.setFieldValue('isEnabled', checked)}
                                />
                                <Label htmlFor="trendyol-integration">Enable Trendyol Integration</Label>
                            </div>

                            {formik.values.isEnabled && (
                                <>
                                    {!category?.trendyolCategoryId && (
                                        <Alert variant="warning">
                                            <AlertTitle>Warning</AlertTitle>
                                            <AlertDescription>No Trendyol category mapping found. Please map the category in Category management.</AlertDescription>
                                        </Alert>
                                    )}
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="trendyolBrandId" className="text-right">Trendyol Brand</Label>
                                        <Input
                                            id="trendyolBrandId"
                                            value={brand?.name || 'Not matched'}
                                            disabled
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="trendyolCategoryId" className="text-right">Trendyol Category</Label>
                                        <Input
                                            id="trendyolCategoryId"
                                            value={category ? `${category.trendyolCategoryName}` : 'Not matched'}
                                            disabled
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Shipment Address</Label>
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                {shipmentAddresses.map((address) => (
                                                    <SelectableCard
                                                        key={address.id}
                                                        address={address}
                                                        isSelected={formik.values.shipmentAddressId === address.id.toString()}
                                                        onSelect={(id) => formik.setFieldValue('shipmentAddressId', id.toString())}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Returning Address</Label>
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                {returningAddresses.map((address) => (
                                                    <SelectableCard
                                                        key={address.id}
                                                        address={address}
                                                        isSelected={formik.values.returningAddressId === address.id.toString()}
                                                        onSelect={(id) => formik.setFieldValue('returningAddressId', id.toString())}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="listPrice">Trendyol List Price</Label>
                                            <Input
                                                id="listPrice"
                                                type="number"
                                                {...formik.getFieldProps('listPrice')}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="salePrice">Trendyol Sale Price</Label>
                                            <Input
                                                id="salePrice"
                                                type="number"
                                                {...formik.getFieldProps('salePrice')}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="vatRate">VAT Rate</Label>
                                            <Input
                                                id="vatRate"
                                                type="number"
                                                {...formik.getFieldProps('vatRate')}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="cargoCompanyId" className="text-right">Cargo Company</Label>
                                        <Select
                                            onValueChange={(value) => formik.setFieldValue('cargoCompanyId', value)}
                                            value={formik.values.cargoCompanyId}
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select cargo company" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cargoCompanies.map((company) => (
                                                    <SelectItem key={company.id} value={company.id.toString()}>
                                                        {company.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="deliveryDuration">Delivery Duration</Label>
                                            <Input
                                                id="deliveryDuration"
                                                type="number"
                                                {...formik.getFieldProps('deliveryDuration')}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="fastDeliveryType">Fast Delivery Type</Label>
                                            <Select
                                                onValueChange={(value) => formik.setFieldValue('fastDeliveryType', value)}
                                                value={formik.values.fastDeliveryType}
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

                                    {category?.trendyolAttributes && category.trendyolAttributes.length > 0 && (
                                        <>
                                            <h3 className="text-lg font-semibold">Category Attributes</h3>
                                            {category.trendyolAttributes.map((attribute) => (
                                                <div key={attribute.attributeId} className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor={`trendyolAttributes.${attribute.attributeId}`} className="text-right">
                                                        {attribute.name}
                                                    </Label>
                                                    {renderAttributeInput(attribute)}
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit">Submit</Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ProductTrendyol;