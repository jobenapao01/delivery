import { z } from "zod";

export const skuSchema = z.object({
  name: z.string().min(3, { message: "Name should atleast be 3 characters." }),
  code: z.string().min(3, { message: "Code should atleast be 3 characters." }),
  imageUrl: z.string().min(3, { message: "Image is required." }),
  unitPrice: z
    .number()
    .min(0, { message: "Unit Price should be a positive number" }),
  isActive: z.boolean().optional().default(true),
});
