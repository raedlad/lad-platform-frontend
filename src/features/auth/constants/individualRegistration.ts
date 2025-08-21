import { IndividualRegistrationStep } from "@auth/types/individual";

export const REGISTRATION_STEPS: IndividualRegistrationStep[] = [
  "authMethod",
  "personalInfo",
  "verification",
  "complete",
];

export const STEP_CONFIG = {
  authMethod: {
    title: "اختر طريقة التسجيل",
    description: "حدد الطريقة التي تود استخدامها لإنشاء حسابك",
    stepNumber: 1,
  },
  personalInfo: {
    title: "المعلومات الشخصية",
    description: "أدخل بياناتك الشخصية للمتابعة",
    stepNumber: 2,
  },
  verification: {
    title: "تأكيد الحساب",
    description: "أدخل رمز التحقق المرسل إلى حسابك",
    stepNumber: 3,
  },
  complete: {
    title: "اكتمل التسجيل",
    description: "تم إنشاء حسابك بنجاح",
    stepNumber: 4,
  },
} as const;

export const AUTH_METHOD_LABELS = {
  email: "التسجيل بالبريد الإلكتروني",
  phone: "التسجيل برقم الهاتف",
  thirdParty: "التسجيل عبر حساب اجتماعي",
} as const;

export const AUTH_METHOD_DESCRIPTIONS = {
  email: "أنشئ حسابك باستخدام البريد الإلكتروني",
  phone: "أنشئ حسابك باستخدام رقم الهاتف",
  thirdParty: "المتابعة باستخدام Google أو Apple",
} as const;

// تسميات الحقول والنصوص التوضيحية
export const FORM_LABELS = {
  firstName: "الاسم الأول",
  lastName: "الاسم الأخير",
  email: "البريد الإلكتروني",
  phoneNumber: "رقم الهاتف",
  password: "كلمة المرور",
  confirmPassword: "تأكيد كلمة المرور",
  nationalId: "رفع الهوية الوطنية",
} as const;

export const FORM_PLACEHOLDERS = {
  firstName: "أدخل اسمك الأول",
  lastName: "أدخل اسمك الأخير",
  email: "me@example.com",
  phoneNumber: "أدخل رقم هاتفك",
  password: "أنشئ كلمة مرور",
  confirmPassword: "أعد إدخال كلمة المرور",
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
  title: "رفع الهوية الوطنية (اختياري)",
  description: "قم برفع هويتك الوطنية للتحقق",
  clickToUpload: "اضغط للرفع",
  dragAndDrop: "أو اسحب الملف وأفلته هنا",
  fileTypes: "PDF أو JPG بحد أقصى 5 ميجابايت",
  invalidType: "يرجى رفع ملف بصيغة PDF أو JPG",
  invalidSize: "يجب أن يكون حجم الملف أقل من 5 ميجابايت",
} as const;

// الشروط والأحكام
export const TERMS_TEXT = {
  terms: "اوافق على",
  termsCong: "و",
  termsLink: "شروط الخدمة",
  privacyLink: "سياسة الخصوصية",
} as const;
