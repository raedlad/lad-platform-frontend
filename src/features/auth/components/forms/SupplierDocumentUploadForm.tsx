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
import { SupplierDocumentUploadSchema } from "@auth/utils/validation";
import { SupplierDocumentUpload } from "@auth/types/supplier";
import { ArrowLeft } from "lucide-react";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
  FILE_UPLOAD_MESSAGES,
} from "@auth/constants/supplierRegistration";
import { FileUpload } from "@/features/auth/components/common/FileUpload";
import { useSupplierRegistrationStore } from "@auth/store/supplierRegistrationStore";
import { useSupplierRegistration } from "@auth/hooks/useSupplierRegistration";

const SupplierDocumentUploadForm: React.FC = () => {
  const store = useSupplierRegistrationStore();
  const { handleDocumentUploadSubmit, goToPreviousStep } =
    useSupplierRegistration();

  const isLoading = store.isLoading;
  const onSubmit = handleDocumentUploadSubmit;
  const onBack = goToPreviousStep;

  const [commercialRegistration, setCommercialRegistration] =
    useState<File | null>(null);
  const [vatCertificate, setVatCertificate] = useState<File | null>(null);
  const [nationalAddress, setNationalAddress] = useState<File | null>(null);
  const [bankAccountDetails, setBankAccountDetails] = useState<File | null>(
    null
  );
  const [accreditationCertificates, setAccreditationCertificates] = useState<
    File[]
  >([]);
  const [establishmentProfile, setEstablishmentProfile] = useState<File | null>(
    null
  );
  const [administrativeStructure, setAdministrativeStructure] =
    useState<File | null>(null);
  const [previousContracts, setPreviousContracts] = useState<File[]>([]);
  const [thankYouLetters, setThankYouLetters] = useState<File[]>([]);
  const [additionalCredibilityDocuments, setAdditionalCredibilityDocuments] =
    useState<File[]>([]);

  const form = useForm<SupplierDocumentUpload>({
    resolver: zodResolver(SupplierDocumentUploadSchema),
    defaultValues: {
      commercialRegistration: undefined,
      vatCertificate: undefined,
      nationalAddress: undefined,
      bankAccountDetails: undefined,
      accreditationCertificates: [],
      establishmentProfile: undefined,
      administrativeStructure: undefined,
      previousContracts: [],
      thankYouLetters: [],
      additionalCredibilityDocuments: [],
    },
  });

  const handleSubmit = async (values: SupplierDocumentUpload) => {
    console.log("Form values before submit:", values);
    const formData = {
      commercialRegistration: commercialRegistration!,
      vatCertificate: vatCertificate || undefined,
      nationalAddress: nationalAddress!,
      bankAccountDetails: bankAccountDetails!,
      accreditationCertificates: accreditationCertificates,
      establishmentProfile: establishmentProfile || undefined,
      administrativeStructure: administrativeStructure || undefined,
      previousContracts: previousContracts,
      thankYouLetters: thankYouLetters,
      additionalCredibilityDocuments: additionalCredibilityDocuments,
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

              {/* VAT Certificate (Optional) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.vatCertificate.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) => setVatCertificate(file as File | null)}
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
                  onChange={(file) => setNationalAddress(file as File | null)}
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
                  onChange={(file) =>
                    setBankAccountDetails(file as File | null)
                  }
                />
                <FormMessage>
                  {form.formState.errors.bankAccountDetails?.message}
                </FormMessage>
              </div>

              {/* Accreditation Certificates (Optional) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.accreditationCertificates.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(files) =>
                    setAccreditationCertificates(files as File[])
                  }
                  multiple={true}
                />
              </div>

              {/* Establishment Profile (Optional) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.establishmentProfile.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) =>
                    setEstablishmentProfile(file as File | null)
                  }
                />
              </div>

              {/* Administrative Structure (Optional) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.administrativeStructure.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) =>
                    setAdministrativeStructure(file as File | null)
                  }
                />
              </div>

              {/* Previous Contracts (Optional) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.previousContracts.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(files) => setPreviousContracts(files as File[])}
                  multiple={true}
                />
              </div>

              {/* Thank You Letters (Optional) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.thankYouLetters.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(files) => setThankYouLetters(files as File[])}
                  multiple={true}
                />
              </div>

              {/* Additional Credibility Documents (Optional) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.additionalCredibilityDocuments.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(files) =>
                    setAdditionalCredibilityDocuments(files as File[])
                  }
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

export default SupplierDocumentUploadForm;
