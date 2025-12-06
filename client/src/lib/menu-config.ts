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
  BotIcon,
  ActivityIcon,
} from "lucide-react";



export const menuConfig: MenuConfig = {
product_manager: [
  // Administration Section
  {
    label: "Administration",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: Home },
      { title: "Process", url: "/process", icon: ActivityIcon },

      {
        title: "Operator Management",
        url: "/operators",
        icon: Users,
        subItems: [
          { title: "Add Operator", url: "/operators/add", icon: UserPlus },
          { title: "Manage operators", url: "/operators/manage", icon: UserPlus },
        ],
      },
    ],
  },

  // Production Section
  {
    label: "Production",
    items: [
      {
        title: "Tasks",
        url: "/tasks",
        icon: Package, 
        subItems: [
          { title: "Add Task", url: "/tasks/add", icon: PlusCircle }, // more action-oriented
        ],
      },
      {
        title: "Skills",
        url: "/skills",
        icon: Wrench, // Wrench is better for Skills/Tools
        subItems: [
          { title: "All Skills", url: "/skills/all", icon: ClipboardList }, // list icon
          { title: "Manage Skills", url: "/skills/manage", icon: Settings }, // management
        ],
      },
      {
        title: "Machines",
        url: "/machines",
        icon: Activity, // better matches Machines/production flow
        subItems: [
          { title: "All Machines", url: "/machines/all", icon: ClipboardList },
          { title: "Preform Maker", url: "/machines/preform", icon: BotIcon },
          { title: "Blow Molder", url: "/machines/blow", icon: BotIcon },
          { title: "Filler Capper", url: "/machines/filler", icon: BotIcon },
          { title: "Maintenance", url: "/machines/in-maintenance", icon: Wrench },
        ],
      },
    ],
  },
],

  operator: [

    {
      label: "My Workspace",
      items: [
        { title: "Dashboard", url: "/operator/dashboard", icon: Home },
      ],
      
    },
     {
    label: "Production",
    items: [
     
      {
        title: "Machines",
        url: "/machines",
        icon: Activity,
        subItems: [
          { title: "All Machines", url: "/machines/all", icon: ClipboardList },
        ],
      },

    ],
  },
    
    
  ],
};