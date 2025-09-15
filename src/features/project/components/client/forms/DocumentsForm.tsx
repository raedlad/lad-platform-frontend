"use client";
import React, { useEffect } from "react";
import NavigationButtons from "../../common/NavigationButtons";
import { useTranslations } from "next-intl";
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
import { createProjectValidationSchemas } from "@/features/project/utils/validation";
import FileUpload from "../../common/FileUpload";
import { useCreateProject } from "@/features/project/hooks/useCreateProject";
import { useProjectStore } from "@/features/project/store/projectStore";
import { toast } from "react-hot-toast";
import { FileText, Image } from "lucide-react";
import { z } from "zod";

const DocumentsForm = () => {
  const { projectId, documents } = useProjectStore();
  const t = useTranslations();
  const {
    uploadFile,
    removeFile,
    removeFileLocal,
    reuploadFile,
    submitDocuments,
  } = useCreateProject();

  const { ProjectDocumentsSchema } = createProjectValidationSchemas(t);

  const handleUpload = async (
    files: File[],
    category: keyof typeof documents
  ) => {
    for (const file of files) {
      try {
        const result = await uploadFile(file, category, projectId as string);

        if (!result.success) {
          toast.error(
            t("project.step3.uploadFileFailed", {
              fileName: file.name,
            })
          );
        } else {
          toast.success(
            t("project.step3.fileUploadedSuccessfully", {
              fileName: file.name,
            })
          );
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(
          t("project.step3.uploadFileError", {
            fileName: file.name,
          })
        );
      }
    }
  };

  const handleRemove = async (
    fileId: string,
    category: keyof typeof documents
  ) => {
    const file = documents[category]?.find((f) => f.id === fileId);
    if (!file) {
      toast.error(t("project.step3.fileNotFound"));
      return false;
    }
    if (file.uploadStatus === "uploading") {
      toast.error(t("project.step3.cannotRemoveUploading"));
      return false;
    }
    if (file.uploadStatus === "completed") {
      try {
        const result = await removeFile(fileId, category, projectId as string);
        if (!result.success) {
          toast.error(
            t("project.step3.removeFileFailed", {
              fileName: file.name,
            })
          );
          return false;
        }
        toast.success(
          t("project.step3.fileRemovedSuccessfully", {
            fileName: file.name,
          })
        );
        return true;
      } catch (error) {
        console.error("Remove error:", error);
        toast.error(
          t("project.step3.removeFileError", {
            fileName: file.name,
          })
        );
        return false;
      }
    } else {
      removeFileLocal(fileId, category);
      toast.success(
        t("project.step3.fileRemovedLocally", {
          fileName: file.name,
        })
      );
      return true;
    }
  };

  const handleReupload = async (
    fileId: string,
    newFile: File,
    category: keyof typeof documents
  ) => {
    try {
      const result = await reuploadFile(
        fileId,
        newFile,
        category,
        projectId as string
      );
      if (!result.success) {
        toast.error(
          t("project.step3.reuploadFileFailed", {
            fileName: newFile.name,
          })
        );
      } else {
        toast.success(
          t("project.step3.fileReuploadedSuccessfully", {
            fileName: newFile.name,
          })
        );
      }
    } catch (error) {
      console.error("Reupload error:", error);
      toast.error(
        t("project.step3.reuploadFileError", {
          fileName: newFile.name,
        })
      );
    }
  };

  const form = useForm<z.infer<typeof ProjectDocumentsSchema>>({
    resolver: zodResolver(ProjectDocumentsSchema),
    defaultValues: {
      architectural_plans:
        documents?.architectural_plans.map((f) => f.file || f) || [],
      licenses: documents?.licenses.map((f) => f.file || f) || [],
      specifications: documents?.specifications.map((f) => f.file || f) || [],
      site_photos: documents?.site_photos.map((f) => f.file || f) || [],
    },
  });

  const getCompletedFiles = (category: keyof typeof documents) => {
    return (
      documents[category]
        ?.filter((f) => f.uploadStatus === "completed")
        .map((f) => f.file || f) || [] // Return file object if exists, otherwise return metadata
    );
  };

  const onSubmit = (data: any) => {
    console.log("Documents form submitted:", data);
    submitDocuments(data);
  };

  const onValidationError = (errors: any) => {
    console.log("Validation errors:", errors);
  };

  return (
    <div className="w-full flex flex-col gap-8 ">
      <div className="flex gap-2 text-base lg:text-lg font-bold">
        <span className="text-design-main">03 -</span>
        <h1>{t("project.step3.title")}</h1>
      </div>

      <div className="flex flex-col gap-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onValidationError)}
            className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
          >
            {/* Architectural Plans */}
            <FormField
              control={form.control}
              name="architectural_plans"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="font-semibold text-design-main">
                    {t("project.step3.architectural_plans")}
                  </FormLabel>
                  <FormControl>
                    <FileUpload
                      icon={
                        <FileText className="w-8 h-8 mx-auto text-design-main" />
                      }
                      iconClassName="text-design-main"
                      category="architectural_plans"
                      accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png"
                      maxFiles={5}
                      maxSize={5 * 1024 * 1024} // 5MB
                      onUpload={(files) => {
                        handleUpload(files, "architectural_plans");
                        field.onChange([
                          ...getCompletedFiles("architectural_plans"),
                          ...files,
                        ]);
                      }}
                      onRemove={async (fileId) => {
                        const success = await handleRemove(
                          fileId,
                          "architectural_plans"
                        );
                        if (success) {
                          field.onChange(
                            getCompletedFiles("architectural_plans")
                          );
                        }
                      }}
                      onReupload={(fileId, newFile) => {
                        handleReupload(fileId, newFile, "architectural_plans");
                        const currentFiles = documents.architectural_plans
                          .filter((f) => f.uploadStatus === "completed")
                          .map((f) =>
                            f.id === fileId ? newFile : f.file || f
                          );
                        field.onChange(currentFiles);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Licenses */}
            <FormField
              control={form.control}
              name="licenses"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="font-semibold text-design-main">
                    {t("project.step3.licenses")}
                  </FormLabel>
                  <FormControl>
                    <FileUpload
                      icon={
                        <FileText className="w-8 h-8 mx-auto text-design-main" />
                      }
                      iconClassName="text-design-main"
                      category="licenses"
                      accept=".pdf,.jpg,.jpeg,.png"
                      maxFiles={5}
                      maxSize={5 * 1024 * 1024} // 5MB
                      onUpload={(files) => {
                        handleUpload(files, "licenses");
                        field.onChange([
                          ...getCompletedFiles("licenses"),
                          ...files,
                        ]);
                      }}
                      onRemove={async (fileId) => {
                        const success = await handleRemove(fileId, "licenses");
                        if (success) {
                          field.onChange(getCompletedFiles("licenses"));
                        }
                      }}
                      onReupload={(fileId, newFile) => {
                        handleReupload(fileId, newFile, "licenses");
                        const currentFiles = documents.licenses
                          .filter((f) => f.uploadStatus === "completed")
                          .map((f) =>
                            f.id === fileId ? newFile : f.file || f
                          );
                        field.onChange(currentFiles);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Specifications */}
            <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="font-semibold text-design-main">
                    {t("project.step3.specifications")}
                  </FormLabel>
                  <FormControl>
                    <FileUpload
                      icon={
                        <FileText className="w-8 h-8 mx-auto text-design-main" />
                      }
                      iconClassName="text-design-main"
                      category="specifications"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      maxFiles={5}
                      maxSize={5 * 1024 * 1024} // 5MB
                      onUpload={(files) => {
                        handleUpload(files, "specifications");
                        field.onChange([
                          ...getCompletedFiles("specifications"),
                          ...files,
                        ]);
                      }}
                      onRemove={async (fileId) => {
                        const success = await handleRemove(
                          fileId,
                          "specifications"
                        );
                        if (success) {
                          field.onChange(getCompletedFiles("specifications"));
                        }
                      }}
                      onReupload={(fileId, newFile) => {
                        handleReupload(fileId, newFile, "specifications");
                        const currentFiles = documents.specifications
                          .filter((f) => f.uploadStatus === "completed")
                          .map((f) =>
                            f.id === fileId ? newFile : f.file || f
                          );
                        field.onChange(currentFiles);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Site Photos */}
            <FormField
              control={form.control}
              name="site_photos"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="font-semibold text-design-main">
                    {t("project.step3.site_photos")}
                  </FormLabel>
                  <FormControl>
                    <FileUpload
                      icon={
                        <Image className="w-8 h-8 mx-auto text-design-main" />
                      }
                      iconClassName="text-design-main"
                      category="site_photos"
                      accept=".jpg,.jpeg,.png"
                      maxFiles={10}
                      maxSize={5 * 1024 * 1024} // 5MB
                      onUpload={(files) => {
                        handleUpload(files, "site_photos");
                        field.onChange([
                          ...getCompletedFiles("site_photos"),
                          ...files,
                        ]);
                      }}
                      onRemove={async (fileId) => {
                        const success = await handleRemove(
                          fileId,
                          "site_photos"
                        );
                        if (success) {
                          field.onChange(getCompletedFiles("site_photos"));
                        }
                      }}
                      onReupload={(fileId, newFile) => {
                        handleReupload(fileId, newFile, "site_photos");
                        const currentFiles = documents.site_photos
                          .filter((f) => f.uploadStatus === "completed")
                          .map((f) =>
                            f.id === fileId ? newFile : f.file || f
                          );
                        field.onChange(currentFiles);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>

          <NavigationButtons
            onSubmit={form.handleSubmit(onSubmit, onValidationError)}
            isLoading={false}
          />
        </Form>
      </div>
    </div>
  );
};

export default DocumentsForm;
