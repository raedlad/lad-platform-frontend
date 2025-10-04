"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import NavigationButtons from "@/features/project/components/common/NavigationButtons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createProjectValidationSchemas } from "@/features/project/utils/validation";
import { Switch } from "@/shared/components/ui/switch";
import { useCreateProject } from "@/features/project/hooks/useCreateProject";
import { useProjectStore } from "@/features/project/store/projectStore";

const PublishSettingsForm = () => {
  const t = useTranslations("");
  const { submitPublishSettings } = useCreateProject();
  const { publishSettings } = useProjectStore();
  const [isLoading, setIsLoading] = useState(false);
  const { ProjectPublishSchema } = createProjectValidationSchemas(t);
  const form = useForm<z.infer<typeof ProjectPublishSchema>>({
    resolver: zodResolver(ProjectPublishSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      offers_window_days: publishSettings?.offers_window_days || 0,
      notify_matching_contractors: publishSettings?.notify_matching_contractors || false,
      notify_client_on_offer: publishSettings?.notify_client_on_offer || false,
    },
  });
  const onSubmit = async (data: z.infer<typeof ProjectPublishSchema>) => {
    try {
      setIsLoading(true);
    const result = await submitPublishSettings(data);
    if (!result.success) {
      console.error("❌ Submission failed:", result.message);
    } 
    } catch (error) {
      console.error("❌ Submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const onValidationError = (errors: Record<string, unknown>) => {
    const firstErrorField = Object.keys(errors)[0];

    if (firstErrorField) {
      form.setFocus(
        firstErrorField as keyof z.infer<typeof ProjectPublishSchema>
      );
    }
  };
  return (
    <div className="w-full flex flex-col gap-8 ">
      <div className="flex gap-2 text-base lg:text-lg font-bold">
        <span className="text-design-main">05 -</span>
        <h1>{t("project.step5.title")}</h1>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="form-section">
            <div className="flex flex-col items-start  gap-6">
              <FormField
                control={form.control}
                name="offers_window_days"
                render={({ field }) => (
                  <FormItem className="form-item-vertical">
                    <FormLabel>
                      {t("project.step5.offers_window_days")} *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? 0 : Number(val));
                        }}
                        disabled={isLoading}
                        inputMode="numeric"
                        min={1}
                        placeholder={t(
                          "project.step5.offers_window_days_placeholder"
                        )}
                      />
                    </FormControl>
                    <FormMessage className="form-message-min-height" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notify_matching_contractors"
                render={({ field }) => (
                  <FormItem className="flex flex-row-reverse items-start justify-end gap-2">
                    <FormLabel>
                      {t("project.step5.notify_matching_contractors")}
                    </FormLabel>
                    <FormControl>
                      <Switch
                        dir="ltr"
                        checked={field.value}
                        className="data-[state=checked]:bg-design-main h-4 w-7 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-3"
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="form-message-min-height" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notify_client_on_offer"
                render={({ field }) => (
                  <FormItem className="flex flex-row-reverse items-start justify-end gap-2">
                    <FormLabel>
                      {t("project.step5.notify_client_on_offer")}
                    </FormLabel>
                    <FormControl>
                      <Switch
                        dir="ltr"
                        checked={field.value}
                        className="data-[state=checked]:bg-design-main h-4 w-7 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-3"
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="form-message-min-height" />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
      <div className="bg-n-4 rounded-md h-[1px] w-full" />
      <div className="flex flex-col gap-4">
        <NavigationButtons
          onSubmit={() => form.handleSubmit(onSubmit, onValidationError)()}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PublishSettingsForm;
