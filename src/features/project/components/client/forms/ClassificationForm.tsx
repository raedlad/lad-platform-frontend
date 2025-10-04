"use client";
import React, { useCallback, useEffect } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@shared/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { createProjectValidationSchemas } from "@/features/project/utils/validation";
import { useProjectStore } from "@/features/project/store/projectStore";
import { Textarea } from "@/shared/components/ui/textarea";
import Job from "@/features/project/components/common/Job";
import Levels from "@/features/project/components/common/Levels";
import WorkType from "@/features/project/components/common/WorkType";
import { useCreateProject } from "@/features/project/hooks/useCreateProject";
import NavigationButtons from "@/features/project/components/common/NavigationButtons";

const ClassificationForm = () => {
  const t = useTranslations("");
  const { ProjectClassificationSchema } = createProjectValidationSchemas(t);
  const { originalClassificationData, completedSteps, currentStep, projectId, isLoading } =
    useProjectStore();
  const { error, submitClassification } = useCreateProject();

  const form = useForm<z.infer<typeof ProjectClassificationSchema>>({
    resolver: zodResolver(ProjectClassificationSchema),
    defaultValues: {
      jobId: originalClassificationData?.jobId || 0,
      levelId: originalClassificationData?.levelId || 0,
      workTypeId: originalClassificationData?.workTypeId || 0,
      notes: originalClassificationData?.notes || "",
    },
  });

  useEffect(() => {
    if (originalClassificationData) {
      form.reset({
        jobId: originalClassificationData.jobId || 0,
        levelId: originalClassificationData.levelId || 0,
        workTypeId: originalClassificationData.workTypeId || 0,
        notes: originalClassificationData.notes || "",
      });
    }
  }, [originalClassificationData, form]);

  const onSubmit = async (
    data: z.infer<typeof ProjectClassificationSchema>
  ) => {
    await submitClassification(data);
  };

  const onValidationError = (errors: Record<string, unknown>) => {
    // Validation errors handled by form
  };

  return (
    <div className="w-full flex flex-col gap-8 ">
      <div className="flex gap-2 text-base lg:text-lg font-bold">
        <span className="text-design-main">02 -</span>
        <h1>{t("project.step2.title")}</h1>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onValidationError)}
              className="form-section"
            >
              <div className="grid grid-cols-1 items-start md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-8 w-fit">
                  <FormField
                    control={form.control}
                    name="jobId"
                    render={({ field }) => (
                      <FormItem className="form-item-vertical">
                        <FormLabel className="text-lg font-semibold text-design-main">
                          {t("project.step2.contractorType")} *
                        </FormLabel>
                        <FormControl>
                          <Job
                            className="w-full"
                            value={field.value}
                            onSelect={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="form-message-min-height" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="levelId"
                    render={({ field }) => (
                      <FormItem className="form-item-vertical">
                        <FormLabel className="text-lg font-semibold text-design-main">
                          {t("project.step2.contractorLevel") + " *"}
                        </FormLabel>
                        <FormControl className="w-full">
                          <Levels
                            className="w-full"
                            value={field.value}
                            onSelect={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="form-message-min-height" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="workTypeId"
                  render={({ field }) => (
                    <FormItem className="form-item-vertical">
                      <FormLabel className="text-lg font-semibold text-design-main">
                        {t("project.step2.workType")} *
                      </FormLabel>
                      <FormControl>
                        <WorkType
                          className="w-full"
                          value={field.value}
                          onSelect={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="form-message-min-height" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="form-item-vertical">
                    <FormLabel className="text-lg font-semibold">
                      {t("project.step2.notes")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="form-message-min-height" />
                  </FormItem>
                )}
              />

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <NavigationButtons
                onSubmit={() =>
                  form.handleSubmit(onSubmit, onValidationError)()
                }
                isLoading={isLoading}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ClassificationForm;
