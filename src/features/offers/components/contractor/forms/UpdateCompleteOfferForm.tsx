"use client";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  FileText,
  Clock,
  Edit,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Textarea } from "@shared/components/ui/textarea";
import { Checkbox } from "@shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/components/ui/form";
import {
  CreateCompleteOfferRequest,
  OfferPhase,
  ContractorOffer,
} from "@/features/offers/types";
import { useContractorOffers } from "../../../hooks/useContractorOffers";
import { createCompleteOfferValidationSchema } from "../../../utils/validation";
import AddPhaseDialog from "./AddPhaseDialog";
import FileUpload from "../../common/FileUpload";
import { useCreateOffer } from "../../../hooks/useCreateOffer";
import { useOfferDocumentsStore } from "../../../store/offerDocumentsStore";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

interface UpdateCompleteOfferFormProps {
  offer: ContractorOffer;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UpdateCompleteOfferForm: React.FC<
  UpdateCompleteOfferFormProps
> = ({ offer, onSuccess, onCancel }) => {
  const t = useTranslations();
  const { updateCompleteOffer, isSubmitting } = useContractorOffers(
    undefined,
    false,
    false
  );

  const [phases, setPhases] = useState<OfferPhase[]>(offer.phases || []);
  const [isPhaseDialogOpen, setIsPhaseDialogOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<OfferPhase | null>(null);
  const [editingPhaseIndex, setEditingPhaseIndex] = useState<number | null>(
    null
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { setDocuments } = useOfferDocumentsStore();

  const { CreateCompleteOfferSchema } = useMemo(
    () => createCompleteOfferValidationSchema(t),
    [t]
  );

  // Format dates from ISO timestamp to YYYY-MM-DD
  const formatDate = useCallback((dateStr: string) => {
    if (!dateStr) return "";
    return dateStr.split("T")[0];
  }, []);

  const form = useForm({
    resolver: zodResolver(CreateCompleteOfferSchema),
    defaultValues: {
      offerAmount: offer.amount || 0,
      offerValidityValue: offer.offerValidity?.value || 0,
      offerValidityUnit: offer.offerValidity?.unit || "days",
      executionDurationValue: offer.executionDuration?.value || 0,
      executionDurationUnit: offer.executionDuration?.unit || "months",
      expectedStartDate: formatDate(offer.timeline?.proposedStartDate || ""),
      expectedEndDate: formatDate(offer.timeline?.proposedEndDate || ""),
      details: offer.description || "",
      hasWarranty: offer.hasWarranty || false,
      files: [],
      phases: offer.phases || [],
    },
  });

  // Reset form when offer data changes
  useEffect(() => {
    if (offer) {
      form.reset({
        offerAmount: offer.amount || 0,
        offerValidityValue: offer.offerValidity?.value || 0,
        offerValidityUnit: offer.offerValidity?.unit || "days",
        executionDurationValue: offer.executionDuration?.value || 0,
        executionDurationUnit: offer.executionDuration?.unit || "months",
        expectedStartDate: formatDate(offer.timeline?.proposedStartDate || ""),
        expectedEndDate: formatDate(offer.timeline?.proposedEndDate || ""),
        details: offer.description || "",
        hasWarranty: offer.hasWarranty || false,
        files: [],
        phases: offer.phases || [],
      });
      setPhases(offer.phases || []);

      // Load existing attachments into document store
      const existingAttachments = (offer.attachments || []).map(
        (attachment, index) => ({
          id: attachment.id || `existing-${index}`,
          file: null,
          name: attachment.name || `Attachment ${index + 1}`,
          type: attachment.type || "application/pdf",
          size: attachment.size || 0,
          url: attachment.url,
          uploadStatus: "completed" as const,
          uploadProgress: 100,
        })
      );

      setDocuments({
        attachments: existingAttachments,
        invoices: [],
        contracts: [],
        other_documents: [],
      });
    }
  }, [offer, form, formatDate, setDocuments]);

  // Sync uploaded attachment File objects into form "files" field
  const { documents } = useCreateOffer();
  useEffect(() => {
    const files = (documents?.attachments || [])
      .filter((f: any) => f.uploadStatus === "completed" && !!f.file)
      .map((f: any) => f.file as File);
    form.setValue("files", files, { shouldValidate: true });
  }, [documents, form]);

  const offerAmount = form.watch("offerAmount");

  const onSubmit = async (data: any) => {
    try {
      setSubmitError(null);
      const updateData = {
        offerAmount: data.offerAmount,
        offerValidityValue: data.offerValidityValue,
        offerValidityUnit: data.offerValidityUnit,
        executionDurationValue: data.executionDurationValue,
        executionDurationUnit: data.executionDurationUnit,
        expectedStartDate: data.expectedStartDate,
        expectedEndDate: data.expectedEndDate,
        details: data.details,
        hasWarranty: data.hasWarranty,
        files: data.files,
        phases: phases,
      };
      await updateCompleteOffer(offer.id, updateData);
      onSuccess?.();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        t("offers.update.error", { default: "Failed to update offer" });
      setSubmitError(errorMessage);
      console.error("Failed to update offer:", error);
    }
  };

  const handleAddPhase = () => {
    setEditingPhase(null);
    setEditingPhaseIndex(null);
    setIsPhaseDialogOpen(true);
  };

  const handleEditPhase = (phase: OfferPhase, index: number) => {
    setEditingPhase(phase);
    setEditingPhaseIndex(index);
    setIsPhaseDialogOpen(true);
  };

  const handlePhaseSubmit = (phase: OfferPhase) => {
    if (editingPhaseIndex !== null) {
      const updated = [...phases];
      updated[editingPhaseIndex] = { ...phase, order: editingPhaseIndex };
      setPhases(updated);
      form.setValue("phases", updated);
    } else {
      const updated = [...phases, { ...phase, order: phases.length }];
      setPhases(updated);
      form.setValue("phases", updated);
    }
  };

  const handleDeletePhase = (index: number) => {
    const updated = phases
      .filter((_, i) => i !== index)
      .map((phase, idx) => ({ ...phase, order: idx }));
    setPhases(updated);
    form.setValue("phases", updated);
  };

  const handleMovePhase = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const updated = [...phases];
    const [movedPhase] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedPhase);

    // Reorder all phases
    const reordered = updated.map((phase, idx) => ({ ...phase, order: idx }));
    setPhases(reordered);
    form.setValue("phases", reordered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "SAR",
    }).format(amount || 0);
  };

  return (
    <>
      <div className="w-full flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Offer Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-base font-semibold">
                <FileText className="h-5 w-5 text-design-main" />
                {t("offers.createCompleteOffer.basicInfo")}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="offerAmount"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        {t("offers.createCompleteOffer.offerAmount")} *
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-10"
                            value={field.value || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? 0 : Number(val));
                            }}
                            disabled={isSubmitting}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expectedStartDate"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        {t("offers.createCompleteOffer.expectedStartDate")} *
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          onChange={(date) =>
                            field.onChange(date?.toISOString().split("T")[0])
                          }
                          placeholder="YYYY-MM-DD"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedEndDate"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        {t("offers.createCompleteOffer.expectedEndDate")} *
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          onChange={(date) =>
                            field.onChange(date?.toISOString().split("T")[0])
                          }
                          placeholder="YYYY-MM-DD"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="offerValidityValue"
                  render={({ field: validityField }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        {t("offers.createCompleteOffer.offerValidity")} *
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="1"
                            placeholder="30"
                            value={validityField.value || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              validityField.onChange(
                                val === "" ? 0 : Number(val)
                              );
                            }}
                            disabled={isSubmitting}
                            className="flex-1"
                          />
                          <FormField
                            control={form.control}
                            name="offerValidityUnit"
                            render={({ field: unitField }) => (
                              <Select
                                value={unitField.value}
                                onValueChange={unitField.onChange}
                              >
                                <SelectTrigger className="w-28 min-h-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="days">
                                    {t("common.select.day")}
                                  </SelectItem>
                                  <SelectItem value="weeks">
                                    {t("common.select.week")}
                                  </SelectItem>
                                  <SelectItem value="months">
                                    {t("common.select.month")}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="executionDurationValue"
                  render={({ field: durationField }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        {t("offers.createCompleteOffer.executionDuration")} *
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="1"
                            placeholder="1"
                            value={durationField.value || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              durationField.onChange(
                                val === "" ? 0 : Number(val)
                              );
                            }}
                            disabled={isSubmitting}
                            className="flex-1"
                          />
                          <FormField
                            control={form.control}
                            name="executionDurationUnit"
                            render={({ field: unitField }) => (
                              <Select
                                value={unitField.value}
                                onValueChange={unitField.onChange}
                              >
                                <SelectTrigger className="w-28 min-h-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="days">
                                    {t("common.select.day")}
                                  </SelectItem>
                                  <SelectItem value="weeks">
                                    {t("common.select.week")}
                                  </SelectItem>
                                  <SelectItem value="months">
                                    {t("common.select.month")}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      {t("offers.createCompleteOffer.details")} *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          "offers.createCompleteOffer.offerDetailsPlaceholder"
                        )}
                        rows={4}
                        className="resize-none"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasWarranty"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>

                    <FormLabel className="text-sm font-medium">
                      {t("offers.createCompleteOffer.includeWarranty")}
                    </FormLabel>
                  </FormItem>
                )}
              />

              {/* Attachments */}
              <FormField
                control={form.control}
                name="files"
                render={() => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      {t("offers.createCompleteOffer.attachments", {
                        default: "Attachments",
                      })}
                    </FormLabel>
                    <FormControl>
                      <div>
                        <FileUpload category="attachments" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Project Phases */}
            <TooltipProvider>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-design-main" />
                    <h2 className="text-base font-semibold">
                      {t("offers.createCompleteOffer.projectPhases")}
                    </h2>
                  </div>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={handleAddPhase}
                    className="flex items-center gap-2 w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4" />
                    {t("offers.createCompleteOffer.addPhase")}
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[80px] max-w-[100px]">
                            {t("offers.createCompleteOffer.phase")}
                          </TableHead>
                          <TableHead className="min-w-[200px] max-w-[250px]">
                            {t("offers.createCompleteOffer.phaseTitle")}
                          </TableHead>
                          <TableHead className="min-w-[250px] max-w-[350px]">
                            {t("offers.createCompleteOffer.phaseDescription")}
                          </TableHead>
                          <TableHead className="min-w-[150px] max-w-[180px] text-right">
                            {t("offers.createCompleteOffer.amount")}
                          </TableHead>
                          <TableHead className="min-w-[100px] max-w-[120px] text-center">
                            {t(
                              "offers.createCompleteOffer.percentageOfContract"
                            )}
                          </TableHead>
                          <TableHead className="min-w-[160px] max-w-[200px] text-center">
                            {t("common.actions.actions", {
                              default: "Actions",
                            })}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {phases.length > 0 ? (
                          phases.map((phase, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium max-w-[100px]">
                                <div className="truncate">{index + 1}</div>
                              </TableCell>
                              <TableCell className="font-medium max-w-[250px]">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="truncate">
                                      {phase.title}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">{phase.title}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground max-w-[350px]">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="truncate">
                                      {phase.description}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">
                                      {phase.description}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>
                              <TableCell className="text-right font-medium max-w-[180px]">
                                <div className="truncate">
                                  {phase.paymentPlans &&
                                  phase.paymentPlans.length > 0 ? (
                                    formatCurrency(
                                      phase.paymentPlans[0]?.amount || 0
                                    )
                                  ) : (
                                    <span className="text-gray-400 text-xs italic">
                                      {t("offers.update.noPaymentPlan", {
                                        default: "Not set",
                                      })}
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-center max-w-[120px]">
                                <div className="truncate">
                                  {phase.paymentPlans &&
                                  phase.paymentPlans.length > 0 ? (
                                    `${
                                      phase.paymentPlans[0]?.percentageOfContract?.toFixed(
                                        2
                                      ) || "0.00"
                                    }%`
                                  ) : (
                                    <span className="text-gray-400 text-xs italic">
                                      -
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-center max-w-[200px]">
                                <div className="flex items-center justify-center gap-1 sm:gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleMovePhase(
                                        index,
                                        Math.max(0, index - 1)
                                      )
                                    }
                                    disabled={index === 0}
                                    className="h-8 w-8 p-0"
                                    aria-label={t("common.actions.moveUp", {
                                      default: "Move up",
                                    })}
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleMovePhase(
                                        index,
                                        Math.min(phases.length - 1, index + 1)
                                      )
                                    }
                                    disabled={index === phases.length - 1}
                                    className="h-8 w-8 p-0"
                                    aria-label={t("common.actions.moveDown", {
                                      default: "Move down",
                                    })}
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>

                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleEditPhase(phase, index)
                                        }
                                        className="h-8 w-8 p-0"
                                        aria-label={t(
                                          "offers.createCompleteOffer.editPhase"
                                        )}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-design-main text-white">
                                      <p>
                                        {t(
                                          "offers.createCompleteOffer.editPhase"
                                        )}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>

                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        disabled={isSubmitting}
                                        aria-label={t("common.actions.delete", {
                                          default: "Delete",
                                        })}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          {t(
                                            "offers.createCompleteOffer.deletePhaseTitle",
                                            { default: "Delete Phase" }
                                          )}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          {t(
                                            "offers.createCompleteOffer.deletePhaseDescription",
                                            {
                                              default:
                                                "Are you sure you want to delete this phase? This action cannot be undone.",
                                            }
                                          )}
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          {t("common.actions.cancel")}
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDeletePhase(index)
                                          }
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          {t("common.actions.delete", {
                                            default: "Delete",
                                          })}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              {t("offers.createCompleteOffer.noPhases")}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </TooltipProvider>
            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-4 border-t">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {t("common.actions.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-design-main hover:bg-design-main/90 sm:min-w-[140px]"
                >
                  {isSubmitting
                    ? t("common.actions.loading")
                    : t("offers.updateCompleteOffer.submitOffer", {
                        default: "Update Offer",
                      })}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>

      <AddPhaseDialog
        isOpen={isPhaseDialogOpen}
        onClose={() => setIsPhaseDialogOpen(false)}
        onSubmit={handlePhaseSubmit}
        editingPhase={editingPhase}
        phaseOrder={phases.length}
        offerAmount={offerAmount}
      />
    </>
  );
};
