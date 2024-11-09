"use client";

import { AddedItem } from "@/components/forms/add-order-form";
import TableActions from "@/components/TableActions";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<AddedItem>[] = [
  {
    accessorKey: "sku.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Qty
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
  },
  {
    accessorKey: "sku.unitPrice",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Unit Price
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
  },
  {
    cell: ({ row }) => (
      <TableActions id={row.original.sku.id} modalType="orderItem" />
    ),
    header: "Actions",
    id: "actions",
  },
];
