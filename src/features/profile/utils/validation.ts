"use client";
import { z } from "zod";
import { getProfileValidationMessages } from "./validationMessages";

export const createProfileValidationSchemas = (t: (key: string) => string) => {
  const messages = getProfileValidationMessages(t);

  const IndividualProfilePersonalInfoSchema = z.object({
    fullName: z.string().min(2, messages.fullName.minLength),
    phoneNumber: z.string().min(9, messages.phoneNumber.minLength), // Made optional for email/third-party
    email: z
      .string()
      .email(messages.email.invalid)
      .optional()
      .or(z.literal("")),
    nationalId: z
      .string()
      .min(10, messages.nationalId.minLength)
      .optional()
      .or(z.literal("")),
  });

  const OrganizationPersonalInfoProfileSchema = z.object({
    organizationName: z.string().min(2, messages.organizationName.required),
    authorizedPersonName: z
      .string()
      .min(2, messages.authorizedPersonName.minLength),
    organizationEmail: z.string().email(messages.email.invalid).optional(),
    authorizedPersonPhoneNumber: z
      .string()
      .min(9, messages.phoneNumber.minLength),
  });

  const FreelanceEngineerPersonalInfoProfileSchema = z.object({
    fullName: z.string().min(2, messages.fullName.minLength),
    email: z.string().email(messages.email.invalid).optional(),
    phoneNumber: z.string().min(9, messages.phoneNumber.minLength),
  });

  const EngineeringOfficePersonalInfoProfileSchema = z.object({
    officeName: z.string().min(2, messages.officeName.required),
    authorizedPersonName: z
      .string()
      .min(2, messages.authorizedPersonName.minLength),
    email: z.string().email(messages.email.invalid).optional(),
    authorizedPersonPhoneNumber: z
      .string()
      .min(9, messages.authorizedPersonPhoneNumber.minLength),
    professionalLicenseNumber: z
      .string()
      .min(1, messages.professionalLicenseNumber.required),
  });

  const ContractorPersonalInfoProfileSchema = z.object({
    companyName: z.string().min(2, messages.companyName.required),
    commercialRegistrationNumber: z
      .string()
      .min(1, messages.commercialRegistrationNumber.required),
    authorizedPersonName: z
      .string()
      .min(2, messages.authorizedPersonName.minLength),
    email: z.string().email(messages.email.invalid),
    authorizedPersonPhoneNumber: z
      .string()
      .min(9, messages.authorizedPersonPhoneNumber.minLength),
    representativeEmail: z.string().email(messages.email.invalid),
    delegationForm: z
      .any()
      .refine((file) => file instanceof File && file.size > 0, {
        message: "Delegation form is required",
      }),
    companyLogo: z
      .any()
      .refine((file) => file instanceof File && file.size > 0, {
        message: "Company logo is required",
      }),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
  });

  const SupplierPersonalInfoProfileSchema = z.object({
    commercialEstablishmentName: z
      .string()
      .min(2, messages.commercialEstablishmentName.required),
    authorizedPersonName: z
      .string()
      .min(2, messages.authorizedPersonName.minLength),
    email: z.string().email(messages.email.invalid).optional(),
    authorizedPersonPhoneNumber: z
      .string()
      .min(9, messages.authorizedPersonPhoneNumber.minLength),
    commercialRegistrationNumber: z
      .string()
      .min(1, messages.commercialRegistrationNumber.required),
  });

  return {
    IndividualProfilePersonalInfoSchema,
    ContractorPersonalInfoProfileSchema,
    SupplierPersonalInfoProfileSchema,
    OrganizationPersonalInfoProfileSchema,
    FreelanceEngineerPersonalInfoProfileSchema,
    EngineeringOfficePersonalInfoProfileSchema,
  };
};
export const IndividualProfileValidationSchema = z.object({
  nationalIdFile: z.instanceof(File).optional(),
});

export const OrganizationProfileValidationSchema = z.object({
  commercialRegistrationFile: z.instanceof(File).optional(),
});
// Individual Profile - File Upload Only
export const IndividualDocumentUploadSchema = z.object({
  nationalIdFile: z.instanceof(File).optional(),
});

// Organization Profile - File Upload Only
export const OrganizationDocumentUploadSchema = z.object({
  commercialRegistrationFile: z.instanceof(File).optional(),
});

// Freelance Engineer Profile - Professional Info + File Upload
export const FreelanceEngineerProfessionalInfoSchema = z
  .object({
    engineeringSpecialization: z
      .array(z.string())
      .min(1, "Please select at least one specialization"),
    yearsOfExperience: z.enum([
      "More than 15 years",
      "10-15 years",
      "5-10 years",
      "Less than 5 years",
    ]),
    typesOfExperience: z
      .array(z.string())
      .min(1, "Please select at least one type of experience"),
    workLocations: z
      .array(z.string())
      .min(1, "Please select at least one work location"),
    currentOfficeAffiliation: z.boolean(),
    officeName: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.currentOfficeAffiliation && !data.officeName) {
        return false;
      }
      return true;
    },
    {
      message: "Office name is required if affiliated",
      path: ["officeName"],
    }
  );

export const FreelanceEngineerDocumentUploadSchema = z.object({
  technicalCV: z.instanceof(File, { message: "Technical CV is required" }),
  personalPhoto: z.instanceof(File, { message: "Personal photo is required" }),
  saudiCouncilOfEngineersCardCopy: z.instanceof(File, {
    message: "Saudi Council of Engineers card copy is required",
  }),
  trainingCertificates: z.array(z.instanceof(File)).optional(),
  professionalCertificates: z.array(z.instanceof(File)).optional(),
  personalProfile: z.instanceof(File).optional(),
  recommendationLetters: z.array(z.instanceof(File)).optional(),
  workSamples: z.array(z.instanceof(File)).optional(),
});

// Engineering Office Profile - Professional Info + File Upload
export const EngineeringOfficeTechnicalOperationalInfoSchema = z
  .object({
    officeSpecializations: z
      .array(z.string())
      .min(1, "Please select at least one specialization"),
    yearsOfExperience: z.enum([
      "More than 20 years",
      "15-20 years",
      "10-15 years",
      "5-10 years",
      "Less than 5 years",
    ]),
    numberOfEmployees: z.enum([
      "More than 50",
      "30-50",
      "10-30",
      "Less than 10",
    ]),
    annualProjectVolume: z.enum([
      "More than 50 projects",
      "30-50 projects",
      "10-30 projects",
      "Less than 10 projects",
    ]),
    geographicCoverage: z
      .array(z.string())
      .min(1, "Please select at least one geographic coverage area"),
    officialAccreditations: z.boolean(),
    accreditationDocument: z.instanceof(File).optional(),
  })
  .refine(
    (data) => {
      if (data.officialAccreditations && !data.accreditationDocument) {
        return false;
      }
      return true;
    },
    {
      message:
        "Accreditation document is required if official accreditations are selected",
      path: ["accreditationDocument"],
    }
  );

export const EngineeringOfficeDocumentUploadSchema = z.object({
  saudiCouncilOfEngineersLicense: z.instanceof(File, {
    message: "Saudi Council of Engineers license is required",
  }),
  commercialRegistration: z.instanceof(File).optional(),
  nationalAddress: z.instanceof(File, {
    message: "National address is required",
  }),
  bankAccountDetails: z.instanceof(File, {
    message: "Bank account details are required",
  }),
  vatCertificate: z.instanceof(File, {
    message: "VAT certificate is required",
  }),
  previousWorkRecord: z.instanceof(File, {
    message: "Previous work record is required",
  }),
  officialContactInformation: z.instanceof(File, {
    message: "Official contact information is required",
  }),
  engineeringClassificationCertificate: z.instanceof(File).optional(),
  qualityCertificates: z.array(z.instanceof(File)).optional(),
  chamberOfCommerceMembership: z.instanceof(File).optional(),
  zakatAndIncomeCertificate: z.instanceof(File).optional(),
  companyProfile: z.instanceof(File).optional(),
  organizationalStructure: z.instanceof(File).optional(),
  additionalFiles: z.array(z.instanceof(File)).optional(),
});

// Contractor Profile - Professional Info + File Upload
export const ContractorTechnicalOperationalInfoSchema = z
  .object({
    projectSizeCompleted: z.enum([
      "Over 50 million",
      "25-50 million",
      "10-25 million",
      "5-10 million",
      "Less than 5 million",
    ]),
    targetProjectSize: z
      .array(z.string())
      .min(1, "Please select at least one target project size"),
    totalEmployees: z.enum([
      "More than 300",
      "100-300",
      "50-100",
      "25-50",
      "Less than 25",
    ]),
    governmentAccreditations: z.boolean(),
    contractorClassification: z.enum([
      "First through seventh classification",
      "Classification file upload if applicable",
    ]),
    classificationFile: z.instanceof(File).optional(),
    workFields: z
      .array(z.string())
      .min(1, "Please select at least one work field"),
    geographicSpread: z
      .array(z.string())
      .min(1, "Please select at least one geographic spread area"),
    yearsOfExperience: z.enum([
      "More than 20 years",
      "15-20 years",
      "10-15 years",
      "5-10 years",
      "Less than 5 years",
    ]),
    annualProjectVolume: z.enum([
      "More than 30 projects",
      "20-30 projects",
      "10-20 projects",
      "5-10 projects",
      "Less than 5 projects",
    ]),
  })
  .refine(
    (data) => {
      if (
        data.contractorClassification ===
          "Classification file upload if applicable" &&
        !data.classificationFile
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Classification file is required if 'Classification file upload if applicable' is selected",
      path: ["classificationFile"],
    }
  );

export const ContractorDocumentUploadSchema = z.object({
  socialInsuranceCertificate: z.instanceof(File, {
    message: "Social insurance certificate is required",
  }),
  commercialRegistration: z.instanceof(File, {
    message: "Commercial registration is required",
  }),
  vatCertificate: z.instanceof(File, {
    message: "VAT certificate is required",
  }),
  nationalAddress: z.instanceof(File, {
    message: "National address is required",
  }),
  projectsAndPreviousWorkRecord: z.instanceof(File, {
    message: "Projects and previous work record is required",
  }),
  officialContactInformation: z.instanceof(File, {
    message: "Official contact information is required",
  }),
  bankAccountDetails: z.instanceof(File, {
    message: "Bank account details are required",
  }),
  chamberOfCommerceMembership: z.instanceof(File).optional(),
  companyProfile: z.instanceof(File).optional(),
  organizationalStructure: z.instanceof(File).optional(),
  qualityCertificates: z.array(z.instanceof(File)).optional(),
  otherFiles: z.array(z.instanceof(File)).optional(),
});

// Supplier Profile - Professional Info + File Upload
export const SupplierOperationalCommercialInfoSchema = z
  .object({
    supplyAreas: z
      .array(z.string())
      .min(1, "Please select at least one supply area"),
    serviceCoverage: z
      .array(z.string())
      .min(1, "Please select at least one service coverage area"),
    yearsOfExperience: z.enum([
      "More than 10 years",
      "5-10 years",
      "Less than 5 years",
    ]),
    governmentPrivateDealings: z.boolean(),
    supportingDocuments: z.array(z.instanceof(File)).optional(),
  })
  .refine(
    (data) => {
      if (
        data.governmentPrivateDealings &&
        (!data.supportingDocuments || data.supportingDocuments.length === 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Supporting documents are required if government/private dealings is selected",
      path: ["supportingDocuments"],
    }
  );

export const SupplierDocumentUploadSchema = z.object({
  commercialRegistration: z.instanceof(File, {
    message: "Commercial registration is required",
  }),
  vatCertificate: z.instanceof(File).optional(),
  nationalAddress: z.instanceof(File, {
    message: "National address is required",
  }),
  bankAccountDetails: z.instanceof(File, {
    message: "Bank account details are required",
  }),
  accreditationCertificates: z.array(z.instanceof(File)).optional(),
  establishmentProfile: z.instanceof(File).optional(),
  administrativeStructure: z.instanceof(File).optional(),
  previousContracts: z.array(z.instanceof(File)).optional(),
  thankYouLetters: z.array(z.instanceof(File)).optional(),
  additionalCredibilityDocuments: z.array(z.instanceof(File)).optional(),
});

// Contractor Operational Information Schema
export const ContractorOperationalSchema = z.object({
  executed_project_range_id: z
    .number()
    .min(1, "Executed project range is required"),
  staff_size_range_id: z.number().min(1, "Staff size range is required"),
  experience_years_range_id: z
    .number()
    .min(1, "Experience years range is required"),
  annual_projects_range_id: z
    .number()
    .min(1, "Annual projects range is required"),
  classification_level_id: z.number().optional(),
  classification_file: z.instanceof(File).optional(),
  has_government_accreditation: z.boolean(),
  covers_all_regions: z.boolean(),
  target_project_value_range_ids: z
    .array(z.number())
    .min(1, "At least one target project value range is required"),
  work_fields: z
    .array(
      z.object({
        work_field_id: z.number(),
        years_of_experience_in_field: z
          .number()
          .min(1, "Years of experience must be at least 1"),
      })
    )
    .min(1, "At least one work field is required"),
  operational_geographical_coverage: z
    .array(
      z.object({
        country_code: z.string().min(1, "Country is required"),
        state_id: z.string().optional(),
        city_id: z.string().optional(),
        covers_all_areas: z.boolean(),
      })
    )
    .min(1, "At least one geographical coverage area is required"),
  contractor_geographic_coverages: z
    .array(
      z.object({
        country_code: z.string().min(1, "Country is required"),
        state_id: z.string().optional(),
        city_id: z.string().optional(),
        covers_all_areas: z.boolean(),
      })
    )
    .min(1, "At least one contractor geographic coverage is required"),
});
