'use client';

import { cn } from '@/lib/utils';
import { Check, Clock, DollarSign, AlertCircle, Loader2, FileText, Calendar } from 'lucide-react';
import type { ProjectPhase, PhaseStatus } from '../types/execution';
import { Badge } from '@shared/components/ui/badge';

interface PhaseTimelineProps {
  phases: ProjectPhase[];
  currentPhaseIndex: number;
  onPhaseClick?: (phase: ProjectPhase) => void;
}

const getStatusIcon = (status: PhaseStatus) => {
  switch (status) {
    case 'completed':
      return <Check className="h-5 w-5" />;
    case 'payment_sent':
    case 'payment_verified':
    case 'funds_requested':
    case 'funds_released':
      return <DollarSign className="h-5 w-5" />;
    case 'in_progress':
      return <Loader2 className="h-5 w-5 animate-spin" />;
    case 'completion_requested':
      return <Clock className="h-5 w-5" />;
    default:
      return <AlertCircle className="h-5 w-5" />;
  }
};

const getStatusColor = (status: PhaseStatus, isCurrent: boolean) => {
  if (isCurrent) {
    return 'bg-design-main text-white border-design-main shadow-lg shadow-design-main/20';
  }
  
  switch (status) {
    case 'completed':
      return 'bg-s-6 text-white border-s-6 dark:bg-s-5 dark:border-s-5';
    case 'payment_sent':
    case 'payment_verified':
      return 'bg-i-6 text-white border-i-6 dark:bg-i-5 dark:border-i-5';
    case 'funds_requested':
    case 'funds_released':
      return 'bg-design-main/80 text-white border-design-main/80';
    case 'in_progress':
      return 'bg-w-6 text-white border-w-6 dark:bg-w-5 dark:border-w-5';
    case 'completion_requested':
      return 'bg-w-7 text-white border-w-7 dark:bg-w-6 dark:border-w-6';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

const getStatusLabel = (status: PhaseStatus) => {
  const labels: Record<PhaseStatus, string> = {
    pending: 'في الانتظار',
    payment_sent: 'تم إرسال الدفعة',
    payment_verified: 'تم التحقق من الدفعة',
    funds_requested: 'طلب صرف الأموال',
    funds_released: 'تم صرف الأموال',
    in_progress: 'قيد التنفيذ',
    completion_requested: 'طلب الإنجاز',
    completed: 'مكتملة'
  };
  return labels[status];
};

export function PhaseTimeline({ phases, currentPhaseIndex, onPhaseClick }: PhaseTimelineProps) {
  return (
    <div className="relative">
      {/* Timeline Line - Solid design-main color */}
      <div className="absolute right-4 sm:right-6 top-12 bottom-0 w-1 bg-design-main/30 rounded-full" />
      
      <div className="space-y-4 sm:space-y-6">
        {phases.map((phase, index) => {
          const isCurrent = index === currentPhaseIndex;
          const isCompleted = phase.status === 'completed';
          const isActive = index <= currentPhaseIndex;
          const isClickable = isActive;
          
          return (
            <div
              key={phase.id}
              className={cn(
                'relative flex gap-3 sm:gap-5 transition-all duration-300 group',
                isClickable && 'cursor-pointer hover:translate-x-[-4px]',
                !isClickable && 'cursor-not-allowed',
                !isActive && 'opacity-50'
              )}
              onClick={() => isClickable && onPhaseClick?.(phase)}
            >
              {/* Timeline Node - Enhanced */}
              <div
                className={cn(
                  'relative z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full',
                  'border-3 sm:border-4 transition-all duration-300 flex-shrink-0',
                  getStatusColor(phase.status, isCurrent),
                  isCurrent && 'ring-3 sm:ring-4 ring-design-main/20 scale-110',
                  !isActive && 'scale-90'
                )}
              >
                {getStatusIcon(phase.status)}
              </div>
              
              {/* Phase Details Card - Enhanced */}
              <div className="flex-1 pb-4">
                <div className={cn(
                  'rounded-xl border-2 bg-card shadow-sm transition-all duration-300',
                  isClickable && 'group-hover:shadow-md group-hover:border-design-main/30',
                  isCurrent && 'border-design-main/40 shadow-md',
                  isCompleted && 'border-s-3/40 dark:border-s-7/40',
                  !isActive && 'border-border'
                )}>
                  {/* Header */}
                  <div className={cn(
                    'px-3 sm:px-5 py-3 sm:py-4 border-b rounded-t-xl',
                    isCurrent && 'bg-design-main/5 border-design-main/20',
                    isCompleted && 'bg-s-2/10 border-s-3/20 dark:bg-s-8/10 dark:border-s-7/20',
                    !isActive && 'border-border'
                  )}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex-1 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className={cn(
                            "text-base sm:text-lg font-bold",
                            isCurrent && "text-design-main",
                            isCompleted && "text-s-7 dark:text-s-4",
                            !isCurrent && !isCompleted && "text-foreground"
                          )}>
                            المرحلة {phase.number}
                          </h3>
                          <span className="text-base sm:text-lg font-semibold text-foreground">· {phase.name}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{phase.description}</p>
                      </div>
                      <Badge className={cn(
                        'text-xs px-2.5 sm:px-3 py-1 border flex-shrink-0',
                        isCompleted && 'bg-s-2 text-s-8 border-s-3 dark:bg-s-8 dark:text-s-2 dark:border-s-7',
                        isCurrent && 'bg-design-main/20 text-design-main border-design-main/30',
                        !isActive && !isCompleted && 'bg-muted text-muted-foreground border-border'
                      )}>
                        {getStatusLabel(phase.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Body Content */}
                  <div className="px-3 sm:px-5 py-3 sm:py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      {/* Budget */}
                      <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/30 rounded-lg border border-border">
                        <div className="p-1.5 sm:p-2 bg-design-main/10 rounded-md flex-shrink-0">
                          <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-design-main" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground mb-0.5">الميزانية</p>
                          <p className="font-bold text-xs sm:text-sm text-design-main truncate">{phase.budget.toLocaleString()} ر.س</p>
                        </div>
                      </div>
                      
                      {/* Duration */}
                      <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/30 rounded-lg border border-border">
                        <div className="p-1.5 sm:p-2 bg-i-2/20 rounded-md dark:bg-i-8/20 flex-shrink-0">
                          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-i-7 dark:text-i-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground mb-0.5">المدة</p>
                          <p className="font-semibold text-xs sm:text-sm truncate">{phase.duration} يوم</p>
                        </div>
                      </div>
                      
                      {/* Reports */}
                      <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/30 rounded-lg border border-border">
                        <div className="p-1.5 sm:p-2 bg-s-2/20 rounded-md dark:bg-s-8/20 flex-shrink-0">
                          <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-s-7 dark:text-s-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground mb-0.5">التقارير</p>
                          <p className="font-semibold text-xs sm:text-sm truncate">{phase.reports.length} تقرير</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dates Timeline */}
                    {phase.status !== 'pending' && (phase.paymentDate || phase.startDate || phase.completedDate) && (
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
                        <div className="flex flex-wrap items-center gap-2">
                          {phase.paymentDate && (
                            <div className="flex items-center gap-1.5 text-xs bg-i-2/10 text-i-7 px-2.5 py-1 rounded-full border border-i-3/20 dark:bg-i-8/10 dark:text-i-4 dark:border-i-7/20">
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              <span className="whitespace-nowrap">دفعة: {new Date(phase.paymentDate).toLocaleDateString('ar-SA')}</span>
                            </div>
                          )}
                          {phase.startDate && (
                            <div className="flex items-center gap-1.5 text-xs bg-w-2/10 text-w-7 px-2.5 py-1 rounded-full border border-w-3/20 dark:bg-w-8/10 dark:text-w-4 dark:border-w-7/20">
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              <span className="whitespace-nowrap">بدأت: {new Date(phase.startDate).toLocaleDateString('ar-SA')}</span>
                            </div>
                          )}
                          {phase.completedDate && (
                            <div className="flex items-center gap-1.5 text-xs bg-s-2/10 text-s-7 px-2.5 py-1 rounded-full border border-s-3/20 dark:bg-s-8/10 dark:text-s-4 dark:border-s-7/20">
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              <span className="whitespace-nowrap">اكتملت: {new Date(phase.completedDate).toLocaleDateString('ar-SA')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
