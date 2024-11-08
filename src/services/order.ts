"use server";

import prisma from "@/lib/prisma";
import { orderSchema } from "@/schemas/orderSchema";
import { z } from "zod";

export async function getOrders() {
  try {
    const response = await prisma.purchaseOrder.findMany({
      include: {
        customer: true,
      },
      orderBy: {
        deliveryDate: "asc",
      },
    });

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error };
  }
}

export async function getOrder(id: string) {
  try {
    const response = await prisma.purchaseOrder.findFirst({
      where: {
        id,
      },
      include: {
        purchaseItems: true,
      },
    });

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error };
  }
}

export async function createPurchaseOrder(
  data: z.infer<typeof orderSchema>,
  purchaseItems: { skuId: string; quantity: number; unitPrice: number }[]
) {
  try {
    const response = await prisma.purchaseOrder.create({
      data: {
        ...data,
        dateCreated: new Date(),
        purchaseItems: {
          create: purchaseItems.map((item) => ({
            skuId: item.skuId, // Assuming you have a skuId field in your purchaseItem model
            quantity: item.quantity,
            price: item.unitPrice,
          })),
        },
      },
    });

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error };
  }
}

export async function updatePurchaseOrder(
  id: string,
  data: z.infer<typeof orderSchema>,
  purchaseItems: { skuId: string; quantity: number; unitPrice: number }[]
) {
  try {
    const response = await prisma.purchaseOrder.update({
      where: {
        id,
      },
      data: {
        ...data,
        dateCreated: new Date(),
        purchaseItems: {
          create: purchaseItems.map((item) => ({
            skuId: item.skuId, // Assuming you have a skuId field in your purchaseItem model
            quantity: item.quantity,
            price: item.unitPrice,
          })),
        },
      },
    });

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error };
  }
}
