import { DashboardUser } from "../types";

export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    individual: "Individual",
    contractor: "Contractor",
    supplier: "Supplier",
    engineering_office: "Engineering Office",
    freelance_engineer: "Freelance Engineer",
    organization: "Organization",
  };

  return roleMap[role] || role;
}

export function getRoleColor(role: string): string {
  switch (role) {
    case "individual":
      return "blue";
    case "contractor":
      return "green";
    case "supplier":
      return "purple";
    case "engineering_office":
      return "orange";
    case "freelance_engineer":
      return "indigo";
    case "organization":
      return "gray";
    default:
      return "gray";
  }
}

export function canAccessFeature(userRole: string, feature: string): boolean {
  const featureAccess: Record<string, string[]> = {
    post_projects: ["individual", "organization"],
    browse_projects: ["contractor", "freelance_engineer", "engineering_office"],
    manage_products: ["supplier"],
    team_management: ["engineering_office", "organization", "contractor"],
    advanced_analytics: [
      "contractor",
      "engineering_office",
      "supplier",
      "organization",
    ],
  };

  return featureAccess[feature]?.includes(userRole) || false;
}

export function getDefaultQuickActions(role: string) {
  const actionMap: Record<string, any[]> = {
    individual: [
      {
        id: "new-project",
        label: "Post New Project",
        description: "Create a new project and find contractors",
        icon: "Plus",
        url: "/dashboard/projects/new",
        color: "blue",
        isEnabled: true,
      },
      {
        id: "view-offers",
        label: "View Offers",
        description: "Review and manage project offers",
        icon: "FileText",
        url: "/dashboard/offers",
        color: "green",
        isEnabled: true,
      },
    ],
    contractor: [
      {
        id: "browse-projects",
        label: "Browse Projects",
        description: "Find new projects to bid on",
        icon: "Search",
        url: "/dashboard/projects/browse",
        color: "blue",
        isEnabled: true,
      },
      {
        id: "my-offers",
        label: "My Offers",
        description: "Track your submitted offers",
        icon: "FileText",
        url: "/dashboard/offers",
        color: "green",
        isEnabled: true,
      },
    ],
    supplier: [
      {
        id: "add-product",
        label: "Add Product",
        description: "List new products for sale",
        icon: "Plus",
        url: "/dashboard/products/new",
        color: "blue",
        isEnabled: true,
      },
      {
        id: "manage-orders",
        label: "Manage Orders",
        description: "Process and fulfill orders",
        icon: "Package",
        url: "/dashboard/orders",
        color: "green",
        isEnabled: true,
      },
    ],
    engineering_office: [
      {
        id: "new-design",
        label: "New Design Project",
        description: "Start a new design project",
        icon: "PenTool",
        url: "/dashboard/projects/new",
        color: "blue",
        isEnabled: true,
      },
      {
        id: "team-management",
        label: "Manage Team",
        description: "Assign and track team tasks",
        icon: "Users",
        url: "/dashboard/team",
        color: "purple",
        isEnabled: true,
      },
    ],
  };

  return actionMap[role] || [];
}

export function isProfileComplete(user: DashboardUser): boolean {
  // Check if profile_status indicates completion
  if (user.account_overview?.profile_status === "not_completed") {
    return false;
  }

  // Basic required fields
  const hasBasicInfo = !!(user.name && user.email);

  // Role-specific completeness checks
  switch (user.role) {
    case "individual":
      return hasBasicInfo && user.isVerified;
    case "contractor":
      return hasBasicInfo && user.isVerified && !!user.phone;
    case "supplier":
      return hasBasicInfo && user.isVerified && !!user.phone;
    case "engineering_office":
      return hasBasicInfo && user.isVerified && !!user.phone;
    default:
      return hasBasicInfo && user.isVerified;
  }
}

export function getProfileCompletionTasks(user: DashboardUser): string[] {
  const tasks: string[] = [];

  if (!user.name) tasks.push("Add your full name");
  if (!user.email) tasks.push("Add email address");
  if (
    !user.phone &&
    ["contractor", "supplier", "engineering_office"].includes(user.role)
  ) {
    tasks.push("Add phone number");
  }
  if (!user.isVerified) tasks.push("Verify your account");

  return tasks;
}
