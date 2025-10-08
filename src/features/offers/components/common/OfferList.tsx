"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Offer, ContractorOffer, IndividualOffer } from "../../types";
import { OfferCard } from "./OfferCard";
import { OfferFilters } from "./OfferFilters";
// import { OfferStats } from "./OfferStats";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  RefreshCw,
  Plus,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";

interface OfferListProps {
  offers: (Offer | ContractorOffer | IndividualOffer)[];
  variant?: "contractor" | "individual";
  isLoading?: boolean;
  error?: string | null;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onAccept?: (offer: any) => void;
  onReject?: (offer: any) => void;
  onView?: (offer: any) => void;
  onEdit?: (offer: any) => void;
  onWithdraw?: (offer: any) => void;
  onCounterOffer?: (offer: any) => void;
  onRefresh?: () => void;
  onCreateNew?: () => void;
  onFilterChange?: (filters: any) => void;
  onSearchChange?: (search: string) => void;
  onPageChange?: (page: number) => void;
  showStats?: boolean;
  showFilters?: boolean;
  className?: string;
}

type SortField = "submittedAt" | "amount" | "projectTitle";
type SortDirection = "asc" | "desc";

export const OfferList: React.FC<OfferListProps> = ({
  offers,
  variant = "individual",
  isLoading = false,
  error = null,
  pagination,
  onAccept,
  onReject,
  onView,
  onEdit,
  onWithdraw,
  onCounterOffer,
  onRefresh,
  onCreateNew,
  onFilterChange,
  onSearchChange,
  onPageChange,
  showStats = false,
  showFilters = true,
  className = "",
}) => {
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("submittedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<any>({});

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Debounce search term
  useEffect(() => {
    if (!onSearchChange) return;

    const timer = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 800); // 800ms delay

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Sort offers (filtering is done by API via search param)
  const filteredOffers = offers.sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case "submittedAt":
        aValue = new Date(a.submittedAt).getTime();
        bValue = new Date(b.submittedAt).getTime();
        break;
      case "amount":
        aValue = a.amount;
        bValue = b.amount;
        break;
      case "projectTitle":
        aValue =
          variant === "contractor"
            ? (a as ContractorOffer).projectTitle
            : (a as IndividualOffer).projectDetails?.title || a.projectTitle;
        bValue =
          variant === "contractor"
            ? (b as ContractorOffer).projectTitle
            : (b as IndividualOffer).projectDetails?.title || b.projectTitle;
        break;
      default:
        return 0;
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <SortAsc className="h-4 w-4" />
    ) : (
      <SortDesc className="h-4 w-4" />
    );
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">{t("common.error")}</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("common.tryAgain")}
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats */}
      {/* {showStats && <OfferStats />} */}

      {/* Header with Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("offers.searchOffers")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-design-main/20 focus:border-design-main focus:ring-design-main/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {getSortIcon(sortField)}
                <span className="hidden lg:block ml-2">
                  {t("offers.sortBy")}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleSort("submittedAt")}>
                {getSortIcon("submittedAt")}
                <span className="ml-2">{t("offers.sortByDate")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("amount")}>
                {getSortIcon("amount")}
                <span className="ml-2">{t("offers.sortByAmount")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("projectTitle")}>
                {getSortIcon("projectTitle")}
                <span className="ml-2">{t("offers.sortByProject")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            <Filter className="h-4 w-4 mr-2" />
            <span className="hidden lg:block">{t("common.filters")}</span>
          </Button>

          {/* Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilterPanel && showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <OfferFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm("")}
            className="text-design-main hover:text-design-main/80"
          >
            {t("common.clearSearch")}
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-300 rounded-xl h-80"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredOffers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? t("offers.noSearchResults") : t("offers.noOffers")}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? t("offers.tryDifferentSearch")
              : variant === "contractor"
              ? t("offers.startBrowsingProjects")
              : t("offers.waitingForOffers")}
          </p>
          {onCreateNew && (
            <Button
              onClick={onCreateNew}
              className="bg-design-main hover:bg-design-main/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("offers.createNew")}
            </Button>
          )}
        </div>
      )}

      {/* Offers Grid/List */}
      {!isLoading && filteredOffers.length > 0 && (
        <>
          <motion.div layout className="grid grid-cols-1  lg:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredOffers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    layout: { duration: 0.2 },
                  }}
                  className="max-w-4xl"
                >
                  <OfferCard
                    offer={offer}
                    variant={variant}
                    onAccept={onAccept}
                    onReject={onReject}
                    onView={onView}
                    onEdit={onEdit}
                    onWithdraw={onWithdraw}
                    onCounterOffer={onCounterOffer}
                    className="w-full"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {/* Pagination */}
          {pagination &&
            (pagination.totalPages > 1 ||
              pagination.total > pagination.limit) &&
            onPageChange && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.page > 1) {
                            onPageChange(pagination.page - 1);
                          }
                        }}
                        className={
                          pagination.page === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= pagination.page - 1 &&
                          page <= pagination.page + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                onPageChange(page);
                              }}
                              isActive={pagination.page === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        page === pagination.page - 2 ||
                        page === pagination.page + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.page < pagination.totalPages) {
                            onPageChange(pagination.page + 1);
                          }
                        }}
                        className={
                          pagination.page === pagination.totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
        </>
      )}
    </div>
  );
};
