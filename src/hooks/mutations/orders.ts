import { orderSchema } from "@/schemas/orderSchema";
import { createPurchaseOrder, updatePurchaseOrder } from "@/services/order";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export const useCreatePurchaseOrder = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: ({
      data,
      purchaseItems,
    }: {
      data: z.infer<typeof orderSchema>;
      purchaseItems: { skuId: string; quantity: number; unitPrice: number }[];
    }) => createPurchaseOrder(data, purchaseItems),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Purchase Order Created");
        router.push("/orders");
        router.refresh();
      }
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
};
export const useUpdatePurchaseOrder = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: ({
      id,
      data,
      purchaseItems,
    }: {
      id: string;
      data: z.infer<typeof orderSchema>;
      purchaseItems: { skuId: string; quantity: number; unitPrice: number }[];
    }) => updatePurchaseOrder(id, data, purchaseItems),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Purchase Order Updated");
        router.push("/orders");
        router.refresh();
      }
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
};
