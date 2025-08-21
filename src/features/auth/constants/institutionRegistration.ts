import { InstitutionRegistrationStep } from "@auth/types/institution";

export const REGISTRATION_STEPS: InstitutionRegistrationStep[] = [
  "authMethod",
  "personalInfo",
  "verification",
  "complete",
];

export const STEP_CONFIG = {
  authMethod: {
    title: "اختر طريقة التسجيل للمؤسسة",
    description: "حدد الطريقة التي تود استخدامها لإنشاء حساب مؤسستك",
    stepNumber: 1,
  },
  personalInfo: {
    title: "معلومات المؤسسة",
    description: "أدخل بيانات مؤسستك للمتابعة",
    stepNumber: 2,
  },
  verification: {
    title: "تأكيد حساب المؤسسة",
    description: "أدخل رمز التحقق المرسل إلى حساب مؤسستك",
    stepNumber: 3,
  },
  complete: {
    title: "اكتمل تسجيل المؤسسة",
    description: "تم إنشاء حساب مؤسستك بنجاح",
    stepNumber: 4,
  },
} as const;

export const AUTH_METHOD_LABELS = {
  email: "التسجيل بالبريد الإلكتروني للمؤسسة",
  phone: "التسجيل برقم الهاتف للمؤسسة",
  thirdParty: "التسجيل عبر حساب اجتماعي للمؤسسة",
} as const;

export const AUTH_METHOD_DESCRIPTIONS = {
  email: "أنشئ حساب مؤسستك باستخدام البريد الإلكتروني",
  phone: "أنشئ حساب مؤسستك باستخدام رقم الهاتف",
  thirdParty: "المتابعة باستخدام Google أو Apple لحساب المؤسسة",
} as const;

// تسميات الحقول والنصوص التوضيحية
export const FORM_LABELS = {
  institutionName: "اسم المؤسسة",
  contactPersonFirstName: "الاسم الأول لجهة الاتصال",
  contactPersonLastName: "الاسم الأخير لجهة الاتصال",
  institutionEmail: "البريد الإلكتروني للمؤسسة",
  institutionPhoneNumber: "رقم هاتف المؤسسة",
  password: "كلمة المرور",
  confirmPassword: "تأكيد كلمة المرور",
  commercialRegistration: "رفع السجل التجاري",
} as const;

export const FORM_PLACEHOLDERS = {
  institutionName: "أدخل اسم مؤسستك",
  contactPersonFirstName: "أدخل الاسم الأول لجهة الاتصال",
  contactPersonLastName: "أدخل الاسم الأخير لجهة الاتصال",
  institutionEmail: "company@example.com",
  institutionPhoneNumber: "أدخل رقم هاتف المؤسسة",
  password: "أنشئ كلمة مرور",
  confirmPassword: "أعد إدخال كلمة المرور",
} as const;

// رسائل التحقق من صحة الإدخال
export const VALIDATION_MESSAGES = {
  institutionName: {
    required: "اسم المؤسسة مطلوب",
    minLength: "يجب أن يتكون اسم المؤسسة من حرفين على الأقل",
  },
  contactPersonFirstName: {
    required: "الاسم الأول لجهة الاتصال مطلوب",
    minLength: "يجب أن يتكون الاسم الأول لجهة الاتصال من حرفين على الأقل",
  },
  contactPersonLastName: {
    required: "الاسم الأخير لجهة الاتصال مطلوب",
    minLength: "يجب أن يتكون الاسم الأخير لجهة الاتصال من حرفين على الأقل",
  },
  institutionEmail: {
    required: "البريد الإلكتروني للمؤسسة مطلوب",
    invalid: "يرجى إدخال بريد إلكتروني صالح للمؤسسة",
  },
  institutionPhoneNumber: {
    required: "رقم هاتف المؤسسة مطلوب",
    minLength: "يرجى إدخال رقم هاتف صالح للمؤسسة",
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
  title: "رفع السجل التجاري (اختياري)",
  description: "قم برفع السجل التجاري للتحقق",
  clickToUpload: "اضغط للرفع",
  dragAndDrop: "أو اسحب الملف وأفلته هنا",
  fileTypes: "PDF أو JPG بحد أقصى 10 ميجابايت",
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


