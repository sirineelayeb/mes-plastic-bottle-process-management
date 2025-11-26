// src/router/Router.tsx
import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import RequireAuth from "@/components/base/RequireAuth";
import { useAuthContext } from "@/hooks/useAuthContext";
import type { Role } from "@/types/types";

// Lazy loaded common pages
const MainLayout = React.lazy(() => import("@/layouts/MainLayout"));
const Login = React.lazy(() => import("@/pages/Login"));
const Signup = React.lazy(() => import("@/pages/Signup")); // <-- added
const AuthCallback = React.lazy(() => import("@/pages/AuthCallback"));

// Supervisor pages
import OperatorManagement from "@/pages/product_manager/operator-management/OperatorManagement";
import AddOperator from "@/pages/product_manager/operator-management/AddOperator";

// Operator page
import OperatorHome from "@/pages/operator/OperatorHome";
import ProductionSteps from "@/pages/product_manager/steps-management/ProductionSteps";
import ManageProductionSteps from "@/pages/product_manager/steps-management/ManageProductionSteps";
import SkillsList from "@/pages/product_manager/skills-management/AllSkills";
import ManageSkills from "@/pages/product_manager/skills-management/ManageSkills";
import ProductManagerHome from "@/pages/product_manager/ProductManagerHome";
import AllMachines from "@/pages/product_manager/machines/AllMachines";
import AddMachine from "@/pages/product_manager/machines/AddMachine";
import InServiceMachines from "@/pages/product_manager/machines/InServiceMachines";
import InMaintenanceMachines from "@/pages/product_manager/machines/InMaintenanceMachines";
import AlertsPage from "@/pages/Alerts";
import LiveMonitoringPage from "@/pages/product_manager/Monitoring";

const Router = () => {
  const { user } = useAuthContext();
  const role = user?.role as Role; // "product_manager" | "operator" | undefined

  const routes = [
    /* ====================== PUBLIC ====================== */
    {
      path: "/login",
      element: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <Login />
        </React.Suspense>
      ),
    },
    {
  path: "/signup", 
  element: (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Signup />
    </React.Suspense>
  ),
},
    {
      path: "/auth/callback",
      element: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <AuthCallback />
        </React.Suspense>
      ),
    },

    /* ====================== PROTECTED ====================== */
    {
      element: <RequireAuth />,
      children: [
        {
          element: <MainLayout />,
          children: [
            /* Root – redirect or show role-specific home */
            {
              path: "/",
              element: (
                <React.Suspense fallback={<div>Loading...</div>}>
                  {!user ? (
                    <div>Loading user...</div>
                  ) : role === "product_manager" ? (
                    <Navigate to="/dashboard" replace />
                  ) : role === "operator" ? (
                    <OperatorHome />
                  ) : (
                    <Navigate to="/login" replace />
                  )}
                </React.Suspense>
              ),
            },

            /* ------------------- SUPERVISOR ROUTES ------------------- */
            ...(role === "product_manager"
              ? [
                 
                  {
                    path: "/dashboard",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <ProductManagerHome />
                      </React.Suspense>
                    ),
                  },
                   {
                    path: "/",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <ProductManagerHome />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "/operators/manage",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <OperatorManagement />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "/operators/add",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AddOperator />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "/steps/all",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <ProductionSteps />
                      </React.Suspense>
                    ),
                  },
                   {
                    path: "/steps/manage",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <ManageProductionSteps />
                      </React.Suspense>
                    ),
                  },
                     {
                    path: "/skills/all",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <SkillsList />
                      </React.Suspense>
                    ),
                  },
                   {
                    path: "/skills/manage",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <ManageSkills />
                      </React.Suspense>
                    ),
                  },
                   {
                    path: "/machines/all",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AllMachines  />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "/machines/add",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AddMachine  />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "/machines/in-service",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <InServiceMachines  />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "/machines/in-maintenance",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <InMaintenanceMachines  />
                      </React.Suspense>
                    ),
                  },
                   {
                    path: "/monitoring",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <LiveMonitoringPage  />
                      </React.Suspense>
                    ),
                  },
                   {
                    path: "/alerts",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AlertsPage  />
                      </React.Suspense>
                    ),
                  },
                ]
              : []),

            /* ------------------- OPERATOR ROUTES ------------------- */
            ...(role === "operator"
              ? [
                  {
                    path: "/operator-home",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <OperatorHome />
                      </React.Suspense>
                    ),
                  },
                  // add more operator routes here later
                ]
              : []),

            /* Catch-all */
            {
              path: "*",
              element: <Navigate to="/" replace />,
            },
          ],
        },
      ],
    },
  ];

  return useRoutes(routes);
};

export default Router;