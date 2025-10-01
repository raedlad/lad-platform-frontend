"use client";
import { z } from "zod";
import { getProfileValidationMessages } from "./validationMessages";

export const createProfileValidationSchemas = (t: (key: string) => string) => {
  const messages = getProfileValidationMessages(t);

  const IndividualProfilePersonalInfoSchema = z.object({
    first_name: z.string().min(2, messages.firstName.minLength),
    last_name: z.string().min(2, messages.lastName.minLength),
    country_id: z.number().optional().nullable(),
    state_id: z.number().optional().nullable(),
    city_id: z.number().optional().nullable(),
    national_id: z
      .string()
      .min(10, messages.nationalId.minLength)
      .optional()
      .or(z.literal("")),
    detailed_address: z.string().optional(),
    about_me: z.string().optional(),
  });

  const OrganizationPersonalInfoProfileSchema = z.object({
    company_name: z
      .string()
      .min(1, messages.companyName.required)
      .max(255, messages.companyName.maxLength),
    commercial_register_number: z
      .string()
      .min(1, messages.commercialRegistrationNumber.required)
      .max(50, messages.commercialRegistrationNumber.maxLength),
    representative_name: z
      .string()
      .min(1, messages.authorizedPersonName.required)
      .max(255, messages.authorizedPersonName.maxLength),
    representative_person_phone: z
      .string()
      .min(1, messages.authorizedPersonPhoneNumber.required)
      .max(20, messages.authorizedPersonPhoneNumber.maxLength),
    representative_person_email: z
      .string()
      .email(messages.email.invalid)
      .min(1, messages.email.required)
      .max(255, messages.email.maxLength),
    has_government_accreditation: z.boolean(),
    detailed_address: z
      .string()
      .min(1, messages.detailedAddress.required)
      .max(500, messages.detailedAddress.maxLength),
    vat_number: z
      .string()
      .min(1, messages.vatNumber.required)
      .max(20, messages.vatNumber.maxLength),
    about_us: z.string().max(1000, messages.aboutUs.maxLength).optional(),
    country_id: z.number().min(1, messages.countryId.required),
    state_id: z.number().min(1, messages.stateId.required),
    city_id: z.number().min(1, messages.cityId.required),
    representative_id_image: z.instanceof(File).optional(),
  });

  const FreelanceEngineerPersonalInfoProfileSchema = z
    .object({
      country_id: z.number().min(1, messages.countryId.required),
      city_id: z.number().min(1, messages.cityId.required),
      state_id: z.number().min(1, messages.stateId.required),
      full_name: z
        .string()
        .min(1, messages.fullName.required)
        .max(255, messages.fullName.maxLength),
      national_id: z
        .string()
        .min(1, messages.nationalId.required)
        .max(20, messages.nationalId.maxLength),
      engineers_association_number: z
        .string()
        .min(1, messages.engineersAssociationNumber.required)
        .max(50, messages.engineersAssociationNumber.maxLength),
      about_me: z
        .string()
        .min(1, messages.aboutMe.required)
        .max(1000, messages.aboutMe.maxLength),
      engineering_type_id: z.number().min(1, messages.engineeringType.required),
      experience_years_range_id: z
        .number()
        .min(1, messages.experienceYearsRange.required),
      is_associated_with_office: z.boolean().optional(),
      associated_office_name: z
        .string()
        .max(255, messages.associatedOfficeName.maxLength)
        .optional(),
    })
    .refine(
      (data) => {
        // Only require office name if associated with office is true
        if (data.is_associated_with_office === true) {
          return (
            data.associated_office_name &&
            data.associated_office_name.trim().length > 0
          );
        }
        return true;
      },
      {
        message:
          messages.associatedOfficeName.required ||
          "Office name is required when associated with office",
        path: ["associated_office_name"],
      }
    );

  const FreelanceEngineerProfessionalInfoSchema = z.object({
    experience_years_range_id: z.number().optional(),
    is_associated_with_office: z.boolean().optional(),
    associated_office_name: z.string().optional(),
    specializations: z.array(
      z.object({
        engineering_specialization_id: z.number(),
        other_specialization: z.string().optional(),
        specialization_notes: z.string().optional(),
        is_primary_specialization: z.boolean().optional(),
        expertise_level: z
          .enum(["beginner", "intermediate", "advanced", "expert"])
          .optional(),
      })
    ),
    geographical_coverage: z.array(
      z.object({
        country_code: z.string().min(1, "Country is required"),
        state_id: z.string().min(1, "State is required"),
        city_id: z.number(),
        notes: z.string().optional(),
      })
    ),
    experiences: z
      .array(
        z.object({
          engineering_specialization_id: z.number().optional(),
          other_specialization: z.string().optional(),
        })
      )
      .optional(),
  });

  const EngineeringOfficePersonalInfoProfileSchema = z.object({
    country_id: z.number().min(1, messages.countryId.required).nullable(),
    city_id: z.number().min(1, messages.cityId.required).nullable(),
    state_id: z.number().min(1, messages.stateId.required).nullable(),
    engineering_type_id: z
      .number()
      .min(1, messages.engineeringType.required)
      .nullable(),
    office_name: z
      .string()
      .min(1, messages.officeName.required)
      .max(255, messages.officeName.maxLength),
    license_number: z
      .string()
      .min(1, messages.professionalLicenseNumber.required)
      .max(50, "License number is too long"),
    authorized_person_name: z
      .string()
      .min(1, messages.authorizedPersonName.required)
      .max(255, messages.authorizedPersonName.maxLength),
    authorized_person_phone: z
      .string()
      .min(1, messages.authorizedPersonPhoneNumber.required)
      .max(20, messages.authorizedPersonPhoneNumber.maxLength),
    representative_email: z
      .string()
      .email(messages.email.invalid)
      .min(1, messages.email.required)
      .max(255, messages.email.maxLength),
    about_us: z
      .string()
      .min(1, messages.aboutUs.required)
      .max(1000, messages.aboutUs.maxLength),
    delegation_form: z
      .any()
      .refine((file) => file instanceof File && file.size > 0, {
        message: messages.delegationForm.required,
      }),
  });

  const EngineeringOfficeProfessionalInfoSchema = z.object({
    experience_years_range_id: z
      .number()
      .min(1, messages.experienceYearsRange.required),
    staff_size_range_id: z.number().min(1, messages.staffSizeRange.required),
    annual_projects_range_id: z
      .number()
      .min(1, messages.annualProjectsRange.required),
    has_government_accreditation: z.boolean(),
    classification_file: z
      .any()
      .refine((file) => file instanceof File && file.size > 0, {
        message: messages.classificationFile.required,
      })
      .optional(),
    custom_name: z.string().optional(),
    description: z.string().optional(),
    expiry_date: z.string().optional(),
    specializations: z
      .array(
        z.object({
          engineering_specialization_id: z.number(),
          other_specialization: z.string().optional(),
          specialization_notes: z.string().optional(),
          is_primary_specialization: z.boolean().optional(),
          expertise_level: z
            .enum(["beginner", "intermediate", "advanced", "expert"])
            .optional(),
        })
      )
      .min(1, messages.officeSpecializations.required),
    geographical_coverage: z
      .array(
        z.object({
          country_code: z.string().min(1, messages.countryId.required),
          state_id: z.string().min(1, messages.stateId.required),
          city_id: z.number(),
          notes: z.string().optional(),
        })
      )
      .min(1, messages.geographicalCoverage.required),
  });
  const ContractorPersonalInfoProfileSchema = z.object({
    company_name: z.string().min(2, messages.companyName.required),
    commercial_registration_number: z
      .string()
      .min(1, messages.commercialRegistrationNumber.required),
    authorized_person_name: z
      .string()
      .min(2, messages.authorizedPersonName.minLength),
    authorized_person_phone: z
      .string()
      .min(9, messages.authorizedPersonPhoneNumber.minLength),
    representative_email: z.string().email(messages.email.invalid),
    delegation_form: z
      .any()
      .refine((file) => file instanceof File && file.size > 0, {
        message: messages.delegationForm.required,
      }),
    country_id: z.string().optional(),
    state_id: z.string().optional(),
    city_id: z.string().optional(),
  });

  const SupplierPersonalInfoProfileSchema = z.object({
    company_name: z
      .string()
      .min(1, messages.companyName.required)
      .max(255, messages.companyName.maxLength),
    commercial_registration_number: z
      .string()
      .min(1, messages.commercialRegistrationNumber.required)
      .max(50, messages.commercialRegistrationNumber.maxLength),
    authorized_person_name: z
      .string()
      .min(1, messages.authorizedPersonName.required)
      .max(255, messages.authorizedPersonName.maxLength),
    authorized_person_phone: z
      .string()
      .min(1, messages.authorizedPersonPhoneNumber.required)
      .max(20, messages.authorizedPersonPhoneNumber.maxLength),
    representative_email: z
      .string()
      .email(messages.email.invalid)
      .min(1, messages.email.required)
      .max(255, messages.email.maxLength),
    country_id: z.number().optional().nullable(),
    city_id: z.number().optional().nullable(),
    state_id: z.number().optional().nullable(),
  });

  const SupplierProfessionalInfoSchema = z.object({
    experience_years_range_id: z
      .number()
      .min(1, messages.experienceYearsRange.required),
    classification_file: z
      .union([
        z.instanceof(File).refine((file) => file.size > 0, {
          message: messages.classificationFile.required,
        }),
        z.string().min(1, messages.classificationFile.required),
        z.undefined(),
        z.null(),
      ])
      .optional(),
    has_government_accreditation: z.boolean(),
    work_fields: z
      .array(
        z.object({
          work_field_id: z
            .string()
            .min(1, messages.workFields.required)
            .transform((val) => parseInt(val, 10))
            .refine((val) => !isNaN(val) && val > 0, {
              message: messages.workFields.required,
            }),
          field_specific_notes: z.string().optional(),
        })
      )
      .min(1, messages.workFields.required),
    geographical_coverage: z
      .array(
        z.object({
          country_code: z.string().min(1, messages.countryId.required),
          state_id: z
            .string()
            .min(1, messages.stateId.required)
            .transform((val) => parseInt(val, 10))
            .refine((val) => !isNaN(val) && val > 0, {
              message: messages.stateId.required,
            }),
          city_id: z
            .string()
            .min(1, messages.cityId.required)
            .transform((val) => parseInt(val, 10))
            .refine((val) => !isNaN(val) && val > 0, {
              message: messages.cityId.required,
            }),
          covers_all_areas: z.boolean(),
          specific_areas: z.array(z.string()).optional(),
          priority: z.enum(["high", "medium", "low"]).optional(),
          notes: z.string().optional(),
        })
      )
      .min(1, messages.geographicalCoverage.required)
      .refine(
        (coverage) =>
          coverage.every((item) => item !== null && item !== undefined),
        {
          message: messages.geographicalCoverage.required,
        }
      ),
  });

  return {
    IndividualProfilePersonalInfoSchema,
    ContractorPersonalInfoProfileSchema,
    SupplierPersonalInfoProfileSchema,
    SupplierProfessionalInfoSchema,
    OrganizationPersonalInfoProfileSchema,
    FreelanceEngineerPersonalInfoProfileSchema,
    FreelanceEngineerProfessionalInfoSchema,
    EngineeringOfficePersonalInfoProfileSchema,
    EngineeringOfficeProfessionalInfoSchema,
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

// Legacy export for backward compatibility

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
export const createContractorOperationalSchema = (
  t: (key: string) => string
) => {
  const messages = getProfileValidationMessages(t);

  return z.object({
    executed_project_range_id: z
      .number()
      .min(1, messages.executedProjectRange.required),
    staff_size_range_id: z.number().min(1, messages.staffSizeRange.required),
    experience_years_range_id: z
      .number()
      .min(1, messages.experienceYearsRange.required),
    annual_projects_range_id: z
      .number()
      .min(1, messages.annualProjectsRange.required),
    classification_level_id: z.number().optional(),
    classification_file: z
      .union([
        z.instanceof(File).refine((file) => file.size > 0, {
          message: messages.classificationFile.required,
        }),
        z.string().min(1, messages.classificationFile.required),
        z.undefined(),
        z.null(),
      ])
      .optional(),
    has_government_accreditation: z
      .boolean()
      .refine((val) => val !== null && val !== undefined, {
        message: messages.hasGovernmentAccreditation.required,
      }),
    covers_all_regions: z
      .boolean()
      .refine((val) => val !== null && val !== undefined, {
        message: messages.coversAllRegions.required,
      }),
    target_project_value_range_ids: z.array(z.number()).optional(), // Made optional as per API
    work_fields: z
      .array(
        z.object({
          work_field_id: z.number().min(1, messages.workFields.required),
          years_of_experience_in_field: z
            .number()
            .min(1, messages.workFields.yearsOfExperience),
        })
      )
      .min(1, messages.workFields.required),
    operational_geographical_coverage: z
      .array(
        z.object({
          country_code: z
            .string()
            .min(1, messages.operationalGeographicalCoverage.countryRequired),
          state_id: z
            .string()
            .min(1, messages.operationalGeographicalCoverage.stateRequired),
          city_id: z
            .string()
            .min(1, messages.operationalGeographicalCoverage.cityRequired),
          covers_all_areas: z.boolean(),
        })
      )
      .min(1, messages.operationalGeographicalCoverage.required),
    contractor_geographic_coverages: z
      .array(
        z.object({
          country_code: z
            .string()
            .min(1, messages.contractorGeographicCoverages.countryRequired),
          state_id: z
            .string()
            .min(1, messages.contractorGeographicCoverages.stateRequired),
          city_id: z
            .string()
            .min(1, messages.contractorGeographicCoverages.cityRequired),
          covers_all_areas: z.boolean(),
        })
      )
      .min(1, messages.contractorGeographicCoverages.required),
  });
};

// Export the type for use in other files
export type ContractorOperationalFormData = z.infer<
  ReturnType<typeof createContractorOperationalSchema>
>;

// Legacy schema for backward compatibility
