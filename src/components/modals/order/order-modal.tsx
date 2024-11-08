import AddCustomerForm from "@/components/forms/add-customer-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOpenOrderModal } from "@/hooks/use-open-order-modal";
import React from "react";

const OrderModal = () => {
  const { isOpen, onClose } = useOpenOrderModal();
  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new order</DialogTitle>
        </DialogHeader>

        <AddCustomerForm />
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
