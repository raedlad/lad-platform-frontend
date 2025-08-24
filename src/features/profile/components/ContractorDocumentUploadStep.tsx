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
import { ContractorDocumentUploadSchema } from "@auth/utils/validation";
import { ContractorDocumentUpload } from "@auth/types/contractor";
import { ArrowLeft } from "lucide-react";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
  FILE_UPLOAD_MESSAGES,
} from "@auth/constants/contractorRegistration";
import { FileUpload } from "@/features/auth/components/common/FileUpload";
import { useAuthStore } from "@auth/store/authStore";
import { useContractorRegistration } from "@/features/auth/flows/contractor/useContractorRegistration";
import { useContractorRegistrationStore } from "@auth/store/contractorRegistrationStore";

const ContractorDocumentUploadStep: React.FC = () => {
  const store = useAuthStore();
  const { handleDocumentUploadSubmit, goToPreviousStep } =
    useContractorRegistration();
  const contractorStore = useContractorRegistrationStore();

  const isLoading = store.isLoading;
  const onSubmit = handleDocumentUploadSubmit;
  const onBack = goToPreviousStep;

  const {
    documentUploadSocialInsuranceCertificate,
    documentUploadCommercialRegistration,
    documentUploadVatCertificate,
    documentUploadNationalAddress,
    documentUploadProjectsAndPreviousWorkRecord,
    documentUploadOfficialContactInformation,
    documentUploadBankAccountDetails,
    documentUploadChamberOfCommerceMembership,
    documentUploadCompanyProfile,
    documentUploadOrganizationalStructure,
    documentUploadQualityCertificates,
    documentUploadOtherFiles,
    setDocumentUploadSocialInsuranceCertificate,
    setDocumentUploadCommercialRegistration,
    setDocumentUploadVatCertificate,
    setDocumentUploadNationalAddress,
    setDocumentUploadProjectsAndPreviousWorkRecord,
    setDocumentUploadOfficialContactInformation,
    setDocumentUploadBankAccountDetails,
    setDocumentUploadChamberOfCommerceMembership,
    setDocumentUploadCompanyProfile,
    setDocumentUploadOrganizationalStructure,
    setDocumentUploadQualityCertificates,
    setDocumentUploadOtherFiles,
  } = contractorStore;

  const form = useForm<ContractorDocumentUpload>({
    resolver: zodResolver(ContractorDocumentUploadSchema),
    defaultValues: {
      socialInsuranceCertificate:
        documentUploadSocialInsuranceCertificate || undefined,
      commercialRegistration: documentUploadCommercialRegistration || undefined,
      vatCertificate: documentUploadVatCertificate || undefined,
      nationalAddress: documentUploadNationalAddress || undefined,
      projectsAndPreviousWorkRecord:
        documentUploadProjectsAndPreviousWorkRecord || undefined,
      officialContactInformation:
        documentUploadOfficialContactInformation || undefined,
      bankAccountDetails: documentUploadBankAccountDetails || undefined,
      chamberOfCommerceMembership:
        documentUploadChamberOfCommerceMembership || undefined,
      companyProfile: documentUploadCompanyProfile || undefined,
      organizationalStructure:
        documentUploadOrganizationalStructure || undefined,
      qualityCertificates: documentUploadQualityCertificates,
      otherFiles: documentUploadOtherFiles,
    },
  });

  const handleSubmit = async (values: ContractorDocumentUpload) => {
    console.log("Form values before submit:", values);
    const formData = {
      socialInsuranceCertificate: documentUploadSocialInsuranceCertificate!,
      commercialRegistration: documentUploadCommercialRegistration!,
      vatCertificate: documentUploadVatCertificate!,
      nationalAddress: documentUploadNationalAddress!,
      projectsAndPreviousWorkRecord:
        documentUploadProjectsAndPreviousWorkRecord!,
      officialContactInformation: documentUploadOfficialContactInformation!,
      bankAccountDetails: documentUploadBankAccountDetails!,
      chamberOfCommerceMembership:
        documentUploadChamberOfCommerceMembership || undefined,
      companyProfile: documentUploadCompanyProfile || undefined,
      organizationalStructure:
        documentUploadOrganizationalStructure || undefined,
      qualityCertificates: documentUploadQualityCertificates,
      otherFiles: documentUploadOtherFiles,
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
              {/* Social Insurance Certificate */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.socialInsuranceCertificate.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) => {
                    setDocumentUploadSocialInsuranceCertificate(
                      file as File | null
                    );
                    form.setValue("socialInsuranceCertificate", file as File);
                  }}
                />
                <FormMessage>
                  {form.formState.errors.socialInsuranceCertificate?.message}
                </FormMessage>
              </div>

              {/* Commercial Registration */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.commercialRegistration.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) => {
                    setDocumentUploadCommercialRegistration(
                      file as File | null
                    );
                    form.setValue("commercialRegistration", file as File);
                  }}
                />
                <FormMessage>
                  {form.formState.errors.commercialRegistration?.message}
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
                    setDocumentUploadVatCertificate(file as File | null);
                    form.setValue("vatCertificate", file as File);
                  }}
                />
                <FormMessage>
                  {form.formState.errors.vatCertificate?.message}
                </FormMessage>
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
                    setDocumentUploadNationalAddress(file as File | null);
                    form.setValue("nationalAddress", file as File);
                  }}
                />
                <FormMessage>
                  {form.formState.errors.nationalAddress?.message}
                </FormMessage>
              </div>

              {/* Projects and Previous Work Record */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.projectsAndPreviousWorkRecord.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) => {
                    setDocumentUploadProjectsAndPreviousWorkRecord(
                      file as File | null
                    );
                    form.setValue("projectsAndPreviousWorkRecord", file as File);
                  }}
                />
                <FormMessage>
                  {form.formState.errors.projectsAndPreviousWorkRecord?.message}
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
                    setDocumentUploadOfficialContactInformation(
                      file as File | null
                    );
                    form.setValue("officialContactInformation", file as File);
                  }}
                />
                <FormMessage>
                  {form.formState.errors.officialContactInformation?.message}
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
                    setDocumentUploadBankAccountDetails(file as File | null);
                    form.setValue("bankAccountDetails", file as File);
                  }}
                />
                <FormMessage>
                  {form.formState.errors.bankAccountDetails?.message}
                </FormMessage>
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
                    setDocumentUploadChamberOfCommerceMembership(
                      file as File | null
                    );
                    form.setValue("chamberOfCommerceMembership", file as File);
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
                    setDocumentUploadCompanyProfile(file as File | null);
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
                    setDocumentUploadOrganizationalStructure(
                      file as File | null
                    );
                    form.setValue("organizationalStructure", file as File);
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
                    setDocumentUploadQualityCertificates(files as File[]);
                    form.setValue("qualityCertificates", files as File[]);
                  }}
                  multiple={true}
                />
              </div>

              {/* Other Files (Optional) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.otherFiles.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(files) => {
                    setDocumentUploadOtherFiles(files as File[]);
                    form.setValue("otherFiles", files as File[]);
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

export default ContractorDocumentUploadStep;
