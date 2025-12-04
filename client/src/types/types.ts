  import type { LucideIcon } from "lucide-react";

  /* USER & AUTH */
  export type Role = "product_manager" | "operator" | undefined;

  export interface User {
    _id?: string;
    name?: string;
    email?: string;
    role?: Role;
  }
export interface Operator {
  _id: string;
  name: string;
  email: string;
  skills: string[];
}

  export interface AuthState {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
  }

  export type AuthAction =
    | { type: "LOGIN"; payload: { user: User; accessToken: string } }
    | { type: "LOGOUT" }
    | { type: "SET_LOADING"; payload: boolean };

  /* MENU */
  export interface SubMenuItem {
    title: string;
    url: string;
    icon: LucideIcon;
  }

  export interface MenuItem {
    title: string;
    url: string;
    icon: LucideIcon;
    subItems?: SubMenuItem[];
  }

export interface OperatorStats {
  stepsCompleted: number;
  totalSteps: number;
  efficiency: number;
  hoursWorked: number;
}

export interface UseFetchOptions {
    immediate?: boolean;
    useAuth?: boolean;
    dependencies?: any[];
}

export interface UseFetchReturn<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}
  export interface MenuGroup {
    label: string;
    items: MenuItem[];
  }

  export type MenuConfig = Record<string, MenuGroup[]>;

  /* DASHBOARD */
  // export type StepStatus = "completed" | "pending" | "in_progress" | "error";
  export interface Operator {
    _id: string;
    name: string;
    email: string;
    skills: string[]; 
  }

  // export interface StepItem {
  //   id: string;
  //   label: string;
  //   status: StepStatus;
  //   progress: number;
  //   expectedStart: string;
  //   expectedEnd: string;
  //   realStart?: string;
  //   realEnd?: string;
  //   operators?: string[];
  //   machines?: string[];
  // }
  export interface Machine {
    _id: string;
    idMachine: string;
    name: string;
    description: string;
    status: "In Service" | "Stopped" | "Under Maintenance";
  }

export interface Task {
_id: string;
taskName: string;
skills: Skill[];                     // array of Skill references
machine: Machine;                    // machine reference
operators: { _id: string; name?: string }[]; // user references; name may be optional if not populated
dateStart?: string;                  // ISO string
dateEnd?: string;                    // ISO string
status: "Pending" | "In Progress" | "Completed";
createdAt: string;
updatedAt: string;
}
  export interface Skill {
    _id: string;
    name: string;
    description: string;
  }
  // export interface MachineItem {
  //   id: string;
  //   name: string;
  //   type?: string;
  //   status: "in_use" | "available" | "maintenance" | "out_of_service";
  //   efficiency?: number;
  //   unavailableFrom?: string;      
  //   expectedAvailable?: string;   
  // }


  // export interface OperatorItem {
  //   id: string;
  //   name: string;
  //   availability: boolean;
  //   skills?: string[];
  //   currentStep?: string | null;
  // }

  // export interface AlertItem {
  //   id: string;
  //   type: "error" | "warning" | "info";
  //   message: string;
  //   step: string;
  //   timestamp: string;
  // }



  /* OPERATOR DASHBOARD - NEW TYPES */

  // export interface OperatorInfo {
  //   name: string;
  //   employeeId: string;
  //   skills: string[];
  //   activeSkills: string[];
  // }
  export interface Material {
    name: string;
    quantity: string;
  }


  // export interface OperatorAlert {
  //   id: number;
  //   type: "warning" | "info" | "error";
  //   message: string;
  //   time: string;
  // }

  // export interface OperatorStats {
  //   stepsCompleted: number;
  //   totalSteps: number;
  //   efficiency: number;
  //   hoursWorked: number;
  // }



//   export interface Metric {
//   label: string;
//   value: number | string;
//   color?: string; // optional for custom card color
// }
