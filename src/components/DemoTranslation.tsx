"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

export default function DemoTranslation() {
  const t = useTranslations();
  const authT = useTranslations("auth");
  const commonT = useTranslations("common");

  return (
    <Card className="container-narrow">
      <CardHeader>
        <CardTitle>{t("auth.title")}</CardTitle>
        <CardDescription>{t("auth.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="form-section">
        <div className="form-field-group">
          <h4 className="font-medium">Common Actions:</h4>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm">{commonT("submit")}</Button>
            <Button size="sm" variant="outline">
              {commonT("cancel")}
            </Button>
            <Button size="sm" variant="outline">
              {commonT("back")}
            </Button>
          </div>
        </div>

        <div className="form-field-group">
          <h4 className="font-medium">Auth Actions:</h4>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm">{authT("login")}</Button>
            <Button size="sm" variant="outline">
              {authT("signup")}
            </Button>
          </div>
        </div>

        <div className="form-field-group">
          <h4 className="font-medium">Form Fields:</h4>
          <div className="text-description space-y-1">
            <p>
              <strong>First Name:</strong> {authT("personalInfo.firstName")}
            </p>
            <p>
              <strong>Email:</strong> {authT("personalInfo.email")}
            </p>
            <p>
              <strong>Password:</strong> {authT("personalInfo.password")}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Validation Messages:</h4>
          <div className="text-sm space-y-1 text-red-600">
            <p>{authT("form.validation.required")}</p>
            <p>{authT("form.validation.invalidEmail")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
