"use client";

import React from "react";
import { Button } from "@shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { ArrowLeft } from "lucide-react";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
  PLAN_OPTIONS,
} from "@auth/constants/supplierRegistration";
import { useSupplierRegistrationStore } from "@auth/store/supplierRegistrationStore";
import { useSupplierRegistration } from "@auth/hooks/useSupplierRegistration";

const SupplierPlanSelectionForm: React.FC = () => {
  const store = useSupplierRegistrationStore();
  const { goToPreviousStep } = useSupplierRegistration();

  const isLoading = store.isLoading;
  const onBack = goToPreviousStep;

  const handlePlanSelection = async (plan: "free" | "paid") => {
    console.log("Selected plan:", plan);
    store.goToNextStep(); // Move to completion after plan selection
    return { success: true };
  };

  const getStepNumber = () => STEP_CONFIG.planSelection.stepNumber;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-transparent shadow-none border-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-1"
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm text-muted-foreground">
              Step {getStepNumber()} of {REGISTRATION_STEPS.length}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {STEP_CONFIG.planSelection.title}
          </CardTitle>
          <CardDescription>
            {STEP_CONFIG.planSelection.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {PLAN_OPTIONS.map((plan) => (
              <Card
                key={plan.type}
                className="border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
              >
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.price}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-4"
                    onClick={() => handlePlanSelection(plan.type)}
                    disabled={isLoading}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierPlanSelectionForm;
