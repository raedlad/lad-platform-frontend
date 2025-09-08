"use client";

import { Card, CardContent, CardHeader } from "@shared/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  FolderOpen,
  Clock,
  CheckCircle,
  Package,
  Users,
  Star,
  Briefcase,
  PenTool,
  FileText,
  Search,
} from "lucide-react";

import { KPI } from "../../types";
import { cn } from "@/lib/utils";

interface KPICardProps {
  kpi: KPI;
  className?: string;
}

const iconMap = {
  DollarSign,
  FolderOpen,
  Clock,
  CheckCircle,
  Package,
  Users,
  Star,
  Briefcase,
  PenTool,
  FileText,
  Search,
  Plus: FolderOpen, // fallback
};

function formatValue(value: number | string, format: KPI["format"]): string {
  if (typeof value === "string") return value;

  switch (format) {
    case "currency":
      return new Intl.NumberFormat("ar-SA", {
        style: "currency",
        currency: "SAR",
        minimumFractionDigits: 0,
      }).format(value);
    case "percentage":
      return `${value}%`;
    case "number":
      return new Intl.NumberFormat("ar-SA").format(value);
    default:
      return value.toString();
  }
}

function getChangeColor(
  changeType?: "increase" | "decrease" | "neutral"
): string {
  switch (changeType) {
    case "increase":
      return "text-green-600";
    case "decrease":
      return "text-red-600";
    case "neutral":
    default:
      return "text-gray-500";
  }
}

function getChangeIcon(changeType?: "increase" | "decrease" | "neutral") {
  switch (changeType) {
    case "increase":
      return <TrendingUp className="h-3 w-3" />;
    case "decrease":
      return <TrendingDown className="h-3 w-3" />;
    case "neutral":
    default:
      return <Minus className="h-3 w-3" />;
  }
}

export function KPICard({ kpi, className }: KPICardProps) {
  const IconComponent = iconMap[kpi.icon as keyof typeof iconMap] || FolderOpen;
  const formattedValue = formatValue(kpi.value, kpi.format);
  const changeColor = getChangeColor(kpi.changeType);
  const ChangeIcon = getChangeIcon(kpi.changeType);

  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
        <IconComponent
          className={cn("h-4 w-4", kpi.color && `text-${kpi.color}-500`)}
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {kpi.change !== undefined && (
          <div className={cn("flex items-center text-xs", changeColor)}>
            {ChangeIcon}
            <span className="ml-1">
              {Math.abs(kpi.change)} from last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
