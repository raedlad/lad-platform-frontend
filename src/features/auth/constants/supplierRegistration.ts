import { SupplierRegistrationStep } from "@auth/types/supplier";

export const REGISTRATION_STEPS: SupplierRegistrationStep[] = [
  "authMethod",
  "personalInfo",
  "verification",
  "operationalCommercialInfo",
  "documentUpload",
  "planSelection",
  "complete",
];

export const STEP_CONFIG = {
  authMethod: {
    title: "اختر طريقة التسجيل للمورد",
    description: "حدد الطريقة التي تود استخدامها لإنشاء حسابك كمورد",
    stepNumber: 1,
  },
  personalInfo: {
    title: "بيانات المنشأة والشخص المخول",
    description: "أدخل بيانات المنشأة والشخص المخول للمتابعة",
    stepNumber: 2,
  },
  verification: {
    title: "تأكيد حساب المورد",
    description: "أدخل رمز التحقق المرسل إلى حسابك كمورد",
    stepNumber: 3,
  },
} as const;

export const AUTH_METHOD_LABELS = {
  email: "التسجيل بالبريد الإلكتروني للمورد",
  phone: "التسجيل برقم الهاتف للمورد",
  thirdParty: "التسجيل عبر حساب اجتماعي للمورد",
} as const;

export const AUTH_METHOD_DESCRIPTIONS = {
  email: "أنشئ حساب المورد باستخدام البريد الإلكتروني",
  phone: "أنشئ حساب المورد باستخدام رقم الهاتف",
  thirdParty: "المتابعة باستخدام Google Business لحساب المورد",
} as const;

// تسميات الحقول والنصوص التوضيحية
export const FORM_LABELS = {
  commercialEstablishmentName: "اسم المنشأة التجارية",
  commercialRegistrationNumber: "رقم السجل التجاري",
  authorizedPersonName: "اسم الشخص المخول",
  authorizedPersonMobileNumber: "رقم جوال الشخص المخول",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  confirmPassword: "تأكيد كلمة المرور",
  officialAuthorizationLetter: "خطاب التفويض الرسمي",
  establishmentLogo: "شعار المنشأة",
  supplyAreas: "مجالات التوريد",
  serviceCoverage: "تغطية الخدمة",
  yearsOfExperience: "سنوات الخبرة",
  governmentPrivateDealings: "تعاملات حكومية/خاصة",
  supportingDocuments: "المستندات الداعمة",
} as const;

export const FORM_PLACEHOLDERS = {
  commercialEstablishmentName: "أدخل اسم المنشأة التجارية",
  commercialRegistrationNumber: "أدخل رقم السجل التجاري",
  authorizedPersonName: "أدخل اسم الشخص المخول",
  authorizedPersonMobileNumber: "أدخل رقم جوال الشخص المخول",
  email: "me@example.com",
  password: "أنشئ كلمة مرور",
  confirmPassword: "أعد إدخال كلمة المرور",
  yearsOfExperience: "اختر سنوات الخبرة",
  governmentPrivateDealings: "حدد إذا كان لديك تعاملات حكومية/خاصة",
} as const;

// رسائل التحقق من صحة الإدخال
export const VALIDATION_MESSAGES = {
  commercialEstablishmentName: {
    required: "اسم المنشأة التجارية مطلوب",
    minLength: "يجب أن يتكون اسم المنشأة من حرفين على الأقل",
  },
  commercialRegistrationNumber: {
    required: "رقم السجل التجاري مطلوب",
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
  officialAuthorizationLetter: {
    title: "خطاب التفويض الرسمي (مطلوب)",
  },
  establishmentLogo: {
    title: "شعار المنشأة (اختياري)",
  },
  commercialRegistration: {
    title: "السجل التجاري (مطلوب)",
  },
  vatCertificate: {
    title: "شهادة ضريبة القيمة المضافة (اختياري)",
  },
  nationalAddress: {
    title: "العنوان الوطني (مطلوب)",
  },
  bankAccountDetails: {
    title: "تفاصيل الحساب البنكي (مطلوب)",
  },
  accreditationCertificates: {
    title: "شهادات الاعتماد (اختياري)",
  },
  establishmentProfile: {
    title: "ملف تعريف المنشأة (اختياري)",
  },
  administrativeStructure: {
    title: "الهيكل الإداري (اختياري)",
  },
  previousContracts: {
    title: "العقود السابقة (اختياري)",
  },
  thankYouLetters: {
    title: "خطابات الشكر (اختياري)",
  },
  additionalCredibilityDocuments: {
    title: "مستندات إضافية لإثبات المصداقية (اختياري)",
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

// Options for Operational and Commercial Info
export const SUPPLY_AREAS_OPTIONS = [
  "Building materials",
  "Electrical materials",
  "Safety equipment",
  "Plumbing",
  "Paints",
  "Office furniture",
  "Other",
] as const;

export const SERVICE_COVERAGE_OPTIONS = [
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

export const YEARS_OF_EXPERIENCE_OPTIONS = [
  "More than 10 years",
  "5-10 years",
  "Less than 5 years",
] as const;

export const PLAN_OPTIONS = [
  {
    type: "free",
    name: "الخطة المجانية",
    price: "مجاني",
    features: [
      "ميزات محدودة",
      "صلاحيات محدودة",
      "تفعيل الحساب بانتظار موافقة الإدارة",
    ],
    buttonText: "اختر الخطة المجانية",
  },
  {
    type: "paid",
    name: "الخطة المدفوعة",
    price: "$XX.XX / شهر",
    features: [
      "جميع الميزات",
      "صلاحيات كاملة",
      "تفعيل الحساب بانتظار موافقة الإدارة",
    ],
    buttonText: "الاشتراك الآن",
  },
] as const;


