import type { MenuConfig } from "@/types/types"
import {
  Home,
  Users,
  Building,
  Truck,
  Package,
  MapPin,
  Bell,
  Settings,
  BarChart,
  ShieldCheck,
  AlertTriangle,
  Car,
  List,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react"


export const menuConfig: MenuConfig = {
  superviseur: [
      {
        label: "Administration",
        items: [
          { title: "Tableau de bord", url: "/dashboard", icon: Home },
          { 
            title: "Gestion Operateurs", 
            url: "/operateurs", 
            icon: Users,
            subItems: [
              { title: "Ajout", url: "/operateurs/comptes", icon: ShieldCheck },
              { title: "Gerer", url: "/operateurs/gerer", icon: ShieldCheck },
            ]
          },
        ],
      },
      {
        label: "Taches",
        items: [
          { 
            title: "Taches", 
            url: "/taches", 
            icon: Package,
            subItems: [
              { title: "Tous Les Taches", url: "/taches/all", icon: List },
              { title: "Gerer", url: "/taches/manage", icon: Settings },
            ]
          },
          { 
            title: "Skills", 
            url: "/skills", 
            icon: MapPin,
            subItems: [
              { title: "All Skills", url: "/skills/all", icon: Car },
              { title: "Gerer", url: "/skills/all", icon: MapPin },
            ]
          },
          { title: "Machines", url: "/machines", icon: AlertTriangle,
            subItems: [
              { title: "Machine 1", url: "/mechines/1", icon: Car },
              { title: "Machine 2", url: "/mechines/2", icon: Car },
              { title: "Machine 3", url: "/mechines/3", icon: Car },
            ]
           },
        ],
      }
    ],
  operateur: [
      {
        label: "Gestion",
        items: [
          { title: "Tableau de bord", url: "/dashboard", icon: Home },
          { 
            title: "Taches", 
            url: "/taches", 
            icon: Package,
          },
          { 
            title: "Signaler un probleme", 
            url: "/report", 
            icon: Truck,
          }
        ],
      },
    ],
}