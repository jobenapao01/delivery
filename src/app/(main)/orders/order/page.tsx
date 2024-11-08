import AddOrderForm from "@/components/forms/add-order-form";
import { getCustomers } from "@/services/customer";
import { getSkus } from "@/services/sku";

const OrderPage = async () => {
  const [customersResponse, skusResponse] = await Promise.all([
    getCustomers(),
    getSkus(),
  ]);
  const { data: customers = [] } = customersResponse;
  const { data: skus = [] } = skusResponse;
  return (
    <div className="min-w-full space-y-4">
      <AddOrderForm customers={customers} />
    </div>
  );
};

export default OrderPage;
