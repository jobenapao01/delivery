"use client";

import AddCustomerForm from "@/components/forms/add-customer-form";
import EditCustomerForm from "@/components/forms/edit-customer-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetCustomer } from "@/hooks/queries/customer";

import { useOpenModal } from "@/hooks/use-open-modal";
import React from "react";

const CustomerModal = () => {
  const { isOpen, onClose, id } = useOpenModal();
  const { data: customer } = useGetCustomer(id as string);
  const isEdit = !!id;
  const header = isEdit ? "Edit customer details" : "Add new customer";
  console.log(customer);
  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{header}</DialogTitle>
        </DialogHeader>

        {isEdit && customer && customer.data ? (
          <EditCustomerForm customerData={customer.data} />
        ) : (
          <AddCustomerForm />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerModal;
