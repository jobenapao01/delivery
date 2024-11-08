import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/data/data-table/customers/columns";

import PageWrapper from "@/components/PageWrapper";
import { getCustomers } from "@/services/customer";

const CustomerPage = async () => {
  const { data: customers = [] } = await getCustomers();

  return (
    <div className="min-w-full space-y-4">
      <PageWrapper
        headerText="Customers List"
        buttonText="Add new customer"
        modalType="customer"
      />

      <DataTable columns={columns} data={customers} />
    </div>
  );
};

export default CustomerPage;
