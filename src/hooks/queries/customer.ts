import { getCustomer, getCustomers } from "@/services/customer";
import { useQuery } from "@tanstack/react-query";

export const useGetCustomer = (id: string) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomer(id),
    // enabled: !!id,
  });
};
