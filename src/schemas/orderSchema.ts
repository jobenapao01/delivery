import { Status } from "@prisma/client";
import { z } from "zod";

export const orderItemsSchema = z.object({
  sku: z.object({
    id: z.string(),
    name: z.string(),
    unitPrice: z.number(),
  }),
  quantity: z.number().min(1),
});

export type OrderItem = z.infer<typeof orderItemsSchema>;

export const orderSchema = z.object({
  customerId: z
    .string()
    .min(3, { message: "Customer Name should atleast be 3 characters." }),
  deliveryDate: z.date().min(new Date(Date.now() + 24 * 60 * 60 * 1000), {
    message: "Delivery Date must atleast be 1 day ahead.",
  }),
  amountDue: z.number().min(0),
  status: z.enum([Status.NEW, Status.COMPLETED, Status.CANCELLED]),
});
