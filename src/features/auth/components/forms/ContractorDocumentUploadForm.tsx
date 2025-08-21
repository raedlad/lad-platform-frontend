"use client";

import React, { useState } from "react";
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
import { useContractorRegistrationStore } from "@auth/store/contractorRegistrationStore";
import { useContractorRegistration } from "@auth/hooks/useContractorRegistration";

const ContractorDocumentUploadForm: React.FC = () => {
  const store = useContractorRegistrationStore();
  const { handleDocumentUploadSubmit, goToPreviousStep } =
    useContractorRegistration();

  const isLoading = store.isLoading;
  const onSubmit = handleDocumentUploadSubmit;
  const onBack = goToPreviousStep;

  const [socialInsuranceCertificate, setSocialInsuranceCertificate] =
    useState<File | null>(null);
  const [commercialRegistration, setCommercialRegistration] =
    useState<File | null>(null);
  const [vatCertificate, setVatCertificate] = useState<File | null>(null);
  const [nationalAddress, setNationalAddress] = useState<File | null>(null);
  const [projectsAndPreviousWorkRecord, setProjectsAndPreviousWorkRecord] =
    useState<File | null>(null);
  const [officialContactInformation, setOfficialContactInformation] =
    useState<File | null>(null);
  const [bankAccountDetails, setBankAccountDetails] = useState<File | null>(
    null
  );
  const [chamberOfCommerceMembership, setChamberOfCommerceMembership] =
    useState<File | null>(null);
  const [companyProfile, setCompanyProfile] = useState<File | null>(null);
  const [organizationalStructure, setOrganizationalStructure] =
    useState<File | null>(null);
  const [qualityCertificates, setQualityCertificates] = useState<File[]>([]);
  const [otherFiles, setOtherFiles] = useState<File[]>([]);

  const form = useForm<ContractorDocumentUpload>({
    resolver: zodResolver(ContractorDocumentUploadSchema),
    defaultValues: {
      socialInsuranceCertificate: undefined,
      commercialRegistration: undefined,
      vatCertificate: undefined,
      nationalAddress: undefined,
      projectsAndPreviousWorkRecord: undefined,
      officialContactInformation: undefined,
      bankAccountDetails: undefined,
      chamberOfCommerceMembership: undefined,
      companyProfile: undefined,
      organizationalStructure: undefined,
      qualityCertificates: [],
      otherFiles: [],
    },
  });

  const handleSubmit = async (values: ContractorDocumentUpload) => {
    console.log("Form values before submit:", values);
    const formData = {
      socialInsuranceCertificate: socialInsuranceCertificate!,
      commercialRegistration: commercialRegistration!,
      vatCertificate: vatCertificate!,
      nationalAddress: nationalAddress!,
      projectsAndPreviousWorkRecord: projectsAndPreviousWorkRecord!,
      officialContactInformation: officialContactInformation!,
      bankAccountDetails: bankAccountDetails!,
      chamberOfCommerceMembership: chamberOfCommerceMembership || undefined,
      companyProfile: companyProfile || undefined,
      organizationalStructure: organizationalStructure || undefined,
      qualityCertificates: qualityCertificates,
      otherFiles: otherFiles,
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
                  onChange={(file) =>
                    setSocialInsuranceCertificate(file as File | null)
                  }
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
                  onChange={(file) =>
                    setCommercialRegistration(file as File | null)
                  }
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
                  onChange={(file) => setVatCertificate(file as File | null)}
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
                  onChange={(file) => setNationalAddress(file as File | null)}
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
                  onChange={(file) =>
                    setProjectsAndPreviousWorkRecord(file as File | null)
                  }
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
                  onChange={(file) =>
                    setOfficialContactInformation(file as File | null)
                  }
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
                  onChange={(file) =>
                    setBankAccountDetails(file as File | null)
                  }
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
                  onChange={(file) =>
                    setChamberOfCommerceMembership(file as File | null)
                  }
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
                  onChange={(file) => setCompanyProfile(file as File | null)}
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
                  onChange={(file) =>
                    setOrganizationalStructure(file as File | null)
                  }
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
                  onChange={(files) => setQualityCertificates(files as File[])}
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
                  onChange={(files) => setOtherFiles(files as File[])}
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

export default ContractorDocumentUploadForm;
