"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Offer } from "../../types";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
} from "../../utils";
import { Badge } from "@/shared/components/ui/badge";
import { Calendar, Clock, DollarSign, FileText, User, Layers, CreditCard, ChevronDown } from "lucide-react";
import { WorkflowStageBadge } from "@/features/workflow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OfferDetailsProps {
  offer: Offer;
  hideContractorInfo?: boolean;
  projectStatus?: string;
  userRole?: "owner" | "contractor";
}

export const OfferDetails: React.FC<OfferDetailsProps> = ({ 
  offer, 
  hideContractorInfo = false,
  projectStatus,
  userRole,
}) => {
  const t = useTranslations();
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set());

  const togglePhase = (index: number) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedPhases(newExpanded);
  };

  return (
    <div className="space-y-8">
      {/* Section Title */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-n-3 dark:border-n-7">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-design-main rounded-full"></div>
          <h2 className="text-2xl font-bold text-n-9 dark:text-n-1">
            {t("offers.yourOffer")}
          </h2>
        </div>
        {projectStatus && (
          <WorkflowStageBadge
            projectStatus={projectStatus}
            hasOffers={true}
            offerAccepted={offer.status === "accepted"}
            userRole={userRole}
            showIcon={true}
            size="md"
          />
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-s-1 dark:bg-s-8 rounded-lg flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-s-6 dark:text-s-3" />
          </div>
          <div>
            <p className="text-sm text-n-6 dark:text-n-4">
              {t("offers.details.offeredAmount")}
            </p>
            <p className="text-xl font-semibold text-n-9 dark:text-n-1">
              {formatCurrency(offer.amount, offer.currency)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-i-1 dark:bg-i-8 rounded-lg flex items-center justify-center">
            <Clock className="h-5 w-5 text-i-6 dark:text-i-3" />
          </div>
          <div>
            <p className="text-sm text-n-6 dark:text-n-4">
              {t("offers.details.estimatedDuration")}
            </p>
            <p className="text-xl font-semibold text-n-9 dark:text-n-1">
              {t("common.time.days", {
                count: offer.timeline.estimatedDuration,
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-p-1 dark:bg-p-8 rounded-lg flex items-center justify-center">
            <Calendar className="h-5 w-5 text-p-6 dark:text-p-3" />
          </div>
          <div>
            <p className="text-sm text-n-6 dark:text-n-4">
              {t("offers.details.proposedStartDate")}
            </p>
            <p className="text-xl font-semibold text-n-9 dark:text-n-1">
              {formatDate(offer.timeline.proposedStartDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Description */}
          <section>
            <h2 className="text-lg font-semibold text-n-9 dark:text-n-1 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-design-main" />
              {t("common.ui.description")}
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-n-7 dark:text-n-3 leading-relaxed whitespace-pre-wrap">
                {offer.description}
              </p>
            </div>
          </section>

          {/* Additional Information */}
          {(offer.notes || offer.terms) && (
            <section>
              <h2 className="text-lg font-semibold text-n-9 dark:text-n-1 mb-4">
                {t("offers.details.additionalInfo")}
              </h2>
              <div className="space-y-6">
                {offer.notes && (
                  <div>
                    <h3 className="text-base font-medium text-n-9 dark:text-n-1 mb-2">
                      {t("common.ui.notes")}
                    </h3>
                    <p className="text-n-7 dark:text-n-3 leading-relaxed whitespace-pre-wrap">
                      {offer.notes}
                    </p>
                  </div>
                )}
                {offer.terms && (
                  <div>
                    <h3 className="text-base font-medium text-n-9 dark:text-n-1 mb-2">
                      {t("offers.details.termsConditions")}
                    </h3>
                    <p className="text-n-7 dark:text-n-3 leading-relaxed whitespace-pre-wrap">
                      {offer.terms}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
          {/* Timeline Details */}
          <section>
            <h2 className="text-lg font-semibold text-n-9 dark:text-n-1 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-design-main" />
              {t("offers.details.timeline")}
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-n-3 dark:border-n-7">
                <span className="text-n-6 dark:text-n-4">
                  {t("offers.details.estimatedDuration")}
                </span>
                <span className="font-medium text-n-9 dark:text-n-1">
                  {t("common.time.days", {
                    count: offer.timeline.estimatedDuration,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-n-3 dark:border-n-7">
                <span className="text-n-6 dark:text-n-4">
                  {t("offers.details.proposedStartDate")}
                </span>
                <span className="font-medium text-n-9 dark:text-n-1">
                  {formatDate(offer.timeline.proposedStartDate)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-n-6 dark:text-n-4">
                  {t("offers.details.proposedEndDate")}
                </span>
                <span className="font-medium text-n-9 dark:text-n-1">
                  {formatDate(offer.timeline.proposedEndDate)}
                </span>
              </div>
            </div>
          </section>

          {/* Financial Summary */}
          <section>
            <h2 className="text-lg font-semibold text-n-9 dark:text-n-1 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-design-main" />
              {t("offers.details.financialDetails")}
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-n-3 dark:border-n-7">
                <span className="text-n-6 dark:text-n-4">
                  {t("offers.details.offeredAmount")}
                </span>
                <span className="text-xl font-bold text-design-main">
                  {formatCurrency(offer.amount, offer.currency)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-n-6 dark:text-n-4">
                  {t("offers.details.currency")}
                </span>
                <span className="font-medium text-n-9 dark:text-n-1">
                  {offer.currency}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="xl:w-80 xl:flex-shrink-0 space-y-6">
          {/* Contractor Information */}
          {!hideContractorInfo && (
            <section>
              <h2 className="text-lg font-semibold text-n-9 dark:text-n-1 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-design-main" />
                {t("offers.details.contractorInfo")}
              </h2>
              <div className="flex items-center gap-4 p-4 bg-n-1 dark:bg-n-8 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-p-5 to-p-6 dark:from-p-4 dark:to-p-5 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-white">
                    {offer.contractorName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-n-9 dark:text-n-1">
                    {offer.contractorName}
                  </p>
                  <p className="text-sm text-n-6 dark:text-n-4">
                    {t("common.ui.rating")}: {offer.contractorRating}/5 ⭐
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Attachments */}
          {offer.attachments && offer.attachments.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-n-9 dark:text-n-1 mb-4">
                {t("common.ui.attachments")}
              </h2>
              <div className="space-y-3">
                {offer.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-4 bg-n-1 dark:bg-n-8 rounded-lg hover:bg-n-2 dark:hover:bg-n-7 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-design-main" />
                      <div>
                        <p className="font-medium text-n-9 dark:text-n-1">
                          {attachment.name}
                        </p>
                        <p className="text-sm text-n-6 dark:text-n-4">
                          {attachment.type} •{" "}
                          {(attachment.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-p-6 dark:text-p-4 hover:text-p-7 dark:hover:text-p-3 font-medium text-sm"
                    >
                      {t("common.actions.download")}
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Phases Section */}
      {offer.phases && offer.phases.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-n-9 dark:text-n-1 mb-6 flex items-center gap-2">
            <Layers className="h-5 w-5 text-design-main" />
            {t("offers.createCompleteOffer.projectPhases")}
          </h2>
          <div className="border border-n-3 dark:border-n-7 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-n-2 dark:bg-n-8">
                    <TableHead className="min-w-[80px] font-semibold text-n-9 dark:text-n-1">
                      {t("offers.createCompleteOffer.phase")}
                    </TableHead>
                    <TableHead className="min-w-[200px] font-semibold text-n-9 dark:text-n-1">
                      {t("offers.createCompleteOffer.phaseTitle")}
                    </TableHead>
                    <TableHead className="min-w-[250px] font-semibold text-n-9 dark:text-n-1">
                      {t("offers.createCompleteOffer.phaseDescription")}
                    </TableHead>
                    <TableHead className="min-w-[150px] text-right font-semibold text-n-9 dark:text-n-1">
                      {t("offers.createCompleteOffer.amount")}
                    </TableHead>
                    <TableHead className="min-w-[100px] text-center font-semibold text-n-9 dark:text-n-1">
                      {t("offers.createCompleteOffer.percentageOfContract")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offer.phases
                    .sort((a, b) => a.order - b.order)
                    .map((phase, index) => {
                      const totalPhaseAmount = phase.paymentPlans?.reduce(
                        (sum, plan) => sum + plan.amount,
                        0
                      ) || 0;
                      const totalPhasePercentage = phase.paymentPlans?.reduce(
                        (sum, plan) => sum + plan.percentageOfContract,
                        0
                      ) || 0;
                      const isExpanded = expandedPhases.has(index);

                      return (
                        <React.Fragment key={phase.id || index}>
                          <TableRow className="border-b border-n-3 dark:border-n-7 hover:bg-n-1 dark:hover:bg-n-8 transition-colors">
                            <TableCell className="font-medium text-n-9 dark:text-n-1">
                              {index + 1}
                            </TableCell>
                            <TableCell className="font-medium text-n-9 dark:text-n-1">
                              <button
                                onClick={() => togglePhase(index)}
                                className="flex items-center gap-2 hover:text-design-main transition-colors w-full text-left"
                              >
                                <ChevronDown 
                                  className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                />
                                {phase.title}
                              </button>
                            </TableCell>
                            <TableCell className="text-sm text-n-7 dark:text-n-3">
                              {phase.description}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-n-9 dark:text-n-1">
                              {formatCurrency(totalPhaseAmount, offer.currency)}
                            </TableCell>
                            <TableCell className="text-center font-medium text-n-9 dark:text-n-1">
                              {totalPhasePercentage.toFixed(1)}%
                            </TableCell>
                          </TableRow>
                          {isExpanded && phase.paymentPlans && phase.paymentPlans.length > 0 && (
                            <TableRow className="bg-n-1 dark:bg-n-9">
                              <TableCell colSpan={5} className="p-0">
                                <div className="px-6 py-4 space-y-3">
                                  <h4 className="text-sm font-semibold text-n-9 dark:text-n-1 flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-design-main" />
                                    {t("offers.createCompleteOffer.paymentPlans")}
                                  </h4>
                                  <div className="space-y-2">
                                    {phase.paymentPlans
                                      .sort((a, b) => a.sortOrder - b.sortOrder)
                                      .map((plan, planIndex) => (
                                        <div
                                          key={plan.id || planIndex}
                                          className="bg-n-2 dark:bg-n-8 rounded-lg p-4 border border-n-3 dark:border-n-7"
                                        >
                                          <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                              <p className="text-sm font-medium text-n-9 dark:text-n-1 mb-1">
                                                {plan.name}
                                              </p>
                                              {plan.referenceNote && (
                                                <p className="text-xs text-n-6 dark:text-n-4">
                                                  {plan.referenceNote}
                                                </p>
                                              )}
                                            </div>
                                            <div className="text-right">
                                              <p className="text-base font-semibold text-n-9 dark:text-n-1">
                                                {formatCurrency(plan.amount, offer.currency)}
                                              </p>
                                              <p className="text-xs text-n-6 dark:text-n-4">
                                                {plan.percentageOfContract.toFixed(1)}%
                                              </p>
                                            </div>
                                          </div>
                                          <div className="mt-3 pt-3 border-t border-n-3 dark:border-n-7">
                                            <div className="flex items-center justify-between text-xs">
                                              <span className="text-n-6 dark:text-n-4">
                                                {t("offers.createCompleteOffer.dueDate")}
                                              </span>
                                              <span className="text-n-7 dark:text-n-3 font-medium">
                                                {formatDate(plan.dueOn)}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
