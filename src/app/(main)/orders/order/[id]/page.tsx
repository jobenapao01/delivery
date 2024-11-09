import AddOrderForm from "@/components/forms/add-order-form";
import EditOrderForm from "@/components/forms/edit-order-form";
import { getCustomers } from "@/services/customer";
import { getOrder } from "@/services/order";
import { getSku } from "@/services/sku";
import { OrderItem } from "@/types/order";
import { useParams } from "next/navigation";
import React from "react";

const OrderIdPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const [customersResponse, orderResponse] = await Promise.all([
    getCustomers(),
    getOrder(id),
  ]);
  const { data: customers = [] } = customersResponse;
  const { data: order } = orderResponse;

  const skuPromises = order
    ? order.purchaseItems.map(async (item): Promise<OrderItem> => {
        const skuResponse = await getSku(item.skuId); // Fetch SKU details
        return {
          quantity: item.quantity,
          sku: {
            name: skuResponse.data ? skuResponse.data.name : "Unknown",
            id: item.skuId,
            unitPrice: item.price,
          },
        };
      })
    : [];

  const items: OrderItem[] = await Promise.all(skuPromises);

  return (
    <div className="min-w-full space-y-4">
      <EditOrderForm
        customers={customers}
        id={id}
        existingOrder={
          order
            ? {
                customerId: order.customerId,
                deliveryDate: order.deliveryDate,
                status: order.status,
                amountDue: order.amountDue,
                items: await Promise.all(
                  order.purchaseItems.map(async (item) => {
                    const skuResponse = await getSku(item.skuId); // Fetch SKU details
                    return {
                      quantity: item.quantity,
                      sku: {
                        name: skuResponse.data
                          ? skuResponse.data.name
                          : "Unknown", // Check for null/undefined
                        id: item.skuId,
                        unitPrice: item.price,
                      },
                    };
                  })
                ),
              }
            : {
                customerId: "",
                deliveryDate: new Date(),
                status: "",
                amountDue: 0,
                items: [],
              }
        }
      />
    </div>
  );
};

export default OrderIdPage;
