"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";

import { useOpenModal } from "@/hooks/use-open-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOpenSkuModal } from "@/hooks/use-open-sku-modal";
import { useOpenOrderModal } from "@/hooks/use-open-order-modal";
import { useItemModal } from "@/hooks/use-item-modal";
import { useRouter } from "next/navigation";

type TableActionsProps = {
  id: string;
  modalType: "customer" | "sku" | "order" | "orderItem";
};

const TableActions = ({ id, modalType }: TableActionsProps) => {
  const { onOpen: openCustomer } = useOpenModal();
  const { onOpen: openSku } = useOpenSkuModal();
  const { onOpen: openOrder } = useOpenOrderModal();
  const { onOpen: openOrderItem } = useItemModal();
  const router = useRouter();

  //const { onOpen: onOpenDelete } = useDeleteModal();
  const handleClick = (id: string, type: string) => {
    if (type === "customer") {
      openCustomer(id);
    }
    if (type === "sku") {
      openSku(id);
    }
    if (type === "order") {
      router.push(`/orders/order/${id}`);
    }
    if (type === "orderItem") {
      openOrderItem(id);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="p-0 size-8" variant="ghost">
          <span className="sr-only">open menu</span>
          <MoreHorizontal className="text-black size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleClick(id, modalType)}>
          <Edit className="mr-2 size-4" />
          Edit
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => onOpenDelete(id)}>
          <div className="flex text-rose-500 hover:text-rose-600">
            <Trash className="mr-2 size-4" />
            Delete
          </div>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableActions;
