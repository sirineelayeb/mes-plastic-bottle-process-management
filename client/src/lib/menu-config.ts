// src/config/menuConfig.ts

import type { MenuConfig } from "@/types/types";
import {
  Home,
  Users,
  UserPlus,
  UserCog,
  Package,
  ListTodo,
  Settings,
  Wrench,
  Gauge,
  AlertTriangle,
  ClipboardList,
  Siren,
  PlusCircle,
  BarChart3,
  Activity,
  Bell,
} from "lucide-react";

export const menuConfig: MenuConfig = {
  product_manager: [
    {
      label: "Administration",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: Home },
        
        {
          title: "Operator Management",
          url: "/operators",
          icon: Users,
          subItems: [
            { title: "Add Operator", url: "/operators/add", icon: UserPlus },
            { title: "Manage Operators", url: "/operators/manage", icon: UserCog },
          ],
        },
      ],
    },
    {
      label: "Production",
      items: [
        {
          title: "Steps",
          url: "/steps",
          icon: Package,
          subItems: [
            { title: "All Steps", url: "/steps/all", icon: ListTodo },
            { title: "Manage Steps", url: "/steps/manage", icon: Settings },
          ],
        },
        {
          title: "Skills",
          url: "/skills",
          icon: Gauge,
          subItems: [
            { title: "All Skills", url: "/skills/all", icon: ClipboardList },
            { title: "Manage Skills", url: "/skills/manage", icon: Wrench },
          ],
        },
        {
          title: "Machines",
          url: "/machines",
          icon: AlertTriangle,
        subItems: [
        { title: "All Machines", url: "/machines/all", icon: Wrench },
        { title: "Add Machine", url: "/machines/add", icon: PlusCircle },
        { title: "In Service", url: "/machines/in-service", icon: Activity },
        { title: "Maintenance", url: "/machines/in-maintenance", icon: Settings },
],
        },
        {
          title: "Live Monitoring",
          url: "/monitoring",
          icon: BarChart3,
        },
        {
          title: "Alerts",
          url: "/alerts",
          icon: Bell,
        },
      ],
    },
  ],

  operator: [
    {
      label: "My Workspace",
      items: [
        { title: "Dashboard", url: "/operator/dashboard", icon: Home },
        { title: "My Tasks", url: "/operator/tasks", icon: Package },
        { title: "Report Issue", url: "/operator/report", icon: AlertTriangle },
        { title: "My Alerts", url: "/operator/my-alerts", icon: Bell },
      ],
    },
  ],
};