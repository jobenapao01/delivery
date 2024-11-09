import PageWrapper from "@/components/PageWrapper";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/data/data-table/sku/columns";
import { getSkus } from "@/services/sku";
import React from "react";

const SkuPage = async () => {
  const { data: skus = [] } = await getSkus();

  return (
    <div className="min-w-full space-y-4">
      <PageWrapper
        headerText="Stock List"
        buttonText="Add new stock"
        modalType="sku"
      />

      <DataTable columns={columns} data={skus} />
    </div>
  );
};
export default SkuPage;
