import { skuSchema } from "@/schemas/skuSchema";
import { createSku, updateSku } from "@/services/sku";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export const useCreateSku = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: createSku,

    onSuccess: (data) => {
      if (data.success) {
        toast.success("Stock created successfully");
        router.refresh();
      } else {
        toast.error("Cannot have duplicate name or code.");
      }
    },

    onError: () => {
      toast.error("Cannot have duplicate name or code.");
    },
  });
};

export const useUpdateSku = () => {
  const router = useRouter();
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: z.infer<typeof skuSchema>;
    }) => updateSku(id, data),

    onSuccess: (data) => {
      if (data?.success) {
        toast.success("Stock updated successfully");
        router.refresh();
        queryClient.invalidateQueries({
          queryKey: ["sku"],
        });
      } else {
        toast.error("Something went wrong");
      }
    },

    onError: () => {
      toast.error("Something went wrong.");
    },
  });
};
