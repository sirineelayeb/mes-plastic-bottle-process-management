import React from "react";
import { useRoutes } from "react-router-dom";
import RequireAuth from "@/components/base/RequireAuth";
import { useAuthContext } from "@/hooks/useAuthContext";
import type { Role } from "@/types/types";

// Lazy loaded pages
const MainLayout = React.lazy(() => import("@/layouts/MainLayout"));
const Login = React.lazy(() => import("@/pages/Login"));
const Signup = React.lazy(() => import("@/pages/SignUp"));
const AuthCallback = React.lazy(() => import("@/pages/AuthCallback"));

// Product Manager pages
const ProductManagerHome = React.lazy(() => import("@/pages/ProductManager/ProductManagerHome"));
const OperatorManagement = React.lazy(() => import("@/pages/ProductManager/operator-management/OperatorManagement"));
const AddOperator = React.lazy(() => import("@/pages/ProductManager/operator-management/AddOperator"));
const SkillsList = React.lazy(() => import("@/pages/ProductManager/skills-management/AllSkills"));
const ManageSkills = React.lazy(() => import("@/pages/ProductManager/skills-management/ManageSkills"));
const AllMachines = React.lazy(() => import("@/pages/ProductManager/machines/AllMachines"));
const AddMachine = React.lazy(() => import("@/pages/ProductManager/machines/AddMachine"));
const InServiceMachines = React.lazy(() => import("@/pages/ProductManager/machines/InServiceMachines"));
const InMaintenanceMachines = React.lazy(() => import("@/pages/ProductManager/machines/InMaintenanceMachines"));
const AlertsPage = React.lazy(() => import("@/pages/Alerts"));
const LiveMonitoringPage = React.lazy(() => import("@/pages/ProductManager/Monitoring"));
const AllTasks = React.lazy(() => import("@/pages/ProductManager/tasks-management/AllTasks"));
const AddTask = React.lazy(() => import("@/pages/ProductManager/tasks-management/AddTask"));
const Process = React.lazy(() => import("@/pages/ProductManager/Process.tsx"));
const Preform = React.lazy(() => import("@/pages/ProductManager/machines/PreformMaker"));

const Filler = React.lazy(() => import("@/pages/ProductManager/machines/FillerClapper"));
const Blow = React.lazy(() => import("@/pages/ProductManager/machines/BlowMolder"));
// Operator pages
const OperatorHome = React.lazy(() => import("@/pages/operator/OperatorHome"));
const MyTasks = React.lazy(() => import("@/pages/operator/MyTasks"));
const Alertop = React.lazy(() => import("@/pages/operator/Alertop"));
const ReportIssue = React.lazy(() => import("@/pages/operator/ReportIssue"));

const Router = () => {
  const { user } = useAuthContext();
  const role: Role = user?.role;

  const routes = [
    {
      element: <RequireAuth />,
      children: [
        {
          path: "/",
          element: <MainLayout />,
          children: [
            ...(role === "product_manager"
              ? [
                  {
                    path: "/",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <ProductManagerHome />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "/process",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <Process />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "dashboard",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <ProductManagerHome />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "operators/manage",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <OperatorManagement />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "operators/add",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AddOperator />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "tasks/all",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AllTasks />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "tasks/add",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AddTask />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "skills/all",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <SkillsList />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "skills/manage",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <ManageSkills />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "machines/all",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AllMachines />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "machines/add",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AddMachine />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "machines/in-service",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <InServiceMachines />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "machines/preform",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <Preform />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "machines/blow",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <Blow />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "machines/filler",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <Filler />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "machines/in-maintenance",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <InMaintenanceMachines />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "monitoring",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <LiveMonitoringPage />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "alerts",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AlertsPage />
                      </React.Suspense>
                    ),
                  },
                ]
              : role === "operator"
              ? [
                  {
                    path: "/",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <OperatorHome />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "machines/all",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AllMachines />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "operator/dashboard",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <OperatorHome />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "operator/tasks",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <MyTasks />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "operator/report",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <ReportIssue />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "operator/my-alerts",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <Alertop />
                      </React.Suspense>
                    ),
                  },
                ]
              : []),
          ],
        },
      ],
    },
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
  ];

  return useRoutes(routes);
};

export default Router;