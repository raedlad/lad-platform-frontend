"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@shared/components/ui/card";
import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FileText,
  Paperclip,
  User,
  Calendar,
  Download,
  Image as ImageIcon,
  Video,
  FileIcon,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import type { WorkReport } from "../types/execution";
import { cn } from "@/lib/utils";

interface ReportsListProps {
  reports: WorkReport[];
  phaseNumber?: number;
}

interface FilePreview {
  name: string;
  type: "image" | "video" | "pdf" | "other";
  url?: string;
}

const getFileType = (fileName: string): FilePreview["type"] => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || ""))
    return "image";
  if (["mp4", "webm", "ogg", "mov"].includes(ext || "")) return "video";
  if (ext === "pdf") return "pdf";
  return "other";
};

const getFileIcon = (type: FilePreview["type"]) => {
  switch (type) {
    case "image":
      return ImageIcon;
    case "video":
      return Video;
    case "pdf":
      return FileText;
    default:
      return FileIcon;
  }
};

const reportTypeColors = {
  progress:
    "bg-i-2 text-i-8 dark:bg-i-8 dark:text-i-2 border border-i-3 dark:border-i-7",
  milestone:
    "bg-s-2 text-s-8 dark:bg-s-8 dark:text-s-2 border border-s-3 dark:border-s-7",
  issue:
    "bg-d-2 text-d-8 dark:bg-d-8 dark:text-d-2 border border-d-3 dark:border-d-7",
  additional:
    "bg-design-main/20 text-design-main border border-design-main/30 dark:bg-design-main/30 dark:text-design-main",
};

const reportTypeLabels = {
  progress: "تقدم",
  milestone: "إنجاز",
  issue: "مشكلة",
  additional: "إضافي",
};

export function ReportsList({ reports, phaseNumber }: ReportsListProps) {
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    name: string;
    reportTitle: string;
  } | null>(null);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (
    fileName: string,
    reportTitle: string,
    allImages: string[]
  ) => {
    // In real app, you'd get actual URLs from your file storage
    const imageUrl = `/api/files/${fileName}`;
    setSelectedImage({ url: imageUrl, name: fileName, reportTitle });
    setLightboxImages(allImages.map((img) => `/api/files/${img}`));
    setCurrentImageIndex(allImages.indexOf(fileName));
  };

  const handleDownload = (fileName: string) => {
    // In real app, trigger actual download
    const link = document.createElement("a");
    link.href = `/api/files/${fileName}`;
    link.download = fileName;
    link.click();
  };

  const handleClose = () => {
    setSelectedImage(null);
    setLightboxImages([]);
    setCurrentImageIndex(0);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentImageIndex((prev) =>
        prev > 0 ? prev - 1 : lightboxImages.length - 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev < lightboxImages.length - 1 ? prev + 1 : 0
      );
    }
  };

  if (!reports || reports.length === 0) {
    return (
      <Card className="bg-card border border-border rounded-lg shadow-sm">
        <CardHeader className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-design-main/10 rounded-lg flex-shrink-0">
              <FileText className="h-5 w-5 text-design-main" />
            </div>
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
              تقارير العمل {phaseNumber && `- المرحلة ${phaseNumber}`}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              لا توجد تقارير
            </h3>
            <p className="text-sm text-muted-foreground">
              لم يتم رفع أي تقارير لهذه المرحلة حتى الآن
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-card border border-border rounded-lg shadow-sm">
        <CardHeader className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-design-main/10 rounded-lg flex-shrink-0">
                <FileText className="h-5 w-5 text-design-main" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
                  تقارير العمل {phaseNumber && `- المرحلة ${phaseNumber}`}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  عرض جميع التقارير والمرفقات
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-design-main/10 text-design-main"
            >
              {reports.length} تقرير
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Accordion
            type="single"
            collapsible
            defaultValue={
              reports.length > 0 ? `report-${reports[0].id}` : undefined
            }
            className="space-y-3"
          >
            {reports.map((report, index) => {
              const imageFiles = report.files.filter(
                (f) => getFileType(f) === "image"
              );
              const videoFiles = report.files.filter(
                (f) => getFileType(f) === "video"
              );
              const otherFiles = report.files.filter(
                (f) => !["image", "video"].includes(getFileType(f))
              );

              return (
                <AccordionItem
                  key={report.id}
                  value={`report-${report.id}`}
                  className={cn(
                    "rounded-lg border-2 bg-card transition-all duration-200 overflow-hidden",
                    report.type === "progress" &&
                      "border-i-3 hover:border-i-5 dark:border-i-7 dark:hover:border-i-5",
                    report.type === "milestone" &&
                      "border-s-3 hover:border-s-5 dark:border-s-7 dark:hover:border-s-5",
                    report.type === "issue" &&
                      "border-d-3 hover:border-d-5 dark:border-d-7 dark:hover:border-d-5",
                    report.type === "additional" &&
                      "border-design-main/30 hover:border-design-main/50"
                  )}
                >
                  {/* Accordion Trigger */}
                  <AccordionTrigger className="p-4 sm:p-6 hover:no-underline [&[data-state=open]]:bg-muted/20 group">
                    <div className="flex items-start justify-between gap-4 w-full">
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-lg font-bold text-foreground leading-relaxed group-hover:text-design-main transition-colors">
                            {report.title}
                          </h4>
                          <Badge
                            className={cn(
                              "text-xs flex-shrink-0 px-2.5 py-1",
                              reportTypeColors[report.type]
                            )}
                          >
                            {reportTypeLabels[report.type]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-loose mb-4 text-start">
                          {report.description}
                        </p>

                        {/* Mini metadata preview */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <div className="flex items-center gap-1.5 bg-muted rounded-md px-3 py-1.5 border border-border">
                            <Calendar className="h-3.5 w-3.5 text-design-main" />
                            <span className="text-foreground">
                              {new Date(report.uploadedAt).toLocaleDateString(
                                "ar-SA"
                              )}
                            </span>
                          </div>
                          {report.files.length > 0 && (
                            <div className="flex items-center gap-1.5 bg-design-main/10 text-design-main rounded-md px-3 py-1.5 border border-design-main/20">
                              <Paperclip className="h-3.5 w-3.5" />
                              <span className="font-semibold">
                                {report.files.length} مرفقات
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>

                  {/* Accordion Content */}
                  <AccordionContent className="pb-0">
                    {/* Detailed Metadata */}
                    <div
                      className={cn(
                        "px-4 sm:px-5 py-3 border-t",
                        report.type === "progress" &&
                          "bg-i-1/30 border-i-3 dark:bg-i-9/20 dark:border-i-7",
                        report.type === "milestone" &&
                          "bg-s-1/30 border-s-3 dark:bg-s-9/20 dark:border-s-7",
                        report.type === "issue" &&
                          "bg-d-1/30 border-d-3 dark:bg-d-9/20 dark:border-d-7",
                        report.type === "additional" &&
                          "bg-design-main/5 border-design-main/20"
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        {report.requestedBy && (
                          <Badge
                            variant="outline"
                            className="text-xs ml-auto border-2"
                          >
                            مطلوب من {report.requestedBy}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Files Preview */}
                    {report.files.length > 0 && (
                      <div className="p-4 sm:p-5 space-y-4">
                        {/* Images Grid */}
                        {imageFiles.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                              <div className="p-1.5 bg-design-main/10 rounded-md">
                                <ImageIcon className="h-4 w-4 text-design-main" />
                              </div>
                              <span className="text-sm font-semibold text-foreground">
                                الصور
                              </span>
                              <Badge
                                variant="secondary"
                                className="bg-design-main/10 text-design-main text-xs"
                              >
                                {imageFiles.length}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                              {imageFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="group relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50 border-2 border-border hover:border-design-main transition-all cursor-pointer shadow-sm hover:shadow-md"
                                  onClick={() =>
                                    handleImageClick(
                                      file,
                                      report.title,
                                      imageFiles
                                    )
                                  }
                                >
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="p-3 bg-design-main/10 rounded-full">
                                      <ImageIcon className="h-10 w-10 text-design-main" />
                                    </div>
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                                    <div className="flex items-center justify-between gap-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 px-3 text-white hover:text-white hover:bg-white/20 backdrop-blur-sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleImageClick(
                                            file,
                                            report.title,
                                            imageFiles
                                          );
                                        }}
                                      >
                                        <Eye className="h-4 w-4 ml-1" />
                                        عرض
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 px-3 text-white hover:text-white hover:bg-white/20 backdrop-blur-sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDownload(file);
                                        }}
                                      >
                                        <Download className="h-4 w-4 ml-1" />
                                        حفظ
                                      </Button>
                                    </div>
                                  </div>
                                  <p className="absolute top-2 left-2 right-2 text-xs text-white bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                    {file}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Videos */}
                        {videoFiles.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                              <div className="p-1.5 bg-design-main/10 rounded-md">
                                <Video className="h-4 w-4 text-design-main" />
                              </div>
                              <span className="text-sm font-semibold text-foreground">
                                الفيديوهات
                              </span>
                              <Badge
                                variant="secondary"
                                className="bg-design-main/10 text-design-main text-xs"
                              >
                                {videoFiles.length}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {videoFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 rounded-lg bg-card border-2 border-border hover:border-design-main transition-all shadow-sm"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="p-2 bg-design-main/10 rounded-lg flex-shrink-0">
                                      <Video className="h-5 w-5 text-design-main" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground truncate">
                                      {file}
                                    </span>
                                  </div>
                                  <Button
                                    size="sm"
                                    className="flex-shrink-0 bg-design-main hover:bg-design-main-dark text-white"
                                    onClick={() => handleDownload(file)}
                                  >
                                    <Download className="h-4 w-4 ml-1" />
                                    تحميل
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Other Files */}
                        {otherFiles.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                              <div className="p-1.5 bg-design-main/10 rounded-md">
                                <FileIcon className="h-4 w-4 text-design-main" />
                              </div>
                              <span className="text-sm font-semibold text-foreground">
                                ملفات أخرى
                              </span>
                              <Badge
                                variant="secondary"
                                className="bg-design-main/10 text-design-main text-xs"
                              >
                                {otherFiles.length}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {otherFiles.map((file, index) => {
                                const FileIconComponent = getFileIcon(
                                  getFileType(file)
                                );
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded-lg bg-card border-2 border-border hover:border-design-main transition-all shadow-sm"
                                  >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div className="p-2 bg-muted rounded-lg flex-shrink-0">
                                        <FileIconComponent className="h-5 w-5 text-design-main" />
                                      </div>
                                      <span className="text-sm font-medium text-foreground truncate">
                                        {file}
                                      </span>
                                    </div>
                                    <Button
                                      size="sm"
                                      className="flex-shrink-0 bg-design-main hover:bg-design-main-dark text-white"
                                      onClick={() => handleDownload(file)}
                                    >
                                      <Download className="h-4 w-4 ml-1" />
                                      تحميل
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Image Lightbox */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-[98vw] max-h-[98vh] w-full h-full p-0 bg-background/95 backdrop-blur-xl border-none rounded-lg">
            <div className="relative w-full h-full flex flex-col">
              {/* Minimal Header */}
              <div className="absolute top-0 left-0 right-0 z-20 px-6 py-4 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-sm font-medium text-muted-foreground truncate">
                      {selectedImage.name}
                    </DialogTitle>
                  </div>
                  <div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:bg-muted/50 backdrop-blur-sm"
                      onClick={() => handleDownload(selectedImage.name)}
                    >
                      <Download className="h-4 w-4 ml-2" />
                      <span className="hidden sm:inline">تحميل</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:bg-muted/50 backdrop-blur-sm"
                      onClick={() => handleClose()}
                    >
                      <X className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Image Display Area */}
              <div className="flex-1 relative flex items-center justify-center p-12">
                {/* Navigation Buttons */}
                {lightboxImages.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute left-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-design-main hover:bg-design-main/80 backdrop-blur-sm"
                      onClick={() => navigateImage("prev")}
                    >
                      <ChevronLeft className="h-5 w-5 text-white" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-6 bg-design-main top-1/2 -translate-y-1/2 h-10 w-10 rounded-full hover:bg-design-main/80 backdrop-blur-sm"
                      onClick={() => navigateImage("next")}
                    >
                      <ChevronRight className="h-5 w-5 text-white" />
                    </Button>
                  </>
                )}

                {/* Image Placeholder */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative max-w-full max-h-full">
                    <div className="bg-muted/30 rounded-lg p-16 flex items-center justify-center">
                      <ImageIcon className="h-32 w-32 text-muted-foreground/40" />
                    </div>
                    {/* In real app, replace with: 
                    <img 
                      src={lightboxImages[currentImageIndex]} 
                      alt={selectedImage.name}
                      className="max-w-full max-h-[85vh] object-contain rounded-lg" 
                    /> 
                    */}
                  </div>
                </div>
              </div>

              {/* Image Counter */}
              {lightboxImages.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium bg-design-main/80 text-white">
                  {currentImageIndex + 1} / {lightboxImages.length}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
