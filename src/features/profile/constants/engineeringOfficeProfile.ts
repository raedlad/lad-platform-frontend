import { EngineeringOfficeRegistrationStep } from "@auth/types/engineeringOffice";

export const REGISTRATION_STEPS: EngineeringOfficeRegistrationStep[] = [
  "authMethod",
  "personalInfo",
  "verification",
  "technicalOperationalInfo",
  "documentUpload",
  "planSelection",
  "complete",
];

export const STEP_CONFIG = {
  authMethod: {
    title: "اختر طريقة التسجيل للمكتب الهندسي",
    description: "حدد الطريقة التي تود استخدامها لإنشاء حسابك كمكتب هندسي",
    stepNumber: 1,
  },
  personalInfo: {
    title: "بيانات المكتب والشخص المخول",
    description: "أدخل بيانات المكتب والشخص المخول للمتابعة",
    stepNumber: 2,
  },
  verification: {
    title: "تأكيد حساب المكتب الهندسي",
    description: "أدخل رمز التحقق المرسل إلى حسابك كمكتب هندسي",
    stepNumber: 3,
  },
  technicalOperationalInfo: {
    title: "المعلومات الفنية والتشغيلية",
    description: "أدخل معلومات المكتب الفنية والتشغيلية",
    stepNumber: 4,
  },
  documentUpload: {
    title: "رفع المستندات",
    description: "يرجى رفع المستندات المطلوبة لإكمال التسجيل",
    stepNumber: 5,
  },
  planSelection: {
    title: "اختر خطة الاشتراك",
    description: "اختر الخطة التي تناسب احتياجات مكتبك",
    stepNumber: 6,
  },
  complete: {
    title: "اكتمل تسجيل المكتب الهندسي",
    description: "تم إنشاء حساب مكتبك الهندسي بنجاح",
    stepNumber: 7,
  },
} as const;

export const AUTH_METHOD_LABELS = {
  email: "التسجيل بالبريد الإلكتروني للمكتب الهندسي",
  phone: "التسجيل برقم الهاتف للمكتب الهندسي",
  thirdParty: "التسجيل عبر حساب اجتماعي للمكتب الهندسي",
} as const;

export const AUTH_METHOD_DESCRIPTIONS = {
  email: "أنشئ حساب مكتبك الهندسي باستخدام البريد الإلكتروني",
  phone: "أنشئ حساب مكتبك الهندسي باستخدام رقم الهاتف",
  thirdParty: "المتابعة باستخدام Google Business لحساب المكتب الهندسي",
} as const;

// تسميات الحقول والنصوص التوضيحية
export const FORM_LABELS = {
  officeName: "اسم المكتب الهندسي",
  professionalLicenseNumber: "رقم الترخيص المهني",
  authorizedPersonName: "اسم الشخص المخول",
  authorizedPersonMobileNumber: "رقم جوال الشخص المخول",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  confirmPassword: "تأكيد كلمة المرور",
  officeSpecializations: "تخصصات المكتب",
  yearsOfExperience: "سنوات الخبرة",
  numberOfEmployees: "عدد الموظفين",
  annualProjectVolume: "حجم المشاريع السنوي",
  geographicCoverage: "التغطية الجغرافية",
  officialAccreditations: "اعتمادات رسمية؟",
  accreditationDocument: "وثيقة الاعتماد",
} as const;

export const FORM_PLACEHOLDERS = {
  officeName: "أدخل اسم المكتب الهندسي",
  professionalLicenseNumber: "أدخل رقم الترخيص المهني",
  authorizedPersonName: "أدخل اسم الشخص المخول",
  authorizedPersonMobileNumber: "أدخل رقم جوال الشخص المخول",
  email: "me@example.com",
  password: "أنشئ كلمة مرور",
  confirmPassword: "أعد إدخال كلمة المرور",
  yearsOfExperience: "اختر سنوات الخبرة",
  numberOfEmployees: "اختر عدد الموظفين",
  annualProjectVolume: "اختر حجم المشاريع السنوي",
  officialAccreditations: "حدد إذا كان لديك اعتمادات رسمية",
} as const;

// رسائل التحقق من صحة الإدخال
export const VALIDATION_MESSAGES = {
  officeName: {
    required: "اسم المكتب الهندسي مطلوب",
    minLength: "يجب أن يتكون اسم المكتب من حرفين على الأقل",
  },
  professionalLicenseNumber: {
    required: "رقم الترخيص المهني مطلوب",
  },
  authorizedPersonName: {
    required: "اسم الشخص المخول مطلوب",
    minLength: "يجب أن يتكون اسم الشخص المخول من حرفين على الأقل",
  },
  authorizedPersonMobileNumber: {
    required: "رقم جوال الشخص المخول مطلوب",
    minLength: "يرجى إدخال رقم جوال صالح",
  },
  email: {
    required: "البريد الإلكتروني مطلوب",
    invalid: "يرجى إدخال بريد إلكتروني صالح",
  },
  password: {
    required: "كلمة المرور مطلوبة",
    minLength: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
  },
  confirmPassword: {
    required: "يرجى تأكيد كلمة المرور",
    mismatch: "كلمتا المرور غير متطابقتين",
  },
  terms: {
    required: "يجب أن توافق على الشروط والأحكام",
  },
} as const;

// رسائل رفع الملفات
export const FILE_UPLOAD_MESSAGES = {
  maxSizeMB: 10,
  authorizationForm: {
    title: "نموذج التفويض (مطلوب)",
  },
  officeLogo: {
    title: "شعار المكتب (اختياري)",
  },
  saudiCouncilOfEngineersLicense: {
    title: "ترخيص الهيئة السعودية للمهندسين (مطلوب)",
  },
  commercialRegistration: {
    title: "السجل التجاري (اختياري)",
  },
  nationalAddress: {
    title: "العنوان الوطني (مطلوب)",
  },
  bankAccountDetails: {
    title: "تفاصيل الحساب البنكي (مطلوب)",
  },
  vatCertificate: {
    title: "شهادة ضريبة القيمة المضافة (مطلوب)",
  },
  previousWorkRecord: {
    title: "سجل الأعمال السابقة (مطلوب)",
  },
  officialContactInformation: {
    title: "معلومات الاتصال الرسمية (مطلوب)",
  },
  engineeringClassificationCertificate: {
    title: "شهادة التصنيف الهندسي (اختياري)",
  },
  qualityCertificates: {
    title: "شهادات الجودة (اختياري)",
  },
  chamberOfCommerceMembership: {
    title: "عضوية الغرفة التجارية (اختياري)",
  },
  zakatAndIncomeCertificate: {
    title: "شهادة الزكاة والدخل (اختياري)",
  },
  companyProfile: {
    title: "ملف تعريف الشركة (اختياري)",
  },
  organizationalStructure: {
    title: "الهيكل التنظيمي (اختياري)",
  },
  additionalFiles: {
    title: "ملفات إضافية (اختياري)",
  },
  invalidType: "يرجى رفع ملف بصيغة PDF أو JPG",
  invalidSize: "يجب أن يكون حجم الملف أقل من 10 ميجابايت",
} as const;

// الشروط والأحكام
export const TERMS_TEXT = {
  terms: "اوافق على",
  termsCong: "و",
  termsLink: "شروط الخدمة",
  privacyLink: "سياسة الخصوصية",
} as const;

// Options for Technical and Operational Info
export const OFFICE_SPECIALIZATIONS = [
  "معماري",
  "إنشائي",
  "ميكانيكي",
  "كهربائي",
  "تخطيط حضري",
  "هندسة بيئية",
  "هندسة السلامة",
  "أخرى",
] as const;

export const YEARS_OF_EXPERIENCE_OPTIONS = [
  "More than 20 years",
  "15-20 years",
  "10-15 years",
  "5-10 years",
  "Less than 5 years",
] as const;

export const YEARS_OF_EXPERIENCE_LABELS = {
  "More than 20 years": "أكثر من 20 سنة",
  "15-20 years": "15-20 سنة",
  "10-15 years": "10-15 سنة",
  "5-10 years": "5-10 سنوات",
  "Less than 5 years": "أقل من 5 سنوات",
} as const;

export const NUMBER_OF_EMPLOYEES_OPTIONS = [
  "More than 50",
  "30-50",
  "10-30",
  "Less than 10",
] as const;

export const NUMBER_OF_EMPLOYEES_LABELS = {
  "More than 50": "أكثر من 50",
  "30-50": "30-50",
  "10-30": "10-30",
  "Less than 10": "أقل من 10",
} as const;

export const ANNUAL_PROJECT_VOLUME_OPTIONS = [
  "More than 50 projects",
  "30-50 projects",
  "10-30 projects",
  "Less than 10 projects",
] as const;

export const ANNUAL_PROJECT_VOLUME_LABELS = {
  "More than 50 projects": "أكثر من 50 مشروع",
  "30-50 projects": "30-50 مشروع",
  "10-30 projects": "10-30 مشروع",
  "Less than 10 projects": "أقل من 10 مشاريع",
} as const;

export const GEOGRAPHIC_COVERAGE_OPTIONS = [
  "الرياض",
  "جدة",
  "الدمام",
  "مكة المكرمة",
  "المدينة المنورة",
  "أبها",
  "تبوك",
  "بريدة",
  "حائل",
  "جازان",
  "نجران",
  "الباحة",
  "عرعر",
  "سكاكا",
  "جميع المناطق",
] as const;

export const PLAN_OPTIONS = [
  {
    type: "free",
    name: "الخطة المجانية",
    price: "مجاني",
    features: ["ميزات محدودة", "عدد محدود من المشاريع", "دعم أساسي"],
    buttonText: "اختر الخطة المجانية",
  },
  {
    type: "paid",
    name: "الخطة المدفوعة",
    price: "$XX.XX / شهر",
    features: [
      "جميع الميزات",
      "عدد غير محدود من المشاريع",
      "دعم متميز",
      "أولوية الظهور",
    ],
    buttonText: "الاشتراك الآن",
  },
] as const;
