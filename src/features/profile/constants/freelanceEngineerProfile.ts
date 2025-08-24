import { FreelanceEngineerRegistrationStep } from "@auth/types/freelanceEngineer";

export const REGISTRATION_STEPS: FreelanceEngineerRegistrationStep[] = [
  "authMethod",
  "personalInfo",
  "verification",
  "professionalInfo",
  "documentUpload",
  "planSelection",
  "complete",
];

export const STEP_CONFIG = {
  authMethod: {
    title: "اختر طريقة التسجيل للمهندس المستقل",
    description: "حدد الطريقة التي تود استخدامها لإنشاء حسابك كمهندس مستقل",
    stepNumber: 1,
  },
  personalInfo: {
    title: "المعلومات الشخصية للمهندس المستقل",
    description: "أدخل بياناتك الشخصية للمتابعة كمهندس مستقل",
    stepNumber: 2,
  },
  verification: {
    title: "تأكيد حساب المهندس المستقل",
    description: "أدخل رمز التحقق المرسل إلى حسابك كمهندس مستقل",
    stepNumber: 3,
  },
  professionalInfo: {
    title: "المعلومات المهنية",
    description: "أدخل معلوماتك المهنية وخبراتك",
    stepNumber: 4,
  },
  documentUpload: {
    title: "رفع المستندات",
    description: "يرجى رفع المستندات المطلوبة لإكمال التسجيل",
    stepNumber: 5,
  },
  planSelection: {
    title: "اختر خطة الاشتراك",
    description: "اختر الخطة التي تناسب احتياجاتك",
    stepNumber: 6,
  },
  complete: {
    title: "اكتمل تسجيل المهندس المستقل",
    description: "تم إنشاء حسابك كمهندس مستقل بنجاح",
    stepNumber: 7,
  },
} as const;

export const AUTH_METHOD_LABELS = {
  email: "التسجيل بالبريد الإلكتروني للمهندس المستقل",
  phone: "التسجيل برقم الهاتف للمهندس المستقل",
  thirdParty: "التسجيل عبر حساب اجتماعي للمهندس المستقل",
} as const;

export const AUTH_METHOD_DESCRIPTIONS = {
  email: "أنشئ حسابك كمهندس مستقل باستخدام البريد الإلكتروني",
  phone: "أنشئ حسابك كمهندس مستقل باستخدام رقم الهاتف",
  thirdParty: "المتابعة باستخدام Google أو Apple لحساب المهندس المستقل",
} as const;

// تسميات الحقول والنصوص التوضيحية
export const FORM_LABELS = {
  firstName: "الاسم الأول",
  lastName: "الاسم الأخير",
  email: "البريد الإلكتروني",
  phoneNumber: "رقم الهاتف",
  password: "كلمة المرور",
  confirmPassword: "تأكيد كلمة المرور",
  engineeringLicense: "رفع رخصة الهندسة",
  engineeringSpecialization: "التخصص الهندسي",
  yearsOfExperience: "سنوات الخبرة",
  typesOfExperience: "أنواع الخبرة",
  workLocations: "مواقع العمل المفضلة",
  currentOfficeAffiliation: "الانتماء لمكتب هندسي حالي؟",
  officeName: "اسم المكتب الهندسي",
} as const;

export const FORM_PLACEHOLDERS = {
  firstName: "أدخل اسمك الأول",
  lastName: "أدخل اسمك الأخير",
  email: "me@example.com",
  phoneNumber: "أدخل رقم هاتفك",
  password: "أنشئ كلمة مرور",
  confirmPassword: "أعد إدخال كلمة المرور",
  yearsOfExperience: "اختر سنوات الخبرة",
  currentOfficeAffiliation: "حدد إذا كنت تابعًا لمكتب هندسي حالي",
  officeName: "أدخل اسم المكتب",
} as const;

// رسائل التحقق من صحة الإدخال
export const VALIDATION_MESSAGES = {
  firstName: {
    required: "الاسم الأول مطلوب",
    minLength: "يجب أن يتكون الاسم الأول من حرفين على الأقل",
  },
  lastName: {
    required: "الاسم الأخير مطلوب",
    minLength: "يجب أن يتكون الاسم الأخير من حرفين على الأقل",
  },
  email: {
    required: "البريد الإلكتروني مطلوب",
    invalid: "يرجى إدخال بريد إلكتروني صالح",
  },
  phoneNumber: {
    required: "رقم الهاتف مطلوب",
    minLength: "يرجى إدخال رقم هاتف صالح",
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
  title: "رفع رخصة الهندسة (اختياري)",
  description: "قم برفع رخصة الهندسة للتحقق",
  clickToUpload: "اضغط للرفع",
  dragAndDrop: "أو اسحب الملف وأفلته هنا",
  fileTypes: "PDF أو JPG بحد أقصى 10 ميجابايت",
  maxSizeMB: 10,
  technicalCV: {
    title: "السيرة الذاتية الفنية (مطلوب)",
  },
  personalPhoto: {
    title: "الصورة الشخصية (مطلوب)",
  },
  saudiCouncilOfEngineersCardCopy: {
    title: "صورة بطاقة الهيئة السعودية للمهندسين (مطلوب)",
  },
  trainingCertificates: {
    title: "شهادات التدريب (اختياري)",
  },
  professionalCertificates: {
    title: "الشهادات المهنية (اختياري)",
  },
  personalProfile: {
    title: "الملف الشخصي (اختياري)",
  },
  recommendationLetters: {
    title: "خطابات التوصية (اختياري)",
  },
  workSamples: {
    title: "نماذج الأعمال (اختياري)",
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

// Options for Professional Info
export const ENGINEERING_SPECIALIZATIONS = [
  "معماري",
  "مدني",
  "ميكانيكي",
  "كهربائي",
  "أخرى",
] as const;

export const YEARS_OF_EXPERIENCE_OPTIONS = [
  "More than 15 years",
  "10-15 years",
  "5-10 years",
  "Less than 5 years",
] as const;

export const YEARS_OF_EXPERIENCE_LABELS = {
  "More than 15 years": "أكثر من 15 سنة",
  "10-15 years": "10-15 سنة",
  "5-10 years": "5-10 سنوات",
  "Less than 5 years": "أقل من 5 سنوات",
} as const;

export const TYPES_OF_EXPERIENCE_OPTIONS = [
  "تصميم معماري",
  "إشراف ميداني",
  "تقارير فنية",
  "تخطيط حضري",
  "أعمال كهربائية وميكانيكية",
  "أخرى",
] as const;

export const WORK_LOCATIONS = [
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
