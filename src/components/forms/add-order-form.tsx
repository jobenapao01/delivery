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

import { useCreatePurchaseOrder } from "@/hooks/mutations/orders";

export type AddedItem = OrderItem;

type AddOrderFormProps = {
  customers: Customer[];
};

const AddOrderForm = ({ customers }: AddOrderFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addedItems, setAddedItems] = useState<AddedItem[]>([]);
  const [skus, setSkus] = useState<SKU[]>([]);

  const { onOpen, isOpen, onClose } = useItemModal();

  const { mutate: createPurchaseOrder } = useCreatePurchaseOrder();

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    // defaultValues: {
    //   customerId: order?.customerId || customers[0].id,
    //   deliveryDate: order?.deliveryDate || new Date(),
    //   status: order?.status || "NEW",
    //   amountDue: order?.amountDue || 0,
    // },
    defaultValues: {
      customerId: customers[0].id,
      deliveryDate: new Date(),
      status: "NEW",
      amountDue: 0,
    },
  });

  useEffect(() => {
    const fetchSkus = async () => {
      const { data: fetchedSkus = [] } = await getSkus(); // Fetch SKUs from the database
      setSkus(fetchedSkus);
    };

    fetchSkus();
  }, []);

  const onSubmit = async (values: z.infer<typeof orderSchema>) => {
    const orderItemsDetails = addedItems.map((item) => ({
      skuId: item.sku.id, // Assuming SKU has a name property
      quantity: item.quantity,
      unitPrice: item.sku.unitPrice, // Assuming unitPrice is a number
    }));

    createPurchaseOrder({
      data: values,
      purchaseItems: orderItemsDetails,
    });
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isFormValid = form.formState.isValid && addedItems.length;
  console.log(form.formState.errors);
  const handleAddItem = (item: AddedItem) => {
    setAddedItems((prev) => {
      const existingItem = prev.find(
        (addedItem) => addedItem.sku.id === item.sku.id
      );
      if (existingItem) {
        // If the item already exists, update the quantity
        return prev.map((addedItem) =>
          addedItem.sku.id === item.sku.id
            ? { ...addedItem, quantity: addedItem.quantity + item.quantity }
            : addedItem
        );
      } else {
        // If the item does not exist, add it to the list
        return [...prev, item];
      }
    });
  };

  const totalAmount = addedItems.reduce((total, item) => {
    return total + item.sku.unitPrice * item.quantity; // Assuming unitPrice is a number
  }, 0);

  useEffect(() => {
    form.setValue("amountDue", totalAmount);
  }, [totalAmount, form]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            {" "}
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
                            onFocus={() => setSearchTerm(searchTerm)} // Keep focus on input
                          />
                        </div>
                        {filteredCustomers.map((customer) => (
                          <DropdownMenuItem
                            key={customer.id}
                            onClick={() => {
                              field.onChange(customer.id);
                              setSearchTerm(""); // Clear search term on selection
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
            Create
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AddOrderForm;
