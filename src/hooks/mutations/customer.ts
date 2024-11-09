import { customerSchema } from "@/schemas/customerSchema";
import { createCustomer, updateCustomer } from "@/services/customer";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { boolean, z } from "zod";

export const useCreateCustomer = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Customer created successfully.");
        router.refresh();
      } else {
        toast.error("Something went wrong.");
      }
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = new QueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: z.infer<typeof customerSchema>;
    }) => updateCustomer(id, data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Customer updated successfully.");
        router.refresh();
        queryClient.invalidateQueries({
          queryKey: ["customer"],
        });
      } else {
        toast.error("Something went wrong.");
      }
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });
};
