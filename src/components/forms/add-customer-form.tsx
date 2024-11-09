import { customerSchema } from "@/schemas/customerSchema";
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
import { PhoneInput } from "react-international-phone";
import { Switch } from "../ui/switch";
import { checkIfIsValidPhoneNumber } from "@/lib/utils";
import { useCreateCustomer } from "@/hooks/mutations/customer";
import { useOpenModal } from "@/hooks/use-open-modal";

const AddCustomerForm = () => {
  const { mutate: createCustomer } = useCreateCustomer();
  const { onClose } = useOpenModal();

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      mobileNumber: "",
      city: "",
      isActive: true,
    },
  });

  const isPhoneValid = checkIfIsValidPhoneNumber(form.watch("mobileNumber"));
  const isFormValid = form.formState.isValid && isPhoneValid;

  const handleSuccess = () => {
    form.reset();
    onClose();
  };

  const handleError = () => {
    form.reset();
    onClose();
  };

  const onSubmit = (values: z.infer<typeof customerSchema>) => {
    const mobileNumberWithoutPrefix = values.mobileNumber.replace(
      /^(\+63)/,
      ""
    );
    createCustomer(
      {
        ...values,
        mobileNumber: mobileNumberWithoutPrefix,
      },
      {
        onSuccess: handleSuccess,
        onError: handleError,
      }
    );
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Firstname" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Lastname" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <PhoneInput
                  disableDialCodeAndPrefix
                  showDisabledDialCodeAndPrefix
                  defaultCountry="ph"
                  value={field.value}
                  onChange={(value, data) => {
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
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
