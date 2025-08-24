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
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Checkbox } from "@shared/components/ui/checkbox";
import { ContractorTechnicalOperationalInfoSchema } from "@auth/utils/validation";
import { ContractorTechnicalOperationalInfo } from "@auth/types/contractor";
import { ArrowLeft } from "lucide-react";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  FILE_UPLOAD_MESSAGES,
} from "@auth/constants/contractorRegistration";
import { FileUpload } from "@/features/auth/components/common/FileUpload";
import { useAuthStore } from "@auth/store/authStore";
import { useContractorRegistration } from "../../auth/flows/contractor/useContractorRegistration";
import { useContractorRegistrationStore } from "@auth/store/contractorRegistrationStore";

const ContractorTechnicalOperationalInfoStep: React.FC = () => {
  const store = useAuthStore();
  const { handleTechnicalOperationalInfoSubmit, goToPreviousStep } =
    useContractorRegistration();
  const contractorStore = useContractorRegistrationStore();

  const isLoading = store.isLoading;
  const onSubmit = handleTechnicalOperationalInfoSubmit;
  const onBack = goToPreviousStep;

  const {
    classificationFile,
    socialInsuranceCertificate,
    commercialRegistration,
    vatCertificate,
    nationalAddress,
    projectsAndPreviousWorkRecord,
    officialContactInformation,
    bankAccountDetails,
    chamberOfCommerceMembership,
    companyProfile,
    organizationalStructure,
    qualityCertificates,
    otherFiles,
    setClassificationFile,
    setSocialInsuranceCertificate,
    setCommercialRegistration,
    setVatCertificate,
    setNationalAddress,
    setProjectsAndPreviousWorkRecord,
    setOfficialContactInformation,
    setBankAccountDetails,
    setChamberOfCommerceMembership,
    setCompanyProfile,
    setOrganizationalStructure,
    setQualityCertificates,
    setOtherFiles,
  } = contractorStore;

  const form = useForm<ContractorTechnicalOperationalInfo>({
    resolver: zodResolver(ContractorTechnicalOperationalInfoSchema),
    defaultValues: {
      projectSizeCompleted: "Less than 5 million",
      targetProjectSize: [],
      totalEmployees: "Less than 25",
      governmentAccreditations: false,
      contractorClassification: "First through seventh classification",
      workFields: [],
      geographicSpread: [],
      yearsOfExperience: "Less than 5 years",
      annualProjectVolume: "Less than 5 projects",
    },
    shouldUnregister: true,
  });

  const handleSubmit = async (values: ContractorTechnicalOperationalInfo) => {
    console.log("Form values before submit:", values);
    const formData = {
      ...values,
      classificationFile: classificationFile!,
      socialInsuranceCertificate: socialInsuranceCertificate!,
      commercialRegistration: commercialRegistration!,
      vatCertificate: vatCertificate!,
      nationalAddress: nationalAddress!,
      projectsAndPreviousWorkRecord: projectsAndPreviousWorkRecord!,
      officialContactInformation: officialContactInformation!,
      bankAccountDetails: bankAccountDetails!,
      chamberOfCommerceMembership: chamberOfCommerceMembership!,
      companyProfile: companyProfile!,
      organizationalStructure: organizationalStructure!,
      qualityCertificates: qualityCertificates,
      otherFiles: otherFiles,
    };

    const result = await onSubmit(formData);

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
            {STEP_CONFIG.technicalOperationalInfo.title}
          </CardTitle>
          <CardDescription>
            {STEP_CONFIG.technicalOperationalInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Project Size Completed */}
              <FormField
                control={form.control}
                name="projectSizeCompleted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.projectSizeCompleted}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Target Project Size */}
              <FormField
                control={form.control}
                name="targetProjectSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.targetProjectSize}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Total Employees */}
              <FormField
                control={form.control}
                name="totalEmployees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.totalEmployees}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Government Accreditations */}
              <FormField
                control={form.control}
                name="governmentAccreditations"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel>
                        {FORM_LABELS.governmentAccreditations}
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {/* Contractor Classification */}
              <FormField
                control={form.control}
                name="contractorClassification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {FORM_LABELS.contractorClassification}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Work Fields */}
              <FormField
                control={form.control}
                name="workFields"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.workFields}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Geographic Spread */}
              <FormField
                control={form.control}
                name="geographicSpread"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.geographicSpread}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Years of Experience */}
              <FormField
                control={form.control}
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.yearsOfExperience}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Annual Project Volume */}
              <FormField
                control={form.control}
                name="annualProjectVolume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.annualProjectVolume}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File Uploads */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Classification File (if applicable)</Label>
                  <FileUpload
                    accept={["application/pdf", "image/jpeg", "image/png"]}
                    maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                    onChange={(file) =>
                      setClassificationFile(file as File | null)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    {FILE_UPLOAD_MESSAGES.socialInsuranceCertificate.title}
                  </Label>
                  <FileUpload
                    accept={["application/pdf", "image/jpeg", "image/png"]}
                    maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                    onChange={(file) =>
                      setSocialInsuranceCertificate(file as File | null)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    {FILE_UPLOAD_MESSAGES.commercialRegistration.title}
                  </Label>
                  <FileUpload
                    accept={["application/pdf", "image/jpeg", "image/png"]}
                    maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                    onChange={(file) =>
                      setCommercialRegistration(file as File | null)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>{FILE_UPLOAD_MESSAGES.vatCertificate.title}</Label>
                  <FileUpload
                    accept={["application/pdf", "image/jpeg", "image/png"]}
                    maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                    onChange={(file) => setVatCertificate(file as File | null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{FILE_UPLOAD_MESSAGES.nationalAddress.title}</Label>
                  <FileUpload
                    accept={["application/pdf", "image/jpeg", "image/png"]}
                    maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                    onChange={(file) => setNationalAddress(file as File | null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    {FILE_UPLOAD_MESSAGES.projectsAndPreviousWorkRecord.title}
                  </Label>
                  <FileUpload
                    accept={["application/pdf", "image/jpeg", "image/png"]}
                    maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                    onChange={(file) =>
                      setProjectsAndPreviousWorkRecord(file as File | null)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    {FILE_UPLOAD_MESSAGES.officialContactInformation.title}
                  </Label>
                  <FileUpload
                    accept={["application/pdf", "image/jpeg", "image/png"]}
                    maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                    onChange={(file) =>
                      setOfficialContactInformation(file as File | null)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>{FILE_UPLOAD_MESSAGES.bankAccountDetails.title}</Label>
                  <FileUpload
                    accept={["application/pdf", "image/jpeg", "image/png"]}
                    maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                    onChange={(file) =>
                      setBankAccountDetails(file as File | null)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>
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

                <div className="space-y-2">
                  <Label>{FILE_UPLOAD_MESSAGES.companyProfile.title}</Label>
                  <FileUpload
                    accept={["application/pdf", "image/jpeg", "image/png"]}
                    maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                    onChange={(file) => setCompanyProfile(file as File | null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
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

                <div className="space-y-2">
                  <Label>
                    {FILE_UPLOAD_MESSAGES.qualityCertificates.title}
                  </Label>
                  <FileUpload
                    accept={["application/pdf", "image/jpeg", "image/png"]}
                    maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                    multiple={true}
                    onChange={(files) =>
                      setQualityCertificates(files as File[])
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>{FILE_UPLOAD_MESSAGES.otherFiles.title}</Label>
                  <FileUpload
                    accept={["application/pdf", "image/jpeg", "image/png"]}
                    maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                    multiple={true}
                    onChange={(files) => setOtherFiles(files as File[])}
                  />
                </div>
              </div>

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

export default ContractorTechnicalOperationalInfoStep;
