"use client";

import React from "react";
import { Badge } from "@shared/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Shield } from "lucide-react";
import { Contract } from "../types/contract";
import { useTranslations } from "next-intl";
import { WorkflowStageBadge } from "@/features/workflow";

interface ContractViewerProps {
  contract: Contract;
  isEditable: boolean;
  projectStatus?: string;
  userRole?: "owner" | "contractor";
}

export const ContractViewer: React.FC<ContractViewerProps> = ({
  contract,
  isEditable,
  projectStatus,
  userRole,
}) => {
  const t = useTranslations("contract.view");
  return (
    <div className="border-2 border-design-main rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1" />
          <h2 className="text-xl font-bold flex-1 text-center">{t("title")}</h2>
          <div className="flex-1 flex justify-end">
            {projectStatus && (
              <WorkflowStageBadge
                projectStatus={projectStatus}
                hasContract={true}
                contractStatus={contract.status}
                offerAccepted={true}
                userRole={userRole}
                showIcon={true}
                size="sm"
              />
            )}
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">
            {t("contractDetails")}
          </h3>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - First Party */}
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="font-semibold mb-4">{t("firstParty")}</h4>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-sm text-muted-foreground">{t("name")}</span>
              <span className="font-medium">Ahmed Al-Qasimi</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-sm text-muted-foreground">
                {t("nationality")}:
              </span>
              <span className="font-medium">Saudi Arabian</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-sm text-muted-foreground">
                {t("mobile")}:
              </span>
              <span className="font-medium">+966 50 123 4567</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-sm text-muted-foreground">
                {t("email")}:
              </span>
              <span className="font-medium">ahmed@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Right Column - Second Party */}
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t("secondParty")}
            </h4>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-sm text-muted-foreground">{t("name")}</span>
              <span className="font-medium">Ahmed Al-Qasimi</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-sm text-muted-foreground">
                {t("nationality")}:
              </span>
              <span className="font-medium">Saudi Arabian</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-sm text-muted-foreground">
                {t("mobile")}
              </span>
              <span className="font-medium">+966 50 123 4567</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-sm text-muted-foreground">
                {t("email")}
              </span>
              <span className="font-medium">ahmed@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Project Details Section */}
      <div className="space-y-4">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
          <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-center">
            {t("projectDetails")}
          </h4>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-sm text-muted-foreground">
                {t("projectName")}:
              </span>
              <span className="font-medium">{contract.project.title}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-sm text-muted-foreground">
                {t("workType")}:
              </span>
              <span className="font-medium">Interior Design</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-sm text-muted-foreground">
                {t("location")}:
              </span>
              <span className="font-medium">Riyadh, Saudi Arabia</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-sm text-muted-foreground">
                {t("area")}:
              </span>
              <span className="font-medium">250 sqm</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-sm text-muted-foreground">
                {t("officeAddress")}:
              </span>
              <span className="font-medium">Al-Olaya District</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-sm text-muted-foreground">
                {t("location")}:
              </span>
              <span className="font-medium">Fourth Floor, Building A</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Financial Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Time Period */}
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              {t("timePeriod")}
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-sm text-muted-foreground">
                  {t("executionPeriod")}:
                </span>
                <span className="font-medium">35 days</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-sm text-muted-foreground">
                  {t("startDate")}:
                </span>
                <span className="font-medium">01/06/2025</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-sm text-muted-foreground">
                  {t("contractDate")}:
                </span>
                <span className="font-medium">25/5/2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Financial Terms */}
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-4 text-center">
              {t("financialTerms")}
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-sm text-muted-foreground">
                  {t("totalAmount")}:
                </span>
                <span className="font-medium">95,000 SAR</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-sm text-muted-foreground">
                  {t("advancePayment")}:
                </span>
                <span className="font-medium">30,000 SAR</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-sm text-muted-foreground">
                  {t("productPayment")}:
                </span>
                <span className="font-medium">50,000 SAR</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-sm text-muted-foreground">
                  {t("finalPayment")}:
                </span>
                <span className="font-medium">15,000 SAR</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Contract Terms */}
      <div className="space-y-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-center">
            {t("contractTerms")}
          </h4>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-sm">•</span>
            <span className="text-sm">Payment method as agreed</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm">•</span>
            <span className="text-sm">Contractor warranty</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm">•</span>
            <span className="text-sm">Delivery timeline</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm">•</span>
            <span className="text-sm">Quality guarantees</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Standard Clauses */}
      <div className="space-y-3 my-6">
        <h4 className="font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4" />
          {t("standardClauses")}
          <Badge variant="default" className="ml-2">
            {t("readOnly")}
          </Badge>
        </h4>
        <div className="space-y-3 pl-6">
          {contract.standardClauses.map((clause) => (
            <div
              key={clause.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <h5 className="font-semibold text-sm mb-2 text-gray-900 dark:text-gray-100">
                {clause.title}
              </h5>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {clause.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Additional Clauses */}
      <div className="space-y-3 my-6">
        <h4 className="font-semibold flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {t("additionalClauses")}
          {isEditable && (
            <Badge variant="default" className="ml-2">
              {t("editable")}
            </Badge>
          )}
        </h4>
        <div className="space-y-3 pl-6">
          {contract.additionalClauses.length > 0 ? (
            contract.additionalClauses.map((clause) => (
              <div
                key={clause.id}
                className={`p-4 rounded-lg ${
                  isEditable
                    ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                    : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {clause.text}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground dark:text-gray-400 italic">
              {t("noAdditionalClauses")}
            </p>
          )}
        </div>
      </div>

      {/* Last Negotiation Comment */}
      {contract.lastNegotiationComment && (
        <>
          <Separator />
          <div className="space-y-3 mt-6">
            <h4 className="font-semibold text-orange-600 dark:text-orange-400">
              {t("latestComment")}
            </h4>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg">
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {contract.lastNegotiationComment}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
