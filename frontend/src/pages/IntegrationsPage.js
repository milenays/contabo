import React, { useState, useEffect, useCallback } from 'react';
import { getIntegrations, saveIntegration, fetchTrendyolProducts, deleteIntegration, updateIntegrationStatus } from '../api/integrationApi';
import { fetchTyBrands, fetchTyCategories, fetchTyCategoryAttributes, fetchTrendyolAddresses } from '../api/trendyolApi';
import { Button } from "../components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet"
import { useToast } from "../components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Switch } from "../components/ui/switch"
import { PlusIcon, Pencil, Trash2, RefreshCw, TagIcon, FolderIcon, ListIcon, TruckIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"

const IntegrationsPage = () => {
  const [integrations, setIntegrations] = useState([]);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchIntegrations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getIntegrations();
      setIntegrations(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch integrations",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchIntegrations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setSelectedIntegration(null);
    setSheetOpen(true);
  };

  const handleEdit = (integration) => {
    setSelectedIntegration(integration);
    setSheetOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteIntegration(id);
      toast({
        title: "Success",
        description: "Integration deleted successfully",
      });
      fetchIntegrations();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete integration",
      });
    }
  };

  const handleFetchProducts = async (integrationId) => {
    setLoading(true);
    try {
      await fetchTrendyolProducts(integrationId);
      toast({
        title: "Success",
        description: "Products fetched successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch products",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchBrands = async () => {
    try {
      await fetchTyBrands();
      toast({
        title: "Success",
        description: "Trendyol brands fetched successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch Trendyol brands",
      });
    }
  };

  const handleFetchCategories = async () => {
    try {
      await fetchTyCategories();
      toast({
        title: "Success",
        description: "Trendyol categories fetched successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch Trendyol categories",
      });
    }
  };

  const handleFetchCategoryAttributes = async () => {
    try {
      await fetchTyCategoryAttributes();
      toast({
        title: "Success",
        description: "Trendyol category attributes fetched successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch Trendyol category attributes",
      });
    }
  };

  const handleFetchAddresses = async () => {
    try {
      await fetchTrendyolAddresses();
      toast({
        title: "Success",
        description: "Trendyol addresses fetched and saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch Trendyol addresses",
      });
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      await saveIntegration({
        ...values,
        id: selectedIntegration?._id,
      });
      setSheetOpen(false);
      toast({
        title: "Success",
        description: `Integration ${selectedIntegration ? 'updated' : 'added'} successfully`,
      });
      fetchIntegrations(); // Listeyi güncelle
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${selectedIntegration ? 'update' : 'add'} integration`,
      });
    }
  };

  const handleToggleStatus = async (integrationId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateIntegrationStatus(integrationId, newStatus);
      toast({
        title: "Success",
        description: `Integration status updated to ${newStatus}`,
      });
      fetchIntegrations(); // Listeyi güncelle
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update integration status",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Integrations</h2>
        <Button onClick={handleAdd}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Integration
        </Button>
      </div>
      <div className="mb-6 space-x-4">
        <Button onClick={handleFetchBrands}>
          <TagIcon className="mr-2 h-4 w-4" /> Fetch Brands
        </Button>
        <Button onClick={handleFetchCategories}>
          <FolderIcon className="mr-2 h-4 w-4" /> Fetch Categories
        </Button>
        <Button onClick={handleFetchCategoryAttributes}>
          <ListIcon className="mr-2 h-4 w-4" /> Fetch Category Attributes
        </Button>
        <Button onClick={handleFetchAddresses}>
          <TruckIcon className="mr-2 h-4 w-4" /> Fetch Addresses
        </Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => (
            <Card key={integration._id}>
              <CardHeader>
                <CardTitle>{integration.name}</CardTitle>
                <CardDescription>{integration.platform}</CardDescription>
              </CardHeader>
              <CardContent>
                <p><strong>Seller ID:</strong> {integration.sellerId}</p>
                <div className="mt-2">
                  <Label htmlFor={`status-${integration._id}`}>Status</Label>
                  <Switch
                    id={`status-${integration._id}`}
                    checked={integration.status === 'active'}
                    onCheckedChange={() => handleToggleStatus(integration._id, integration.status)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => handleEdit(integration)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="outline" onClick={() => handleFetchProducts(integration._id)}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Fetch Products
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the integration.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(integration._id)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedIntegration ? 'Edit Integration' : 'Add Integration'}</SheetTitle>
          </SheetHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const values = Object.fromEntries(formData.entries());
            handleFormSubmit(values);
          }} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select name="platform" defaultValue={selectedIntegration?.platform || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Trendyol">Trendyol</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="name">Integration Name</Label>
              <Input id="name" name="name" defaultValue={selectedIntegration?.name || ''} />
            </div>
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input id="apiKey" name="apiKey" defaultValue={selectedIntegration?.apiKey || ''} />
            </div>
            <div>
              <Label htmlFor="apiSecret">API Secret</Label>
              <Input id="apiSecret" name="apiSecret" type="password" defaultValue={selectedIntegration?.apiSecret || ''} />
            </div>
            <div>
              <Label htmlFor="sellerId">Seller ID</Label>
              <Input id="sellerId" name="sellerId" defaultValue={selectedIntegration?.sellerId || ''} />
            </div>
            <Button type="submit">Save</Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default IntegrationsPage;