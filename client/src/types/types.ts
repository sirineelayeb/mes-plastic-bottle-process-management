import { type LucideIcon } from "lucide-react";

export type Role = "superviseur" | "opoerateur";

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

export interface MenuGroup {
  label: string;
  items: MenuItem[];
}

export interface MenuConfig {
  [key: string]: MenuGroup[];
}

export interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: Role;
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