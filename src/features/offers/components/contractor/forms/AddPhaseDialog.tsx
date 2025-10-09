"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Textarea } from "@shared/components/ui/textarea";
import { formatCurrency } from "@/shared/utils/formatters";
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
import { Card } from "@/shared/components/ui/card";
import { OfferPhase, OfferPaymentPlan } from "../../../types/offer";
import { createCompleteOfferValidationSchema } from "../../../utils/validation";

interface AddPhaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phase: OfferPhase) => void;
  editingPhase?: OfferPhase | null;
  phaseOrder: number;
  offerAmount: number;
}

const AddPhaseDialog: React.FC<AddPhaseDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingPhase,
  phaseOrder,
  offerAmount,
}) => {
  const t = useTranslations();
  const tValidation = useTranslations("");

  const [paymentAmount, setPaymentAmount] = useState(0);
  const [amountError, setAmountError] = useState<string | null>(null);

  const { OfferPhaseSchema } = createCompleteOfferValidationSchema(tValidation);

  const form = useForm<z.infer<typeof OfferPhaseSchema>>({
    resolver: zodResolver(OfferPhaseSchema),
    defaultValues: {
      title: "",
      description: "",
      order: 0,
      paymentPlans: [],
    },
  });

  useEffect(() => {
    if (editingPhase) {
      form.reset({
        title: editingPhase.title,
        description: editingPhase.description,
        order: editingPhase.order,
        paymentPlans: editingPhase.paymentPlans,
      });
      setPaymentAmount(editingPhase.paymentPlans?.[0]?.amount || 0);
    } else {
      form.reset({
        title: "",
        description: "",
        order: phaseOrder,
        paymentPlans: [],
      });
      setPaymentAmount(0);
    }
  }, [editingPhase, isOpen, form, phaseOrder]);

  const handlePaymentAmountChange = (amount: number) => {
    setPaymentAmount(amount);
    
    // Validate against main offer amount
    if (amount > offerAmount) {
      setAmountError(
        t("offers.errors.phaseAmountExceedsOffer", {
          defaultValue: `Amount cannot exceed the main offer amount (${formatCurrency(offerAmount, "SAR")})`
        })
      );
    } else {
      setAmountError(null);
    }
    
    const percentage = offerAmount > 0 ? (amount / offerAmount) * 100 : 0;
    const payment: OfferPaymentPlan = {
      name: "Phase Payment",
      amount,
      percentageOfContract: Number(percentage.toFixed(2)),
      dueOn: new Date().toISOString().split("T")[0],
      sortOrder: 0,
      userBankAccountId: 1,
      referenceNote: "",
    };
    form.setValue("paymentPlans", [payment]);
  };

  const onFormSubmit = (data: z.infer<typeof OfferPhaseSchema>) => {
    const percentage =
      offerAmount > 0 ? (paymentAmount / offerAmount) * 100 : 0;
    const payment: OfferPaymentPlan = {
      name: "Phase Payment",
      amount: paymentAmount,
      percentageOfContract: Number(percentage.toFixed(2)),
      dueOn: new Date().toISOString().split("T")[0],
      sortOrder: 0,
      userBankAccountId: 1,
      referenceNote: "",
    };
    onSubmit({ ...data, paymentPlans: [payment] });
    onClose();
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-lg font-semibold">
            {editingPhase
              ? t("offers.createCompleteOffer.editPhase")
              : t("offers.createCompleteOffer.addPhase")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-6 px-6 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">
                    {t("offers.createCompleteOffer.phaseTitle")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "offers.createCompleteOffer.phaseTitlePlaceholder"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">
                    {t("offers.createCompleteOffer.phaseDescription")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        "offers.createCompleteOffer.phaseDescriptionPlaceholder"
                      )}
                      rows={3}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentPlans"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">
                    {t("offers.createCompleteOffer.amount")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="space-y-2">
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max={offerAmount}
                        value={paymentAmount || ""}
                        onChange={(e) =>
                          handlePaymentAmountChange(Number(e.target.value) || 0)
                        }
                        placeholder="0.00"
                        className={amountError ? "border-red-500" : ""}
                      />
                    </FormControl>
                    {paymentAmount > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(paymentAmount, "SAR")}
                      </p>
                    )}
                    {amountError && (
                      <p className="text-sm text-red-500">{amountError}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {t("offers.createCompleteOffer.maxAmount", {
                        defaultValue: "Max:",
                      })}{" "}
                      {formatCurrency(offerAmount, "SAR")}
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="w-full px-6 pb-6 pt-4 border-t">
              <div className="w-full flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  {t("common.actions.cancel")}
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-design-main hover:bg-design-main/90"
                  disabled={form.formState.isSubmitting || paymentAmount <= 0 || !!amountError}
                >
                  {form.formState.isSubmitting
                    ? t("common.actions.saving")
                    : editingPhase
                    ? t("common.actions.update")
                    : t("common.actions.create")}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPhaseDialog;
