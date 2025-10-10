// Main hook for project execution
import { useEffect } from 'react';
import { useExecutionStore } from '../store/executionStore';

export const useProjectExecution = () => {
  const {
    execution,
    currentPhase,
    actions,
    isLoading,
    isInitialLoading,
    error,
    userRole,
    loadExecution,
    sendPayment,
    requestFundsRelease,
    uploadReport,
    requestAdditionalReport,
    requestCompletion,
    approveCompletion,
    setUserRole,
    resetExecution
  } = useExecutionStore();

  // Load execution data on mount
  useEffect(() => {
    loadExecution();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh phase status every 2 seconds to simulate admin actions (silent mode)
  useEffect(() => {
    const interval = setInterval(() => {
      loadExecution(true); // Silent refresh - no loading spinner
    }, 2000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if action is available based on role and phase status
  const canSendPayment = (phaseId: string) => {
    const phase = execution?.phases.find(p => p.id === phaseId);
    return userRole === 'client' && phase?.status === 'pending';
  };

  const canRequestFunds = (phaseId: string) => {
    const phase = execution?.phases.find(p => p.id === phaseId);
    return userRole === 'contractor' && phase?.status === 'payment_verified';
  };

  const canUploadReport = (phaseId: string) => {
    const phase = execution?.phases.find(p => p.id === phaseId);
    return userRole === 'contractor' && 
           (phase?.status === 'in_progress' || phase?.status === 'funds_released');
  };

  const canRequestReport = (phaseId: string) => {
    const phase = execution?.phases.find(p => p.id === phaseId);
    return userRole === 'client' && phase?.status === 'in_progress';
  };

  const canRequestCompletion = (phaseId: string) => {
    const phase = execution?.phases.find(p => p.id === phaseId);
    return userRole === 'contractor' && 
           phase?.status === 'in_progress' &&
           (phase?.reports.length ?? 0) > 0;
  };

  const canApproveCompletion = (phaseId: string) => {
    const phase = execution?.phases.find(p => p.id === phaseId);
    return userRole === 'client' && phase?.status === 'completion_requested';
  };

  return {
    execution,
    currentPhase,
    actions,
    isLoading,
    isInitialLoading,
    error,
    userRole,
    
    // Actions
    sendPayment,
    requestFundsRelease,
    uploadReport,
    requestAdditionalReport,
    requestCompletion,
    approveCompletion,
    setUserRole,
    resetExecution,
    
    // Permissions
    canSendPayment,
    canRequestFunds,
    canUploadReport,
    canRequestReport,
    canRequestCompletion,
    canApproveCompletion,
    
    // Computed
    isProjectCompleted: execution?.status === 'completed',
    completedPhasesCount: execution?.phases.filter(p => p.status === 'completed').length ?? 0,
    totalPhasesCount: execution?.phases.length ?? 0,
    progressPercentage: execution ? 
      Math.round((execution.phases.filter(p => p.status === 'completed').length / execution.phases.length) * 100) : 0
  };
};
