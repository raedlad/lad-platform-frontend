"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/components/ui/form";
import { Label } from "@shared/components/ui/label";
import { FreelanceEngineerDocumentUploadSchema } from "@auth/utils/validation";
import { FreelanceEngineerDocumentUpload } from "@auth/types/freelanceEngineer";
import { ArrowLeft } from "lucide-react";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
  FILE_UPLOAD_MESSAGES,
} from "@auth/constants/freelanceEngineerRegistration";
import { FileUpload } from "@/features/auth/components/common/FileUpload";
import { useAuthStore } from "@auth/store/authStore";
import { useFreelanceEngineerRegistration } from "@/features/auth/flows/freelance-engineer/useFreelanceEngineerRegistration";

const FreelanceEngineerDocumentUploadStep: React.FC = () => {
  const store = useAuthStore();
  const { handleDocumentUploadSubmit, goToPreviousStep } =
    useFreelanceEngineerRegistration();

  const isLoading = store.isLoading;
  const onSubmit = handleDocumentUploadSubmit;
  const onBack = goToPreviousStep;

  const form = useForm<FreelanceEngineerDocumentUpload>({
    resolver: zodResolver(FreelanceEngineerDocumentUploadSchema),
    defaultValues: {
      technicalCV: undefined,
      personalPhoto: undefined,
      saudiCouncilOfEngineersCardCopy: undefined,
      trainingCertificates: [],
      professionalCertificates: [],
      personalProfile: undefined,
      recommendationLetters: [],
      workSamples: [],
    },
  });

  const handleSubmit = async (values: FreelanceEngineerDocumentUpload) => {
    console.log("Form values before submit:", values);
    const result = await onSubmit(values);

    if (!result.success) {
      console.log("Form submission failed:", result.error);
    }
  };

  const getStepNumber = () => {
    const stepInfo = store.getCurrentStepInfo();
    return stepInfo.stepNumber;
  };

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
            {STEP_CONFIG.documentUpload.title}
          </CardTitle>
          <CardDescription>
            {STEP_CONFIG.documentUpload.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                console.log("❌ Validation errors:", errors);
              })}
              className="space-y-6"
            >
              {/* Technical CV */}
              <FormField
                control={form.control}
                name="technicalCV"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-bold" htmlFor="technicalCV">
                      {FILE_UPLOAD_MESSAGES.technicalCV.title}
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        accept={["application/pdf", "image/jpeg", "image/png"]}
                        maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                        onChange={(file) => {
                          field.onChange(file as File | null);
                          form.setValue("technicalCV", file as File);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Personal Photo */}
              <FormField
                control={form.control}
                name="personalPhoto"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-bold" htmlFor="personalPhoto">
                      {FILE_UPLOAD_MESSAGES.personalPhoto.title}
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        accept={["image/jpeg", "image/png"]}
                        maxSizeMB={5}
                        onChange={(file) => {
                          field.onChange(file as File | null);
                          form.setValue("personalPhoto", file as File);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Saudi Council of Engineers Card Copy */}
              <FormField
                control={form.control}
                name="saudiCouncilOfEngineersCardCopy"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel
                      className="font-bold"
                      htmlFor="saudiCouncilOfEngineersCardCopy"
                    >
                      {
                        FILE_UPLOAD_MESSAGES.saudiCouncilOfEngineersCardCopy
                          .title
                      }
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        accept={["application/pdf", "image/jpeg", "image/png"]}
                        maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                        onChange={(file) => {
                          field.onChange(file as File | null);
                          form.setValue(
                            "saudiCouncilOfEngineersCardCopy",
                            file as File
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Training Certificates */}
              <FormField
                control={form.control}
                name="trainingCertificates"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel
                      className="font-bold"
                      htmlFor="trainingCertificates"
                    >
                      {FILE_UPLOAD_MESSAGES.trainingCertificates.title}
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        accept={["application/pdf", "image/jpeg", "image/png"]}
                        maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                        multiple={true}
                        onChange={(files) => {
                          field.onChange(files as File[]);
                          form.setValue("trainingCertificates", files as File[]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Professional Certificates */}
              <FormField
                control={form.control}
                name="professionalCertificates"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel
                      className="font-bold"
                      htmlFor="professionalCertificates"
                    >
                      {FILE_UPLOAD_MESSAGES.professionalCertificates.title}
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        accept={["application/pdf", "image/jpeg", "image/png"]}
                        maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                        multiple={true}
                        onChange={(files) => {
                          field.onChange(files as File[]);
                          form.setValue(
                            "professionalCertificates",
                            files as File[]
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Personal Profile */}
              <FormField
                control={form.control}
                name="personalProfile"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-bold" htmlFor="personalProfile">
                      {FILE_UPLOAD_MESSAGES.personalProfile.title}
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        accept={["application/pdf", "image/jpeg", "image/png"]}
                        maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                        onChange={(file) => {
                          field.onChange(file as File | null);
                          form.setValue("personalProfile", file as File);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Recommendation Letters */}
              <FormField
                control={form.control}
                name="recommendationLetters"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel
                      className="font-bold"
                      htmlFor="recommendationLetters"
                    >
                      {FILE_UPLOAD_MESSAGES.recommendationLetters.title}
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        accept={["application/pdf", "image/jpeg", "image/png"]}
                        maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                        multiple={true}
                        onChange={(files) => {
                          field.onChange(files as File[]);
                          form.setValue(
                            "recommendationLetters",
                            files as File[]
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Work Samples */}
              <FormField
                control={form.control}
                name="workSamples"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-bold" htmlFor="workSamples">
                      {FILE_UPLOAD_MESSAGES.workSamples.title}
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        accept={["application/pdf", "image/jpeg", "image/png"]}
                        maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                        multiple={true}
                        onChange={(files) => {
                          field.onChange(files as File[]);
                          form.setValue("workSamples", files as File[]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Continue"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreelanceEngineerDocumentUploadStep;
