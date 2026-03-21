export interface CityData {
  slug: string;
  name: string;
  state: string;
  stateCode: string;
  population: string;
  permits: string;
  growth: string;
  avgJobValue: string;
  topTrades: string[];
  description: string;
  luxuryZips?: string[];
}

export const cities: CityData[] = [
  {
    slug: "new-york",
    name: "New York",
    state: "New York",
    stateCode: "NY",
    population: "8.3M",
    permits: "120,000+",
    growth: "8%",
    avgJobValue: "$85,000",
    topTrades: ["General Contracting", "Plumbing", "Electrical", "HVAC"],
    description: "The largest construction market in America. NYC contractors face fierce competition but massive opportunity — over 120,000 building permits issued annually across all five boroughs.",
    luxuryZips: ["10021", "10022", "10023", "10024", "10025"],
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    state: "California",
    stateCode: "CA",
    population: "3.9M",
    permits: "85,000+",
    growth: "11%",
    avgJobValue: "$92,000",
    topTrades: ["Roofing", "Solar Installation", "HVAC", "Landscaping", "Renovations"],
    description: "LA's booming construction market combines solar installations, earthquake retrofits, and luxury renovations — a goldmine for contractors who show up first on Google.",
    luxuryZips: ["90210", "90077", "90272", "90402", "90049"],
  },
  {
    slug: "chicago",
    name: "Chicago",
    state: "Illinois",
    stateCode: "IL",
    population: "2.7M",
    permits: "55,000+",
    growth: "7%",
    avgJobValue: "$68,000",
    topTrades: ["HVAC", "Plumbing", "Electrical", "Roofing", "Renovations"],
    description: "Chicago's extreme weather drives year-round demand for HVAC, roofing, and plumbing services. Over 55,000 annual permits keep qualified contractors fully booked.",
    luxuryZips: ["60611", "60614", "60657", "60654", "60610"],
  },
  {
    slug: "houston",
    name: "Houston",
    state: "Texas",
    stateCode: "TX",
    population: "2.3M",
    permits: "65,000+",
    growth: "16%",
    avgJobValue: "$75,000",
    topTrades: ["HVAC", "Plumbing", "Roofing", "Electrical", "Solar Installation"],
    description: "Houston is one of the fastest-growing construction markets in America. Post-hurricane rebuilding cycles and explosive suburban expansion create an unmatched volume of residential trade work.",
    luxuryZips: ["77019", "77024", "77027", "77056", "77057"],
  },
  {
    slug: "phoenix",
    name: "Phoenix",
    state: "Arizona",
    stateCode: "AZ",
    population: "1.6M",
    permits: "50,000+",
    growth: "18%",
    avgJobValue: "$72,000",
    topTrades: ["HVAC", "Roofing", "Solar Installation", "Landscaping", "Pool Construction"],
    description: "Phoenix leads the nation in construction growth at 18%. Desert heat drives massive HVAC replacement cycles, while Sun Belt migration is generating new permits at a pace that far outstrips contractor capacity.",
    luxuryZips: ["85253", "85254", "85255", "85259", "85262"],
  },
  {
    slug: "dallas",
    name: "Dallas",
    state: "Texas",
    stateCode: "TX",
    population: "1.3M",
    permits: "48,000+",
    growth: "15%",
    avgJobValue: "$78,000",
    topTrades: ["HVAC", "Roofing", "Plumbing", "General Contracting"],
    description: "Dallas-Fort Worth's explosive population growth fuels one of the hottest construction markets in the Sun Belt. The DFW metro adds more new residents annually than any other US market.",
    luxuryZips: ["75205", "75209", "75220", "75225", "75230"],
  },
  {
    slug: "miami",
    name: "Miami",
    state: "Florida",
    stateCode: "FL",
    population: "6M metro",
    permits: "42,000+",
    growth: "13%",
    avgJobValue: "$95,000",
    topTrades: ["Roofing", "HVAC", "Hurricane Protection", "Plumbing"],
    description: "Miami's hurricane-prone climate and luxury real estate boom create a uniquely high-value contractor market. Post-storm roofing and HVAC jobs average $15,000–$50,000 per contract.",
    luxuryZips: ["33139", "33140", "33141", "33154", "33109"],
  },
  {
    slug: "atlanta",
    name: "Atlanta",
    state: "Georgia",
    stateCode: "GA",
    population: "6M metro",
    permits: "38,000+",
    growth: "14%",
    avgJobValue: "$70,000",
    topTrades: ["HVAC", "Roofing", "Plumbing", "Landscaping", "Renovations"],
    description: "Atlanta's rapid expansion makes it a prime market for trade contractors. Corporate relocations and new subdivisions across Buckhead and Sandy Springs drive 14% annual construction growth.",
    luxuryZips: ["30305", "30309", "30327", "30338", "30342"],
  },
  {
    slug: "philadelphia",
    name: "Philadelphia",
    state: "Pennsylvania",
    stateCode: "PA",
    population: "1.6M",
    permits: "35,000+",
    growth: "6%",
    avgJobValue: "$62,000",
    topTrades: ["Renovations", "Plumbing", "Electrical", "HVAC", "Roofing"],
    description: "Philadelphia's historic housing stock is a goldmine for renovation contractors. Aging row homes and brownstones require constant plumbing, electrical, and structural updates.",
    luxuryZips: ["19103", "19106", "19107", "19146", "19147"],
  },
  {
    slug: "seattle",
    name: "Seattle",
    state: "Washington",
    stateCode: "WA",
    population: "4M metro",
    permits: "30,000+",
    growth: "10%",
    avgJobValue: "$88,000",
    topTrades: ["Roofing", "Plumbing", "HVAC", "Electrical", "Renovations"],
    description: "Seattle's tech boom and persistent rainfall create a uniquely high-demand roofing and waterproofing market. With median home values exceeding $800,000, contractors command premium rates.",
    luxuryZips: ["98004", "98005", "98006", "98033", "98039"],
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return cities.map((c) => c.slug);
}
