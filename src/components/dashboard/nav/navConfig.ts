import {
  Home,
  User,
  Bell,
  FileText,
  Briefcase,
  Package,
  Settings,
  HelpCircle,
  Search,
} from "lucide-react";

// Shared navigation items that appear for all roles
export const sharedNav = [
  {
    title: "Notifications",
    url: "/dashboard/notifications", // Generic notifications URL
    icon: Bell,
  },
];

export const roleNav = {
  individual: [
    { title: "Home", url: "/dashboard/individual", icon: Home },
    {
      title: "Profile",
      url: "/dashboard/individual/profile",
      icon: User,
    },
    {
      title: "Applications",
      url: "/dashboard/individual/applications",
      icon: FileText,
    },
    {
      title: "Notifications",
      url: "/dashboard/individual/notifications",
      icon: Bell,
    },
  ],
  contractor: [
    {
      title: "Home",
      url: "/dashboard/contractor",
      icon: Home,
    },
    {
      title: "Profile",
      url: "/dashboard/contractor/profile",
      icon: User,
    },
    {
      title: "Applications",
      url: "/dashboard/contractor/applications",
      icon: FileText,
    },
    {
      title: "Notifications",
      url: "/dashboard/contractor/notifications",
      icon: Bell,
    },
    {
      title: "Projects",
      url: "/dashboard/contractor/projects",
      icon: Briefcase,
    },
    { title: "Team", url: "/dashboard/contractor/team", icon: User },
  ],
  supplier: [
    { title: "Home", url: "/dashboard/supplier", icon: Home },
    {
      title: "Notifications",
      url: "/dashboard/supplier/notifications",
      icon: Bell,
    },
    { title: "Inventory", url: "/dashboard/supplier/inventory", icon: Package },
    { title: "Orders", url: "/dashboard/supplier/orders", icon: FileText },
  ],
  organization: [
    {
      title: "Home",
      url: "/dashboard/organization",
      icon: Home,
    },
    {
      title: "Applications",
      url: "/dashboard/organization/applications",
      icon: FileText,
    },
    {
      title: "Notifications",
      url: "/dashboard/organization/notifications",
      icon: Bell,
    },
    {
      title: "Departments",
      url: "/dashboard/organization/departments",
      icon: Briefcase,
    },
  ],
};

export const secondaryNav = [
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Get Help",
    url: "#",
    icon: HelpCircle,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
];
