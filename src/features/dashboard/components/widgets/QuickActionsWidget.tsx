"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  FileText,
  MessageCircle,
  CreditCard,
  Search,
  Package,
  Users,
  Settings,
  ExternalLink,
  Lock,
} from "lucide-react";

import { QuickAction } from "../../types";
import { cn } from "@/lib/utils";

interface QuickActionsWidgetProps {
  actions: QuickAction[];
  className?: string;
  onActionClick?: (action: QuickAction) => void;
}

function getActionIcon(iconName: string) {
  const iconMap = {
    Plus,
    FileText,
    MessageCircle,
    CreditCard,
    Search,
    Package,
    Users,
    Settings,
    ExternalLink,
  };

  return iconMap[iconName as keyof typeof iconMap] || Plus;
}

function getActionColor(color?: string): string {
  switch (color) {
    case "blue":
      return "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200";
    case "green":
      return "bg-green-50 text-green-700 hover:bg-green-100 border-green-200";
    case "purple":
      return "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200";
    case "orange":
      return "bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200";
    case "red":
      return "bg-red-50 text-red-700 hover:bg-red-100 border-red-200";
    case "yellow":
      return "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200";
    default:
      return "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200";
  }
}

function ActionCard({
  action,
  onClick,
}: {
  action: QuickAction;
  onClick?: (action: QuickAction) => void;
}) {
  const IconComponent = getActionIcon(action.icon);
  const colorClass = getActionColor(action.color);

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md cursor-pointer border",
        colorClass,
        !action.isEnabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={() => action.isEnabled && onClick?.(action)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              "p-2 rounded-lg",
              action.color === "blue" && "bg-blue-100",
              action.color === "green" && "bg-green-100",
              action.color === "purple" && "bg-purple-100",
              action.color === "orange" && "bg-orange-100",
              !action.color && "bg-gray-100"
            )}
          >
            {action.requiresVerification && !action.isEnabled ? (
              <Lock className="h-5 w-5" />
            ) : (
              <IconComponent className="h-5 w-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-sm truncate">{action.label}</h3>
              {action.requiresVerification && (
                <Badge variant="secondary" className="text-xs">
                  Requires Verification
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {action.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickActionsWidget({
  actions,
  className,
  onActionClick,
}: QuickActionsWidgetProps) {
  const enabledActions = actions.filter((action) => action.isEnabled);
  const disabledActions = actions.filter((action) => !action.isEnabled);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {enabledActions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              onClick={onActionClick}
            />
          ))}
          {disabledActions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              onClick={onActionClick}
            />
          ))}
        </div>

        {actions.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No quick actions available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
