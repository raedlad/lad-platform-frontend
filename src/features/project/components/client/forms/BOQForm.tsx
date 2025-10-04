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
import { projectApi } from "@/features/project/services/projectApi";

const BOQForm = () => {
  const t = useTranslations("project.step4");
  const tValidation = useTranslations("");
  const {
    boqData,
    boqTemplates,
    units,
    boqTemplatesLoaded,
    unitsLoaded,
    setBOQTemplates,
    setUnits,
    setBOQTemplatesLoaded,
    setUnitsLoaded,
    addBOQItem,
    updateBOQItem,
    removeBOQItem,
    resetBOQ,
    setBOQData,
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
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  // Load BOQ templates and units on mount
  // This is now the only place where BOQ metadata is loaded
  useEffect(() => {
    const loadBOQData = async () => {
      if (boqTemplatesLoaded && unitsLoaded) {
        return;
      }

      setIsLoadingTemplates(true);
      try {
        if (!boqTemplatesLoaded) {
          const templatesResponse = await projectApi.getBoqTemplates();
          if (templatesResponse.success && templatesResponse.response) {
            const templatesWithoutItems = templatesResponse.response.map(
              (template) => ({
                ...template,
                items: [],
              })
            );
            setBOQTemplates(templatesWithoutItems || []);
            setBOQTemplatesLoaded(true);
          }
        }

        if (!unitsLoaded) {
          const unitsResponse = await projectApi.getBoqUnits();
          if (unitsResponse.success) {
            setUnits(unitsResponse.response || []);
            setUnitsLoaded(true);
          }
        }
      } catch (error) {
        // Error handled silently
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    loadBOQData();
  }, [
    boqTemplatesLoaded,
    unitsLoaded,
    setBOQTemplates,
    setBOQTemplatesLoaded,
    setUnits,
    setUnitsLoaded,
  ]);

  // Sync form with store data
  useEffect(() => {
    form.reset({
      items: boqData.items,
      total_amount: boqData.total_amount,
      template_id: boqData.template_id,
    });
  }, [boqData, form]);

  const handleTemplateSelect = async (templateId: string) => {
    if (templateId === "manual") return;

    setIsLoading(true);

    try {
      const templateResponse = await projectApi.getBoqTemplateById(
        parseInt(templateId)
      );

      if (templateResponse.success && templateResponse.response) {
        const template = templateResponse.response;

        const boqItems: BOQItem[] = (template.items || []).map(
          (item, index: number) => ({
            id: `item_${Date.now()}_${index}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            name: item.name,
            description: item.description,
            unit_id: parseInt(item.unit_id),
            quantity: item.default_qty || 0,
            unit_price: item.default_price || 0,
            sort_order: item.sort_order || index,
            is_required: false,
          })
        );

        const total_amount = boqItems.reduce(
          (sum, item) => sum + item.quantity * item.unit_price,
          0
        );

        setBOQData({
          items: boqItems,
          total_amount,
          template_id: parseInt(templateId),
        });
      }
    } catch (error) {
      // Error handled silently
    } finally {
      setIsLoading(false);
    }
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
    await submitBOQ(data);
  };

  const onValidationError = (errors: Record<string, unknown>) => {
    // Validation errors handled by form
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
              <Select
                onValueChange={handleTemplateSelect}
                disabled={isLoading || isLoadingTemplates}
              >
                <SelectTrigger className="w-full sm:w-[300px] min-w-0">
                  <SelectValue
                    placeholder={
                      isLoadingTemplates
                        ? t("templateSelection.loading")
                        : t("templateSelection.templatePlaceholder")
                    }
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
                        {template.name} - {template.project_type_id}
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
              <p className="text-red-800 text-sm">
                {form.formState.errors.items.message}
              </p>
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
