"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { customerSchema } from "@/schemas/customerSchema";

export async function createCustomer(data: z.infer<typeof customerSchema>) {
  try {
    const response = await prisma.customer.create({
      data: {
        ...data,
        fullName: `${data.firstName} ${data.lastName}`,
        dateCreated: new Date(),
      },
    });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: "Failed to create customer" };
  }
}

export async function updateCustomer(
  id: string,
  data: z.infer<typeof customerSchema>
) {
  try {
    const response = await prisma.customer.update({
      where: {
        id,
      },
      data: {
        ...data,
        fullName: `${data.firstName} ${data.lastName}`,
        dateCreated: new Date(),
      },
    });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: "Failed to create customer" };
  }
}

export async function getCustomers() {
  try {
    const data = await prisma.customer.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        fullName: "asc",
      },
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function getCustomer(id: string) {
  try {
    const data = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error };
  }
}
