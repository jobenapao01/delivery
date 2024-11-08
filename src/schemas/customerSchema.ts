import { z } from "zod";

export const customerSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "Firstname must atleast be 3 characters." }),
  lastName: z
    .string()
    .min(3, { message: "Lastname must atleast be 3 characters." }),
  mobileNumber: z
    .string()
    .min(10, { message: "Please input a valid mobile number." }),
  city: z
    .string()
    .min(5, { message: "Lastname must atleast be 5 characters." }),
  isActive: z.boolean().optional().default(true),
});
