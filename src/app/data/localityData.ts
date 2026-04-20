// Location-based insights data for properties
export interface LocalityInsight {
  avgPrice: string;
  priceUnit: string;
  localityRank: number;
  state: string;
  rentalCount: number;
  saleCount: number;
  safetyRating: string;
  demographicType: string;
  demographicDesc: string;
  nearbyLandmarks: {
    schools: Array<{ name: string; distance: string }>;
    busStops: Array<{ name: string; distance: string }>;
    hospitals: Array<{ name: string; distance: string }>;
    banks: Array<{ name: string; distance: string }>;
    temples: Array<{ name: string; distance: string }>;
    shopping: Array<{ name: string; distance: string }>;
  };
}

// Location-specific data mapping
const localityInsights: Record<string, LocalityInsight> = {
  // Bangalore localities
  'koramangala': {
    avgPrice: '12,850',
    priceUnit: '/sq.ft',
    localityRank: 15,
    state: 'Karnataka',
    rentalCount: 150,
    saleCount: 280,
    safetyRating: '4.7/5',
    demographicType: 'Premium Tech Hub',
    demographicDesc: 'Young professionals and IT sector employees',
    nearbyLandmarks: {
      schools: [
        { name: 'Delhi Public School', distance: '0.8 KM' },
        { name: 'Greenwood High International School', distance: '1.2 KM' },
        { name: 'National Hill View Public School', distance: '1.5 KM' }
      ],
      busStops: [
        { name: 'Koramangala Bus Terminal', distance: '0.3 KM' },
        { name: 'Jyoti Nivas College Bus Stop', distance: '0.6 KM' },
        { name: 'Sony Signal Bus Stop', distance: '0.9 KM' }
      ],
      hospitals: [
        { name: 'Manipal Hospital', distance: '1.1 KM' },
        { name: 'Cloudnine Hospital', distance: '1.4 KM' },
        { name: 'Sparsh Hospital', distance: '2.0 KM' }
      ],
      banks: [
        { name: 'HDFC Bank', distance: '0.2 KM' },
        { name: 'ICICI Bank', distance: '0.4 KM' },
        { name: 'Axis Bank', distance: '0.7 KM' }
      ],
      temples: [
        { name: 'Chokkanathaswamy Temple', distance: '1.8 KM' },
        { name: 'ISKCON Temple', distance: '3.2 KM' },
        { name: 'Bull Temple', distance: '4.5 KM' }
      ],
      shopping: [
        { name: 'Forum Mall', distance: '0.9 KM' },
        { name: 'Koramangala Social', distance: '0.5 KM' },
        { name: 'Big Bazaar', distance: '1.3 KM' }
      ]
    }
  },
  'indiranagar': {
    avgPrice: '14,200',
    priceUnit: '/sq.ft',
    localityRank: 8,
    state: 'Karnataka',
    rentalCount: 180,
    saleCount: 320,
    safetyRating: '4.8/5',
    demographicType: 'Upscale Residential',
    demographicDesc: 'High-income families and expatriates',
    nearbyLandmarks: {
      schools: [
        { name: 'Clarence High School', distance: '0.6 KM' },
        { name: 'Delhi Public School', distance: '2.1 KM' },
        { name: 'Bishop Cotton Girls School', distance: '2.8 KM' }
      ],
      busStops: [
        { name: 'Indiranagar Metro Station', distance: '0.4 KM' },
        { name: '100 Feet Road Bus Stop', distance: '0.2 KM' },
        { name: 'HAL Bus Stop', distance: '1.5 KM' }
      ],
      hospitals: [
        { name: 'Mallya Hospital', distance: '0.8 KM' },
        { name: 'Columbia Asia Hospital', distance: '1.2 KM' },
        { name: 'Sagar Hospitals', distance: '2.5 KM' }
      ],
      banks: [
        { name: 'State Bank of India', distance: '0.3 KM' },
        { name: 'HDFC Bank', distance: '0.5 KM' },
        { name: 'Kotak Mahindra Bank', distance: '0.8 KM' }
      ],
      temples: [
        { name: 'Kote Venkataramana Temple', distance: '3.5 KM' },
        { name: 'ISKCON Temple', distance: '4.2 KM' },
        { name: 'Gavi Gangadhareshwara Temple', distance: '5.0 KM' }
      ],
      shopping: [
        { name: 'Gopalan Arcade', distance: '0.3 KM' },
        { name: 'Phoenix Marketcity', distance: '1.8 KM' },
        { name: 'Garuda Mall', distance: '2.2 KM' }
      ]
    }
  },
  'whitefield': {
    avgPrice: '8,950',
    priceUnit: '/sq.ft',
    localityRank: 28,
    state: 'Karnataka',
    rentalCount: 220,
    saleCount: 410,
    safetyRating: '4.4/5',
    demographicType: 'IT Corridor',
    demographicDesc: 'IT professionals and young families',
    nearbyLandmarks: {
      schools: [
        { name: 'Ryan International School', distance: '0.9 KM' },
        { name: 'Inventure Academy', distance: '1.5 KM' },
        { name: 'Oakridge International School', distance: '2.2 KM' }
      ],
      busStops: [
        { name: 'Whitefield Bus Depot', distance: '0.5 KM' },
        { name: 'ITPL Main Gate', distance: '0.7 KM' },
        { name: 'Varthur Bus Stop', distance: '1.2 KM' }
      ],
      hospitals: [
        { name: 'Columbia Asia Hospital', distance: '1.0 KM' },
        { name: 'Vydehi Hospital', distance: '2.5 KM' },
        { name: 'Manipal Hospital', distance: '3.8 KM' }
      ],
      banks: [
        { name: 'ICICI Bank', distance: '0.4 KM' },
        { name: 'Axis Bank', distance: '0.6 KM' },
        { name: 'State Bank of India', distance: '0.9 KM' }
      ],
      temples: [
        { name: 'Sri Sathya Sai Baba Ashram', distance: '1.8 KM' },
        { name: 'Shiva Temple', distance: '2.3 KM' },
        { name: 'Dodda Ganeshana Gudi', distance: '5.5 KM' }
      ],
      shopping: [
        { name: 'Phoenix Marketcity', distance: '0.6 KM' },
        { name: 'Park Square Mall', distance: '1.1 KM' },
        { name: 'VR Bengaluru', distance: '1.8 KM' }
      ]
    }
  },
  // Mumbai localities
  'andheri': {
    avgPrice: '22,500',
    priceUnit: '/sq.ft',
    localityRank: 45,
    state: 'Maharashtra',
    rentalCount: 300,
    saleCount: 420,
    safetyRating: '4.3/5',
    demographicType: 'Mixed Residential',
    demographicDesc: 'Middle to high-income professionals',
    nearbyLandmarks: {
      schools: [
        { name: 'Podar International School', distance: '0.7 KM' },
        { name: 'Ryan International School', distance: '1.2 KM' },
        { name: 'JBCN International School', distance: '1.8 KM' }
      ],
      busStops: [
        { name: 'Andheri Station (West)', distance: '0.3 KM' },
        { name: 'DN Nagar Metro', distance: '0.8 KM' },
        { name: 'Versova Bus Depot', distance: '1.5 KM' }
      ],
      hospitals: [
        { name: 'Kokilaben Dhirubhai Ambani Hospital', distance: '1.5 KM' },
        { name: 'Seven Hills Hospital', distance: '2.2 KM' },
        { name: 'Holy Spirit Hospital', distance: '0.9 KM' }
      ],
      banks: [
        { name: 'HDFC Bank', distance: '0.2 KM' },
        { name: 'ICICI Bank', distance: '0.4 KM' },
        { name: 'State Bank of India', distance: '0.6 KM' }
      ],
      temples: [
        { name: 'Iskcon Temple', distance: '2.8 KM' },
        { name: 'Hanuman Temple', distance: '1.1 KM' },
        { name: 'Shiva Temple', distance: '1.5 KM' }
      ],
      shopping: [
        { name: 'Infiniti Mall', distance: '0.6 KM' },
        { name: 'Shoppers Stop', distance: '0.8 KM' },
        { name: 'Lokhandwala Market', distance: '1.2 KM' }
      ]
    }
  },
  // Delhi localities
  'vasant kunj': {
    avgPrice: '18,750',
    priceUnit: '/sq.ft',
    localityRank: 52,
    state: 'Delhi',
    rentalCount: 85,
    saleCount: 165,
    safetyRating: '4.6/5',
    demographicType: 'Affluent Residential',
    demographicDesc: 'High-net-worth individuals and diplomats',
    nearbyLandmarks: {
      schools: [
        { name: 'The Shri Ram School', distance: '0.5 KM' },
        { name: 'Vasant Valley School', distance: '1.0 KM' },
        { name: 'DPS Vasant Kunj', distance: '1.3 KM' }
      ],
      busStops: [
        { name: 'Vasant Kunj Sector C Bus Stop', distance: '0.3 KM' },
        { name: 'Chattarpur Metro Station', distance: '2.5 KM' },
        { name: 'Ambience Mall Bus Stop', distance: '1.1 KM' }
      ],
      hospitals: [
        { name: 'Fortis Flt. Lt. Rajan Dhall Hospital', distance: '0.8 KM' },
        { name: 'Manipal Hospital', distance: '1.5 KM' },
        { name: 'Aakash Healthcare', distance: '2.0 KM' }
      ],
      banks: [
        { name: 'HDFC Bank', distance: '0.4 KM' },
        { name: 'ICICI Bank', distance: '0.6 KM' },
        { name: 'Axis Bank', distance: '0.9 KM' }
      ],
      temples: [
        { name: 'Chhatarpur Temple', distance: '3.2 KM' },
        { name: 'ISKCON Temple', distance: '4.5 KM' },
        { name: 'Kalkaji Mandir', distance: '8.5 KM' }
      ],
      shopping: [
        { name: 'Ambience Mall', distance: '1.0 KM' },
        { name: 'DLF Promenade', distance: '2.8 KM' },
        { name: 'Select Citywalk', distance: '5.2 KM' }
      ]
    }
  },
  // Default fallback
  'default': {
    avgPrice: '29,750',
    priceUnit: '/sq.ft',
    localityRank: 330,
    state: 'India',
    rentalCount: 20,
    saleCount: 70,
    safetyRating: '4.5/5',
    demographicType: 'Premium',
    demographicDesc: 'High-income residential area',
    nearbyLandmarks: {
      schools: [
        { name: 'Ashok Academy', distance: '0.15 KM' },
        { name: 'Kiddie Cove', distance: '0.41 KM' },
        { name: 'Hussain Allana English School', distance: '0.48 KM' }
      ],
      busStops: [
        { name: 'Main Bus Stop', distance: '0.25 KM' },
        { name: 'Junction Bus Stand', distance: '0.55 KM' },
        { name: 'City Bus Terminal', distance: '1.2 KM' }
      ],
      hospitals: [
        { name: 'City Hospital', distance: '0.9 KM' },
        { name: 'General Hospital', distance: '1.5 KM' },
        { name: 'Medical Center', distance: '2.2 KM' }
      ],
      banks: [
        { name: 'HDFC Bank', distance: '0.3 KM' },
        { name: 'State Bank of India', distance: '0.5 KM' },
        { name: 'ICICI Bank', distance: '0.7 KM' }
      ],
      temples: [
        { name: 'Local Temple', distance: '0.8 KM' },
        { name: 'Main Temple', distance: '1.5 KM' },
        { name: 'Historic Temple', distance: '2.8 KM' }
      ],
      shopping: [
        { name: 'City Mall', distance: '0.6 KM' },
        { name: 'Shopping Complex', distance: '1.1 KM' },
        { name: 'Market Street', distance: '1.5 KM' }
      ]
    }
  }
};

/**
 * Get locality insights based on city name
 * Returns default insights if city not found
 */
export function getLocalityInsights(city?: string, state?: string): LocalityInsight {
  if (!city) return localityInsights['default'];
  
  // Normalize city name for lookup
  const normalizedCity = city.toLowerCase().trim();
  
  // Try exact match first
  if (localityInsights[normalizedCity]) {
    return localityInsights[normalizedCity];
  }
  
  // Try partial match
  const partialMatch = Object.keys(localityInsights).find(key => 
    normalizedCity.includes(key) || key.includes(normalizedCity)
  );
  
  if (partialMatch) {
    return localityInsights[partialMatch];
  }
  
  // Return default with state info if available
  const defaultData = { ...localityInsights['default'] };
  if (state) {
    defaultData.state = state;
  }
  
  return defaultData;
}
