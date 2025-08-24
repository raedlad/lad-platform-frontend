import { ContractorRegistrationStep } from "@auth/types/contractor";

export const REGISTRATION_STEPS: ContractorRegistrationStep[] = [
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
    title: "اختر طريقة التسجيل للمقاول",
    description: "حدد الطريقة التي تود استخدامها لإنشاء حسابك كمقاول",
    stepNumber: 1,
  },
  personalInfo: {
    title: "بيانات الشركة والشخص المخول",
    description: "أدخل بيانات الشركة والشخص المخول للمتابعة",
    stepNumber: 2,
  },
  verification: {
    title: "تأكيد حساب المقاول",
    description: "أدخل رمز التحقق المرسل إلى حسابك كمقاول",
    stepNumber: 3,
  },
  technicalOperationalInfo: {
    title: "المعلومات الفنية والتشغيلية",
    description: "أدخل معلومات المقاول الفنية والتشغيلية",
    stepNumber: 4,
  },
  documentUpload: {
    title: "رفع المستندات",
    description: "يرجى رفع المستندات المطلوبة لإكمال التسجيل",
    stepNumber: 5,
  },
  planSelection: {
    title: "اختر خطة الاشتراك",
    description: "اختر الخطة التي تناسب احتياجات شركتك",
    stepNumber: 6,
  },
  complete: {
    title: "اكتمل تسجيل المقاول",
    description: "تم إنشاء حساب المقاول بنجاح",
    stepNumber: 7,
  },
} as const;

export const AUTH_METHOD_LABELS = {
  email: "التسجيل بالبريد الإلكتروني للمقاول",
  phone: "التسجيل برقم الهاتف للمقاول",
  thirdParty: "التسجيل عبر حساب اجتماعي للمقاول",
} as const;

export const AUTH_METHOD_DESCRIPTIONS = {
  email: "أنشئ حساب المقاول باستخدام البريد الإلكتروني",
  phone: "أنشئ حساب المقاول باستخدام رقم الهاتف",
  thirdParty: "المتابعة باستخدام Google Business لحساب المقاول",
} as const;

// تسميات الحقول والنصوص التوضيحية
export const FORM_LABELS = {
  companyName: "اسم الشركة",
  commercialRegistrationNumber: "رقم السجل التجاري",
  authorizedPersonName: "اسم الشخص المخول",
  authorizedPersonMobileNumber: "رقم جوال الشخص المخول",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  confirmPassword: "تأكيد كلمة المرور",
  projectSizeCompleted: "حجم المشاريع المنجزة (آخر 5 سنوات)",
  targetProjectSize: "حجم المشاريع المستهدفة",
  totalEmployees: "إجمالي عدد الموظفين",
  governmentAccreditations: "اعتمادات حكومية؟",
  contractorClassification: "تصنيف المقاول",
  classificationFile: "ملف التصنيف",
  workFields: "مجالات العمل",
  geographicSpread: "الانتشار الجغرافي",
  yearsOfExperience: "سنوات الخبرة",
  annualProjectVolume: "حجم المشاريع السنوي",
} as const;

export const FORM_PLACEHOLDERS = {
  companyName: "أدخل اسم الشركة",
  commercialRegistrationNumber: "أدخل رقم السجل التجاري",
  authorizedPersonName: "أدخل اسم الشخص المخول",
  authorizedPersonMobileNumber: "أدخل رقم جوال الشخص المخول",
  email: "me@example.com",
  password: "أنشئ كلمة مرور",
  confirmPassword: "أعد إدخال كلمة المرور",
  projectSizeCompleted: "اختر حجم المشاريع المنجزة",
  targetProjectSize: "اختر حجم المشاريع المستهدفة",
  totalEmployees: "اختر إجمالي عدد الموظفين",
  governmentAccreditations: "حدد إذا كان لديك اعتمادات حكومية",
  contractorClassification: "اختر تصنيف المقاول",
  yearsOfExperience: "اختر سنوات الخبرة",
  annualProjectVolume: "اختر حجم المشاريع السنوي",
} as const;

// رسائل التحقق من صحة الإدخال
export const VALIDATION_MESSAGES = {
  companyName: {
    required: "اسم الشركة مطلوب",
    minLength: "يجب أن يتكون اسم الشركة من حرفين على الأقل",
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
  authorizationForm: {
    title: "نموذج التفويض (مطلوب)",
  },
  companyLogo: {
    title: "شعار الشركة (اختياري)",
  },
  socialInsuranceCertificate: {
    title: "شهادة التأمينات الاجتماعية (مطلوب)",
  },
  commercialRegistration: {
    title: "السجل التجاري (مطلوب)",
  },
  vatCertificate: {
    title: "شهادة ضريبة القيمة المضافة (مطلوب)",
  },
  nationalAddress: {
    title: "العنوان الوطني (مطلوب)",
  },
  projectsAndPreviousWorkRecord: {
    title: "سجل المشاريع والأعمال السابقة (مطلوب)",
  },
  officialContactInformation: {
    title: "معلومات الاتصال الرسمية (مطلوب)",
  },
  bankAccountDetails: {
    title: "تفاصيل الحساب البنكي (مطلوب)",
  },
  chamberOfCommerceMembership: {
    title: "عضوية الغرفة التجارية (اختياري)",
  },
  companyProfile: {
    title: "ملف تعريف الشركة (اختياري)",
  },
  organizationalStructure: {
    title: "الهيكل التنظيمي (اختياري)",
  },
  qualityCertificates: {
    title: "شهادات الجودة (اختياري)",
  },
  otherFiles: {
    title: "ملفات أخرى (اختياري)",
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
export const PROJECT_SIZE_COMPLETED_OPTIONS = [
  "Over 50 million",
  "25-50 million",
  "10-25 million",
  "5-10 million",
  "Less than 5 million",
] as const;

export const TARGET_PROJECT_SIZE_OPTIONS = [
  "Over 50 million",
  "25-50 million",
  "10-25 million",
  "5-10 million",
  "Less than 5 million",
] as const;

export const TOTAL_EMPLOYEES_OPTIONS = [
  "More than 300",
  "100-300",
  "50-100",
  "25-50",
  "Less than 25",
] as const;

export const CONTRACTOR_CLASSIFICATION_OPTIONS = [
  "First through seventh classification",
  "Classification file upload if applicable",
] as const;

export const WORK_FIELDS_OPTIONS = [
  "Construction and maintenance",
  "Roads",
  "Well drilling and maintenance",
  "Others as per system",
] as const;

export const GEOGRAPHIC_SPREAD_OPTIONS = [
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
  "More than 20 years",
  "15-20 years",
  "10-15 years",
  "5-10 years",
  "Less than 5 years",
] as const;

export const ANNUAL_PROJECT_VOLUME_OPTIONS = [
  "More than 30 projects",
  "20-30 projects",
  "10-20 projects",
  "5-10 projects",
  "Less than 5 projects",
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


