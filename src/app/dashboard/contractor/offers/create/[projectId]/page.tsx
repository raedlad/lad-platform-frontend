"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CreateCompleteOfferForm } from "@/features/offers/components";

interface CreateCompleteOfferPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function CreateCompleteOfferPage({
  params,
}: CreateCompleteOfferPageProps) {
  const t = useTranslations();
  const router = useRouter();
  const { projectId } = React.use(params);

  const handleSuccess = () => {
    router.push("/dashboard/contractor/offers");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="section">
      <div className="w-full">
        <div className="w-full flex flex-col gap-6">
          {/* Header */}
          <div className="w-full flex justify-between">
            <div className="w-full flex flex-col gap-2 max-w-sm">
              <h1 className="text-2xl font-bold">{t("offers.create.title")}</h1>
              <p>{t("offers.create.description")}</p>
            </div>
            <Link href="/dashboard/contractor/offers">
              <Button
                variant="outline"
                size="sm"
                className="border-design-main text-design-main px-6"
              >
                {t("common.actions.back")}
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Form */}
          <div className="w-full border border-design-tertiary rounded-md p-4 md:p-6 max-w-3xl mx-auto">
            <CreateCompleteOfferForm
              projectId={projectId}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
