"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DatePicker } from "./date-picker";
import { Button } from "./button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";

// Example validation schema
const formSchema = z.object({
  birthDate: z.date({
    error: "Birth date is required",
  }).refine((date) => {
    // Must be at least 18 years old
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    return date <= eighteenYearsAgo;
  }, {
    message: "You must be at least 18 years old",
  }),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}).refine((data) => {
  // Ensure end date is after start date
  if (data.startDate && data.endDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type FormValues = z.infer<typeof formSchema>;

export function DatePickerExample() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthDate: undefined,
      startDate: undefined,
      endDate: undefined,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    alert(`Form submitted successfully!\n\nBirth Date: ${data.birthDate?.toLocaleDateString()}\nStart Date: ${data.startDate?.toLocaleDateString() || "N/A"}\nEnd Date: ${data.endDate?.toLocaleDateString() || "N/A"}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">DatePicker Component Example</h1>
        <p className="text-gray-600 dark:text-gray-400">
          This example demonstrates how to use the DatePicker component with React Hook Form and Zod validation.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Required Date Field with Validation */}
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Birth Date <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="YYYY-MM-DD"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Optional Start Date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date (Optional)</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="YYYY-MM-DD"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Optional End Date */}
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date (Optional)</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="YYYY-MM-DD"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>

      {/* Usage Examples */}
      <div className="border-t pt-6 space-y-4">
        <h2 className="text-xl font-semibold">Standalone Usage Examples</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Basic DatePicker</h3>
            <DatePicker
              label="Select a date"
              placeholder="YYYY-MM-DD"
              onChange={(date) => console.log("Selected date:", date)}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Disabled DatePicker</h3>
            <DatePicker
              label="Disabled"
              placeholder="YYYY-MM-DD"
              disabled
              value={new Date()}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">DatePicker with Error</h3>
            <DatePicker
              label="With Error"
              placeholder="YYYY-MM-DD"
              error="This field is required"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
