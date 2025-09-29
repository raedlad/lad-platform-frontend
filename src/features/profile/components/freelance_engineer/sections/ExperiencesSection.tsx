"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { ExperiencesSectionProps } from "../types/sections";
import { cn } from "@/lib/utils";

export const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({
  control,
  engineeringTypes,
  experiences,
  setExperiences,
  validationErrors,
  setValidationErrors,
  clearFormErrors,
  isLoading,
}) => {
  const tFreelanceEngineer = useTranslations(
    "profile.freelanceEngineer.professionalInfo"
  );

  const addExperience = () => {
    const newExperience = {
      engineering_specialization_id: 0,
      other_specialization: "",
    };
    setExperiences([...experiences, newExperience]);
  };

  const removeExperience = (index: number) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
    clearFormErrors(`experiences.${index}`);
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updatedExperiences = experiences.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    setExperiences(updatedExperiences);
    clearFormErrors(`experiences.${index}.${field}`);
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {tFreelanceEngineer("experiences")}
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addExperience}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {tFreelanceEngineer("addExperience")}
        </Button>
      </div>

      {validationErrors.experiences && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">
            {validationErrors.experiences}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {experiences.map((experience, index) => (
          <div
            key={index}
            className="p-4 border border-border rounded-lg bg-gray-50/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-foreground">
                {tFreelanceEngineer("experience")} {index + 1}
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeExperience(index)}
                disabled={isLoading}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {tFreelanceEngineer("engineeringSpecialization")}
                </label>
                <Select
                  disabled={isLoading}
                  value={experience.engineering_specialization_id.toString()}
                  onValueChange={(value) =>
                    updateExperience(
                      index,
                      "engineering_specialization_id",
                      parseInt(value)
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={tFreelanceEngineer(
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
                  `experiences.${index}.engineering_specialization_id`
                ] && (
                  <p className="text-destructive text-xs mt-1">
                    {
                      validationErrors[
                        `experiences.${index}.engineering_specialization_id`
                      ]
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {tFreelanceEngineer("otherSpecialization")}
                </label>
                <Input
                  value={experience.other_specialization}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      "other_specialization",
                      e.target.value
                    )
                  }
                  disabled={isLoading}
                  placeholder={tFreelanceEngineer(
                    "placeholders.otherSpecialization"
                  )}
                />
                {validationErrors[
                  `experiences.${index}.other_specialization`
                ] && (
                  <p className="text-destructive text-xs mt-1">
                    {
                      validationErrors[
                        `experiences.${index}.other_specialization`
                      ]
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>{tFreelanceEngineer("noExperiences")}</p>
            <p className="text-sm">
              {tFreelanceEngineer("addFirstExperience")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
