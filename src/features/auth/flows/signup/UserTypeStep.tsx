"use client";

import { useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Building2, Briefcase, User, Search } from "lucide-react";
import { Checkbox } from "@/shared/components/ui/checkbox";
import Link from "next/link";

const userTypes = [
  {
    id: "service-seeker",
    title: "طالب خدمة",
    description: "هل تبحث عن خدمات تلبي احتياجاتك؟ هذه الفئة لك.",
    buttonText: "انضم كطالب خدمة",
  },
  {
    id: "service-provider",
    title: "مقدم خدمة",
    description: "هل تقدم خدمات وترغب في الوصول إلى عملاء جدد؟ انضم هنا.",
    buttonText: "قدم كمقدم خدمة",
  },
];

const UserTypeStep = () => {
  const [selected, setSelected] = useState("");

  const handleSelect = (id: string) => {
    setSelected((prev) => (prev === id ? "" : id));
  };
  const icons = useMemo(
    () => ({
      "service-seeker": <Search className="size-5 text-p-6" />,
      "service-provider": <Briefcase className="size-5 text-p-6" />,
    }),
    []
  ) as Record<string, React.ReactNode>;

  return (
    <div className="container section max-w-lg mx-auto flex flex-col items-center justify-center gap-10">
      <div className="w-full flex flex-col gap-2 items-start justify-start ">
        <h2 className="text-2xl font-medium text-start">ابدأ رحلتك معنا</h2>
        <p className="text-n-8 text-base md:text-lg">
          حدد الفئة التي تُمثل نشاطك للمتابعة في إنشاء الحساب
        </p>
      </div>
      <div className="w-full flex flex-col gap-10 max-w-lg">
        <div className="flex flex-col gap-4 w-full">
          {userTypes.map((type) => (
            <Label
              key={type.id}
              htmlFor={type.id}
              className="cursor-pointer w-full"
            >
              <Card
                onClick={() => handleSelect(type.id)}
                className={`p-4 transition-all  rounded-xl w-full ${
                  selected === type.id
                    ? "border-p-5 bg-n-1 "
                    : "hover:bg-n-1/80"
                }`}
              >
                <CardHeader className="p-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="size-10 shrink-0 rounded-lg border flex items-center justify-center">
                        {icons[type.id] ?? <User className="size-5" />}
                      </div>
                      <div className="text-right">
                        <CardTitle className="font-semibold text-lg">
                          {type.title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {type.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Checkbox
                      id={type.id}
                      checked={selected === type.id}
                      onCheckedChange={() => handleSelect(type.id)}
                    />
                  </div>
                </CardHeader>
              </Card>
            </Label>
          ))}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <Button
            className={`w-full py-6 rounded-sm font-bold ${
              !selected ? "bg-n-4 text-n-8" : ""
            }`}
            disabled={!selected}
          >
            {selected
              ? userTypes.find((type) => type.id === selected)?.buttonText
              : "انشاء حساب"}
          </Button>
          <p>
            لديك حساب مسجل مسبقا؟{"  "}
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
  );
};

export default UserTypeStep;
