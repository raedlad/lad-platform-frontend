// Execution Store using Zustand
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  ProjectExecution, 
  ProjectPhase, 
  WorkReport,
  ExecutionAction,
  PhaseStatus
} from '../types/execution';
import { mockExecutionService } from '../services/mockExecutionService';

interface ExecutionStore {
  // State
  execution: ProjectExecution | null;
  currentPhase: ProjectPhase | null;
  actions: ExecutionAction[];
  isLoading: boolean;
  isInitialLoading: boolean;
  error: string | null;
  userRole: 'client' | 'contractor' | 'admin';
  
  // Actions
  setExecution: (execution: ProjectExecution) => void;
  setCurrentPhase: (phase: ProjectPhase) => void;
  setUserRole: (role: 'client' | 'contractor' | 'admin') => void;
  addAction: (action: Omit<ExecutionAction, 'timestamp'>) => void;
  
  // API Actions
  loadExecution: (silent?: boolean) => Promise<void>;
  sendPayment: (phaseId: string, amount: number) => Promise<void>;
  requestFundsRelease: (phaseId: string) => Promise<void>;
  uploadReport: (phaseId: string, report: Omit<WorkReport, 'id' | 'phaseId' | 'uploadedAt'>) => Promise<void>;
  requestAdditionalReport: (phaseId: string, message?: string) => Promise<void>;
  requestCompletion: (phaseId: string) => Promise<void>;
  approveCompletion: (phaseId: string) => Promise<void>;
  updatePhaseStatus: (phaseId: string, status: PhaseStatus) => Promise<void>;
  resetExecution: () => Promise<void>;
}

export const useExecutionStore = create<ExecutionStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      execution: null,
      currentPhase: null,
      actions: [],
      isLoading: false,
      isInitialLoading: true,
      error: null,
      userRole: 'client', // Default role
      
      // Basic Actions
      setExecution: (execution) => 
        set({ 
          execution,
          currentPhase: execution.phases[execution.currentPhaseIndex] || null
        }),
      
      setCurrentPhase: (phase) => 
        set({ currentPhase: phase }),
      
      setUserRole: (role) => 
        set({ userRole: role }),
      
      addAction: (action) => 
        set((state) => ({
          actions: [...state.actions, { ...action, timestamp: new Date() }]
        })),
      
      // Load Execution Data
      loadExecution: async (silent = false) => {
        if (!silent) {
          set({ isInitialLoading: true, error: null });
        }
        try {
          const execution = await mockExecutionService.getExecutionData();
          get().setExecution(execution);
        } catch (error) {
          set({ error: 'Failed to load execution data' });
        } finally {
          if (!silent) {
            set({ isInitialLoading: false });
          }
        }
      },
      
      // Client: Send Payment
      sendPayment: async (phaseId, amount) => {
        set({ isLoading: true, error: null });
        try {
          const updatedPhase = await mockExecutionService.sendPayment(phaseId, amount);
          
          // Update local state
          const execution = get().execution;
          if (execution) {
            const phaseIndex = execution.phases.findIndex(p => p.id === phaseId);
            if (phaseIndex !== -1) {
              execution.phases[phaseIndex] = updatedPhase;
              get().setExecution({ ...execution });
            }
          }
          
          // Log action
          get().addAction({
            type: 'send_payment',
            phaseId,
            performedBy: 'client',
            details: { amount }
          });
        } catch (error) {
          set({ error: 'Failed to send payment' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Contractor: Request Funds Release
      requestFundsRelease: async (phaseId) => {
        set({ isLoading: true, error: null });
        try {
          const updatedPhase = await mockExecutionService.requestFundsRelease(phaseId);
          
          // Update local state
          const execution = get().execution;
          if (execution) {
            const phaseIndex = execution.phases.findIndex(p => p.id === phaseId);
            if (phaseIndex !== -1) {
              execution.phases[phaseIndex] = updatedPhase;
              get().setExecution({ ...execution });
            }
          }
          
          // Log action
          get().addAction({
            type: 'request_funds',
            phaseId,
            performedBy: 'contractor'
          });
        } catch (error) {
          set({ error: 'Failed to request funds release' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Contractor: Upload Report
      uploadReport: async (phaseId, report) => {
        set({ isLoading: true, error: null });
        try {
          const newReport = await mockExecutionService.uploadReport(phaseId, report);
          
          // Update local state
          const execution = get().execution;
          if (execution) {
            const phaseIndex = execution.phases.findIndex(p => p.id === phaseId);
            if (phaseIndex !== -1) {
              execution.phases[phaseIndex].reports.push(newReport);
              get().setExecution({ ...execution });
            }
          }
          
          // Log action
          get().addAction({
            type: 'upload_report',
            phaseId,
            performedBy: 'contractor',
            details: { reportId: newReport.id, title: newReport.title }
          });
        } catch (error) {
          set({ error: 'Failed to upload report' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Client: Request Additional Report
      requestAdditionalReport: async (phaseId, message = 'طلب تقرير تقدم إضافي') => {
        set({ isLoading: true, error: null });
        try {
          const updatedPhase = await mockExecutionService.requestAdditionalReport(phaseId, 'client', message);
          
          // Update local state
          const execution = get().execution;
          if (execution) {
            const phaseIndex = execution.phases.findIndex(p => p.id === phaseId);
            if (phaseIndex !== -1) {
              execution.phases[phaseIndex] = updatedPhase;
              get().setExecution({ ...execution });
            }
          }
          
          // Log action
          get().addAction({
            type: 'request_report',
            phaseId,
            performedBy: 'client',
            details: { message }
          });
        } catch (error) {
          set({ error: 'Failed to request report' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Contractor: Request Completion
      requestCompletion: async (phaseId) => {
        set({ isLoading: true, error: null });
        try {
          const updatedPhase = await mockExecutionService.requestCompletion(phaseId);
          
          // Update local state
          const execution = get().execution;
          if (execution) {
            const phaseIndex = execution.phases.findIndex(p => p.id === phaseId);
            if (phaseIndex !== -1) {
              execution.phases[phaseIndex] = updatedPhase;
              get().setExecution({ ...execution });
            }
          }
          
          // Log action
          get().addAction({
            type: 'request_completion',
            phaseId,
            performedBy: 'contractor'
          });
        } catch (error) {
          set({ error: 'Failed to request completion' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Client: Approve Completion
      approveCompletion: async (phaseId) => {
        set({ isLoading: true, error: null });
        try {
          const updatedPhase = await mockExecutionService.approveCompletion(phaseId);
          
          // Update local state and move to next phase
          const execution = get().execution;
          if (execution) {
            const phaseIndex = execution.phases.findIndex(p => p.id === phaseId);
            if (phaseIndex !== -1) {
              execution.phases[phaseIndex] = updatedPhase;
              
              // Update current phase index if needed
              if (phaseIndex < execution.phases.length - 1) {
                execution.currentPhaseIndex = phaseIndex + 1;
              } else {
                execution.status = 'completed';
                execution.actualEndDate = new Date();
              }
              
              get().setExecution({ ...execution });
            }
          }
          
          // Log action
          get().addAction({
            type: 'approve_completion',
            phaseId,
            performedBy: 'client'
          });
        } catch (error) {
          set({ error: 'Failed to approve completion' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Update Phase Status (for admin simulation)
      updatePhaseStatus: async (phaseId, status) => {
        set({ isLoading: true, error: null });
        try {
          const updatedPhase = await mockExecutionService.updatePhaseStatus(phaseId, status);
          
          // Update local state
          const execution = get().execution;
          if (execution) {
            const phaseIndex = execution.phases.findIndex(p => p.id === phaseId);
            if (phaseIndex !== -1) {
              execution.phases[phaseIndex] = updatedPhase;
              get().setExecution({ ...execution });
            }
          }
        } catch (error) {
          set({ error: 'Failed to update phase status' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Reset for demo
      resetExecution: async () => {
        set({ isLoading: true, error: null });
        try {
          await mockExecutionService.resetExecution();
          await get().loadExecution();
          set({ actions: [] });
        } catch (error) {
          set({ error: 'Failed to reset execution' });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'execution-store'
    }
  )
);
