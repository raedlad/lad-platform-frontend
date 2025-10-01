import { Star } from "lucide-react";
import React from "react";
import { Button } from "@/shared/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const UpgradeToPremium = ({ className }: { className?: string }) => {
  const t = useTranslations("");
  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            className={cn("rounded-full font-semibold text-xs", className)}
          >
            <Star className="w-4 h-4 me-1 font-semibold" />
            {t("profile.upgradeToPremium")}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("common.ui.comingSoon")}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default UpgradeToPremium;
