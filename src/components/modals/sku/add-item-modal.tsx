"use client";

import AddItemForm from "@/components/forms/add-item-form";
import AddNewSkuForm from "@/components/forms/add-new-sku-form";
import EditSkuForm from "@/components/forms/edit-sku-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetSku } from "@/hooks/queries/skuu";
import { useItemModal } from "@/hooks/use-item-modal";
import { OrderItem } from "@/types/order";
import { SKU } from "@prisma/client";
import { useEffect, useState } from "react";

type AddItemModalProps = {
  onClose: () => void;
  isOpen: boolean;
  skus: SKU[];
  onAddItem: (item: { sku: SKU; quantity: number }) => void;
  editItem?: { sku: SKU; quantity: number };
};

const AddItemModal = ({
  isOpen,
  onClose,
  skus,
  onAddItem,
  editItem,
}: AddItemModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSku, setSelectedSku] = useState<SKU | undefined>(undefined);

  const { id } = useItemModal();

  // useEffect(() => {
  //   if (editItem) {
  //     setSelectedSku(editItem.sku); // Set selected SKU for editing
  //     setQuantity(editItem.quantity); // Set quantity for editing
  //     console.log("edit", selectedSku);
  //   } else {
  //     setSelectedSku(undefined); // Reset if not editing
  //     setQuantity(1); // Reset quantity
  //   }
  // }, [editItem, isOpen]);

  const handleAddItem = () => {
    if (selectedSku) {
      onAddItem({ sku: selectedSku, quantity });
      setQuantity(1);
      setSelectedSku(undefined);
      onClose();
    }
  };
  const isEdit = !!id;

  const header = isEdit ? "Edit Item" : "Add Item";
  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{header}</DialogTitle>
        </DialogHeader>
        <Select
          onValueChange={(value) =>
            setSelectedSku(skus.find((sku) => sku.id === value) || undefined)
          }
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue
              placeholder={selectedSku ? selectedSku.name : "Select an item"}
            />
          </SelectTrigger>
          <SelectContent>
            {skus.map((sku) => (
              <SelectItem key={sku.id} value={sku.id}>
                {sku.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={1}
          placeholder={quantity.toString()}
        />
        <Button onClick={handleAddItem} disabled={!selectedSku}>
          {isEdit ? "Update Item" : "Add Item"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
