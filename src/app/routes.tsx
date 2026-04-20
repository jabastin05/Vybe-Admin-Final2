import { Navigate, createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { AdminSignIn } from "./screens/AdminSignIn";
import { Invitations } from "./screens/Invitations";
import { UserManagement } from "./screens/UserManagement";
import { EnhancedUserManagement } from "./screens/EnhancedUserManagement";
import { ClientManagement } from "./screens/ClientManagement";
import { EnhancedServiceConfiguration } from "./screens/EnhancedServiceConfiguration";
import { AdminDocumentVault } from "./screens/AdminDocumentVault";
import { AdminCaseManagement } from "./screens/AdminCaseManagement";
import { AdminCaseDetail } from "./screens/AdminCaseDetail";
import { AdminCaseChat } from "./screens/AdminCaseChat";
import { MasterDataManagement } from "./screens/MasterDataManagement";
import { PropertyOnboardingConfig } from "./screens/PropertyOnboardingConfig";
import { PartnerRoleConfig } from "./screens/PartnerRoleConfig";
import { ServiceCategoryConfig } from "./screens/ServiceCategoryConfig";
import { UserTypeConfig } from "./screens/UserTypeConfig";
import { WorkflowTemplateConfig } from "./screens/WorkflowTemplateConfig";
import { AdminDashboard } from "./screens/AdminDashboard";
import { AdminCallbackLog } from "./screens/AdminCallbackLog";

function RedirectToAdminSignIn() {
  return <Navigate to="/admin/signin" replace />;
}

// VYBE Platform Router Configuration
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: RedirectToAdminSignIn,
      },
      {
        path: "admin/signin",
        Component: AdminSignIn,
      },
      {
        path: "admin/dashboard",
        Component: AdminDashboard,
      },
      {
        path: "admin/callback-log",
        Component: AdminCallbackLog,
      },
      {
        path: "admin/invitations",
        Component: Invitations,
      },
      {
        path: "admin/user-management",
        Component: UserManagement,
      },
      {
        path: "admin/users",
        Component: EnhancedUserManagement,
      },
      {
        path: "admin/clients",
        Component: ClientManagement,
      },
      {
        path: "admin/master-data",
        Component: MasterDataManagement,
      },
      {
        path: "admin/master-data/property-onboarding",
        Component: PropertyOnboardingConfig,
      },
      {
        path: "admin/master-data/partner-roles",
        Component: PartnerRoleConfig,
      },
      {
        path: "admin/master-data/service-categories",
        Component: ServiceCategoryConfig,
      },
      {
        path: "admin/master-data/user-types",
        Component: UserTypeConfig,
      },
      {
        path: "admin/workflow-templates",
        Component: WorkflowTemplateConfig,
      },
      {
        path: "admin/services",
        Component: EnhancedServiceConfiguration,
      },
      {
        path: "admin/documents",
        Component: AdminDocumentVault,
      },
      {
        path: "admin/cases",
        Component: AdminCaseManagement,
      },
      {
        path: "admin/cases/:id",
        Component: AdminCaseDetail,
      },
      {
        path: "admin/cases/:id/chat",
        Component: AdminCaseChat,
      },
      {
        path: "*",
        Component: RedirectToAdminSignIn,
      },
    ]
  }
]);
