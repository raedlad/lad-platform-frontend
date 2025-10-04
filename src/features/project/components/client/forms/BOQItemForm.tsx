"use client";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  BOQItem,
  Unit,
  BOQItemFormData,
} from "@/features/project/types/project";
import { createProjectValidationSchemas } from "@/features/project/utils/validation";

interface BOQItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: BOQItemFormData) => void;
  editingItem?: BOQItem | null;
  units: Unit[];
}

const BOQItemForm: React.FC<BOQItemFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  units,
}) => {
  const t = useTranslations("project.step4.itemForm");
  const tValidation = useTranslations("");

  // Create validation schema
  const { BOQItemSchema } = createProjectValidationSchemas(tValidation);

  const form = useForm<z.infer<typeof BOQItemSchema>>({
    resolver: zodResolver(BOQItemSchema),
    defaultValues: {
      name: "",
      description: "",
      unit_id: 0,
      quantity: 0,
      unit_price: 0,
      sort_order: 0,
      is_required: false,
    },
  });

  // Watch form values for total price calculation
  const watchedValues = form.watch();

  useEffect(() => {
    if (editingItem) {
      form.reset({
        name: editingItem.name,
        description: editingItem.description,
        unit_id: editingItem.unit_id,
        quantity: editingItem.quantity,
        unit_price: editingItem.unit_price,
        sort_order: editingItem.sort_order,
        is_required: editingItem.is_required,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        unit_id: 0,
        quantity: 0,
        unit_price: 0,
        sort_order: 0,
        is_required: false,
      });
    }
  }, [editingItem, isOpen, form]);

  const onFormSubmit = (data: z.infer<typeof BOQItemSchema>) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {editingItem ? t("title2") : t("title1")}
            </DialogTitle>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-6 py-4"
          >
            {/* Item Name and Unit */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      {t("name")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("namePlaceholder")}
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit_id"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      {t("unit")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value.toString()}
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={t("unitPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((unit: Unit) => (
                            <SelectItem
                              key={unit.id}
                              value={unit.id.toString()}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{unit.name}</span>
                                <span className="text-muted-foreground">
                                  ({unit.code})
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-foreground">
                    {t("description")} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("descriptionPlaceholder")}
                      rows={3}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity, Unit Price, and Sort Order */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      {t("quantity")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder={t("quantityPlaceholder")}
                        className="h-11"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit_price"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      {t("unitPrice")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                          SAR
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder={t("unitPricePlaceholder")}
                          className="h-11 pl-12"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Sort Order
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        className="h-11"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    {/* <p className="text-xs text-muted-foreground">
                      Lower numbers appear first
                    </p> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Required Checkbox */}
            <FormField
              control={form.control}
              name="is_required"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <FormControl>
                      <input
                        type="checkbox"
                        id="is_required"
                        checked={field.value}
                        onChange={field.onChange}
                        className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="text-sm font-medium text-foreground cursor-pointer">
                        {t("isRequired")}
                      </FormLabel>
                      {/* <p className="text-xs text-muted-foreground">
                        {t("isRequiredDescription")}
                      </p> */}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Total Price Display */}
            {watchedValues.quantity > 0 && watchedValues.unit_price > 0 && (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total Price:
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "SAR",
                    }).format(
                      watchedValues.quantity * watchedValues.unit_price
                    )}
                  </span>
                </div>
              </div>
            )}

            <DialogFooter className="pt-4 border-t">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  {t("cancel")}
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Saving..."
                    : editingItem
                    ? t("update")
                    : t("add")}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BOQItemForm;
