import { z } from "zod";
import { VALIDATION_MESSAGES } from "@auth/constants/individualRegistration";

export const EmailLoginSchema = z.object({
  email: z.string().email(VALIDATION_MESSAGES.email.invalid),
  password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
});
// Common validation schemas for reuse
export const validationSchemas = {
  name: z.string().min(2, VALIDATION_MESSAGES.firstName.minLength),
  email: z.string().email(VALIDATION_MESSAGES.email.invalid),
  phone: z.string().min(9, VALIDATION_MESSAGES.phoneNumber.minLength),
};
export const PhoneLoginSchema = z.object({
  phoneNumber: z.string().min(9, VALIDATION_MESSAGES.phoneNumber.minLength),
  // Assuming OTP is used for login instead of a password for phone
});

// Unified schema for individual personal information (replaces individualUnifiedPersonalInfoSchema)
export const PersonalInfoSchema = z
  .object({
    firstName: z.string().min(2, VALIDATION_MESSAGES.firstName.minLength),
    lastName: z.string().min(2, VALIDATION_MESSAGES.lastName.minLength),
    phoneNumber: z
      .string()
      .min(9, VALIDATION_MESSAGES.phoneNumber.minLength)
      .optional(), // Made optional for email/third-party
    email: z.string().email(VALIDATION_MESSAGES.email.invalid).optional(),
    password: z
      .string()
      .min(8, VALIDATION_MESSAGES.password.minLength)
      .optional(),
    confirmPassword: z.string().optional(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: VALIDATION_MESSAGES.terms.required,
    }),
    nationalIdFile: z.instanceof(File).optional(),
  })
  .refine(
    (data) => {
      // Password validation only for email and phone auth methods if present
      if (
        (data.password || data.confirmPassword) &&
        data.password !== data.confirmPassword
      ) {
        return false;
      }
      return true;
    },
    {
      message: VALIDATION_MESSAGES.confirmPassword.mismatch,
      path: ["confirmPassword"],
    }
  );

// Specific schemas for different authentication methods (can be derived or separate)
// Email-based registration/login
export const IndividualEmailRegistrationSchema = PersonalInfoSchema.extend({
  email: z.string().email(VALIDATION_MESSAGES.email.invalid),
  password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
  confirmPassword: z.string(),
  phoneNumber: z.string().min(9, VALIDATION_MESSAGES.phoneNumber.minLength),
});

// Phone-based registration/login
export const IndividualPhoneRegistrationSchema = PersonalInfoSchema.extend({
  phoneNumber: z.string().min(9, VALIDATION_MESSAGES.phoneNumber.minLength),
  password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
  confirmPassword: z.string(),
});

export const IndividualThirdPartyRegistrationSchema = PersonalInfoSchema.extend(
  {
    email: z.string().email(VALIDATION_MESSAGES.email.invalid),
    phoneNumber: z.string().min(9, VALIDATION_MESSAGES.phoneNumber.minLength),
  }
);

export const OTPVerificationSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
});

// Third-party registration (minimal info needed)

// Example for password reset
export const PasswordResetSchema = z.object({
  email: z.string().email(VALIDATION_MESSAGES.email.invalid),
});

// Example for setting new password after reset
export const NewPasswordSchema = z
  .object({
    password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.confirmPassword.mismatch,
    path: ["confirmPassword"],
  });

// Institution-specific Zod Schemas
export const InstitutionPersonalInfoSchema = z
  .object({
    institutionName: z.string().min(2, "Institution name is required"),
    contactPersonFirstName: z
      .string()
      .min(2, VALIDATION_MESSAGES.firstName.minLength),
    contactPersonLastName: z
      .string()
      .min(2, VALIDATION_MESSAGES.lastName.minLength),
    institutionEmail: z
      .string()
      .email(VALIDATION_MESSAGES.email.invalid)
      .optional(),
    institutionPhoneNumber: z
      .string()
      .min(9, VALIDATION_MESSAGES.phoneNumber.minLength)
      .optional(),
    password: z
      .string()
      .min(8, VALIDATION_MESSAGES.password.minLength)
      .optional(),
    confirmPassword: z.string().optional(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: VALIDATION_MESSAGES.terms.required,
    }),
    commercialRegistrationFile: z.instanceof(File).optional(),
  })
  .refine(
    (data) => {
      if (
        (data.password || data.confirmPassword) &&
        data.password !== data.confirmPassword
      ) {
        return false;
      }
      return true;
    },
    {
      message: VALIDATION_MESSAGES.confirmPassword.mismatch,
      path: ["confirmPassword"],
    }
  );

export const InstitutionEmailRegistrationSchema =
  InstitutionPersonalInfoSchema.extend({
    institutionEmail: z.string().email(VALIDATION_MESSAGES.email.invalid),
    password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
    confirmPassword: z.string(),
    institutionPhoneNumber: z.string().optional(),
  });

export const InstitutionPhoneRegistrationSchema =
  InstitutionPersonalInfoSchema.extend({
    institutionPhoneNumber: z
      .string()
      .min(9, VALIDATION_MESSAGES.phoneNumber.minLength),
    password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
    confirmPassword: z.string(),
    institutionEmail: z
      .string()
      .email(VALIDATION_MESSAGES.email.invalid)
      .optional(),
  });

export const InstitutionThirdPartyRegistrationSchema =
  InstitutionPersonalInfoSchema.extend({
    institutionEmail: z.string().email(VALIDATION_MESSAGES.email.invalid),
    institutionPhoneNumber: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  });

// Freelance Engineer-specific Zod Schemas
export const FreelanceEngineerPersonalInfoSchema = z
  .object({
    firstName: z.string().min(2, VALIDATION_MESSAGES.firstName.minLength),
    lastName: z.string().min(2, VALIDATION_MESSAGES.lastName.minLength),
    phoneNumber: z
      .string()
      .min(9, VALIDATION_MESSAGES.phoneNumber.minLength)
      .optional(),
    email: z.string().email(VALIDATION_MESSAGES.email.invalid).optional(),
    password: z
      .string()
      .min(8, VALIDATION_MESSAGES.password.minLength)
      .optional(),
    confirmPassword: z.string().optional(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: VALIDATION_MESSAGES.terms.required,
    }),
    engineeringLicenseFile: z.instanceof(File).optional(), // Specific field for freelance engineer
  })
  .refine(
    (data) => {
      if (
        (data.password || data.confirmPassword) &&
        data.password !== data.confirmPassword
      ) {
        return false;
      }
      return true;
    },
    {
      message: VALIDATION_MESSAGES.confirmPassword.mismatch,
      path: ["confirmPassword"],
    }
  );

export const FreelanceEngineerEmailRegistrationSchema =
  FreelanceEngineerPersonalInfoSchema.extend({
    email: z.string().email(VALIDATION_MESSAGES.email.invalid),
    password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
    confirmPassword: z.string(),
    phoneNumber: z.string().optional(),
  });

export const FreelanceEngineerPhoneRegistrationSchema =
  FreelanceEngineerPersonalInfoSchema.extend({
    phoneNumber: z.string().min(9, VALIDATION_MESSAGES.phoneNumber.minLength),
    password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
    confirmPassword: z.string(),
    email: z.string().email(VALIDATION_MESSAGES.email.invalid).optional(),
  });

export const FreelanceEngineerThirdPartyRegistrationSchema =
  FreelanceEngineerPersonalInfoSchema.extend({
    email: z.string().email(VALIDATION_MESSAGES.email.invalid),
    phoneNumber: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  });

// Freelance Engineer Professional Information Zod Schema
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
        return false; // If affiliated, office name is required
      }
      return true;
    },
    {
      message: "Office name is required if affiliated",
      path: ["officeName"],
    }
  );

// Freelance Engineer Document Upload Zod Schema
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

// Engineering Office-specific Zod Schemas
export const EngineeringOfficePersonalInfoSchema = z
  .object({
    officeName: z.string().min(2, "Engineering office name is required"),
    professionalLicenseNumber: z
      .string()
      .min(1, "Professional license number is required"),
    authorizedPersonName: z
      .string()
      .min(2, VALIDATION_MESSAGES.firstName.minLength),
    authorizedPersonMobileNumber: z
      .string()
      .min(9, VALIDATION_MESSAGES.phoneNumber.minLength),
    email: z.string().email(VALIDATION_MESSAGES.email.invalid),
    password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
    confirmPassword: z.string(),
    authorizationForm: z.instanceof(File, {
      message: "Authorization form is required",
    }),
    officeLogo: z
      .instanceof(File, { message: "Office logo is required" })
      .optional(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.confirmPassword.mismatch,
    path: ["confirmPassword"],
  });

export const EngineeringOfficeEmailRegistrationSchema =
  EngineeringOfficePersonalInfoSchema.extend({
    email: z.string().email(VALIDATION_MESSAGES.email.invalid),
    password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
    confirmPassword: z.string(),
  });

export const EngineeringOfficePhoneRegistrationSchema =
  EngineeringOfficePersonalInfoSchema.extend({
    authorizedPersonMobileNumber: z
      .string()
      .min(9, VALIDATION_MESSAGES.phoneNumber.minLength),
    password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
    confirmPassword: z.string(),
  });

export const EngineeringOfficeThirdPartyRegistrationSchema =
  EngineeringOfficePersonalInfoSchema.extend({
    email: z.string().email(VALIDATION_MESSAGES.email.invalid),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  });

// Engineering Office Technical and Operational Information Zod Schema
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
        return false; // If accredited, document is required
      }
      return true;
    },
    {
      message:
        "Accreditation document is required if official accreditations are selected",
      path: ["accreditationDocument"],
    }
  );

// Engineering Office Document Upload Zod Schema
export const EngineeringOfficeDocumentUploadSchema = z.object({
  saudiCouncilOfEngineersLicense: z.instanceof(File, {
    message: "Saudi Council of Engineers license is required",
  }),
  commercialRegistration: z.instanceof(File).optional(), // Optional based on flow analysis
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

// Contractor-specific Zod Schemas
export const ContractorPersonalInfoSchema = z
  .object({
    companyName: z.string().min(2, "Company name is required"),
    commercialRegistrationNumber: z
      .string()
      .min(1, "Commercial registration number is required"),
    authorizedPersonName: z
      .string()
      .min(2, VALIDATION_MESSAGES.firstName.minLength),
    authorizedPersonMobileNumber: z
      .string()
      .min(9, VALIDATION_MESSAGES.phoneNumber.minLength),
    email: z.string().email(VALIDATION_MESSAGES.email.invalid),
    password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
    confirmPassword: z.string(),
    authorizationForm: z.instanceof(File, {
      message: "Authorization form is required",
    }),
    companyLogo: z
      .instanceof(File, { message: "Company logo is required" })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.confirmPassword.mismatch,
    path: ["confirmPassword"],
  });

export const ContractorEmailRegistrationSchema =
  ContractorPersonalInfoSchema.extend({
    email: z.string().email(VALIDATION_MESSAGES.email.invalid),
    password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
    confirmPassword: z.string(),
  });

export const ContractorPhoneRegistrationSchema =
  ContractorPersonalInfoSchema.extend({
    authorizedPersonMobileNumber: z
      .string()
      .min(9, VALIDATION_MESSAGES.phoneNumber.minLength),
    password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
    confirmPassword: z.string(),
  });

export const ContractorThirdPartyRegistrationSchema =
  ContractorPersonalInfoSchema.extend({
    email: z.string().email(VALIDATION_MESSAGES.email.invalid),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  });

// Contractor Technical and Operational Information Zod Schema
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
        return false; // If classification file upload is selected, file is required
      }
      return true;
    },
    {
      message:
        "Classification file is required if 'Classification file upload if applicable' is selected",
      path: ["classificationFile"],
    }
  );

// Contractor Document Upload Zod Schema
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

// Supplier-specific Zod Schemas
export const SupplierPersonalInfoSchema = z
  .object({
    commercialEstablishmentName: z
      .string()
      .min(2, "Commercial establishment name is required"),
    commercialRegistrationNumber: z
      .string()
      .min(1, "Commercial registration number is required"),
    authorizedPersonName: z
      .string()
      .min(2, VALIDATION_MESSAGES.firstName.minLength),
    authorizedPersonMobileNumber: z
      .string()
      .min(9, VALIDATION_MESSAGES.phoneNumber.minLength),
    email: z.string().email(VALIDATION_MESSAGES.email.invalid),
    password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
    confirmPassword: z.string(),
    officialAuthorizationLetter: z.instanceof(File, {
      message: "Official authorization letter is required",
    }),
    establishmentLogo: z
      .instanceof(File, { message: "Establishment logo is required" })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.confirmPassword.mismatch,
    path: ["confirmPassword"],
  });

export const SupplierEmailRegistrationSchema =
  SupplierPersonalInfoSchema.extend({
    email: z.string().email(VALIDATION_MESSAGES.email.invalid),
    password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
    confirmPassword: z.string(),
  });

export const SupplierPhoneRegistrationSchema =
  SupplierPersonalInfoSchema.extend({
    authorizedPersonMobileNumber: z
      .string()
      .min(9, VALIDATION_MESSAGES.phoneNumber.minLength),
    password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
    confirmPassword: z.string(),
  });

export const SupplierThirdPartyRegistrationSchema =
  SupplierPersonalInfoSchema.extend({
    email: z.string().email(VALIDATION_MESSAGES.email.invalid),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  });

// Supplier Operational and Commercial Information Zod Schema
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
        return false; // If government/private dealings is true, supporting documents are required
      }
      return true;
    },
    {
      message:
        "Supporting documents are required if government/private dealings is selected",
      path: ["supportingDocuments"],
    }
  );

// Supplier Document Upload Zod Schema
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
