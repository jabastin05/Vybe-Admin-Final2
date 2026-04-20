import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';

export type ServiceType = 'HABU Report' | 'Property Service' | 'Lease & Rent' | 'Sell or Liquidate';
export type CaseStatus = 'Open' | 'Closed';

// Sub-service types for each main service
export type PropertyServiceSubType = 'Property Tax Filing' | 'Asset Valuation' | 'Property Maintenance' | 'Legal Documentation';
export type LeaseRentSubType = 'Tenant Screening' | 'Rental Management & Asset Care' | 'Lease Compliance & Documentation';
export type SellLiquidateSubType = 'Market Analysis' | 'JV Partnership' | 'Asset Liquidation';
export type SubServiceType = PropertyServiceSubType | LeaseRentSubType | SellLiquidateSubType | null;

export interface CaseMilestone {
  id: string;
  title: string;
  status: 'completed' | 'pending';
  date?: string;
}

export interface CaseStatusChange {
  id: string;
  timestamp: string;
  status?: string; // Optional - for status changes
  progress?: number; // Optional - for progress changes
  comments: string;
  changedBy: 'admin' | 'partner';
  changedByName: string;
  changeType: 'status' | 'progress' | 'partner-assignment' | 'document-upload'; // Type of change
  partnerName?: string; // For partner assignment changes
}

export interface CaseDocument {
  id: string;
  name: string;
  size: string;
  uploadedDate: string;
  type: string;
  status?: 'uploaded' | 'requested';
  uploadedByName?: string;
  uploadedByRole?: 'admin' | 'partner';
  dataUrl?: string;
}

export interface Case {
  id: string;
  caseId: string; // Human-readable case ID like "CASE-2024-001"
  serviceRequested: ServiceType;
  subService?: SubServiceType; // Optional sub-service for non-HABU services
  propertyId?: string; // Optional - for HABU non-owned properties
  propertyName: string;
  propertyLocation: string;
  status: CaseStatus;
  dateCreated: string;
  dateClosed?: string;
  progress?: number; // Percentage of completion (0-100)
  milestones?: CaseMilestone[];
  relationshipToProperty?: string; // For non-owned HABU properties
  unreadMessages?: number; // Number of unread messages from support
  userName?: string; // User who created the case
  partnerName?: string; // Assigned partner name
  statusHistory?: CaseStatusChange[]; // History of status changes
  habuPlans?: {
    id: string;
    optionNumber: number;
    title: string;
    icon: string; // 'clock' | 'building' | 'trending'
    badge?: 'recommended';
    theme: 'green' | 'pink' | 'yellow';
    metrics: {
      label: string;
      value: string;
      subtext?: string;
      highlight?: boolean;
    }[];
    insights: {
      type: 'why' | 'challenges';
      points: string[];
    };
  }[];
  habuReportUrl?: string;
  documents?: CaseDocument[];
}

interface CasesContextType {
  cases: Case[];
  addCase: (caseData: Omit<Case, 'id' | 'caseId' | 'dateCreated'>) => void;
  removeCase: (id: string) => void;
  getCase: (id: string) => Case | undefined;
  updateCase: (id: string, updates: Partial<Case>) => void;
  getCasesByCaseId: (caseId: string) => Case | undefined;
}

const CasesContext = createContext<CasesContextType | undefined>(undefined);

export function CasesProvider({ children }: { children: ReactNode }) {
  console.log('🔵 CasesProvider mounting...');
  
  const [cases, setCases] = useState<Case[]>(() => {
    console.log('🔵 Initializing cases state...');
    // Load from localStorage on initial mount
    try {
      const saved = localStorage.getItem('vybe-cases');
      const loadedCases = saved ? JSON.parse(saved) : [];
      
      // Deduplicate any existing cases by ID (clean up any historical duplicates)
      const seenIds = new Set<string>();
      const deduplicatedCases = loadedCases.filter((c: Case) => {
        if (seenIds.has(c.id)) {
          console.log('⚠️ Removing duplicate case with ID:', c.id);
          return false;
        }
        seenIds.add(c.id);
        return true;
      });
      
      // Add a sample closed HABU case if none exists
      const hasClosedHABU = deduplicatedCases.some((c: Case) => 
        c.serviceRequested === 'HABU Report' && c.status === 'Closed'
      );
      
      // Check if the specific sample case already exists
      const hasSampleCase = deduplicatedCases.some((c: Case) => c.id === 'sample-habu-closed');
      
      // Always add sample closed HABU if it doesn't exist (removed the empty check)
      if (!hasClosedHABU && !hasSampleCase) {
        const sampleClosedHABU: Case = {
          id: 'sample-habu-closed',
          caseId: 'CASE-2026-001',
          serviceRequested: 'HABU Report',
          propertyId: 'prop-1',
          propertyName: 'Prestige Tech Park',
          propertyLocation: 'Whitefield, Bangalore',
          status: 'Closed',
          dateCreated: new Date('2026-01-15').toISOString(),
          dateClosed: new Date('2026-03-10').toISOString(),
          progress: 100,
          unreadMessages: 2, // Sample unread messages from support
          userName: 'Vikram Malhotra',
          partnerName: 'Rajesh Kumar',
          statusHistory: [
            {
              id: '1',
              timestamp: new Date('2026-01-15').toISOString(),
              status: 'Open',
              comments: 'Case initiated by user',
              changedBy: 'admin',
              changedByName: 'System',
              changeType: 'status'
            },
            {
              id: '2',
              timestamp: new Date('2026-03-10').toISOString(),
              status: 'Closed',
              comments: 'All documents reviewed and HABU report generated successfully',
              changedBy: 'admin',
              changedByName: 'Admin Team',
              changeType: 'status'
            }
          ],
          milestones: [
            { id: '1', title: 'Case submitted', status: 'completed', date: '15 Jan 2026' },
            { id: '2', title: 'Documents reviewed', status: 'completed', date: '18 Jan 2026' },
            { id: '3', title: 'Partner assigned', status: 'completed', date: '20 Jan 2026' },
            { id: '4', title: 'Application filing', status: 'completed', date: '5 Feb 2026' },
            { id: '5', title: 'Authority follow-up', status: 'completed', date: '25 Feb 2026' },
            { id: '6', title: 'Case closed', status: 'completed', date: '10 Mar 2026' },
          ],
          habuPlans: [
            {
              id: 'plan-1',
              optionNumber: 1,
              title: 'Land Banking (3–5 Year Hold)',
              icon: 'clock',
              badge: 'recommended',
              theme: 'green',
              metrics: [
                { label: 'CAPITAL', value: '₹85 Cr' },
                { label: '3Y VALUE', value: '₹135 Cr', subtext: '+69%' },
                { label: '5Y VALUE', value: '₹195 Cr', subtext: '+129%' },
                { label: 'CAGR', value: '18.2%', highlight: true },
                { label: 'RISK', value: 'Low-Med' }
              ],
              insights: {
                type: 'why',
                points: [
                  'Minimal capital: ₹85 Cr vs ₹272 Cr for development',
                  'Low risk: No execution/construction complexity',
                  'Clear catalyst: Metro completion drives appreciation'
                ]
              }
            },
            {
              id: 'plan-2',
              optionNumber: 2,
              title: 'Develop Now (Residential Towers)',
              icon: 'building',
              theme: 'pink',
              metrics: [
                { label: 'CAPITAL', value: '₹272 Cr' },
                { label: 'REVENUE', value: '₹338 Cr' },
                { label: 'PROFIT', value: '₹66 Cr' },
                { label: 'IRR', value: '16.8%' },
                { label: 'RISK', value: 'Med-High' }
              ],
              insights: {
                type: 'challenges',
                points: [
                  '3.2x more capital vs land banking',
                  'Lower returns (16.8% vs 18.2%)',
                  'High execution risk, 18-24 mo absorption'
                ]
              }
            },
            {
              id: 'plan-3',
              optionNumber: 3,
              title: 'Villa Development (Premium Community)',
              icon: 'trending',
              theme: 'yellow',
              metrics: [
                { label: 'CAPITAL', value: '₹168 Cr' },
                { label: 'REVENUE', value: '₹210 Cr' },
                { label: 'PROFIT', value: '₹42 Cr' },
                { label: 'IRR', value: '19.2%' },
                { label: 'RISK', value: 'Medium' }
              ],
              insights: {
                type: 'challenges',
                points: [
                  'Limited buyer pool for ₹4+ Cr villas',
                  '2x capital vs land banking',
                  'Longer absorption (24-30 months)'
                ]
              }
            }
          ],
          habuReportUrl: '/reports/habu-prestige-tech-park.pdf',
          documents: [
            {
              id: 'habu-doc-1',
              name: 'HABU_Report_Prestige_Tech_Park.pdf',
              size: '4.2 MB',
              uploadedDate: '10 Mar 2026',
              type: 'application/pdf',
              status: 'uploaded',
              uploadedByName: 'Rajesh Kumar',
              uploadedByRole: 'partner'
            }
          ]
        };
        deduplicatedCases.unshift(sampleClosedHABU); // Add to beginning of array
      }
      
      // Add more dummy cases if they don't exist
      const dummyCases = [
        {
          id: 'sample-case-2',
          caseId: 'CASE-2026-002',
          serviceRequested: 'Lease & Rent',
          subService: 'Tenant Screening',
          propertyId: 'prop-2',
          propertyName: 'Brigade Metropolis',
          propertyLocation: 'Mahadevapura, Bangalore',
          status: 'Open',
          dateCreated: new Date('2026-03-15').toISOString(),
          progress: 40,
          userName: 'Ananya Iyer',
          partnerName: 'Sneha Reddy',
          statusHistory: [
            {
              id: 'status-2-1',
              timestamp: new Date('2026-03-15').toISOString(),
              status: 'Open',
              comments: 'Tenant screening request initiated',
              changedBy: 'admin',
              changedByName: 'System',
              changeType: 'status'
            }
          ],
          milestones: [
            { id: 'm1', title: 'Request Received', status: 'completed', date: '15 Mar 2026' },
            { id: 'm2', title: 'Background Check', status: 'pending' },
            { id: 'm3', title: 'Financial Verification', status: 'pending' },
            { id: 'm4', title: 'Final Report', status: 'pending' }
          ]
        },
        {
          id: 'sample-case-3',
          caseId: 'CASE-2026-003',
          serviceRequested: 'Property Service',
          subService: 'Property Maintenance',
          propertyId: 'prop-3',
          propertyName: 'DLF King\'s Court',
          propertyLocation: 'Greater Kailash, New Delhi',
          status: 'Open',
          dateCreated: new Date('2026-03-18').toISOString(),
          progress: 75,
          userName: 'Alexander Sterling',
          partnerName: 'Mervin Jacob',
          statusHistory: [
            {
              id: 'status-3-1',
              timestamp: new Date('2026-03-18').toISOString(),
              status: 'Open',
              comments: 'Plumbing and electrical maintenance scheduled',
              changedBy: 'admin',
              changedByName: 'System',
              changeType: 'status'
            }
          ],
          milestones: [
            { id: 'm1', title: 'Issue Identified', status: 'completed', date: '18 Mar 2026' },
            { id: 'm2', title: 'Partner Assigned', status: 'completed', date: '19 Mar 2026' },
            { id: 'm3', title: 'Work in Progress', status: 'completed', date: '21 Mar 2026' },
            { id: 'm4', title: 'Final Inspection', status: 'pending' }
          ],
          documents: [
            {
              id: 'case-3-doc-1',
              name: 'Maintenance_Site_Inspection_Report.pdf',
              size: '2.1 MB',
              uploadedDate: '22 Mar 2026',
              type: 'application/pdf',
              status: 'uploaded',
              uploadedByName: 'Mervin Jacob',
              uploadedByRole: 'partner'
            },
            {
              id: 'case-3-doc-2',
              name: 'Electrical_Rectification_Photos.zip',
              size: '8.7 MB',
              uploadedDate: '23 Mar 2026',
              type: 'application/zip',
              status: 'uploaded',
              uploadedByName: 'Mervin Jacob',
              uploadedByRole: 'partner'
            }
          ]
        },
        {
          id: 'sample-case-4',
          caseId: 'CASE-2026-004',
          serviceRequested: 'Sell or Liquidate',
          subService: 'Market Analysis',
          propertyId: 'prop-4',
          propertyName: 'Lodha Bellissimo',
          propertyLocation: 'Mahalaxmi, Mumbai',
          status: 'Open',
          dateCreated: new Date('2026-03-20').toISOString(),
          progress: 20,
          userName: 'Vikram Malhotra',
          partnerName: 'Priya Sharma',
          statusHistory: [
            {
              id: 'status-4-1',
              timestamp: new Date('2026-03-20').toISOString(),
              status: 'Open',
              comments: 'Market analysis requested for liquidation planning',
              changedBy: 'admin',
              changedByName: 'System',
              changeType: 'status'
            }
          ],
          milestones: [
            { id: 'm1', title: 'Initial Consultation', status: 'completed', date: '20 Mar 2026' },
            { id: 'm2', title: 'Property Valuation', status: 'pending' },
            { id: 'm3', title: 'Market Positioning', status: 'pending' },
            { id: 'm4', title: 'Liquidation Strategy', status: 'pending' }
          ],
          documents: [
            {
              id: 'case-4-doc-1',
              name: 'Comparable_Sales_Analysis.xlsx',
              size: '1.3 MB',
              uploadedDate: '21 Mar 2026',
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              status: 'uploaded',
              uploadedByName: 'Priya Sharma',
              uploadedByRole: 'partner'
            }
          ]
        },
        {
          id: 'sample-case-5',
          caseId: 'CASE-2026-005',
          serviceRequested: 'Property Service',
          subService: 'Asset Valuation',
          propertyId: 'prop-5',
          propertyName: 'Godrej Properties',
          propertyLocation: 'Vikhroli, Mumbai',
          status: 'Closed',
          dateCreated: new Date('2026-02-05').toISOString(),
          dateClosed: new Date('2026-02-28').toISOString(),
          progress: 100,
          userName: 'Ananya Iyer',
          partnerName: 'Aarav Mehta',
          statusHistory: [
            {
              id: 'status-5-1',
              timestamp: new Date('2026-02-05').toISOString(),
              status: 'Open',
              comments: 'Asset valuation requested',
              changedBy: 'admin',
              changedByName: 'System',
              changeType: 'status'
            },
            {
              id: 'status-5-2',
              timestamp: new Date('2026-02-28').toISOString(),
              status: 'Closed',
              comments: 'Valuation report delivered and case closed',
              changedBy: 'admin',
              changedByName: 'Admin Team',
              changeType: 'status'
            }
          ],
          milestones: [
            { id: 'm1', title: 'Request Submitted', status: 'completed', date: '5 Feb 2026' },
            { id: 'm2', title: 'Site Visit', status: 'completed', date: '12 Feb 2026' },
            { id: 'm3', title: 'Report Generation', status: 'completed', date: '25 Feb 2026' },
            { id: 'm4', title: 'Final Review', status: 'completed', date: '28 Feb 2026' }
          ]
        },
        {
          id: 'sample-case-6',
          caseId: 'CASE-2026-006',
          serviceRequested: 'HABU Report',
          propertyId: 'prop-6',
          propertyName: 'Salarpuria Sattva Knowledge City',
          propertyLocation: 'HITEC City, Hyderabad',
          status: 'Open',
          dateCreated: new Date('2026-03-22').toISOString(),
          progress: 15,
          userName: 'Alexander Sterling',
          partnerName: 'Aditya Patel',
          statusHistory: [
            {
              id: 'status-6-1',
              timestamp: new Date('2026-03-22').toISOString(),
              status: 'Open',
              comments: 'New HABU analysis request',
              changedBy: 'admin',
              changedByName: 'System',
              changeType: 'status'
            }
          ],
          milestones: [
            { id: 'm1', title: 'Case Submitted', status: 'completed', date: '22 Mar 2026' },
            { id: 'm2', title: 'Documents Review', status: 'pending' },
            { id: 'm3', title: 'Partner Assignment', status: 'pending' },
            { id: 'm4', title: 'Analysis in Progress', status: 'pending' },
            { id: 'm5', title: 'Report Generation', status: 'pending' }
          ]
        },
        {
          id: 'sample-case-7',
          caseId: 'CASE-2026-007',
          serviceRequested: 'Property Service',
          subService: 'Legal Documentation',
          propertyId: 'prop-7',
          propertyName: 'Embassy Lake Terraces',
          propertyLocation: 'Hebbal, Bangalore',
          status: 'Open',
          dateCreated: new Date('2026-03-25').toISOString(),
          progress: 55,
          userName: 'Sri Vidhya P',
          partnerName: 'Rajesh Kumar',
          statusHistory: [
            {
              id: 'status-7-1',
              timestamp: new Date('2026-03-25').toISOString(),
              status: 'Open',
              comments: 'Legal documentation review initiated for transfer support',
              changedBy: 'admin',
              changedByName: 'System',
              changeType: 'status'
            },
            {
              id: 'partner-7-1',
              timestamp: new Date('2026-03-26').toISOString(),
              partnerName: 'Rajesh Kumar',
              comments: 'Partner assigned: Rajesh Kumar',
              changedBy: 'admin',
              changedByName: 'Admin Team',
              changeType: 'partner-assignment'
            }
          ],
          milestones: [
            { id: 'm1', title: 'Request Submitted', status: 'completed', date: '25 Mar 2026' },
            { id: 'm2', title: 'Document reviewed', status: 'completed', date: '26 Mar 2026' },
            { id: 'm3', title: 'Partner assigned', status: 'completed', date: '26 Mar 2026' },
            { id: 'm4', title: 'Application filling', status: 'pending' },
            { id: 'm5', title: 'Authority follow-up', status: 'pending' },
            { id: 'm6', title: 'Case closed', status: 'pending' }
          ]
        }
      ];

      dummyCases.forEach(dummyCase => {
        if (!deduplicatedCases.some((c: Case) => c.id === dummyCase.id)) {
          deduplicatedCases.push(dummyCase as Case);
        }
      });
      
      console.log('CasesProvider initialized with', deduplicatedCases.length, 'cases');
      return deduplicatedCases;
    } catch (error) {
      console.error('Error loading cases from localStorage:', error);
      return [];
    }
  });

  // Save to localStorage whenever cases change
  useEffect(() => {
    try {
      localStorage.setItem('vybe-cases', JSON.stringify(cases));
    } catch (error) {
      console.error('Error saving cases to localStorage:', error);
    }
  }, [cases]);

  const generateCaseId = () => {
    const year = new Date().getFullYear();
    const count = cases.length + 1;
    return `CASE-${year}-${String(count).padStart(3, '0')}`;
  };

  const addCase = useCallback((caseData: Omit<Case, 'id' | 'caseId' | 'dateCreated'>) => {
    const newCase: Case = {
      ...caseData,
      id: `case-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      caseId: (() => {
        const year = new Date().getFullYear();
        // Generate based on current length of the state
        const count = cases.length + 1;
        return `CASE-${year}-${String(count).padStart(3, '0')}`;
      })(),
      dateCreated: new Date().toISOString(),
    };
    setCases(prev => [newCase, ...prev]);
  }, [cases.length]);

  const removeCase = useCallback((id: string) => {
    setCases(prev => prev.filter(c => c.id !== id));
  }, []);

  const getCase = useCallback((id: string) => {
    return cases.find(c => c.id === id);
  }, [cases]);

  const getCasesByCaseId = useCallback((caseId: string) => {
    return cases.find(c => c.caseId === caseId);
  }, [cases]);

  const updateCase = useCallback((id: string, updates: Partial<Case>) => {
    setCases(prev => 
      prev.map(c => c.id === id ? { ...c, ...updates } : c)
    );
  }, []);

  const value = useMemo(() => ({
    cases,
    addCase,
    removeCase,
    getCase,
    updateCase,
    getCasesByCaseId,
  }), [cases, addCase, removeCase, getCase, updateCase, getCasesByCaseId]);

  return (
    <CasesContext.Provider value={value}>
      {children}
    </CasesContext.Provider>
  );
}

export function useCases() {
  const context = useContext(CasesContext);
  if (context === undefined) {
    throw new Error('useCases must be used within a CasesProvider');
  }
  return context;
}
