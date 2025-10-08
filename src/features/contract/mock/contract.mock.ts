import { Contract, ContractVersion } from "../types/contract";

export const mockVersionHistory: ContractVersion[] = [
  {
    versionNumber: 1,
    modifiedBy: "client",
    modifiedAt: "2024-01-10T10:00:00",
    comment: "Initial contract draft created by system",
  },
  {
    versionNumber: 2,
    modifiedBy: "client",
    modifiedAt: "2024-01-11T14:30:00",
    comment: "Added additional clauses for project delivery phases",
  },
  {
    versionNumber: 3,
    modifiedBy: "contractor",
    modifiedAt: "2024-01-12T09:15:00",
    comment: "يرجى تعديل بند الضمان إلى 12 شهرًا بدلاً من 6.",
  },
];

export const mockContract: Contract = {
  id: 101,
  project: {
    id: 12,
    title: "عمارة سكنية ثلاث طوابق",
    status: "waiting_for_contract",
  },
  offer: {
    id: 45,
    contractor_name: "شركة البناء المتكامل",
    offer_amount: 500000,
    duration: "6 أشهر",
  },
  versionNumber: 3,
  lastNegotiationComment: "يرجى تعديل بند الضمان إلى 12 شهرًا بدلاً من 6.",
  status: "Awaiting Client Review",
  standardClauses: [
    { 
      id: 1, 
      title: "مدة التنفيذ", 
      text: "مدة تنفيذ المشروع 6 أشهر من تاريخ توقيع العقد." 
    },
    { 
      id: 2, 
      title: "ضمان الأعمال", 
      text: "المقاول مسؤول عن ضمان الأعمال لمدة سنة واحدة بعد التسليم." 
    },
    {
      id: 3,
      title: "الدفعات المالية",
      text: "يتم دفع 30% كدفعة أولى، 40% عند اكتمال 50% من المشروع، و30% عند التسليم النهائي."
    },
    {
      id: 4,
      title: "المواد والجودة",
      text: "جميع المواد المستخدمة يجب أن تكون مطابقة للمواصفات القياسية السعودية."
    },
    {
      id: 5,
      title: "التأخير والغرامات",
      text: "في حالة التأخير عن الموعد المحدد، يتم خصم 0.5% من قيمة العقد عن كل يوم تأخير."
    },
  ],
  additionalClauses: [
    { 
      id: "add-1", 
      text: "يتم تسليم المشروع على مراحل متفق عليها مسبقاً." 
    },
    { 
      id: "add-2", 
      text: "يتم توفير العمالة المحلية قدر الإمكان." 
    },
  ],
  clientSignedPDF_URL: null,
  contractorSignedPDF_URL: null,
  versionHistory: mockVersionHistory,
  createdAt: "2024-01-10T08:00:00",
  updatedAt: "2024-01-12T09:15:00",
};

// Mock function to generate a signed PDF URL
export const generateMockPDF = (role: "client" | "contractor"): string => {
  const timestamp = Date.now();
  return `/mock-pdf/${role}-signed-contract-${timestamp}.pdf`;
};
