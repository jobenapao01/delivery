import { Customer, PurchaseItems, PurchaseOrder } from "@prisma/client";

export interface PurchaseOrderWithCustomer {
  id: string; // Adjust the type based on your schema
  customerId: string; // Adjust the type based on your schema
  // Add other fields from your PurchaseOrder model
  customer: Customer; // Include the customer relation
  deliveryDate: Date;
  status: string;
}

export type PurchaseOrderWithItems = PurchaseOrder & {
  purchaseItems: PurchaseItems[];
};

export interface SKU {
  name: string;
  id: string;
  unitPrice: number;
}

export interface OrderItem {
  quantity: number;
  sku: SKU;
}

export interface ExistingOrder {
  customerId: string;
  deliveryDate: Date;
  status: string;
  amountDue: number;
  items: OrderItem[];
}
