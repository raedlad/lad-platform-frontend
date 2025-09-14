"use client";
import React, { useEffect, useState } from "react";
import { projectApi } from "../../services/projectApi";
import useProjectStore from "../../store/projectStore";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/shared/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/useLocale";

const Job = ({
  onSelect,
  className,
  disabled,
  value,
}: {
  onSelect: (value: number) => void;
  className?: string;
  disabled?: boolean;
  value?: number;
}) => {
  const t = useTranslations("");
  const { projectClassificationJobs, setProjectClassificationJobs } =
    useProjectStore();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (projectClassificationJobs) return;
    const fetchProjectClassificationJobs = async () => {
      try {
        setIsLoading(true);
        const result = await projectApi.getProjectClassificationJobs();
        if (result.success) {
          setProjectClassificationJobs(result.response);
        }
      } catch (error) {
        console.log("Error getting project classification jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectClassificationJobs();
  }, []);
  return (
    <div>
      <Select
        value={value?.toString()}
        onValueChange={(value) => {
          onSelect(parseInt(value));
        }}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className={cn("w-full !h-10", className)}>
          <SelectValue
            placeholder={
              isLoading
                ? t("project.step2.jobLoading")
                : t("project.step2.jobSelect")
            }
          />
        </SelectTrigger>
        <SelectContent className={cn("w-full")}>
          {projectClassificationJobs?.map((job) => (
            <SelectItem key={job.id} value={job.id.toString()}>
              {job.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Job;
