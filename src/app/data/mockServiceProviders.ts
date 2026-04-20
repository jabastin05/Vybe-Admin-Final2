export interface MockServiceProvider {
  id: number;
  partnerType: 'Company' | 'Individual';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  cityCoverage: string[];
  role: string;
  maxCaseload: number;
  turnAroundSLA: string;
  isEnabled: boolean;
  commercialSetup: {
    defaultPricing: string;
    commissionModel: string;
    revenueShare: string;
    payoutTerms: string;
  };
  documents: {
    gstPan?: string;
    agreements?: string;
    bankDetails?: string;
    licenses?: string;
  };
}

export const MOCK_SERVICE_PROVIDERS: MockServiceProvider[] = [
  {
    id: 1,
    partnerType: 'Individual',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@legalservices.com',
    cityCoverage: ['Mumbai', 'Pune', 'Thane'],
    role: 'Legal Service Provider',
    maxCaseload: 15,
    turnAroundSLA: '3-5 business days',
    isEnabled: true,
    commercialSetup: {
      defaultPricing: 'Project Based',
      commissionModel: 'Percentage Based',
      revenueShare: '70-30',
      payoutTerms: 'Net 30',
    },
    documents: {
      gstPan: 'gst_rajesh_kumar.pdf',
      agreements: 'agreement_rajesh.pdf',
    },
  },
  {
    id: 2,
    partnerType: 'Company',
    firstName: 'Priya',
    lastName: 'Sharma',
    phone: '+91 98123 45678',
    email: 'priya@architectsolutions.com',
    cityCoverage: ['Delhi', 'Gurugram', 'Noida'],
    role: 'Architect/Planning Service Provider',
    maxCaseload: 10,
    turnAroundSLA: '5-7 business days',
    isEnabled: true,
    commercialSetup: {
      defaultPricing: 'Fixed Fee',
      commissionModel: 'Flat Fee',
      revenueShare: '60-40',
      payoutTerms: 'Milestone Based',
    },
    documents: {
      gstPan: 'gst_priya_sharma.pdf',
      licenses: 'architect_license.pdf',
    },
  },
  {
    id: 3,
    partnerType: 'Individual',
    firstName: 'Mervin',
    lastName: 'Jacob',
    phone: '+91 99887 76655',
    email: 'mervin.jacob@fieldops.com',
    cityCoverage: ['Bangalore', 'Chennai'],
    role: 'Survey/Technician Service Provider',
    maxCaseload: 20,
    turnAroundSLA: '2-3 business days',
    isEnabled: true,
    commercialSetup: {
      defaultPricing: 'Hourly Rate',
      commissionModel: 'Tiered Commission',
      revenueShare: '80-20',
      payoutTerms: 'Net 45',
    },
    documents: {
      gstPan: 'gst_mervin_jacob.pdf',
      bankDetails: 'bank_mervin.pdf',
    },
  },
  {
    id: 4,
    partnerType: 'Company',
    firstName: 'Aarav',
    lastName: 'Mehta',
    phone: '+91 98234 56789',
    email: 'aarav.mehta@valuerhub.com',
    cityCoverage: ['Ahmedabad', 'Surat', 'Vadodara'],
    role: 'Legal Service Provider',
    maxCaseload: 12,
    turnAroundSLA: '4-6 business days',
    isEnabled: true,
    commercialSetup: {
      defaultPricing: 'Project Based',
      commissionModel: 'Percentage Based',
      revenueShare: '70-30',
      payoutTerms: 'Upon Completion',
    },
    documents: {
      gstPan: 'gst_aarav_mehta.pdf',
      licenses: 'valuer_license.pdf',
      agreements: 'agreement_aarav.pdf',
    },
  },
  {
    id: 5,
    partnerType: 'Individual',
    firstName: 'Aditya',
    lastName: 'Patel',
    phone: '+91 98450 11223',
    email: 'aditya.patel@channelfield.com',
    cityCoverage: ['Hyderabad', 'Secunderabad'],
    role: 'Channel Field Service Provider',
    maxCaseload: 14,
    turnAroundSLA: '4-5 business days',
    isEnabled: true,
    commercialSetup: {
      defaultPricing: 'Retainer',
      commissionModel: 'Hybrid',
      revenueShare: '60-40',
      payoutTerms: 'Milestone Based',
    },
    documents: {
      gstPan: 'gst_aditya_patel.pdf',
      agreements: 'agreement_aditya.pdf',
    },
  },
  {
    id: 6,
    partnerType: 'Individual',
    firstName: 'Sneha',
    lastName: 'Reddy',
    phone: '+91 98861 44556',
    email: 'sneha.reddy@docscompliance.com',
    cityCoverage: ['Bangalore', 'Hyderabad'],
    role: 'Documentation/Compliance Service Provider',
    maxCaseload: 18,
    turnAroundSLA: '2-4 business days',
    isEnabled: true,
    commercialSetup: {
      defaultPricing: 'Fixed Fee',
      commissionModel: 'Flat Fee',
      revenueShare: '50-50',
      payoutTerms: 'Net 30',
    },
    documents: {
      gstPan: 'gst_sneha_reddy.pdf',
      licenses: 'compliance_license.pdf',
    },
  },
];

export const getServiceProviderName = (provider: Pick<MockServiceProvider, 'firstName' | 'lastName'>) =>
  `${provider.firstName} ${provider.lastName}`;

export const findServiceProviderByEmail = (email: string) =>
  MOCK_SERVICE_PROVIDERS.find((provider) => provider.email.toLowerCase() === email.toLowerCase());

export const resolveServiceProviderIdentity = (email: string, currentName?: string) => {
  const provider = findServiceProviderByEmail(email);
  if (provider) {
    return getServiceProviderName(provider);
  }

  if (currentName && currentName !== 'Service Provider') {
    return currentName;
  }

  return getServiceProviderName(MOCK_SERVICE_PROVIDERS[0]);
};
