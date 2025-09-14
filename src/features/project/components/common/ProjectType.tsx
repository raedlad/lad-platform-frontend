"use client";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import React, { useEffect } from "react";
import { useProjectStore } from "@/features/project/store/projectStore";
import { projectApi } from "../../services/projectApi";
import { cn } from "@/lib/utils";

const ProjectType = ({
  onSelect,
  className,
  value,
}: {
  onSelect: (value: number) => void;
  className?: string;
  value?: number;
}) => {
  const { projectTypes, setProjectTypes } = useProjectStore();
  useEffect(() => {
    if (projectTypes) return;
    const fetchProjectTypes = async () => {
      const result = await projectApi.getProjectTypes();
      if (result.success) {
        setProjectTypes(result.response);
      }
    };
    fetchProjectTypes();
  }, []);
  return (
    <Select
      value={value?.toString()}
      onValueChange={(value) => {
        onSelect(parseInt(value));
      }}
    >
      <SelectTrigger className={cn("w-full !h-10", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="w-full ">
        {projectTypes?.map((projectType) => (
          <SelectItem key={projectType.id} value={projectType.id.toString()}>
            {projectType.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProjectType;
