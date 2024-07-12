import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  Home,
  ShoppingCart,
  Boxes,
  Tags,
  Users,
  Store,
  List,
  DollarSign,
  Layers,
  Package,
  Calculator,
  LogOut,
  Calendar, // Yeni eklenen ikon
  CheckSquare // Yeni eklenen ikon
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const MenuItem = ({ href, icon: Icon, children }) => (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start",
        location.pathname === href && "bg-muted font-bold"
      )}
      asChild
    >
      <Link to={href}>
        <Icon className="mr-2 h-4 w-4" />
        {children}
      </Link>
    </Button>
  );

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-[60px] items-center border-b px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span>Stockie by Milenay</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          <MenuItem href="/" icon={Home}>Dashboard</MenuItem>
          <MenuItem href="/orders" icon={ShoppingCart}>Orders</MenuItem>
          <div className="py-2">
            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">Products</h4>
            <MenuItem href="/products" icon={List}>Product List</MenuItem>
            <MenuItem href="/categories" icon={Boxes}>Categories</MenuItem>
            <MenuItem href="/variants" icon={Layers}>Variants</MenuItem>
            <MenuItem href="/brands" icon={Store}>Brands</MenuItem>
            <MenuItem href="/taxes" icon={DollarSign}>Taxes</MenuItem>
            <MenuItem href="/tags" icon={Tags}>Tags</MenuItem>
          </div>
          <MenuItem href="/customers" icon={Users}>Customers</MenuItem>
          <MenuItem href="/suppliers" icon={Store}>Suppliers</MenuItem>
          <MenuItem href="/profit-calculator" icon={Calculator}>Profit Calculator</MenuItem>
          <MenuItem href="/calendar" icon={Calendar}>Calendar</MenuItem> {/* Yeni eklenen satır */}
          <MenuItem href="/todo" icon={CheckSquare}>Todo List</MenuItem> {/* Yeni eklenen satır */}
          <div className="py-2">
            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">Settings</h4>
            <MenuItem href="/integrations" icon={Layers}>Integrations</MenuItem>
          </div>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button variant="outline" className="w-full justify-start" onClick={() => {/* Add sign out logic here */}}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;