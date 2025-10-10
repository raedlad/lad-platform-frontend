'use client';

import { useState } from 'react';
import { Button } from '@shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Textarea } from '@shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select';
import { DollarSign, Upload, CheckSquare, FileText, Loader2, X, Building, ArrowRight, XCircle, Bell } from 'lucide-react';
import type { ProjectPhase, WorkReport } from '../types/execution';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ContractorActionPanelProps {
  phase: ProjectPhase | null;
  canRequestFunds: boolean;
  canUploadReport: boolean;
  canRequestCompletion: boolean;
  allPhasesCompleted?: boolean;
  onRequestFunds: () => void;
  onUploadReport: (report: Omit<WorkReport, 'id' | 'phaseId' | 'uploadedAt'>) => void;
  onRequestCompletion: () => void;
  onRequestProjectClosure: () => void;
  isLoading?: boolean;
}

export function ContractorActionPanel({
  phase,
  canRequestFunds,
  canUploadReport,
  canRequestCompletion,
  allPhasesCompleted = false,
  onRequestFunds,
  onUploadReport,
  onRequestCompletion,
  onRequestProjectClosure,
  isLoading
}: ContractorActionPanelProps) {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showClosureRequestDialog, setShowClosureRequestDialog] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportType, setReportType] = useState<WorkReport['type']>('progress');
  const [reportFiles, setReportFiles] = useState<string[]>([]);

  const handleUploadReport = () => {
    if (reportTitle && reportDescription) {
      onUploadReport({
        type: reportType,
        title: reportTitle,
        description: reportDescription,
        files: reportFiles,
        uploadedBy: 'contractor'
      });
      setShowReportDialog(false);
      setReportTitle('');
      setReportDescription('');
      setReportFiles([]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(f => f.name);
      setReportFiles(fileNames);
    }
  };

  const handleRequestClosure = () => {
    onRequestProjectClosure();
    setShowClosureRequestDialog(false);
  };

  if (!phase) {
    return (
      <Card className="bg-card border-2 border-border rounded-xl shadow-sm">
        <CardHeader className="px-3 sm:px-6 py-3 sm:py-4 border-b border-border bg-design-main/5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-design-main/10 rounded-lg flex-shrink-0">
              <Building className="h-4 w-4 sm:h-5 sm:w-5 text-design-main" />
            </div>
            <CardTitle className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
              إجراءات المقاول
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <p className="text-xs sm:text-sm text-muted-foreground">اختر مرحلة لعرض الإجراءات المتاحة</p>
        </CardContent>
      </Card>
    );
  }

  // Get pending report requests
  const pendingReportRequests = phase.reportRequests?.filter(req => req.status === 'pending') || [];

  return (
    <>
      <Card className="bg-card border-2 border-border rounded-xl shadow-sm">
        <CardHeader className="px-3 sm:px-6 py-3 sm:py-4 border-b border-border bg-design-main/5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-design-main/10 rounded-lg flex-shrink-0">
              <Building className="h-4 w-4 sm:h-5 sm:w-5 text-design-main" />
            </div>
            <CardTitle className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
              إجراءات المقاول - المرحلة {phase.number}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-3">
          {/* Report Request Alert */}
          {pendingReportRequests.length > 0 && (
            <Alert className="border-w-5 bg-w-1/30 dark:bg-w-9/10">
              <Bell className="h-4 w-4 text-w-6 dark:text-w-5" />
              <AlertDescription className="text-start">
                <div className="flex flex-col gap-2">
                  <p className="font-semibold text-sm text-w-8 dark:text-w-3">
                    طلبات تقارير من العميل ({pendingReportRequests.length})
                  </p>
                  {pendingReportRequests.map((request) => (
                    <div key={request.id} className="p-3 rounded-lg bg-background border border-w-3/30">
                      <p className="text-xs text-muted-foreground mb-1">
                        تم الطلب: {new Date(request.requestedAt).toLocaleDateString('ar-SA')}
                      </p>
                      <p className="text-sm text-foreground">{request.message}</p>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Request Funds Release */}
          <Button
            className={`w-full h-auto py-4 px-4 justify-between ${
              canRequestFunds
                ? 'bg-design-main hover:bg-design-main-dark text-white'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            disabled={!canRequestFunds || isLoading}
            onClick={onRequestFunds}
          >
            <div className="flex items-center gap-3">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <DollarSign className="h-5 w-5" />
              )}
              <div className="text-right">
                <div className="font-semibold text-sm sm:text-base">طلب صرف الأموال</div>
                <div className="text-xs opacity-90">استلام دفعة المرحلة</div>
              </div>
            </div>
            {canRequestFunds && <ArrowRight className="h-4 w-4 rtl:rotate-180" />}
          </Button>

          {/* Upload Report */}
          <Button
            className={`w-full h-auto py-4 px-4 justify-between ${
              canUploadReport
                ? 'bg-i-6 hover:bg-i-7 text-white dark:bg-i-5 dark:hover:bg-i-6'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            disabled={!canUploadReport || isLoading}
            onClick={() => setShowReportDialog(true)}
          >
            <div className="flex items-center gap-3">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
              <div className="text-right">
                <div className="font-semibold text-sm sm:text-base">رفع تقرير عمل</div>
                <div className="text-xs opacity-90">إضافة تقرير تقدم</div>
              </div>
            </div>
            {canUploadReport && <ArrowRight className="h-4 w-4 rtl:rotate-180" />}
          </Button>

          {/* Request Completion */}
          <Button
            className={`w-full h-auto py-4 px-4 justify-between ${
              canRequestCompletion
                ? 'bg-s-6 hover:bg-s-7 text-white dark:bg-s-5 dark:hover:bg-s-6'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            disabled={!canRequestCompletion || isLoading}
            onClick={onRequestCompletion}
          >
            <div className="flex items-center gap-3">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CheckSquare className="h-5 w-5" />
              )}
              <div className="text-right">
                <div className="font-semibold text-sm sm:text-base">طلب اعتماد الإنجاز</div>
                <div className="text-xs opacity-90">إنهاء عمل المرحلة</div>
              </div>
            </div>
            {canRequestCompletion && <ArrowRight className="h-4 w-4 rtl:rotate-180" />}
          </Button>

          {/* Request Project Closure (when all phases completed) */}
          {allPhasesCompleted && (
            <Button
              className="w-full h-auto py-4 px-4 justify-between bg-e-6 hover:bg-e-7 text-white dark:bg-e-5 dark:hover:bg-e-6"
              onClick={() => setShowClosureRequestDialog(true)}
              disabled={isLoading}
            >
              <div className="flex items-center gap-3">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <div className="text-right">
                  <div className="font-semibold text-sm sm:text-base">طلب إغلاق المشروع</div>
                  <div className="text-xs opacity-90">إرسال طلب إغلاق للعميل</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          )}

          {/* Status Info */}
          <div className="rounded-lg bg-i-1/30 border border-i-3/30 p-4 dark:bg-i-9/10 dark:border-i-7/30">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-i-6 dark:text-i-5" />
              <span className="font-medium text-sm text-i-8 dark:text-i-3">التقارير: {phase.reports.length}</span>
            </div>
            <p className="text-sm text-i-7 dark:text-i-4">
              {phase.status === 'in_progress' && 'يمكنك الآن رفع تقارير العمل وتحديثات المشروع'}
              {phase.status === 'payment_verified' && '✅ تم التحقق من الدفعة - يمكنك طلب صرف الأموال'}
              {phase.status === 'payment_sent' && 'جاري التحقق من الدفعة...'}
              {phase.status === 'funds_requested' && 'جاري صرف الأموال...'}
              {phase.status === 'funds_released' && '✅ تم صرف الأموال - يمكنك البدء بالعمل'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upload Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] flex flex-col gap-0 p-0 rounded-md">
          <DialogHeader className="px-6 pt-6 pb-4 bg-design-main/10 border-b border-design-main/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-design-main/20 rounded-lg">
                <FileText className="h-5 w-5 text-design-main" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-design-main">رفع تقرير عمل</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  أضف تقرير عن تقدم العمل في المرحلة {phase.number}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium text-foreground">نوع التقرير</Label>
              <Select value={reportType} onValueChange={(value) => setReportType(value as WorkReport['type'])}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="اختر نوع التقرير" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="progress">تقرير تقدم</SelectItem>
                  <SelectItem value="milestone">إنجاز مرحلي</SelectItem>
                  <SelectItem value="issue">مشكلة أو تحدي</SelectItem>
                  <SelectItem value="additional">تقرير إضافي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-foreground">عنوان التقرير</Label>
              <Input
                id="title"
                placeholder="مثال: إنجاز 50% من واجهة المستخدم"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-foreground">وصف التقرير</Label>
              <Textarea
                id="description"
                placeholder="اشرح التفاصيل..."
                rows={4}
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                className="border-border focus:border-design-main focus:ring-design-main/20 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">المرفقات (اختياري)</Label>
              {reportFiles.length > 0 ? (
                <div className="space-y-2">
                  {reportFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-design-main" />
                        <span className="text-sm text-foreground">{file}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setReportFiles(reportFiles.filter((_, i) => i !== index))}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div
                    className="flex items-center justify-center p-3 border-2 border-dashed border-design-main/30 rounded-lg hover:border-design-main/50 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('report-files')?.click()}
                  >
                    <Upload className="h-5 w-5 text-design-main/60 ml-2" />
                    <span className="text-sm text-muted-foreground">إضافة ملفات أخرى</span>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-design-main/30 rounded-lg hover:border-design-main/50 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('report-files')?.click()}
                >
                  <Upload className="h-8 w-8 text-design-main/60 mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">اضغط لإضافة ملفات</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG, PNG (حتى 10MB)</p>
                </div>
              )}
              <input
                id="report-files"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t bg-muted/10 flex flex-row gap-2 items-center justify-end">
            <Button variant="outline" onClick={() => setShowReportDialog(false)} className="min-w-[100px]">
              إلغاء
            </Button>
            <Button 
              onClick={handleUploadReport} 
              disabled={!reportTitle || !reportDescription}
              className="min-w-[100px] bg-design-main hover:bg-design-main-dark text-white"
            >
              <Upload className="ml-2 h-4 w-4" />
              رفع التقرير
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Closure Request Dialog */}
      <Dialog open={showClosureRequestDialog} onOpenChange={setShowClosureRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-start">طلب إغلاق المشروع</DialogTitle>
            <DialogDescription className="text-start">
              هل أنت متأكد من طلب إغلاق المشروع؟ سيتم إرسال طلب للعميل لإغلاق المشروع.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-i-1/30 border border-i-3/30 p-4 dark:bg-i-9/10 dark:border-i-7/30">
              <p className="text-sm text-i-7 dark:text-i-4">
                ℹ️ بعد إرسال الطلب، سيتم إشعار العميل لمراجعة المشروع واتخاذ قرار الإغلاق النهائي.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClosureRequestDialog(false)} className="min-w-[100px]">
              إلغاء
            </Button>
            <Button 
              onClick={handleRequestClosure} 
              className="min-w-[100px] bg-e-6 hover:bg-e-7 text-white dark:bg-e-5 dark:hover:bg-e-6"
            >
              إرسال الطلب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
