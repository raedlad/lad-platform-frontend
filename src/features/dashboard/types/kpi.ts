export interface KPI {
  id: string;
  label: string;
  value: number | string;
  previousValue?: number | string;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  format: KPIFormat;
  icon?: string;
  color?: string;
}

export type KPIFormat = "number" | "currency" | "percentage" | "text" | "date";

export interface DashboardKPIs {
  individual: IndividualKPIs;
  contractor: ContractorKPIs;
  supplier: SupplierKPIs;
  engineering_office: EngineeringOfficeKPIs;
}

export interface IndividualKPIs {
  totalProjects: KPI;
  activeProjects: KPI;
  completedProjects: KPI;
  totalSpent: KPI;
  averageProjectCost: KPI;
  nextDeadline: KPI;
}

export interface ContractorKPIs {
  totalOffers: KPI;
  acceptedOffers: KPI;
  rejectionRate: KPI;
  averageOfferValue: KPI;
  ongoingProjects: KPI;
  reputation: KPI;
  totalEarnings: KPI;
}

export interface SupplierKPIs {
  totalProducts: KPI;
  activeListings: KPI;
  pendingOrders: KPI;
  completedOrders: KPI;
  totalRevenue: KPI;
  averageOrderValue: KPI;
  rating: KPI;
}

export interface EngineeringOfficeKPIs {
  activeProjects: KPI;
  teamUtilization: KPI;
  projectsUnderReview: KPI;
  completedDesigns: KPI;
  averageProjectValue: KPI;
  clientSatisfaction: KPI;
}
