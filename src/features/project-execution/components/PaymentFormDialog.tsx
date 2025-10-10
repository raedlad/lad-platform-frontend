'use client';

import { useState } from 'react';
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
import { Button } from '@shared/components/ui/button';
import { Upload, X, FileText, Loader2, Building2, Copy, Check } from 'lucide-react';
import type { ProjectPhase } from '../types/execution';

interface PaymentFormDialogProps {
  open: boolean;
  onClose: () => void;
  phase: ProjectPhase | null;
  onSubmit: (amount: number, paymentProof?: File) => void;
  isLoading?: boolean;
}

export function PaymentFormDialog({
  open,
  onClose,
  phase,
  onSubmit,
  isLoading
}: PaymentFormDialogProps) {
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Platform bank account details
  const platformAccount = {
    bankName: 'مصرف الراجحي',
    accountHolder: 'منصة لاد للإدارة والاستشارات',
    iban: 'SA0380000000608010167519',
    accountNumber: '608010167519',
    swiftCode: 'RJHISARI'
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(file);
    }
  };

  const handleRemoveFile = () => {
    setPaymentProof(null);
  };

  const handleSubmit = () => {
    const amount = parseFloat(paymentAmount);
    if (amount > 0) {
      onSubmit(amount, paymentProof || undefined);
      // Reset form
      setBankName('');
      setAccountHolder('');
      setAccountNumber('');
      setPaymentAmount('');
      setPaymentProof(null);
      onClose();
    }
  };

  if (!phase) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] flex flex-col gap-0 p-0 rounded-md">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 bg-design-main/10 border-b border-design-main/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-design-main/20 rounded-lg">
              <FileText className="h-5 w-5 text-design-main" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-design-main">
                تفاصيل الدفع للمرحلة {phase.number}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {phase.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Platform Account Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-5 w-5 text-design-main" />
              <h3 className="font-semibold text-base text-foreground">معلومات حساب المنصة</h3>
            </div>
            <div className="rounded-lg border-2 border-design-main/30 bg-design-main/5 p-4 space-y-3">
              {/* Bank Name */}
              <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">اسم البنك</p>
                  <p className="font-semibold text-sm text-foreground">{platformAccount.bankName}</p>
                </div>
              </div>

              {/* Account Holder */}
              <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">اسم صاحب الحساب</p>
                  <p className="font-semibold text-sm text-foreground">{platformAccount.accountHolder}</p>
                </div>
              </div>

              {/* IBAN */}
              <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border group hover:border-design-main/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">رقم الآيبان (IBAN)</p>
                  <p className="font-mono font-bold text-sm text-foreground">{platformAccount.iban}</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="flex-shrink-0"
                  onClick={() => handleCopy(platformAccount.iban, 'iban')}
                >
                  {copiedField === 'iban' ? (
                    <Check className="h-4 w-4 text-s-6" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Account Number */}
              <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border group hover:border-design-main/50 transition-colors">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">رقم الحساب</p>
                  <p className="font-mono font-semibold text-sm text-foreground">{platformAccount.accountNumber}</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="flex-shrink-0"
                  onClick={() => handleCopy(platformAccount.accountNumber, 'account')}
                >
                  {copiedField === 'account' ? (
                    <Check className="h-4 w-4 text-s-6" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Swift Code */}
              <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Swift Code</p>
                  <p className="font-mono font-semibold text-sm text-foreground">{platformAccount.swiftCode}</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="flex-shrink-0"
                  onClick={() => handleCopy(platformAccount.swiftCode, 'swift')}
                >
                  {copiedField === 'swift' ? (
                    <Check className="h-4 w-4 text-s-6" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Transfer Amount */}
              <div className="flex items-center justify-between p-3 bg-design-main/10 rounded-lg border-2 border-design-main/30">
                <div className="flex-1">
                  <p className="text-xs text-design-main/80 mb-1">المبلغ المطلوب تحويله</p>
                  <p className="font-bold text-xl text-design-main">{phase?.budget.toLocaleString()} ر.س</p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">تفاصيل التحويل</span>
            </div>
          </div>

          {/* Bank Details Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank-name" className="text-sm font-medium text-foreground">
                اسم البنك
              </Label>
              <Input
                id="bank-name"
                placeholder="بنك الراجحي"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-holder" className="text-sm font-medium text-foreground">
                اسم المنشأة / المنشأة الفرد
              </Label>
              <Input
                id="account-holder"
                placeholder="أدخل اسم صاحب الحساب"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-number" className="text-sm font-medium text-foreground">
                رقم الحساب - السداد
              </Label>
              <Input
                id="account-number"
                placeholder="SA0000000000000000000000"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-foreground">
                المبلغ
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder={phase.budget.toString()}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  ر.س
                </span>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              رفع إيصال الحوالة إن وجد
            </Label>
            <p className="text-xs text-muted-foreground">المرفقات</p>
            
            {paymentProof ? (
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-design-main" />
                  <span className="text-sm text-foreground">{paymentProof.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-design-main/30 rounded-lg hover:border-design-main/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById('payment-proof')?.click()}
              >
                <Upload className="h-8 w-8 text-design-main/60 mb-2" />
                <p className="text-sm text-muted-foreground mb-1">اضغط لإضافة ملف</p>
                <p className="text-xs text-muted-foreground">PDF, JPG, PNG (حتى 10MB)</p>
              </div>
            )}
            <input
              id="payment-proof"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Important Note */}
          <div className="rounded-lg bg-w-1 border border-w-4 p-4 dark:bg-w-9/20 dark:border-w-7">
            <p className="text-sm font-medium text-w-8 dark:text-w-3 mb-2">
              ملاحظة هامة
            </p>
            <p className="text-sm text-w-7 dark:text-w-4">
              يجب التحقق من تفاصيل الحساب والمبلغ قبل إتمام الدفع. بعد إرسال التحويل البنكي سيتم مراجعته خلال 24 ساعة.
            </p>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t bg-muted/10 flex flex-row gap-2 items-center justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="min-w-[100px]"
          >
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!paymentAmount || parseFloat(paymentAmount) <= 0 || isLoading}
            className="min-w-[100px] bg-design-main hover:bg-design-main-dark text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الإرسال...
              </>
            ) : (
              'تأكيد الدفع'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
