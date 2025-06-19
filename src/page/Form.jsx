import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { formSchema } from "../lib/Form/FormSchema";
import { useNavigate } from "react-router-dom";

const defaultValues = {
  name: "",
  email: "",
  count: 1,
  items: [{ butter: "", bread: "" }],
  isMilkRequired: false,
};

export default function DynamicForm() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues,
  });

  const { fields, replace } = useFieldArray({
    name: "items",
    control: form.control,
  });

  const count = form.watch("count");

  useEffect(() => {
    const len = parseInt(count, 10);
    if (!isNaN(len)) {
      replace(Array(len).fill({ butter: "", bread: "" }));
    }
  }, [count, replace]);

  function onSubmit(data) {
    console.log("Form Submitted:", data);
  }

  return (
    <div className="min-h-screen bg-gray-100 mx-auto px-4 py-6">
      <div className="flex justify-end">
        <Button onClick={() => navigate("/")}>Go to Table</Button>
      </div>
      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Form</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="example@domain.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Products</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={String(field.value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select count" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(7)].map((_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Items</h3>
              {fields.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md"
                >
                  <h4 className="text-md font-medium col-span-full">
                    Day {idx + 1}
                  </h4>

                  <FormField
                    control={form.control}
                    name={`items.${idx}.butter`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Butter #{idx + 1}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Butter"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${idx}.bread`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bread #{idx + 1}</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Bread" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            {(count === 3 || count === 6) && (
              <FormField
                control={form.control}
                name="isMilkRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is Milk Required?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(val) => field.onChange(val === "yes")}
                        value={field.value ? "yes" : "no"}
                        className="flex flex-col sm:flex-row gap-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="milk-yes" />
                          <FormLabel htmlFor="milk-yes">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="milk-no" />
                          <FormLabel htmlFor="milk-no">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                onClick={() => form.reset(defaultValues)}
                className="w-full sm:w-auto"
              >
                Clear
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
