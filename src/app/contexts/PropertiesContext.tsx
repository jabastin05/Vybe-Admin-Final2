import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Property {
  id: string;
  name: string;
  type: string;
  buildingType?: 'residential' | 'commercial' | '';
  plotSize?: string;
  builtUpArea?: string;
  yearOfConstruction?: string;
  numberOfFloors?: string;
  surveyNumber?: string;
  currentUsage?: string;
  rentalIncome?: string;
  country?: string;
  state?: string;
  city?: string;
  address: string;
  latitude?: string;
  longitude?: string;
  district?: string;
  zoning?: string;
  dateAdded: string;
  documents?: {
    id: string;
    name: string;
    size: string;
    status: 'uploading' | 'verified' | 'processing' | 'error';
    type: string;
    documentType?: string;
  }[];
  extractedData?: {
    surveyNumber?: string;
    landArea?: string;
    landAreaUnit?: string;
    ownershipType?: string;
    zoningClassification?: string;
    roadAccess?: string;
    encumbranceStatus?: string;
    utilitiesAvailability?: string[];
  };
}

interface PropertiesContextType {
  properties: Property[];
  addProperty: (property: Property) => void;
  removeProperty: (id: string) => void;
  getProperty: (id: string) => Property | undefined;
  updateProperty: (id: string, updates: Partial<Property>) => void;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(() => {
    // Load from localStorage on initial mount
    const saved = localStorage.getItem('vybe-properties');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever properties change
  useEffect(() => {
    localStorage.setItem('vybe-properties', JSON.stringify(properties));
  }, [properties]);

  const addProperty = (property: Property) => {
    setProperties(prev => [...prev, property]);
  };

  const removeProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const getProperty = (id: string) => {
    return properties.find(p => p.id === id);
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(prev => 
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  return (
    <PropertiesContext.Provider value={{
      properties,
      addProperty,
      removeProperty,
      getProperty,
      updateProperty,
    }}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertiesContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertiesProvider');
  }
  return context;
}