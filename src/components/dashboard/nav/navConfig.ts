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
      title: "navigation.dashboard",
      url: "/dashboard/contractor",
      icon: Home,
    },
    {
      title: "navigation.myOffers",
      url: "/dashboard/contractor/offers",
      icon: assets.offers,
    },
    {
      title: "navigation.browseProjects",
      url: "/dashboard/contractor/browse-projects",
      icon: assets.projects,
    },
    {
      title: "navigation.contracts",
      url: "/dashboard/contractor/contracts",
      icon: assets.contract,
    },
    {
      title: "navigation.payments",
      url: "/dashboard/contractor/payments",
      icon: assets.payment,
    },
    {
      title: "navigation.messages",
      url: "/dashboard/contractor/messages",
      icon: assets.messages,
    },
    {
      title: "navigation.profile",
      url: "/dashboard/contractor/profile",
      icon: User,
    },
    {
      title: "navigation.settings",
      url: "/dashboard/contractor/settings",
      icon: Settings,
    },
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
  engineering_office: [
    {
      title: "Home",
      url: "/dashboard/engineering_office",
      icon: Home,
    },
    {
      title: "Profile",
      url: "/dashboard/engineering_office/profile",
      icon: User,
    },
    {
      title: "Projects",
      url: "/dashboard/engineering_office/projects",
      icon: Briefcase,
    },
    {
      title: "Applications",
      url: "/dashboard/engineering_office/applications",
      icon: FileText,
    },
    {
      title: "Notifications",
      url: "/dashboard/engineering_office/notifications",
      icon: Bell,
    },
    {
      title: "Team",
      url: "/dashboard/engineering_office/team",
      icon: User,
    },
  ],
  freelance_engineer: [
    {
      title: "Home",
      url: "/dashboard/freelance_engineer",
      icon: Home,
    },
    {
      title: "Profile",
      url: "/dashboard/freelance_engineer/profile",
      icon: User,
    },
    {
      title: "Projects",
      url: "/dashboard/freelance_engineer/projects",
      icon: Briefcase,
    },
    {
      title: "Applications",
      url: "/dashboard/freelance_engineer/applications",
      icon: FileText,
    },
    {
      title: "Notifications",
      url: "/dashboard/freelance_engineer/notifications",
      icon: Bell,
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
