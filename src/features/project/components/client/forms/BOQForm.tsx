"use client";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import NavigationButtons from "@/features/project/components/common/NavigationButtons";
import BOQTable from "./BOQTable";
import BOQItemForm from "./BOQItemForm";
import { useProjectStore } from "@/features/project/store/projectStore";
import { BOQItem, BOQTemplate, Unit } from "@/features/project/types/project";
import { useCreateProject } from "@/features/project/hooks/useCreateProject";
import { createProjectValidationSchemas } from "@/features/project/utils/validation";
import { Plus, FileText, RotateCcw } from "lucide-react";

const BOQForm = () => {
  const t = useTranslations("project.step4");
  const tValidation = useTranslations("");
  const {
    boqData,
    boqTemplates,
    units,
    setBOQTemplates,
    setUnits,
    addBOQItem,
    updateBOQItem,
    removeBOQItem,
    resetBOQ,
    loadBOQTemplate,
  } = useProjectStore();

  const { submitBOQ, loading, error } = useCreateProject();

  // Create validation schema
  const { BOQFormSchema } = createProjectValidationSchemas(tValidation);

  const form = useForm<z.infer<typeof BOQFormSchema>>({
    resolver: zodResolver(BOQFormSchema),
    defaultValues: {
      items: boqData.items,
      total_amount: boqData.total_amount,
      template_id: boqData.template_id,
    },
  });

  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<BOQItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync form with store data
  useEffect(() => {
    form.reset({
      items: boqData.items,
      total_amount: boqData.total_amount,
      template_id: boqData.template_id,
    });
  }, [boqData, form]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Mock BOQ templates
    const mockTemplates: BOQTemplate[] = [
      {
        id: 1,
        name: "Residential Building Template",
        description: "Standard template for residential construction projects",
        category: "Residential",
        items: [
          {
            name: "Concrete Foundation",
            description: "Reinforced concrete foundation",
            unit_id: 1,
            quantity: 50,
            unit_price: 150,
            sort_order: 1,
            is_required: true,
          },
          {
            name: "Steel Reinforcement",
            description: "Steel bars for reinforcement",
            unit_id: 2,
            quantity: 2000,
            unit_price: 2.5,
            sort_order: 2,
            is_required: true,
          },
        ],
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        id: 2,
        name: "Commercial Building Template",
        description: "Template for commercial construction projects",
        category: "Commercial",
        items: [
          {
            name: "Steel Frame Structure",
            description: "Main structural steel frame",
            unit_id: 3,
            quantity: 100,
            unit_price: 500,
            sort_order: 1,
            is_required: true,
          },
        ],
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
    ];

    // Mock units
    const mockUnits: Unit[] = [
      {
        id: 1,
        name: "Cubic Meter",
        symbol: "m³",
        description: "Volume unit",
        is_active: true,
      },
      {
        id: 2,
        name: "Kilogram",
        symbol: "kg",
        description: "Weight unit",
        is_active: true,
      },
      {
        id: 3,
        name: "Square Meter",
        symbol: "m²",
        description: "Area unit",
        is_active: true,
      },
      {
        id: 4,
        name: "Meter",
        symbol: "m",
        description: "Length unit",
        is_active: true,
      },
      {
        id: 5,
        name: "Piece",
        symbol: "pcs",
        description: "Count unit",
        is_active: true,
      },
    ];

    setBOQTemplates(mockTemplates);
    setUnits(mockUnits);
  }, [setBOQTemplates, setUnits]);

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === "manual") return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      loadBOQTemplate(parseInt(templateId));
      setIsLoading(false);
    }, 1000);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowItemForm(true);
  };

  const handleEditItem = (item: BOQItem) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  const handleItemSubmit = (itemData: Omit<BOQItem, "id">) => {
    if (editingItem) {
      updateBOQItem(editingItem.id!, itemData);
    } else {
      addBOQItem(itemData);
    }
    setShowItemForm(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    removeBOQItem(itemId);
  };

  const handleReset = () => {
    resetBOQ();
  };

  const onSubmit = async (data: z.infer<typeof BOQFormSchema>) => {
    console.log("🚀 Submitting BOQ:", data);
    const result = await submitBOQ(data);
    if (!result.success) {
      console.error("❌ BOQ submission failed:", result.message);
    } else {
      console.log("✅ BOQ submission successful:", result.message);
    }
  };

  const onValidationError = (errors: any) => {
    console.log("❌ BOQ validation errors:", errors);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex gap-2 text-base lg:text-lg font-bold">
        <span className="text-design-main">04 -</span>
        <h1>{t("title")}</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onValidationError)}
          className="space-y-6"
        >
          <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-2 sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <Select onValueChange={handleTemplateSelect} disabled={isLoading}>
                <SelectTrigger className="w-full sm:w-[300px] min-w-0">
                  <SelectValue
                    placeholder={t("templateSelection.templatePlaceholder")}
                    className="truncate"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual" className="truncate">
                    <span className="truncate">
                      {t("templateSelection.manual")} -{" "}
                      {t("templateSelection.manualDescription")}
                    </span>
                  </SelectItem>
                  {boqTemplates?.map((template: BOQTemplate) => (
                    <SelectItem
                      key={template.id}
                      value={template.id.toString()}
                      className="truncate"
                    >
                      <span className="truncate">
                        {template.name} - {template.category}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 items-center justify-start sm:justify-end flex-shrink-0">
              <Button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-2 flex-shrink-0"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:block text-sm font-medium">
                  {t("boqTable.addItem")}
                </span>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={boqData.items.length === 0}
                    className="flex-shrink-0"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="hidden sm:block text-sm font-medium">
                      {t("actions.reset")}
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t("dialogs.resetTitle")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("dialogs.resetDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("dialogs.cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleReset}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {t("dialogs.reset")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          {/* BOQ Table */}
          <BOQTable
            items={boqData.items}
            units={units || []}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            totalAmount={boqData.total_amount}
          />

          {/* Error Display */}
          {form.formState.errors.items && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{form.formState.errors.items.message}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <NavigationButtons
            onSubmit={() => form.handleSubmit(onSubmit, onValidationError)()}
            isLoading={loading}
          />
        </form>
      </Form>
      <BOQItemForm
        isOpen={showItemForm}
        onClose={() => {
          setShowItemForm(false);
          setEditingItem(null);
        }}
        onSubmit={handleItemSubmit}
        editingItem={editingItem}
        units={units || []}
      />
    </div>
  );
};

export default BOQForm;
