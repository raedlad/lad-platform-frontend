"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  status: "active" | "inactive" | "out_of_stock";
  image?: string;
  orders: number;
}

interface Order {
  id: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  currency: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  customerName: string;
  orderDate: string;
}

interface SupplierSectionProps {
  products: Product[];
  orders: Order[];
  className?: string;
  onAddProduct?: () => void;
  onViewProduct?: (productId: string) => void;
  onViewOrder?: (orderId: string) => void;
  onViewAllProducts?: () => void;
  onViewAllOrders?: () => void;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: currency || "SAR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getStatusColor(status: string): string {
  switch (status) {
    case "active":
    case "confirmed":
    case "delivered":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "inactive":
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "out_of_stock":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function ProductCard({ product }: { product: Product }) {
  const statusColor = getStatusColor(product.status);

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {product.category}
            </p>
          </div>
          <Badge variant="secondary" className={statusColor}>
            {product.status.replace("_", " ")}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">
              {formatCurrency(product.price, product.currency)}
            </span>
            <span className="text-xs text-muted-foreground">
              Stock: {product.stock}
            </span>
          </div>

          <div className="flex items-center text-xs text-muted-foreground">
            <ShoppingCart className="h-3 w-3 mr-1" />
            <span>{product.orders} orders</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderCard({ order }: { order: Order }) {
  const statusColor = getStatusColor(order.status);

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-sm line-clamp-1">
              {order.productName}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              by {order.customerName}
            </p>
          </div>
          <Badge variant="secondary" className={statusColor}>
            {order.status}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">
              {formatCurrency(order.totalAmount, order.currency)}
            </span>
            <span className="text-xs text-muted-foreground">
              Qty: {order.quantity}
            </span>
          </div>

          <div className="text-xs text-muted-foreground">
            {timeAgo(order.orderDate)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mock data - in real app this would come from props/store
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Cement Bags",
    category: "Construction Materials",
    price: 25,
    currency: "SAR",
    stock: 150,
    status: "active",
    orders: 12,
  },
  {
    id: "2",
    name: "Steel Reinforcement Bars",
    category: "Structural Materials",
    price: 450,
    currency: "SAR",
    stock: 0,
    status: "out_of_stock",
    orders: 8,
  },
];

const mockOrders: Order[] = [
  {
    id: "1",
    productName: "Premium Cement Bags",
    quantity: 50,
    totalAmount: 1250,
    currency: "SAR",
    status: "pending",
    customerName: "Ahmed Construction",
    orderDate: "2024-12-07T10:00:00Z",
  },
  {
    id: "2",
    productName: "Steel Reinforcement Bars",
    quantity: 10,
    totalAmount: 4500,
    currency: "SAR",
    status: "confirmed",
    customerName: "Modern Builders",
    orderDate: "2024-12-06T14:30:00Z",
  },
];

export function SupplierSection({
  products = mockProducts,
  orders = mockOrders,
  className,
  onAddProduct,
  onViewProduct,
  onViewOrder,
  onViewAllProducts,
  onViewAllOrders,
}: SupplierSectionProps) {
  const pendingOrders = orders.filter((order) => order.status === "pending");
  const outOfStockProducts = products.filter(
    (product) => product.status === "out_of_stock"
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Total Products</h3>
                <p className="text-lg font-bold text-blue-600">
                  {products.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Total Orders</h3>
                <p className="text-lg font-bold text-green-600">
                  {orders.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Pending Orders</h3>
                <p className="text-lg font-bold text-yellow-600">
                  {pendingOrders.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Revenue</h3>
                <p className="text-lg font-bold text-purple-600">
                  {formatCurrency(25000, "SAR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Out of Stock Alert */}
      {outOfStockProducts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg text-orange-900">
                Products Out of Stock
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outOfStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200 cursor-pointer hover:shadow-sm"
                  onClick={() => onViewProduct?.(product.id)}
                >
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {product.category}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-orange-100 text-orange-800 border-orange-300"
                  >
                    Out of Stock
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">My Products</CardTitle>
            <div className="flex space-x-2">
              <Button size="sm" onClick={onAddProduct}>
                <Plus className="h-4 w-4 mr-1" />
                Add Product
              </Button>
              {products.length > 4 && (
                <Button variant="outline" size="sm" onClick={onViewAllProducts}>
                  <Eye className="h-4 w-4 mr-1" />
                  View All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium mb-2">No Products Listed</h3>
                <p className="text-sm">Start by adding your first product.</p>
                <Button className="mt-4" onClick={onAddProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            {orders.length > 4 && (
              <Button variant="outline" size="sm" onClick={onViewAllOrders}>
                <Eye className="h-4 w-4 mr-1" />
                View All
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 4).map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
