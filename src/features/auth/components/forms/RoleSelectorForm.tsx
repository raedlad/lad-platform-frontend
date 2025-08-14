"use client";

import { Building2, Briefcase, User, Search } from "lucide-react";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

// --- Data arrays remain the same ---
const serviceSeekerRoles = [
    // ... (no changes here)
  {
    id: "individual",
    title: "فرد",
    description: "للأفراد الذين يبحثون عن خدمات",
    icon: <User className="size-4" />,
    comingSoon: false,
    buttonText: "الاستمرار كفرد",
  },
  {
    id: "institution",
    title: "مؤسسة",
    description: "للمؤسسات والشركات التي تبحث عن خدمات",
    icon: <Building2 className="size-4" />,
    comingSoon: false,
    buttonText: "الاستمرار كمؤسسة",
  },
  {
    id: "government-agency",
    title: "جهة حكومية",
    description: "للجهات الحكومية التي تبحث عن خدمات",
    icon: <Briefcase className="size-4" />,
    comingSoon: true,
    buttonText: "الاستمرار كجهة حكومية",
  },
];

const serviceProviderRoles = [
    // ... (no changes here)
  {
    id: "freelance-engineer",
    title: "مهندس مستقل",
    description: "للمهندسين المستقلين والعاملين لحسابهم الخاص",
    icon: <User className="size-4" />,
    comingSoon: false,
    buttonText: "تقديم كمهندس مستقل",

  },
  {
    id: "engineering-office",
    title: "مكتب هندسي",
    description: "لمكاتب الهندسة والاستشارات الهندسية",
    icon: <Building2 className="size-4" />,
    comingSoon: false,
    buttonText: "تقديم كمكتب هندسي ",

  },
  {
    id: "contractor",
    title: "مقاول",
    description: "للمقاولين وشركات المقاولات",
    icon: <Briefcase className="size-4" />,
    comingSoon: false,
    buttonText: "تقديم كمقاول ",
  },
  {
    id: "supplier",
    title: "مورد",
    description: "للموردين ومزودي المواد والمعدات",
    icon: <Search className="size-4" />,
    comingSoon: false,
    buttonText: "تقديم كمورد ",
  },
];


// 1. Define the props the component will receive from its parent
interface RoleSelectorFormProps {
  selectedRole: string | null;
  onSelectRole: (roleId: string) => void;
  onContinue: () => void;
}
// 2. Accept the props
const RoleSelectorForm = ({ selectedRole, onSelectRole, onContinue  }: RoleSelectorFormProps) => {
  
  
  const handleSelect = (id: string) => {
    if (id !== "government-agency") {
      onSelectRole(id);
    }
  };


  const buttonText = selectedRole
  ? serviceSeekerRoles.find((type) => type.id === selectedRole)?.buttonText ||
    serviceProviderRoles.find((type) => type.id === selectedRole)?.buttonText
  : "انشاء حساب";
  const renderUserRoleCard = (role: any) => {
    

    const isSelected = selectedRole === role.id;
    const isDisabled = role.comingSoon;

    return (
      <Label
        key={role.id}
        htmlFor={role.id}
        className={twMerge(
          "flex-1 p-1.5 h-full border border-n-4 rounded-lg shadow-xs transition-all cursor-pointer",
          isSelected && !isDisabled
            ? "border-p-9 shadow-p-1 text-p-5 bg-p-1/10"
            : isDisabled
            ? "opacity-60 cursor-not-allowed"
            : "hover:border-n-5 hover:shadow-sm"
        )}
        // Call the handler directly, no need for a separate function if it's simple
        onClick={() => !isDisabled && handleSelect(role.id)}
      >
        <div className="w-full flex justify-between">
          <div className="flex items-center gap-2">
            <div
              className={twMerge(
                "flex items-center justify-center w-10 h-10 rounded-lg bg-n4 bg-n-2/50",
                isSelected && !isDisabled ? "bg-p-2/50 text-p-6" : ""
              )}
            >
              {role.icon}
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm">{role.title}</h4>
                {isDisabled && (
                  <span className="inline-flex items-center rounded-full border border-n-4 bg-n-2/50 text-n-6 text-xs px-2 py-0.5 font-medium">
                    قريباً
                  </span>
                )}
              </div>
              <p
                className={twMerge(
                  "text-xs text-n-7",
                  isSelected && !isDisabled ? "text-p-5" : ""
                )}
              >
                {role.description}
              </p>
            </div>
          </div>
          <Checkbox
            id={role.id}
            className="rounded-full"
            checked={isSelected && !isDisabled}
            // The Label's onClick handles this, but this is good for accessibility
            onCheckedChange={() => !isDisabled && handleSelect(role.id)}
            disabled={isDisabled}
          />
        </div>
      </Label>
    );
  };

  return (
    <div className="w-full max-w-2xl section">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center justify-center text-center gap-1.5">
          <h1 className="text-5xl">LAD</h1>
          <h2 className="text-2xl font-bold">انطلق نحو تجربتك المثالية</h2>
          <p className="text-sm text-n-7">
            حدد نوع المستخدم لبدء استخدام منصتنا
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-base font-semibold">طالب خدمة</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 auto-rows-fr items-center justify-center gap-3">
              {serviceSeekerRoles.map((role) => renderUserRoleCard(role))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-background">أو</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-base font-semibold">مقدم خدمة</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2  items-center justify-center gap-3">
              {serviceProviderRoles.map((role) => renderUserRoleCard(role))}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full mt-2">
          <Button
            // The onClick now calls the onContinue function from props
            onClick={onContinue}
            className={`w-full py-4 rounded-sm font-bold ${
              !selectedRole ? "bg-n-4 text-n-8" : ""
            }`}
            // Disable the button if no role is selected
            disabled={!selectedRole}
          >
            {buttonText}
          </Button>
          <p className="text-sm text-center">
            لديك حساب مسجل مسبقا؟{" "}
            <Link
              href="/login"
              className="text-p-6 hover:text-p-5 transition-all underline underline-offset-4"
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};
export default RoleSelectorForm;