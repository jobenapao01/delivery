"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { OrderItem, orderSchema } from "@/schemas/orderSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Customer, SKU } from "@prisma/client";
import { useEffect, useState } from "react";
import { useItemModal } from "@/hooks/use-item-modal";
import AddItemModal from "../modals/sku/add-item-modal";
import { getSkus } from "@/services/sku";
import { DataTable } from "../ui/data-table";
import { columns } from "@/data/data-table/orderList/columns";

import { useUpdatePurchaseOrder } from "@/hooks/mutations/orders"; // Assuming you have a hook for updating orders
import { usePathname, useSearchParams } from "next/navigation";

export type AddedItem = OrderItem;

type EditOrderFormProps = {
  customers: Customer[];
  existingOrder: {
    customerId: string;
    deliveryDate: Date;
    status: string;
    amountDue: number;
    items: AddedItem[];
  };
  id: string;
};

const EditOrderForm = ({
  customers,
  existingOrder,
  id,
}: EditOrderFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addedItems, setAddedItems] = useState<AddedItem[]>(
    existingOrder.items
  );
  const [skus, setSkus] = useState<SKU[]>([]);

  //   const [selectedItem, setSelectedItem] = useState<
  //     | {
  //         sku: SKU;
  //         quantity: number;
  //       }
  //     | undefined
  //   >(undefined);

  //   const [items, setItems] = useState<{ sku: SKU; quantity: number }[]>([]);

  const { onOpen, isOpen, onClose } = useItemModal();

  const { mutate: updatePurchaseOrder } = useUpdatePurchaseOrder();

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerId: existingOrder.customerId,
      deliveryDate: existingOrder.deliveryDate,
      status: existingOrder.status as "NEW" | "COMPLETED" | "CANCELLED",
      amountDue: existingOrder.amountDue,
    },
  });

  useEffect(() => {
    const fetchSkus = async () => {
      const { data: fetchedSkus = [] } = await getSkus(); // Fetch SKUs from the database
      setSkus(fetchedSkus);
    };

    fetchSkus();
  }, []);

  useEffect(() => {
    // Initialize addedItems with existingOrder.items, merging quantities if necessary
    const initializeAddedItems = () => {
      const itemMap: Record<string, AddedItem> = {};

      existingOrder.items.forEach((item) => {
        if (itemMap[item.sku.id]) {
          itemMap[item.sku.id].quantity += item.quantity; // Merge quantities
        } else {
          itemMap[item.sku.id] = { ...item }; // Add new item
        }
      });

      setAddedItems(Object.values(itemMap)); // Set the state with merged items
    };

    initializeAddedItems();
  }, [existingOrder.items]);

  //   const handleEditItem = (item: { sku: SKU; quantity: number }) => {
  //     setSelectedItem(item);
  //     onOpen();
  //   };

  const onSubmit = async (values: z.infer<typeof orderSchema>) => {
    const orderItemsDetails = addedItems.map((item) => ({
      skuId: item.sku.id,
      quantity: item.quantity,
      unitPrice: item.sku.unitPrice,
    }));

    updatePurchaseOrder({
      id,
      data: values,
      purchaseItems: orderItemsDetails,
    });
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isFormValid = form.formState.isValid && addedItems.length;

  const handleAddItem = (item: AddedItem) => {
    setAddedItems((prev) => {
      const existingItem = prev.find(
        (addedItem) => addedItem.sku.id === item.sku.id
      );
      if (existingItem) {
        return prev.map((addedItem) =>
          addedItem.sku.id === item.sku.id
            ? { ...addedItem, quantity: addedItem.quantity + item.quantity }
            : addedItem
        );
      } else {
        return [...prev, item];
      }
    });
  };

  //   const handleAddItem = (item: { sku: SKU; quantity: number }) => {
  //     if (selectedItem) {
  //       // Update the existing item
  //       const updatedItems = items.map((existingItem) =>
  //         existingItem.sku.id === item.sku.id ? item : existingItem
  //       );
  //       setItems(updatedItems);
  //     } else {
  //       // Add a new item
  //       setItems([...items, item]);
  //     }
  //     setSelectedItem(undefined); // Reset selected item
  //     onClose();
  //   };

  const totalAmount = addedItems.reduce((total, item) => {
    return total + item.sku.unitPrice * item.quantity;
  }, 0);

  useEffect(() => {
    form.setValue("amountDue", totalAmount);
  }, [totalAmount, form]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">
                          {customers.find(
                            (customer) => customer.id === field.value
                          )?.fullName || "Select Customer"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <div className="p-2">
                          <Input
                            type="text"
                            placeholder="Search Customer"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border rounded"
                            onFocus={() => setSearchTerm(searchTerm)}
                          />
                        </div>
                        {filteredCustomers.map((customer) => (
                          <DropdownMenuItem
                            key={customer.id}
                            onClick={() => {
                              field.onChange(customer.id);
                              setSearchTerm("");
                            }}
                          >
                            {customer.fullName}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          {field.value || "Select Status"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => field.onChange("NEW")}>
                          NEW
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => field.onChange("COMPLETED")}
                        >
                          COMPLETED
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => field.onChange("CANCELLED")}
                        >
                          CANCELLED
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <Button
              onClick={() => {
                onOpen();
              }}
              type="button"
            >
              Add item
            </Button>
          </div>

          <AddItemModal
            isOpen={isOpen}
            onClose={onClose}
            skus={skus}
            onAddItem={handleAddItem}
          />

          <div className="flex flex-col w-full">
            <DataTable columns={columns} data={addedItems} />

            <div className="flex items-center justify-between w-1/2">
              <h1 className="font-bold">Total Amount:</h1>
              <span className="font-bold text-2xl">
                {totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <Button type="submit" disabled={!isFormValid}>
            Update
          </Button>
        </form>
      </Form>
    </>
  );
};

export default EditOrderForm;
