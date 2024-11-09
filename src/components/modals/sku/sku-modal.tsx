"use client";

import AddNewSkuForm from "@/components/forms/add-new-sku-form";
import EditSkuForm from "@/components/forms/edit-sku-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetSku } from "@/hooks/queries/skuu";
import { useOpenSkuModal } from "@/hooks/use-open-sku-modal";
import React from "react";

const SkuModal = () => {
  const { onClose, isOpen, id } = useOpenSkuModal();
  const { data: sku } = useGetSku(id as string);
  const isEdit = !!id;
  const header = isEdit ? "Edit Stock" : "Add new stock";
  console.log(id);
  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{header}</DialogTitle>
        </DialogHeader>
        {isEdit && sku && sku.data ? (
          <EditSkuForm skuData={sku?.data} />
        ) : (
          <AddNewSkuForm />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SkuModal;
