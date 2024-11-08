import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import "react-international-phone/style.css";

import { Switch } from "../ui/switch";

import { skuSchema } from "@/schemas/skuSchema";
import ImageUpload from "../ImageUpload";
import { useCreateSku } from "@/hooks/mutations/sku";
import { useOpenSkuModal } from "@/hooks/use-open-sku-modal";

const AddCustomerForm = () => {
  const { mutate: createSku } = useCreateSku();
  const { onClose } = useOpenSkuModal();

  const form = useForm<z.infer<typeof skuSchema>>({
    resolver: zodResolver(skuSchema),
    defaultValues: {
      name: "",
      code: "",
      imageUrl: "",
      unitPrice: 0,
      isActive: true,
    },
  });

  const handleSuccess = () => {
    form.reset();
    onClose();
  };

  const handleError = () => {
    form.reset();
    onClose();
  };

  const isFormValid = form.formState.isValid;

  const onSubmit = (values: z.infer<typeof skuSchema>) => {
    createSku(values, {
      onSuccess: handleSuccess,
      onError: handleError,
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="Code" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unitPrice"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Unit Price</FormLabel>
              <FormControl>
                <Input
                  placeholder="Unit Price"
                  type="number"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageUpload
                  onUploadComplete={(url: string) => field.onChange(url)}
                  initialUrl=""
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center p-4 border rounded-lg gap-x-4">
              <div className="flex flex-col">
                <FormLabel>isActive</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked: boolean) =>
                    field.onChange(checked)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={!isFormValid}>
          Create
        </Button>
      </form>
    </Form>
  );
};

export default AddCustomerForm;
