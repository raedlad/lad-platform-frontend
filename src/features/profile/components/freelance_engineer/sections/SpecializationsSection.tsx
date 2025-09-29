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
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";

import { SpecializationsSectionProps } from "../types/sections";
import { cn } from "@/lib/utils";

export const SpecializationsSection: React.FC<SpecializationsSectionProps> = ({
  control,
  engineeringTypes,
  specializations,
  setSpecializations,
  validationErrors,
  setValidationErrors,
  clearFormErrors,
  isLoading,
}) => {
  const tFreelanceEngineer = useTranslations(
    "profile.freelanceEngineer.professionalInfo"
  );

  const addSpecialization = () => {
    const newSpecialization = {
      engineering_specialization_id: 0,
      other_specialization: "",
      specialization_notes: "",
      is_primary_specialization: false,
      expertise_level: undefined,
    };
    setSpecializations([...specializations, newSpecialization]);
  };

  const removeSpecialization = (index: number) => {
    const updatedSpecializations = specializations.filter(
      (_, i) => i !== index
    );
    setSpecializations(updatedSpecializations);
    clearFormErrors(`specializations.${index}`);
  };

  const updateSpecialization = (index: number, field: string, value: any) => {
    const updatedSpecializations = specializations.map((spec, i) =>
      i === index ? { ...spec, [field]: value } : spec
    );
    setSpecializations(updatedSpecializations);
    clearFormErrors(`specializations.${index}.${field}`);
  };

  const setPrimarySpecialization = (index: number) => {
    const updatedSpecializations = specializations.map((spec, i) => ({
      ...spec,
      is_primary_specialization: i === index,
    }));
    setSpecializations(updatedSpecializations);
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {tFreelanceEngineer("specializations")}
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
          {tFreelanceEngineer("addSpecialization")}
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
          <div
            key={index}
            className="p-4 border border-border rounded-lg bg-gray-50/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-foreground">
                  {tFreelanceEngineer("specialization")} {index + 1}
                </h4>
                {specialization.is_primary_specialization && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPrimarySpecialization(index)}
                  disabled={
                    isLoading || specialization.is_primary_specialization
                  }
                  className={cn(
                    "text-xs",
                    specialization.is_primary_specialization &&
                      "bg-yellow-50 border-yellow-200"
                  )}
                >
                  {specialization.is_primary_specialization
                    ? tFreelanceEngineer("primary")
                    : tFreelanceEngineer("setPrimary")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSpecialization(index)}
                  disabled={isLoading}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {tFreelanceEngineer("engineeringSpecialization")}
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
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {tFreelanceEngineer("otherSpecialization")}
                </label>
                <Input
                  value={specialization.other_specialization}
                  onChange={(e) =>
                    updateSpecialization(
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
                  `specializations.${index}.other_specialization`
                ] && (
                  <p className="text-destructive text-xs mt-1">
                    {
                      validationErrors[
                        `specializations.${index}.other_specialization`
                      ]
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {tFreelanceEngineer("expertiseLevel")}
                </label>
                <Select
                  disabled={isLoading}
                  value={specialization.expertise_level || ""}
                  onValueChange={(value) =>
                    updateSpecialization(index, "expertise_level", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={tFreelanceEngineer(
                        "placeholders.selectExpertiseLevel"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors[
                  `specializations.${index}.expertise_level`
                ] && (
                  <p className="text-destructive text-xs mt-1">
                    {
                      validationErrors[
                        `specializations.${index}.expertise_level`
                      ]
                    }
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {tFreelanceEngineer("specializationNotes")}
                </label>
                <Textarea
                  value={specialization.specialization_notes}
                  onChange={(e) =>
                    updateSpecialization(
                      index,
                      "specialization_notes",
                      e.target.value
                    )
                  }
                  disabled={isLoading}
                  placeholder={tFreelanceEngineer(
                    "placeholders.specializationNotes"
                  )}
                  rows={3}
                />
                {validationErrors[
                  `specializations.${index}.specialization_notes`
                ] && (
                  <p className="text-destructive text-xs mt-1">
                    {
                      validationErrors[
                        `specializations.${index}.specialization_notes`
                      ]
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {specializations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>{tFreelanceEngineer("noSpecializations")}</p>
            <p className="text-sm">
              {tFreelanceEngineer("addFirstSpecialization")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
