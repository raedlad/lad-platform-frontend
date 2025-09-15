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
import { assets } from "@/constants/assets";

export const roleNav = {
  individual: [
    { title: "navigation.dashboard", url: "/dashboard/individual", icon: Home },
    {
      title: "navigation.projects",
      url: "/dashboard/individual/projects",
      icon: assets.projects,
    },
    {
      title: "navigation.offers",
      url: "/dashboard/individual/offers",
      icon: assets.offers,
    },
    {
      title: "navigation.contracts",
      url: "/dashboard/individual/contracts",
      icon: assets.contract,
    },
    {
      title: "navigation.payments",
      url: "/dashboard/individual/payments",
      icon: assets.payment,
    },
    {
      title: "navigation.materials",
      url: "/dashboard/individual/materials",
      icon: assets.materials,
    },
    {
      title: "navigation.messages",
      url: "/dashboard/individual/messages",
      icon: assets.messages,
    },
    {
      title: "navigation.reviews",
      url: "/dashboard/individual/reviews",
      icon: assets.reviews,
    },
  
    {
      title: "navigation.settings",
      url: "/dashboard/individual/profile",
      icon: Settings,
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
