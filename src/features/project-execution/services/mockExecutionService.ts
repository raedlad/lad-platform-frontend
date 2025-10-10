// Mock Execution Service
import type { ProjectExecution, ProjectPhase, PhaseStatus, WorkReport, ReportRequest } from '../types/execution';

// Mock Data
const MOCK_EXECUTION_DATA: ProjectExecution = {
  id: 'exec_001',
  projectId: 'proj_001',
  contractId: 'contract_001',
  projectName: 'تطوير موقع التجارة الإلكترونية',
  clientName: 'أحمد محمد',
  contractorName: 'شركة التقنية المتقدمة',
  totalBudget: 150000,
  currentPhaseIndex: 0,
  startDate: new Date('2024-01-01'),
  expectedEndDate: new Date('2024-06-01'),
  status: 'active',
  phases: [
    {
      id: 'phase_001',
      number: 1,
      name: 'التحليل والتصميم',
      description: 'تحليل المتطلبات وتصميم النظام',
      budget: 30000,
      duration: 30,
      status: 'pending',
      reports: []
    },
    {
      id: 'phase_002',
      number: 2,
      name: 'التطوير الأساسي',
      description: 'تطوير الوظائف الأساسية للموقع',
      budget: 60000,
      duration: 45,
      status: 'pending',
      reports: []
    },
    {
      id: 'phase_003',
      number: 3,
      name: 'الاختبار والنشر',
      description: 'اختبار النظام ونشره على الخادم',
      budget: 60000,
      duration: 30,
      status: 'pending',
      reports: []
    }
  ]
};

// Simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockExecutionService {
  private executionData: ProjectExecution = JSON.parse(JSON.stringify(MOCK_EXECUTION_DATA));

  async getExecutionData(): Promise<ProjectExecution> {
    await delay(300);
    // Return deep copy to ensure fresh data
    return JSON.parse(JSON.stringify(this.executionData));
  }

  async sendPayment(phaseId: string, amount: number): Promise<ProjectPhase> {
    await delay(800);
    
    const phase = this.executionData.phases.find(p => p.id === phaseId);
    if (!phase) throw new Error('Phase not found');
    
    phase.status = 'payment_sent';
    phase.paymentDate = new Date();
    
    console.log('💰 Payment sent, will verify in 2 seconds...');
    
    // Simulate admin verification after 2 seconds
    setTimeout(() => {
      phase.status = 'payment_verified';
      phase.paymentVerifiedDate = new Date();
      console.log('✅ Payment verified automatically');
    }, 2000);
    
    return JSON.parse(JSON.stringify(phase));
  }

  async requestFundsRelease(phaseId: string): Promise<ProjectPhase> {
    await delay(600);
    
    const phase = this.executionData.phases.find(p => p.id === phaseId);
    if (!phase) throw new Error('Phase not found');
    
    phase.status = 'funds_requested';
    phase.fundsRequestedDate = new Date();
    
    console.log('💵 Funds requested, will release in 2 seconds...');
    
    // Simulate admin release after 2 seconds
    setTimeout(() => {
      phase.status = 'funds_released';
      phase.fundsReleasedDate = new Date();
      console.log('✅ Funds released automatically');
      
      // Move to in_progress after funds released
      setTimeout(() => {
        phase.status = 'in_progress';
        phase.startDate = new Date();
        console.log('🚀 Phase moved to in_progress');
      }, 1000);
    }, 2000);
    
    return JSON.parse(JSON.stringify(phase));
  }

  async uploadReport(
    phaseId: string, 
    report: Omit<WorkReport, 'id' | 'phaseId' | 'uploadedAt'>
  ): Promise<WorkReport> {
    await delay(800);
    
    const phase = this.executionData.phases.find(p => p.id === phaseId);
    if (!phase) throw new Error('Phase not found');
    
    const newReport: WorkReport = {
      ...report,
      id: `report_${Date.now()}`,
      phaseId,
      uploadedAt: new Date()
    };
    
    phase.reports.push(newReport);
    
    return newReport;
  }

  async requestAdditionalReport(phaseId: string, requestedBy: string, message: string): Promise<ProjectPhase> {
    await delay(500);
    
    const phase = this.executionData.phases.find(p => p.id === phaseId);
    if (!phase) throw new Error('Phase not found');
    
    // Create new report request
    const newRequest: ReportRequest = {
      id: `req-${Date.now()}`,
      phaseId,
      message,
      requestedBy,
      requestedAt: new Date(),
      status: 'pending'
    };
    
    // Add to phase
    if (!phase.reportRequests) {
      phase.reportRequests = [];
    }
    phase.reportRequests.push(newRequest);
    
    console.log(`Additional report requested for phase ${phaseId} by ${requestedBy}: ${message}`);
    
    return { ...phase };
  }

  async requestCompletion(phaseId: string): Promise<ProjectPhase> {
    await delay(800);
    
    const phase = this.executionData.phases.find(p => p.id === phaseId);
    if (!phase) throw new Error('Phase not found');
    
    phase.status = 'completion_requested';
    phase.completionRequestedDate = new Date();
    
    return { ...phase };
  }

  async approveCompletion(phaseId: string): Promise<ProjectPhase> {
    await delay(1000);
    
    const phase = this.executionData.phases.find(p => p.id === phaseId);
    if (!phase) throw new Error('Phase not found');
    
    phase.status = 'completed';
    phase.completedDate = new Date();
    phase.endDate = new Date();
    
    // Move to next phase
    const currentIndex = this.executionData.phases.findIndex(p => p.id === phaseId);
    if (currentIndex < this.executionData.phases.length - 1) {
      this.executionData.currentPhaseIndex = currentIndex + 1;
    } else {
      // All phases completed
      this.executionData.status = 'completed';
      this.executionData.actualEndDate = new Date();
    }
    
    return { ...phase };
  }

  async updatePhaseStatus(phaseId: string, status: PhaseStatus): Promise<ProjectPhase> {
    await delay(500);
    
    const phase = this.executionData.phases.find(p => p.id === phaseId);
    if (!phase) throw new Error('Phase not found');
    
    phase.status = status;
    
    return { ...phase };
  }

  // Reset for demo purposes
  async resetExecution(): Promise<void> {
    await delay(500);
    this.executionData = JSON.parse(JSON.stringify(MOCK_EXECUTION_DATA));
  }
}

export const mockExecutionService = new MockExecutionService();
