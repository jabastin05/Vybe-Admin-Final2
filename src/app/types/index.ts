export interface PropertyCase {
  id: string;
  caseId: string; // Added Case ID
  name: string;
  location: string;
  parcelSize: string;
  surveyNumber?: string;
  status: 'reviewing' | 'analyzing' | 'strategy-ready' | 'in-execution';
  riskScore: number;
  trustScore: number;
  createdAt: string;
  lastUpdated: string;
  selectedStrategyId?: string;
  assignedPartnerId?: string;
  hasMilestones?: boolean;
  
  // Status-specific fields
  documentCount?: number; // For 'reviewing' status
  analysisProgress?: number; // For 'analyzing' status (0-100)
  strategyCount?: number; // For 'strategy-ready' status
  bestRoi?: number; // For 'strategy-ready' status
  executionProgress?: number; // For 'in-execution' status (0-100)
  currentPhase?: string; // For 'in-execution' status
  nextMilestone?: string; // For 'in-execution' status
  nextMilestoneDue?: string; // For 'in-execution' status
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  roi: number;
  riskLevel: 'low' | 'medium' | 'high';
  capitalRequired: string;
  effort: string;
  timeline: string;
  projections: {
    year: string;
    revenue: number;
    cost: number;
  }[];
}

export interface Partner {
  id: string;
  name: string;
  role: string;
  experience: string;
  photo: string;
  slaTimeline: string;
}

export interface Milestone {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  dueDate: string;
  completedDate?: string;
}