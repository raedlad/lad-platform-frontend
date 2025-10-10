'use client';

import { ExecutionDashboard } from '@/features/project-execution';
import { ArrowLeft, Play } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ExecutionDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="ml-2 h-4 w-4" />
                  الرجوع
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">عرض تجريبي - تنفيذ المشروع</h1>
                <p className="text-sm text-muted-foreground">
                  محاكاة كاملة لدورة حياة تنفيذ المشروع بالمراحل
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-s-6 dark:text-s-5" />
              <span className="text-sm font-medium text-s-6 dark:text-s-5">عرض تجريبي نشط</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 bg-background">
        <ExecutionDashboard />
      </div>

      {/* Help Section */}
      <div className="border-t bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="rounded-lg bg-i-1 p-4 dark:bg-i-9/20">
            <h3 className="mb-2 font-semibold text-i-8 dark:text-i-2">كيفية استخدام العرض التجريبي:</h3>
            <ol className="list-inside list-decimal space-y-1 text-sm text-i-7 dark:text-i-3">
              <li>اختر دورك (عميل أو مقاول) من لوحة تبديل الأدوار</li>
              <li><strong>كعميل:</strong> أرسل الدفعة للمرحلة الأولى</li>
              <li>⏱️ انتظر 2-3 ثوانٍ - التحقق التلقائي من الدفعة (محاكاة المدير)</li>
              <li><strong>بدّل للمقاول:</strong> اطلب صرف الأموال بعد التحقق</li>
              <li>⏱️ انتظر 2-3 ثوانٍ - الصرف التلقائي (محاكاة المدير)</li>
              <li><strong>كمقاول:</strong> ارفع تقارير العمل (يجب رفع تقرير واحد على الأقل)</li>
              <li><strong>كمقاول:</strong> اطلب اعتماد الإنجاز بعد رفع التقارير</li>
              <li><strong>بدّل للعميل:</strong> اعتمد إنجاز المرحلة للانتقال للمرحلة التالية</li>
            </ol>
            <div className="mt-3 rounded-md bg-w-1 p-2 dark:bg-w-9/20">
              <p className="text-xs text-w-8 dark:text-w-3">
                💡 <strong>نصيحة:</strong> راقب الرموز المتحركة (⏱️) التي تشير إلى العمليات التلقائية الجارية. 
                النظام يحدث البيانات تلقائياً كل ثانيتين.
              </p>
            </div>
            <p className="mt-2 text-xs text-i-6 dark:text-i-4">
              ملاحظة: جميع البيانات تجريبية ويتم إعادة تعيينها عند الضغط على زر "إعادة تعيين"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
