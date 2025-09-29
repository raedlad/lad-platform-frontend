"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, Star } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { EngineeringOfficeSpecializationsSectionProps } from "../types/sections";
import { cn } from "@/lib/utils";

export const EngineeringOfficeSpecializationsSection: React.FC<
  EngineeringOfficeSpecializationsSectionProps
> = ({
  control,
  engineeringTypes,
  specializations,
  setSpecializations,
  validationErrors,
  setValidationErrors,
  clearFormErrors,
  isLoading,
}) => {
  const tEngineeringOffice = useTranslations(
    "profile.engineeringOffice.professionalInfo"
  );

  const addSpecialization = () => {
    const newSpecialization = {
      engineering_specialization_id: 0,
      other_specialization: "",
      specialization_notes: "",
      is_primary_specialization: false,
      expertise_level: "beginner" as const,
    };
    setSpecializations([...specializations, newSpecialization]);
  };

  const removeSpecialization = (index: number) => {
    const updatedSpecializations = specializations.filter(
      (_, i) => i !== index
    );
    setSpecializations(updatedSpecializations);
  };

  const updateSpecialization = (
    index: number,
    field: keyof (typeof specializations)[0],
    value: any
  ) => {
    const updatedSpecializations = specializations.map((spec, i) =>
      i === index ? { ...spec, [field]: value } : spec
    );
    setSpecializations(updatedSpecializations);

    // Clear validation error for this field
    clearFormErrors(`specializations.${index}.${field}`);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground dark:text-white">
          {tEngineeringOffice("specializations")}
          <span className="text-red-500 ml-1">*</span>
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSpecialization}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {tEngineeringOffice("addSpecialization")}
        </Button>
      </div>

      {validationErrors.specializations && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">
            {validationErrors.specializations}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {specializations.map((specialization, index) => (
          <div key={index} className="p-4 border border-border  rounded-lg ">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-foreground dark:text-white">
                  {tEngineeringOffice("specialization")} {index + 1}
                </h4>
                {specialization.is_primary_specialization && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSpecialization(index)}
                disabled={isLoading}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground dark:text-white mb-2 block">
                  {tEngineeringOffice("engineeringSpecialization")}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Select
                  disabled={isLoading}
                  value={specialization.engineering_specialization_id.toString()}
                  onValueChange={(value) =>
                    updateSpecialization(
                      index,
                      "engineering_specialization_id",
                      parseInt(value)
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={tEngineeringOffice(
                        "placeholders.selectSpecialization"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {engineeringTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name_en || type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors[
                  `specializations.${index}.engineering_specialization_id`
                ] && (
                  <p className="text-destructive text-xs mt-1">
                    {
                      validationErrors[
                        `specializations.${index}.engineering_specialization_id`
                      ]
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground dark:text-white mb-2 block">
                  {tEngineeringOffice("otherSpecialization")}
                </label>
                <Input
                  value={specialization.other_specialization || ""}
                  onChange={(e) =>
                    updateSpecialization(
                      index,
                      "other_specialization",
                      e.target.value
                    )
                  }
                  disabled={isLoading}
                  placeholder={tEngineeringOffice(
                    "placeholders.enterOtherSpecialization"
                  )}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-foreground dark:text-white mb-2 block">
                {tEngineeringOffice("specializationNotes")}
              </label>
              <Textarea
                value={specialization.specialization_notes || ""}
                onChange={(e) =>
                  updateSpecialization(
                    index,
                    "specialization_notes",
                    e.target.value
                  )
                }
                disabled={isLoading}
                placeholder={tEngineeringOffice(
                  "placeholders.enterSpecializationNotes"
                )}
                rows={3}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`primary-${index}`}
                  checked={specialization.is_primary_specialization || false}
                  onCheckedChange={(checked) =>
                    updateSpecialization(
                      index,
                      "is_primary_specialization",
                      checked
                    )
                  }
                  disabled={isLoading}
                />
                <label
                  htmlFor={`primary-${index}`}
                  className="text-sm font-medium text-foreground dark:text-white"
                >
                  {tEngineeringOffice("isPrimarySpecialization")}
                </label>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground dark:text-white mb-2 block">
                  {tEngineeringOffice("expertiseLevel")}
                </label>
                <Select
                  disabled={isLoading}
                  value={specialization.expertise_level || "beginner"}
                  onValueChange={(value) =>
                    updateSpecialization(
                      index,
                      "expertise_level",
                      value as
                        | "beginner"
                        | "intermediate"
                        | "advanced"
                        | "expert"
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">
                      {tEngineeringOffice("expertiseLevels.beginner")}
                    </SelectItem>
                    <SelectItem value="intermediate">
                      {tEngineeringOffice("expertiseLevels.intermediate")}
                    </SelectItem>
                    <SelectItem value="advanced">
                      {tEngineeringOffice("expertiseLevels.advanced")}
                    </SelectItem>
                    <SelectItem value="expert">
                      {tEngineeringOffice("expertiseLevels.expert")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {specializations.length === 0 && (
        <div className="text-center py-8 text-muted-foreground dark:text-gray-400">
          <p>{tEngineeringOffice("noSpecializations")}</p>
        </div>
      )}
    </div>
  );
};
