import { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface UserType {
  id: number;
  name: string;
  description: string;
}

export interface PartnerRole {
  id: number;
  name: string;
  description: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  children?: ServiceCategory[];
}

export interface WorkflowTemplate {
  id: number;
  name: string;
  description: string;
  statuses: string[];
}

export type PermissionValue = 'full' | 'denied' | 'assigned-only' | 'assigned-clients' | 'assigned-task-only' | 'optional' | 'all' | 'controlled' | 'assigned' | 'limited';

export interface ModulePermission {
  moduleId: string;
  moduleName: string;
  permissions: Record<number, PermissionValue>; // userTypeId -> permission
}

interface MasterDataContextType {
  // User Types
  userTypes: UserType[];
  addUserType: (userType: Omit<UserType, 'id'>) => UserType;
  updateUserType: (id: number, userType: Partial<UserType>) => void;
  deleteUserType: (id: number) => void;

  // Partner Roles
  partnerRoles: PartnerRole[];
  addPartnerRole: (role: Omit<PartnerRole, 'id'>) => void;
  updatePartnerRole: (id: number, role: Partial<PartnerRole>) => void;
  deletePartnerRole: (id: number) => void;

  // Service Categories
  serviceCategories: ServiceCategory[];
  addServiceCategory: (category: Omit<ServiceCategory, 'id'>) => void;
  updateServiceCategory: (id: number, category: Partial<ServiceCategory>) => void;
  deleteServiceCategory: (id: number) => void;

  // Workflow Templates
  workflowTemplates: WorkflowTemplate[];
  addWorkflowTemplate: (template: Omit<WorkflowTemplate, 'id'>) => void;
  updateWorkflowTemplate: (id: number, template: Partial<WorkflowTemplate>) => void;
  deleteWorkflowTemplate: (id: number) => void;

  // Access Control
  modulePermissions: ModulePermission[];
  updateModulePermission: (moduleId: string, userTypeId: number, permission: PermissionValue) => void;
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

export function MasterDataProvider({ children }: { children: ReactNode }) {
  // User Types State
  const [userTypes, setUserTypes] = useState<UserType[]>([
    { id: 1, name: 'Admin', description: 'Full system access and permissions' },
    { id: 2, name: 'Manager', description: 'Manage teams and view reports' },
    { id: 3, name: 'Viewer', description: 'Read-only access to platform' },
    { id: 4, name: 'Analyst', description: 'Access to analytics and reporting tools' },
  ]);

  // Partner Roles State
  const [partnerRoles, setPartnerRoles] = useState<PartnerRole[]>([
    { id: 1, name: 'Legal Consultant', description: 'Handles legal documentation and compliance' },
    { id: 2, name: 'Property Valuer', description: 'Conducts property valuations' },
    { id: 3, name: 'Tax Advisor', description: 'Provides tax planning and advisory' },
    { id: 4, name: 'Architect', description: 'Design and architectural services' },
  ]);

  // Service Categories State
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([
    { id: 1, name: 'Legal Services', description: 'Legal consultation and documentation', parentId: null },
    { id: 2, name: 'Property Valuation', description: 'Property assessment services', parentId: null },
    { id: 3, name: 'Tax Advisory', description: 'Tax planning and compliance', parentId: null },
    { id: 4, name: 'Documentation', description: 'Legal documentation services', parentId: 1 },
    { id: 5, name: 'Compliance', description: 'Regulatory compliance', parentId: 1 },
  ]);

  // Workflow Templates State
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>([
    {
      id: 1,
      name: 'Standard Legal Process',
      description: 'Standard workflow for legal services',
      statuses: ['Initiated', 'Document Review', 'Legal Review', 'Approval', 'Completed'],
    },
    {
      id: 2,
      name: 'Property Valuation Process',
      description: 'Workflow for property valuation services',
      statuses: ['Requested', 'Site Visit', 'Analysis', 'Report Draft', 'Final Report'],
    },
    {
      id: 3,
      name: 'Tax Filing Process',
      description: 'Workflow for tax filing services',
      statuses: ['Data Collection', 'Review', 'Filing', 'Confirmation', 'Archived'],
    },
  ]);

  // Access Control State
  const [modulePermissions, setModulePermissions] = useState<ModulePermission[]>([
    {
      moduleId: 'invitation',
      moduleName: 'Invitation',
      permissions: { 1: 'full', 2: 'full', 3: 'denied', 4: 'denied' },
    },
    {
      moduleId: 'user-management',
      moduleName: 'User Management',
      permissions: { 1: 'full', 2: 'denied', 3: 'denied', 4: 'denied' },
    },
    {
      moduleId: 'client-management',
      moduleName: 'Client Management',
      permissions: { 1: 'full', 2: 'full', 3: 'assigned-only', 4: 'denied' },
    },
    {
      moduleId: 'case-creation',
      moduleName: 'Case Creation',
      permissions: { 1: 'full', 2: 'full', 3: 'assigned-clients', 4: 'denied' },
    },
    {
      moduleId: 'case-assignment',
      moduleName: 'Case Assignment',
      permissions: { 1: 'full', 2: 'full', 3: 'denied', 4: 'denied' },
    },
    {
      moduleId: 'case-management',
      moduleName: 'Case Management',
      permissions: { 1: 'full', 2: 'full', 3: 'assigned-only', 4: 'assigned-only' },
    },
    {
      moduleId: 'case-status-update',
      moduleName: 'Case Status Update',
      permissions: { 1: 'full', 2: 'full', 3: 'assigned-only', 4: 'assigned-task-only' },
    },
    {
      moduleId: 'partner-task-update',
      moduleName: 'Partner Task Update',
      permissions: { 1: 'full', 2: 'full', 3: 'denied', 4: 'full' },
    },
    {
      moduleId: 'execute-operations',
      moduleName: 'Execute Operations',
      permissions: { 1: 'full', 2: 'full', 3: 'denied', 4: 'full' },
    },
    {
      moduleId: 'upload-reports',
      moduleName: 'Upload Reports',
      permissions: { 1: 'full', 2: 'full', 3: 'optional', 4: 'full' },
    },
    {
      moduleId: 'document-access',
      moduleName: 'Document Access',
      permissions: { 1: 'all', 2: 'controlled', 3: 'assigned', 4: 'limited' },
    },
    {
      moduleId: 'service-management',
      moduleName: 'Service Management',
      permissions: { 1: 'full', 2: 'denied', 3: 'denied', 4: 'denied' },
    },
    {
      moduleId: 'workflow-config',
      moduleName: 'Workflow Config',
      permissions: { 1: 'full', 2: 'denied', 3: 'denied', 4: 'denied' },
    },
    {
      moduleId: 'monitoring-reports',
      moduleName: 'Monitoring / Reports',
      permissions: { 1: 'full', 2: 'limited', 3: 'denied', 4: 'denied' },
    },
  ]);

  // User Types Functions
  const addUserType = (userType: Omit<UserType, 'id'>) => {
    const newUserType: UserType = { ...userType, id: Date.now() };
    setUserTypes([...userTypes, newUserType]);
    return newUserType;
  };

  const updateUserType = (id: number, userType: Partial<UserType>) => {
    setUserTypes(userTypes.map(ut => ut.id === id ? { ...ut, ...userType } : ut));
  };

  const deleteUserType = (id: number) => {
    setUserTypes(userTypes.filter(ut => ut.id !== id));
  };

  // Partner Roles Functions
  const addPartnerRole = (role: Omit<PartnerRole, 'id'>) => {
    setPartnerRoles([...partnerRoles, { ...role, id: Date.now() }]);
  };

  const updatePartnerRole = (id: number, role: Partial<PartnerRole>) => {
    setPartnerRoles(partnerRoles.map(pr => pr.id === id ? { ...pr, ...role } : pr));
  };

  const deletePartnerRole = (id: number) => {
    setPartnerRoles(partnerRoles.filter(pr => pr.id !== id));
  };

  // Service Categories Functions
  const addServiceCategory = (category: Omit<ServiceCategory, 'id'>) => {
    setServiceCategories([...serviceCategories, { ...category, id: Date.now() }]);
  };

  const updateServiceCategory = (id: number, category: Partial<ServiceCategory>) => {
    setServiceCategories(serviceCategories.map(sc => sc.id === id ? { ...sc, ...category } : sc));
  };

  const deleteServiceCategory = (id: number) => {
    setServiceCategories(serviceCategories.filter(sc => sc.id !== id && sc.parentId !== id));
  };

  // Workflow Templates Functions
  const addWorkflowTemplate = (template: Omit<WorkflowTemplate, 'id'>) => {
    setWorkflowTemplates([...workflowTemplates, { ...template, id: Date.now() }]);
  };

  const updateWorkflowTemplate = (id: number, template: Partial<WorkflowTemplate>) => {
    setWorkflowTemplates(workflowTemplates.map(wt => wt.id === id ? { ...wt, ...template } : wt));
  };

  const deleteWorkflowTemplate = (id: number) => {
    setWorkflowTemplates(workflowTemplates.filter(wt => wt.id !== id));
  };

  // Access Control Functions
  const updateModulePermission = (moduleId: string, userTypeId: number, permission: PermissionValue) => {
    setModulePermissions(modulePermissions.map(mp => {
      if (mp.moduleId === moduleId) {
        return {
          ...mp,
          permissions: {
            ...mp.permissions,
            [userTypeId]: permission,
          },
        };
      }
      return mp;
    }));
  };

  const value = {
    userTypes,
    addUserType,
    updateUserType,
    deleteUserType,
    partnerRoles,
    addPartnerRole,
    updatePartnerRole,
    deletePartnerRole,
    serviceCategories,
    addServiceCategory,
    updateServiceCategory,
    deleteServiceCategory,
    workflowTemplates,
    addWorkflowTemplate,
    updateWorkflowTemplate,
    deleteWorkflowTemplate,
    modulePermissions,
    updateModulePermission,
  };

  return (
    <MasterDataContext.Provider value={value}>
      {children}
    </MasterDataContext.Provider>
  );
}

export function useMasterData() {
  const context = useContext(MasterDataContext);
  if (context === undefined) {
    throw new Error('useMasterData must be used within a MasterDataProvider');
  }
  return context;
}