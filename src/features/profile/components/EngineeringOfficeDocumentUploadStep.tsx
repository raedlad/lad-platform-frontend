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
import { Form, FormMessage } from "@shared/components/ui/form";
import { Label } from "@shared/components/ui/label";
import { EngineeringOfficeDocumentUploadSchema } from "@auth/utils/validation";
import { EngineeringOfficeDocumentUpload } from "@auth/types/engineeringOffice";
import { ArrowLeft } from "lucide-react";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
  FILE_UPLOAD_MESSAGES,
} from "@auth/constants/engineeringOfficeRegistration";
import { FileUpload } from "@/features/auth/components/common/FileUpload";
import { useAuthStore } from "@auth/store/authStore";
import { useEngineeringOfficeRegistration } from "@/features/auth/flows/engineering-office/useEngineeringOfficeRegistration";
import { useEngineeringOfficeRegistrationStore } from "@auth/store/engineeringOfficeRegistrationStore";

const EngineeringOfficeDocumentUploadStep: React.FC = () => {
  const store = useAuthStore();
  const { handleDocumentUploadSubmit, goToPreviousStep } =
    useEngineeringOfficeRegistration();
  const engineeringOfficeStore = useEngineeringOfficeRegistrationStore();

  const isLoading = store.isLoading;
  const onSubmit = handleDocumentUploadSubmit;
  const onBack = goToPreviousStep;

  const {
    saudiCouncilOfEngineersLicense,
    commercialRegistration,
    nationalAddress,
    bankAccountDetails,
    vatCertificate,
    previousWorkRecord,
    officialContactInformation,
    engineeringClassificationCertificate,
    qualityCertificates,
    chamberOfCommerceMembership,
    zakatAndIncomeCertificate,
    companyProfile,
    organizationalStructure,
    additionalFiles,
    setSaudiCouncilOfEngineersLicense,
    setCommercialRegistration,
    setNationalAddress,
    setBankAccountDetails,
    setVatCertificate,
    setPreviousWorkRecord,
    setOfficialContactInformation,
    setEngineeringClassificationCertificate,
    setQualityCertificates,
    setChamberOfCommerceMembership,
    setZakatAndIncomeCertificate,
    setCompanyProfile,
    setOrganizationalStructure,
    setAdditionalFiles,
  } = engineeringOfficeStore;

  const form = useForm<EngineeringOfficeDocumentUpload>({
    resolver: zodResolver(EngineeringOfficeDocumentUploadSchema),
    defaultValues: {
      saudiCouncilOfEngineersLicense:
        saudiCouncilOfEngineersLicense || undefined,
      commercialRegistration: commercialRegistration || undefined,
      nationalAddress: nationalAddress || undefined,
      bankAccountDetails: bankAccountDetails || undefined,
      vatCertificate: vatCertificate || undefined,
      previousWorkRecord: previousWorkRecord || undefined,
      officialContactInformation: officialContactInformation || undefined,
      engineeringClassificationCertificate:
        engineeringClassificationCertificate || undefined,
      qualityCertificates: qualityCertificates,
      chamberOfCommerceMembership: chamberOfCommerceMembership || undefined,
      zakatAndIncomeCertificate: zakatAndIncomeCertificate || undefined,
      companyProfile: companyProfile || undefined,
      organizationalStructure: organizationalStructure || undefined,
      additionalFiles: additionalFiles,
    },
  });

  const handleSubmit = async (values: EngineeringOfficeDocumentUpload) => {
    console.log("Form values before submit:", values);
    const formData = {
      saudiCouncilOfEngineersLicense: saudiCouncilOfEngineersLicense!,
      commercialRegistration: commercialRegistration || undefined,
      nationalAddress: nationalAddress!,
      bankAccountDetails: bankAccountDetails!,
      vatCertificate: vatCertificate!,
      previousWorkRecord: previousWorkRecord!,
      officialContactInformation: officialContactInformation!,
      engineeringClassificationCertificate:
        engineeringClassificationCertificate || undefined,
      qualityCertificates: qualityCertificates,
      chamberOfCommerceMembership: chamberOfCommerceMembership || undefined,
      zakatAndIncomeCertificate: zakatAndIncomeCertificate || undefined,
      companyProfile: companyProfile || undefined,
      organizationalStructure: organizationalStructure || undefined,
      additionalFiles: additionalFiles,
    };

    const result = await onSubmit(formData);

    if (!result.success) {
      console.log("Form submission failed:", result.error);
    }
  };

  const getStepNumber = () => STEP_CONFIG.documentUpload.stepNumber;

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
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Saudi Council of Engineers License */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.saudiCouncilOfEngineersLicense.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) => {
                    setSaudiCouncilOfEngineersLicense(file as File | null);
                    form.setValue(
                      "saudiCouncilOfEngineersLicense",
                      file as File
                    );
                  }}
                />
                <FormMessage>
                  {
                    form.formState.errors.saudiCouncilOfEngineersLicense
                      ?.message
                  }
                </FormMessage>
              </div>

              {/* Commercial Registration (Optional) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.commercialRegistration.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) => {
                    setCommercialRegistration(file as File | null);
                    form.setValue("commercialRegistration", file as File);
                  }}
                />
              </div>

              {/* National Address */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.nationalAddress.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) => {
                    setNationalAddress(file as File | null);
                    form.setValue("nationalAddress", file as File);
                  }}
                />
                <FormMessage>
                  {form.formState.errors.nationalAddress?.message}
                </FormMessage>
              </div>

              {/* Bank Account Details */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.bankAccountDetails.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) => {
                    setBankAccountDetails(file as File | null);
                    form.setValue("bankAccountDetails", file as File);
                  }}
                />
                <FormMessage>
                  {form.formState.errors.bankAccountDetails?.message}
                </FormMessage>
              </div>

              {/* VAT Certificate */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.vatCertificate.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) => {
                    setVatCertificate(file as File | null);
                    form.setValue("vatCertificate", file as File);
                  }}
                />
                <FormMessage>
                  {form.formState.errors.vatCertificate?.message}
                </FormMessage>
              </div>

              {/* Previous Work Record */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.previousWorkRecord.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) => {
                    setPreviousWorkRecord(file as File | null);
                    form.setValue("previousWorkRecord", file as File);
                  }}
                />
                <FormMessage>
                  {form.formState.errors.previousWorkRecord?.message}
                </FormMessage>
              </div>

              {/* Official Contact Information */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.officialContactInformation.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                    onChange={(file) => {
                    setOfficialContactInformation(file as File | null);
                    form.setValue("officialContactInformation", file as File);
                  }}
                />
                <FormMessage>
                  {form.formState.errors.officialContactInformation?.message}
                </FormMessage>
              </div>

              {/* Engineering Classification Certificate (Optional) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {
                    FILE_UPLOAD_MESSAGES.engineeringClassificationCertificate
                      .title
                  }
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) => {
                    setEngineeringClassificationCertificate(file as File | null);
                    form.setValue(
                      "engineeringClassificationCertificate",
                      file as File
                    );
                  }}
                />
              </div>

              {/* Quality Certificates (Optional) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.qualityCertificates.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(files) => {
                    setQualityCertificates(files as File[]);
                    form.setValue("qualityCertificates", files as File[]);
                  }}
                  multiple={true}
                />
              </div>

              {/* Chamber of Commerce Membership (Optional) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.chamberOfCommerceMembership.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) => {
                    setChamberOfCommerceMembership(file as File | null);
                    form.setValue("chamberOfCommerceMembership", file as File);
                  }}
                />
              </div>

              {/* Zakat and Income Certificate (Optional) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.zakatAndIncomeCertificate.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) => {
                    setZakatAndIncomeCertificate(file as File | null);
                    form.setValue("zakatAndIncomeCertificate", file as File);
                  }}
                />
              </div>

              {/* Company Profile (Optional) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.companyProfile.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) => {
                    setCompanyProfile(file as File | null);
                    form.setValue("companyProfile", file as File);
                  }}
                />
              </div>

              {/* Organizational Structure (Optional) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.organizationalStructure.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) => {
                    setOrganizationalStructure(file as File | null);
                    form.setValue("organizationalStructure", file as File);
                  }}
                />
              </div>

              {/* Additional Files (Optional) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.additionalFiles.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(files) => {
                    setAdditionalFiles(files as File[]);
                    form.setValue("additionalFiles", files as File[]);
                  }}
                  multiple={true}
                />
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Uploading..." : "Continue"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngineeringOfficeDocumentUploadStep;
