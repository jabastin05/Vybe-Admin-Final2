export interface LocationData {
  area: string;
  district: string;
  state: string;
  avgPrice: number;
  priceChange: string;
  priceChangeValue: number;
  vybeScore: number;
  rentalYield: string;
  demandIndex: string;
  supplyIndex: string;
  infrastructureScore: number;
  liquidityScore: number;
  keyHighlights: string[];
  nearbyAmenities: Array<{
    name: string;
    count: number;
    distance: string;
  }>;
  priceHistory: Array<{
    period: string;
    price: number;
  }>;
  futureProjects: string[];
}

export function generateMockLocationData(pincode: string): LocationData {
  const locations: Record<string, LocationData> = {
    '560034': {
      area: 'Whitefield, Bangalore',
      district: 'Bangalore Urban',
      state: 'Karnataka',
      avgPrice: 9500,
      priceChange: '+18.5%',
      priceChangeValue: 1485,
      vybeScore: 8.7,
      rentalYield: '6.2%',
      demandIndex: 'Very High',
      supplyIndex: 'Medium',
      infrastructureScore: 8.5,
      liquidityScore: 7.8,
      keyHighlights: [
        'IT hub with 200+ tech companies within 10km radius',
        'Metro Phase 2 expansion underway - 3 new stations by 2026',
        '3 premium malls and retail centers within 5km',
        'International schools and multi-specialty hospitals nearby',
        'Strong rental demand from IT professionals (95% occupancy)'
      ],
      nearbyAmenities: [
        { name: 'Tech Parks', count: 12, distance: '2-5 km' },
        { name: 'Metro Stations', count: 3, distance: '1-3 km' },
        { name: 'Shopping Malls', count: 5, distance: '3-7 km' },
        { name: 'Hospitals', count: 8, distance: '2-6 km' }
      ],
      priceHistory: [
        { period: '12M Ago', price: 8015 },
        { period: '9M Ago', price: 8320 },
        { period: '6M Ago', price: 8750 },
        { period: '3M Ago', price: 9100 },
        { period: 'Current', price: 9500 }
      ],
      futureProjects: [
        'Whitefield Metro Extension (2026)',
        'KR Puram Railway Terminal Upgrade',
        '2 New IT Parks under construction'
      ]
    },
    '122001': {
      area: 'Gurgaon Sector 82-95',
      district: 'Gurgaon',
      state: 'Haryana',
      avgPrice: 7200,
      priceChange: '+21.2%',
      priceChangeValue: 1498,
      vybeScore: 8.3,
      rentalYield: '5.8%',
      demandIndex: 'Very High',
      supplyIndex: 'High',
      infrastructureScore: 8.8,
      liquidityScore: 8.2,
      keyHighlights: [
        'Dwarka Expressway connectivity - 15 min to IGI Airport',
        'New Diplomatic Enclave nearby attracting premium residents',
        'Rapid Metro expansion Phase 3 planned for 2025',
        '50+ Fortune 500 companies within 10km radius',
        'Premium gated communities with 8-9% rental appreciation'
      ],
      nearbyAmenities: [
        { name: 'Corporate Offices', count: 25, distance: '3-8 km' },
        { name: 'Metro Stations', count: 4, distance: '2-5 km' },
        { name: 'Malls & Retail', count: 7, distance: '2-6 km' },
        { name: 'International Schools', count: 6, distance: '1-5 km' }
      ],
      priceHistory: [
        { period: '12M Ago', price: 5940 },
        { period: '9M Ago', price: 6300 },
        { period: '6M Ago', price: 6650 },
        { period: '3M Ago', price: 6950 },
        { period: 'Current', price: 7200 }
      ],
      futureProjects: [
        'Dwarka Expressway (Completion 2025)',
        'New Metro Corridor Phase 3',
        'Smart City Infrastructure Upgrade'
      ]
    },
    '400706': {
      area: 'Navi Mumbai Panvel',
      district: 'Raigad',
      state: 'Maharashtra',
      avgPrice: 6800,
      priceChange: '+16.8%',
      priceChangeValue: 978,
      vybeScore: 7.9,
      rentalYield: '7.1%',
      demandIndex: 'High',
      supplyIndex: 'Medium',
      infrastructureScore: 7.9,
      liquidityScore: 7.3,
      keyHighlights: [
        'Navi Mumbai International Airport operational by 2024',
        'Mumbai Trans Harbour Link - 20 min to South Mumbai',
        'JNPT Port proximity - major logistics and warehousing hub',
        'Planned IT SEZ development attracting tech companies',
        'Lower entry price point with high growth potential (16%+ YoY)'
      ],
      nearbyAmenities: [
        { name: 'Logistics Hubs', count: 8, distance: '5-10 km' },
        { name: 'Railway Stations', count: 3, distance: '2-4 km' },
        { name: 'Commercial Centers', count: 6, distance: '3-7 km' },
        { name: 'Educational Institutes', count: 12, distance: '2-8 km' }
      ],
      priceHistory: [
        { period: '12M Ago', price: 5822 },
        { period: '9M Ago', price: 6100 },
        { period: '6M Ago', price: 6350 },
        { period: '3M Ago', price: 6580 },
        { period: 'Current', price: 6800 }
      ],
      futureProjects: [
        'Navi Mumbai International Airport (2024)',
        'Mumbai Trans Harbour Link Bridge',
        'IT SEZ Development - Phase 1'
      ]
    },
    '110001': {
      area: 'Connaught Place, Delhi',
      district: 'New Delhi',
      state: 'Delhi',
      avgPrice: 45000,
      priceChange: '+12.3%',
      priceChangeValue: 4920,
      vybeScore: 9.1,
      rentalYield: '4.8%',
      demandIndex: 'Very High',
      supplyIndex: 'Low',
      infrastructureScore: 9.5,
      liquidityScore: 9.2,
      keyHighlights: [
        'Prime commercial hub - heart of Delhi CBD',
        'Heritage zone with Grade A office spaces',
        'Metro connectivity - 4 lines intersection',
        'Highest footfall in NCR for retail',
        'Institutional demand from MNCs and embassies'
      ],
      nearbyAmenities: [
        { name: 'Metro Stations', count: 5, distance: '0.5-2 km' },
        { name: 'Corporate Offices', count: 200, distance: '0.5-3 km' },
        { name: 'Hotels & Restaurants', count: 150, distance: '0.5-2 km' },
        { name: 'Government Offices', count: 50, distance: '1-4 km' }
      ],
      priceHistory: [
        { period: '12M Ago', price: 40080 },
        { period: '9M Ago', price: 41500 },
        { period: '6M Ago', price: 42800 },
        { period: '3M Ago', price: 44200 },
        { period: 'Current', price: 45000 }
      ],
      futureProjects: [
        'Central Vista Redevelopment',
        'Smart Traffic Management System',
        'Heritage Building Restoration Project'
      ]
    }
  };

  // Return data if pincode exists, otherwise generate generic data
  if (locations[pincode]) {
    return locations[pincode];
  }

  // Generic fallback data for any other pincode
  const genericPrice = 5000 + (parseInt(pincode.slice(0, 3)) % 50) * 100;
  const genericScore = 6.5 + (parseInt(pincode.slice(3, 6)) % 20) / 10;
  
  return {
    area: `Pincode ${pincode} Area`,
    district: 'District',
    state: 'India',
    avgPrice: genericPrice,
    priceChange: '+12.5%',
    priceChangeValue: Math.round(genericPrice * 0.125),
    vybeScore: Number(genericScore.toFixed(1)),
    rentalYield: '5.5%',
    demandIndex: 'Medium',
    supplyIndex: 'Medium',
    infrastructureScore: 7.0,
    liquidityScore: 6.8,
    keyHighlights: [
      'Growing residential and commercial area',
      'Good connectivity to main city center',
      'Educational institutions and schools nearby',
      'Retail development and markets underway',
      'Stable rental market with steady demand'
    ],
    nearbyAmenities: [
      { name: 'Schools', count: 5, distance: '1-4 km' },
      { name: 'Hospitals', count: 3, distance: '2-5 km' },
      { name: 'Markets', count: 4, distance: '1-3 km' },
      { name: 'Transport Hubs', count: 2, distance: '3-6 km' }
    ],
    priceHistory: [
      { period: '12M Ago', price: Math.round(genericPrice * 0.875) },
      { period: '9M Ago', price: Math.round(genericPrice * 0.91) },
      { period: '6M Ago', price: Math.round(genericPrice * 0.95) },
      { period: '3M Ago', price: Math.round(genericPrice * 0.98) },
      { period: 'Current', price: genericPrice }
    ],
    futureProjects: [
      'Infrastructure development planned',
      'New residential projects',
      'Road widening and connectivity project'
    ]
  };
}
