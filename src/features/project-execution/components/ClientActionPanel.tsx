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
import { Textarea } from '@shared/components/ui/textarea';
import { Label } from '@shared/components/ui/label';
import { Send, CheckCircle, FileText, Loader2, Clock, DollarSign, ArrowRight, XCircle } from 'lucide-react';
import { PaymentFormDialog } from './PaymentFormDialog';
import type { ProjectPhase } from '../types/execution';

interface ClientActionPanelProps {
  phase: ProjectPhase | null;
  canSendPayment: boolean;
  canRequestReport: boolean;
  canApproveCompletion: boolean;
  allPhasesCompleted?: boolean;
  onSendPayment: (amount: number, paymentProof?: File) => void;
  onRequestReport: (message: string) => void;
  onApproveCompletion: () => void;
  onCloseProject: () => void;
  isLoading?: boolean;
}

export function ClientActionPanel({
  phase,
  canSendPayment,
  canRequestReport,
  canApproveCompletion,
  allPhasesCompleted = false,
  onSendPayment,
  onRequestReport,
  onApproveCompletion,
  onCloseProject,
  isLoading
}: ClientActionPanelProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showReportRequestDialog, setShowReportRequestDialog] = useState(false);
  const [showCloseProjectDialog, setShowCloseProjectDialog] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [reportRequestMessage, setReportRequestMessage] = useState('');

  const handleSendPayment = (amount: number, paymentProof?: File) => {
    onSendPayment(amount, paymentProof);
    setShowPaymentDialog(false);
  };

  const handleApproveCompletion = () => {
    onApproveCompletion();
    setShowApprovalDialog(false);
    setApprovalNotes('');
  };

  const handleRequestReport = () => {
    if (reportRequestMessage.trim()) {
      onRequestReport(reportRequestMessage);
      setShowReportRequestDialog(false);
      setReportRequestMessage('');
    }
  };

  const handleCloseProject = () => {
    onCloseProject();
    setShowCloseProjectDialog(false);
  };

  if (!phase) {
    return (
      <Card className="bg-card border-2 border-border rounded-xl shadow-sm">
        <CardHeader className="px-3 sm:px-6 py-3 sm:py-4 border-b border-border bg-design-main/5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-design-main/10 rounded-lg flex-shrink-0">
              <Send className="h-4 w-4 sm:h-5 sm:w-5 text-design-main" />
            </div>
            <CardTitle className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
              إجراءات العميل
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <p className="text-xs sm:text-sm text-muted-foreground">اختر مرحلة لعرض الإجراءات المتاحة</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-card border-2 border-border rounded-xl shadow-sm">
        <CardHeader className="px-3 sm:px-6 py-3 sm:py-4 border-b border-border bg-design-main/5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-design-main/10 rounded-lg flex-shrink-0">
              <Send className="h-4 w-4 sm:h-5 sm:w-5 text-design-main" />
            </div>
            <CardTitle className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
              إجراءات العميل - المرحلة {phase.number}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-3">
          {/* Send Payment */}
          <Button
            className={`w-full h-auto py-4 px-4 justify-between ${
              canSendPayment
                ? 'bg-design-main hover:bg-design-main-dark text-white'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            disabled={!canSendPayment || isLoading}
            onClick={() => setShowPaymentDialog(true)}
          >
            <div className="flex items-center gap-3">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <DollarSign className="h-5 w-5" />
              )}
              <div className="text-right">
                <div className="font-semibold text-sm sm:text-base">إرسال الدفعة</div>
                <div className="text-xs opacity-90">{phase.budget.toLocaleString()} ر.س</div>
              </div>
            </div>
            {canSendPayment && <ArrowRight className="h-4 w-4 rtl:rotate-180" />}
          </Button>

          {/* Request Additional Report */}
          <Button
            className={`w-full h-auto py-4 px-4 justify-between ${
              canRequestReport
                ? 'bg-i-6 hover:bg-i-7 text-white dark:bg-i-5 dark:hover:bg-i-6'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            disabled={!canRequestReport || isLoading}
            onClick={() => setShowReportRequestDialog(true)}
          >
            <div className="flex items-center gap-3">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
              <div className="text-right">
                <div className="font-semibold text-sm sm:text-base">طلب تقرير إضافي</div>
                <div className="text-xs opacity-90">طلب تحديث من المقاول</div>
              </div>
            </div>
            {canRequestReport && <ArrowRight className="h-4 w-4 rtl:rotate-180" />}
          </Button>

          {/* Approve Completion */}
          <Button
            className={`w-full h-auto py-4 px-4 justify-between ${
              canApproveCompletion
                ? 'bg-s-6 hover:bg-s-7 text-white dark:bg-s-5 dark:hover:bg-s-6'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            disabled={!canApproveCompletion || isLoading}
            onClick={() => setShowApprovalDialog(true)}
          >
            <div className="flex items-center gap-3">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
              <div className="text-right">
                <div className="font-semibold text-sm sm:text-base">اعتماد إنجاز المرحلة</div>
                <div className="text-xs opacity-90">تأكيد إتمام العمل</div>
              </div>
            </div>
            {canApproveCompletion && <ArrowRight className="h-4 w-4 rtl:rotate-180" />}
          </Button>

          {/* Close Project Button (when all phases completed) */}
          {allPhasesCompleted && (
            <Button
              className="w-full h-auto py-4 px-4 justify-between bg-e-6 hover:bg-e-7 text-white dark:bg-e-5 dark:hover:bg-e-6"
              onClick={() => setShowCloseProjectDialog(true)}
              disabled={isLoading}
            >
              <div className="flex items-center gap-3">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <div className="text-right">
                  <div className="font-semibold text-sm sm:text-base">إغلاق المشروع</div>
                  <div className="text-xs opacity-90">إنهاء المشروع نهائياً</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          )}

          {/* Status Info */}
          <div className="rounded-lg bg-i-1/30 border border-i-3/30 p-4 dark:bg-i-9/10 dark:border-i-7/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-i-6 dark:text-i-5" />
              <span className="font-medium text-sm text-i-8 dark:text-i-3">الحالة:</span>
            </div>
            <p className="text-sm text-i-7 dark:text-i-4">
              {phase.status === 'pending' && 'في انتظار الدفعة'}
              {phase.status === 'payment_sent' && 'تم إرسال الدفعة - جاري التحقق التلقائي...'}
              {phase.status === 'payment_verified' && 'تم التحقق من الدفعة - المقاول يمكنه طلب الأموال'}
              {phase.status === 'funds_requested' && 'جاري صرف الأموال تلقائياً...'}
              {phase.status === 'funds_released' && 'تم صرف الأموال للمقاول'}
              {phase.status === 'in_progress' && 'العمل جاري في المرحلة'}
              {phase.status === 'completion_requested' && 'المقاول طلب اعتماد الإنجاز'}
              {phase.status === 'completed' && 'المرحلة مكتملة'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <PaymentFormDialog
        open={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        phase={phase}
        onSubmit={handleSendPayment}
        isLoading={isLoading}
      />

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-start'>اعتماد إنجاز المرحلة {phase.number}</DialogTitle>
            <DialogDescription className='text-start'>
              هل أنت متأكد من اعتماد إنجاز المرحلة: {phase.name}؟
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className='flex flex-col gap-4'>
              <Label htmlFor="notes">ملاحظات (اختياري)</Label>
              <Textarea
                id="notes"
                placeholder="أضف أي ملاحظات..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
              />
            </div>
            <div className="rounded-lg bg-s-1 border border-s-3 p-3 dark:bg-s-9/20 dark:border-s-7">
              <p className="text-sm font-medium text-s-8 dark:text-s-3">
                عدد التقارير المرفوعة: {phase.reports.length}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)} className="min-w-[100px]">
              إلغاء
            </Button>
            <Button onClick={handleApproveCompletion} className="min-w-[100px] bg-s-6 hover:bg-s-7 text-white dark:bg-s-5 dark:hover:bg-s-6">
              اعتماد الإنجاز
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Request Dialog */}
      <Dialog open={showReportRequestDialog} onOpenChange={setShowReportRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-start">طلب تقرير إضافي</DialogTitle>
            <DialogDescription className="text-start">
              أرسل رسالة للمقاول لطلب تقرير عن تقدم العمل
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="report-message">رسالة الطلب</Label>
              <Textarea
                id="report-message"
                placeholder="مثال: أرجو تقديم تقرير عن التقدم الحالي للمرحلة..."
                rows={4}
                value={reportRequestMessage}
                onChange={(e) => setReportRequestMessage(e.target.value)}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportRequestDialog(false)} className="min-w-[100px]">
              إلغاء
            </Button>
            <Button 
              onClick={handleRequestReport} 
              disabled={!reportRequestMessage.trim()}
              className="min-w-[100px] bg-i-6 hover:bg-i-7 text-white dark:bg-i-5 dark:hover:bg-i-6"
            >
              إرسال الطلب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Project Dialog */}
      <Dialog open={showCloseProjectDialog} onOpenChange={setShowCloseProjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-start">إغلاق المشروع</DialogTitle>
            <DialogDescription className="text-start">
              هل أنت متأكد من إغلاق المشروع؟ هذا الإجراء نهائي ولا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-e-1/30 border border-e-3/30 p-4 dark:bg-e-9/10 dark:border-e-7/30">
              <p className="text-sm text-e-7 dark:text-e-4">
                ⚠️ سيتم إغلاق المشروع بشكل نهائي بعد التأكيد. تأكد من إتمام جميع المراحل واستلام جميع التقارير.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloseProjectDialog(false)} className="min-w-[100px]">
              إلغاء
            </Button>
            <Button 
              onClick={handleCloseProject} 
              className="min-w-[100px] bg-e-6 hover:bg-e-7 text-white dark:bg-e-5 dark:hover:bg-e-6"
            >
              تأكيد الإغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
