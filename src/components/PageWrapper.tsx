"use client";

import React, { use } from "react";
import { Button } from "./ui/button";
import { useOpenModal } from "@/hooks/use-open-modal";
import { useOpenSkuModal } from "@/hooks/use-open-sku-modal";
import { useOpenOrderModal } from "@/hooks/use-open-order-modal";
import { useRouter } from "next/navigation";

type PageWrapperType = {
  headerText: string;
  buttonText: string;
  modalType: "customer" | "sku" | "order";
};

const PageWrapper = ({
  buttonText,
  headerText,
  modalType,
}: PageWrapperType) => {
  const { onOpen: openCustomer } = useOpenModal();
  const { onOpen: openSku } = useOpenSkuModal();
  const { onOpen: openOrder } = useOpenOrderModal();
  const router = useRouter();

  const handleClick = (type: string) => {
    if (type === "customer") {
      openCustomer();
    }

    if (type === "sku") {
      openSku();
    }
    if (type === "order") {
      router.push("/orders/order");
    }
  };

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-slate-700 font-semibold">{headerText}</span>
      <Button
        className="p-4 hover:cursor-pointer"
        onClick={() => handleClick(modalType)}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default PageWrapper;
