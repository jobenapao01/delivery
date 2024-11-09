import { getSku } from "@/services/sku";
import { useQuery } from "@tanstack/react-query";

export const useGetSku = (id: string) => {
  return useQuery({
    queryKey: ["sku", id],
    queryFn: () => getSku(id),
  });
};
