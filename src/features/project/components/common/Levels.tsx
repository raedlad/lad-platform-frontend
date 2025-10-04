import React, { useEffect, useState } from "react";
import useProjectStore from "../../store/projectStore";
import { projectApi } from "../../services/projectApi";
import { cn } from "@/lib/utils";
import { ShimmerSkeleton } from "@/components/ui/shimmer-skeleton";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Label } from "@/shared/components/ui/label";
import { Level } from "../../types/project";

const Levels = ({
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
  const { projectClassificationLevels, setProjectClassificationLevels } =
    useProjectStore();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(
    value?.toString() || ""
  );

  useEffect(() => {
    if (projectClassificationLevels) return;
    const fetchProjectClassificationLevels = async () => {
      try {
        setIsLoading(true);
        const result = await projectApi.getProjectClassificationLevels();
        if (result.success) {
          setProjectClassificationLevels(result.response as Level[]);
        }
      } catch (error) {
        // Error handled silently
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectClassificationLevels();
  }, []);

  // Update selectedValue when external value changes
  useEffect(() => {
    setSelectedValue(value?.toString() || "");
  }, [value]);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    onSelect(parseInt(value));
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="space-y-2">
          <ShimmerSkeleton variant="text" lines={1} className="h-4 w-32" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <ShimmerSkeleton variant="circular" className="h-4 w-4" />
                <ShimmerSkeleton
                  variant="text"
                  lines={1}
                  className="h-4 w-48"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <RadioGroup
        value={selectedValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        className="space-y-2"
      >
        {projectClassificationLevels?.map((level) => (
          <div key={level.id} className="flex items-center space-x-3">
            <RadioGroupItem
              value={level.id.toString()}
              id={`level-${level.id}`}
              className="h-4 w-4"
            />
            <Label
              htmlFor={`level-${level.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {level.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Levels;
