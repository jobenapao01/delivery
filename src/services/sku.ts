"use server";

import prisma from "@/lib/prisma";
import { skuSchema } from "@/schemas/skuSchema";
import { z } from "zod";

export async function getSkus() {
  try {
    const data = await prisma.sKU.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function getSku(id: string) {
  try {
    const data = await prisma.sKU.findFirst({
      where: {
        id,
      },
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function createSku(data: z.infer<typeof skuSchema>) {
  try {
    const response = await prisma.sKU.create({
      data: {
        ...data,
        dateCreated: new Date(),
        imageUrl: Array.isArray(data.imageUrl)
          ? data.imageUrl
          : [data.imageUrl],
      },
    });

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error };
  }
}

export async function updateSku(id: string, data: z.infer<typeof skuSchema>) {
  try {
    const updateData: any = {};

    // Only include fields that are provided in the data object
    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.code !== undefined) {
      updateData.code = data.code;
    }
    if (data.imageUrl !== undefined) {
      updateData.imageUrl = Array.isArray(data.imageUrl)
        ? data.imageUrl
        : [data.imageUrl];
    }
    if (data.unitPrice !== undefined) {
      updateData.unitPrice = data.unitPrice;
    }
    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }
    const response = await prisma.sKU.update({
      where: {
        id,
      },
      data: {
        ...updateData,
        dateCreated: new Date(),
      },
    });

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error };
  }
}
