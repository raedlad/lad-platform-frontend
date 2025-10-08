"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "../types/contract";
import { useContractStore } from "../store/useContractStore";
import { User, Users, RotateCw } from "lucide-react";

export const RoleSwitcher: React.FC = () => {
  const t = useTranslations('contract');
  const { currentRole, setRole, resetContract } = useContractStore();

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <Users className="w-5 h-5" />
          {t('role_switcher.title')}
        </CardTitle>
        <CardDescription className="text-blue-700 dark:text-blue-300">
          {t('role_switcher.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant={currentRole === "client" ? "secondary" : "outline"}
              onClick={() => setRole("client")}
              className="gap-2"
            >
              <User className="w-4 h-4" />
              {t('role_switcher.client_view')}
            </Button>
            <Button
              variant={currentRole === "contractor" ? "secondary" : "outline"}
              onClick={() => setRole("contractor")}
              className="gap-2"
            >
              <User className="w-4 h-4" />
              {t('role_switcher.contractor_view')}
            </Button>
          </div>
          
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
          
          <Button
            variant="outline"
            onClick={resetContract}
            className="gap-2"
            size="sm"
          >
            <RotateCw className="w-4 h-4" />
            {t('role_switcher.reset_demo')}
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground dark:text-gray-400">{t('roles.current_role')}:</span>
          <Badge variant={currentRole === "client" ? "secondary" : "outline"}>
            {currentRole === "client" ? t('roles.client_owner') : t('roles.contractor')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
