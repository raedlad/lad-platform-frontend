'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/components/ui/card';
import { Badge } from '@shared/components/ui/badge';
import { Button } from '@shared/components/ui/button';
import { Progress } from '@shared/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  RefreshCw, 
  User, 
  Building, 
  Shield,
  Info,
  TrendingUp,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Target,
  Activity
} from 'lucide-react';
import { PhaseTimeline } from './PhaseTimeline';
import { ClientActionPanel } from './ClientActionPanel';
import { ContractorActionPanel } from './ContractorActionPanel';
import { ReportsList } from './ReportsList';
import { useProjectExecution } from '../hooks/useProjectExecution';
import type { ProjectPhase } from '../types/execution';

export function ExecutionDashboard() {
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhase | null>(null);
  
  const {
    execution,
    currentPhase,
    actions,
    isLoading,
    isInitialLoading,
    error,
    userRole,
    setUserRole,
    sendPayment,
    requestFundsRelease,
    uploadReport,
    requestAdditionalReport,
    requestCompletion,
    approveCompletion,
    resetExecution,
    canSendPayment,
    canRequestFunds,
    canUploadReport,
    canRequestReport,
    canRequestCompletion,
    canApproveCompletion,
    progressPercentage,
    completedPhasesCount,
    totalPhasesCount,
    isProjectCompleted
  } = useProjectExecution();

  // Set initial selected phase
  useEffect(() => {
    if (currentPhase && !selectedPhase) {
      setSelectedPhase(currentPhase);
    }
  }, [currentPhase]);

  const handlePhaseClick = (phase: ProjectPhase) => {
    setSelectedPhase(phase);
    // Scroll to details section smoothly
    setTimeout(() => {
      document.getElementById('phase-details')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const handleSendPayment = async (amount: number, paymentProof?: File) => {
    if (selectedPhase) {
      await sendPayment(selectedPhase.id, amount);
      // TODO: Handle payment proof file upload
    }
  };

  const handleUploadReport = async (report: Parameters<typeof uploadReport>[1]) => {
    if (selectedPhase) {
      await uploadReport(selectedPhase.id, report);
    }
  };

  const handleRequestReport = async (message: string) => {
    if (selectedPhase) {
      // TODO: Send message with the report request
      await requestAdditionalReport(selectedPhase.id);
      console.log('Report requested with message:', message);
    }
  };

  const handleCloseProject = async () => {
    // TODO: Implement close project API call
    console.log('Close project requested by client');
  };

  const handleRequestProjectClosure = async () => {
    // TODO: Implement request project closure API call
    console.log('Project closure requested by contractor');
  };

  if (!execution) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          {isInitialLoading ? (
            <>
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">جاري تحميل بيانات التنفيذ...</p>
            </>
          ) : (
            <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
          )}
        </div>
      </div>
    );
  }

  // Get next action message based on role and phase status
  const getNextActionGuidance = () => {
    if (!currentPhase) return null;
    
    if (userRole === 'client') {
      if (currentPhase.status === 'pending') {
        return {
          type: 'action',
          icon: DollarSign,
          title: 'إجراء مطلوب: إرسال الدفعة',
          description: `يجب إرسال دفعة المرحلة ${currentPhase.number} بمبلغ ${currentPhase.budget.toLocaleString()} ر.س لبدء العمل`,
          action: 'إرسال الدفعة الآن',
          onAction: () => {
            handlePhaseClick(currentPhase);
          }
        };
      } else if (currentPhase.status === 'completion_requested') {
        return {
          type: 'action',
          icon: CheckCircle2,
          title: 'إجراء مطلوب: اعتماد الإنجاز',
          description: `المقاول طلب اعتماد إنجاز المرحلة ${currentPhase.number}. راجع التقارير واعتمد الإنجاز`,
          action: 'مراجعة واعتماد',
          onAction: () => {
            handlePhaseClick(currentPhase);
          }
        };
      } else if (currentPhase.status === 'in_progress') {
        return {
          type: 'info',
          icon: Activity,
          title: 'العمل جارٍ',
          description: `المقاول يعمل على المرحلة ${currentPhase.number}. يمكنك متابعة التقارير والتحديثات`,
          action: 'عرض التقارير',
          onAction: () => {
            handlePhaseClick(currentPhase);
          }
        };
      }
    } else if (userRole === 'contractor') {
      if (currentPhase.status === 'payment_verified') {
        return {
          type: 'action',
          icon: DollarSign,
          title: 'إجراء مطلوب: طلب صرف الأموال',
          description: `تم التحقق من الدفعة. يمكنك الآن طلب صرف أموال المرحلة ${currentPhase.number}`,
          action: 'طلب صرف الأموال',
          onAction: () => {
            handlePhaseClick(currentPhase);
          }
        };
      } else if (currentPhase.status === 'funds_released' || currentPhase.status === 'in_progress') {
        return {
          type: 'info',
          icon: Activity,
          title: 'ابدأ العمل',
          description: `تم صرف أموال المرحلة ${currentPhase.number}. يمكنك البدء بالعمل ورفع التقارير`,
          action: 'رفع تقرير',
          onAction: () => {
            handlePhaseClick(currentPhase);
          }
        };
      }
    }
    
    return {
      type: 'waiting',
      icon: Clock,
      title: 'في الانتظار',
      description: `المرحلة ${currentPhase.number} - ${currentPhase.status === 'payment_sent' ? 'جاري التحقق من الدفعة' : currentPhase.status === 'funds_requested' ? 'جاري صرف الأموال' : 'في الانتظار'}`,
      action: null
    };
  };

  const nextAction = getNextActionGuidance();

  return (
    <div className="space-y-6">
            {/* Role Switcher (Demo Only) */}
            <Card className="bg-card border-2 border-dashed border-i-3 rounded-lg shadow-sm dark:bg-i-9/20 dark:border-i-7">
        <CardHeader className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-i-2 rounded-lg flex-shrink-0 dark:bg-i-8">
              <Shield className="h-5 w-5 text-i-8 dark:text-i-2" />
            </div>
            <CardTitle className="text-base sm:text-lg font-semibold text-i-8 dark:text-i-2">
              وضع العرض التجريبي - تبديل الأدوار
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={userRole === 'client' ? 'secondary' : 'outline'}
              onClick={() => setUserRole('client')}
            >
              <User className="ml-2 h-4 w-4" />
              العميل
            </Button>
            <Button
              size="sm"
              variant={userRole === 'contractor' ? 'secondary' : 'outline'}
              onClick={() => setUserRole('contractor')}
            >
              <Building className="ml-2 h-4 w-4" />
              المقاول
            </Button>
            <Button
              size="sm"
              variant={userRole === 'admin' ? 'secondary' : 'outline'}
              onClick={() => setUserRole('admin')}
            >
              <Shield className="ml-2 h-4 w-4" />
              المدير
            </Button>
            <div className="mr-auto">
              <Button
                size="sm"
                variant="destructive"
                onClick={resetExecution}
              >
                <RefreshCw className="ml-2 h-4 w-4" />
                إعادة تعيين
              </Button>
            </div>
          </div>
          <Alert className="mt-3">
            <Info className="h-4 w-4" />
            <AlertDescription>
              الدور الحالي: <strong>{userRole === 'client' ? 'العميل' : userRole === 'contractor' ? 'المقاول' : 'المدير'}</strong>
              <br />
              <span className="text-xs text-muted-foreground">
                التحقق من الدفع وصرف الأموال يتم تلقائياً بعد ثوانٍ (محاكاة دور المدير)
              </span>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      {/* Header */}
      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="px-4 sm:px-6 py-5 border-b border-border bg-gradient-to-r from-design-main/5 to-transparent">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-design-main/10 rounded-lg flex-shrink-0 ring-2 ring-design-main/20">
                  <Building className="h-6 w-6 text-design-main" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">{execution.projectName}</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">كود المشروع: #{execution.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">العميل</p>
                    <p className="text-sm font-medium text-foreground truncate">{execution.clientName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                  <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">المقاول</p>
                    <p className="text-sm font-medium text-foreground truncate">{execution.contractorName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">الميزانية</p>
                    <p className="text-sm font-medium text-foreground truncate">{execution.totalBudget.toLocaleString()} ر.س</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">المدة</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {Math.ceil((new Date(execution.expectedEndDate).getTime() - new Date(execution.startDate).getTime()) / (1000 * 60 * 60 * 24))} يوم
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Badge 
              variant="secondary"
              className={`text-sm px-3 py-1.5 flex-shrink-0 ${isProjectCompleted ? 'bg-s-2 text-s-8 dark:bg-s-8 dark:text-s-2' : 'bg-i-2 text-i-8 dark:bg-i-8 dark:text-i-2'}`}
            >
              {isProjectCompleted ? (
                <><CheckCircle2 className="h-3.5 w-3.5 ml-1.5 inline" /> مكتمل</>
              ) : (
                <><Activity className="h-3.5 w-3.5 ml-1.5 inline" /> قيد التنفيذ</>
              )}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 sm:px-6 py-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-design-main" />
              <span className="text-sm font-medium text-foreground">التقدم الكلي للمشروع</span>
            </div>
            <span className="text-lg font-bold text-design-main">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 inline ml-1 text-s-6" />
              {completedPhasesCount} من {totalPhasesCount} مراحل مكتملة
            </span>
            <span className="text-muted-foreground">
              {totalPhasesCount - completedPhasesCount} مراحل متبقية
            </span>
          </div>
        </div>
      </div>

      {/* Next Action Guidance Banner */}
      {nextAction && (
        <Alert 
          className={`border-2 ${
            nextAction.type === 'action' 
              ? 'bg-design-main/5 border-design-main/30 dark:bg-design-main/10 ' 
              : nextAction.type === 'info'
              ? 'bg-i-1 border-i-3 dark:bg-i-9/20 dark:border-i-7'
              : 'bg-muted border-border'
          }`}
        >
            <div className=' flex flex-col lg:flex-row items-start gap-3 justify-between w-full'>
            <div className={`p-2 rounded-lg flex-shrink-0 ${
              nextAction.type === 'action'
                ? 'bg-design-main/20'
                : nextAction.type === 'info'
                ? 'bg-i-2 dark:bg-i-8'
                : 'bg-muted'
            }`}>
              <nextAction.icon className={`h-5 w-5 ${
                nextAction.type === 'action'
                  ? 'text-design-main'
                  : nextAction.type === 'info'
                  ? 'text-i-8 dark:text-i-2'
                  : 'text-muted-foreground'
              }`} />
            </div>
            <div className="flex-1 min-w-0 ">
              <h3 className={`font-semibold text-sm sm:text-base ${
                nextAction.type === 'action'
                  ? 'text-design-main'
                  : 'text-foreground'
              }`}>
                {nextAction.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{nextAction.description}</p>
            </div>
            
            {nextAction.action && nextAction.onAction && (
              <Button
                onClick={nextAction.onAction}
                className=""
                size="sm"
              >
                {nextAction.action}
                <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Button>
            )}
          </div>
        </Alert>
      )}



      {/* Main Content - Timeline */}
      <Card className="bg-card border border-border rounded-lg shadow-sm">
        <CardHeader className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-design-main/10 rounded-lg flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-design-main" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
                  مراحل تنفيذ المشروع
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">اضغط على أي مرحلة لعرض الإجراءات والتقارير</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-i-2 text-i-8 dark:bg-i-8 dark:text-i-2">
              {execution.phases.length} مراحل
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <PhaseTimeline
            phases={execution.phases}
            currentPhaseIndex={execution.currentPhaseIndex}
            onPhaseClick={handlePhaseClick}
          />
        </CardContent>
      </Card>

      {/* Phase Details - Actions & Reports */}
      {selectedPhase && (
        <div id="phase-details" className="mt-6 space-y-6 scroll-mt-6">
          {/* Section Header */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border"></div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-design-main/10 border border-design-main/20">
              <Target className="h-4 w-4 text-design-main" />
              <span className="text-sm font-semibold text-design-main">المرحلة {selectedPhase.number}: {selectedPhase.name}</span>
            </div>
            <div className="h-px flex-1 bg-border"></div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {userRole === 'client' ? (
              <ClientActionPanel
                phase={selectedPhase}
                canSendPayment={selectedPhase ? canSendPayment(selectedPhase.id) : false}
                canRequestReport={selectedPhase ? canRequestReport(selectedPhase.id) : false}
                canApproveCompletion={selectedPhase ? canApproveCompletion(selectedPhase.id) : false}
                allPhasesCompleted={isProjectCompleted}
                onSendPayment={handleSendPayment}
                onRequestReport={handleRequestReport}
                onApproveCompletion={() => selectedPhase && approveCompletion(selectedPhase.id)}
                onCloseProject={handleCloseProject}
                isLoading={isLoading}
              />
            ) : userRole === 'contractor' ? (
              <ContractorActionPanel
                phase={selectedPhase}
                canRequestFunds={selectedPhase ? canRequestFunds(selectedPhase.id) : false}
                canUploadReport={selectedPhase ? canUploadReport(selectedPhase.id) : false}
                canRequestCompletion={selectedPhase ? canRequestCompletion(selectedPhase.id) : false}
                allPhasesCompleted={isProjectCompleted}
                onRequestFunds={() => selectedPhase && requestFundsRelease(selectedPhase.id)}
                onUploadReport={handleUploadReport}
                onRequestCompletion={() => selectedPhase && requestCompletion(selectedPhase.id)}
                onRequestProjectClosure={handleRequestProjectClosure}
                isLoading={isLoading}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>إجراءات المدير</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    يتم التحقق من الدفعات وصرف الأموال تلقائياً في هذا العرض التجريبي
                  </p>
                </CardContent>
              </Card>
            )}
            

          </div>

          {/* Reports Section */}
          <div className="mt-6">
            <ReportsList 
              reports={selectedPhase.reports} 
              phaseNumber={selectedPhase.number} 
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
