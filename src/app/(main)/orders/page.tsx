import PageWrapper from "@/components/PageWrapper";
import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { getOrders } from "@/services/order";
import { columns } from "@/data/data-table/order/columns";

const OrdersPage = async () => {
  const { data: orders = [] } = await getOrders();
  console.log(orders);

  return (
    <div className="min-w-full space-y-4">
      <PageWrapper
        headerText="Orders List"
        buttonText="Add new order"
        modalType="order"
      />

      <DataTable columns={columns} data={orders} />
    </div>
  );
};

export default OrdersPage;
