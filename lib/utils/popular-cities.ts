/**
 * Popular Cities Database
 * Common aliases and variations for well-known cities worldwide
 */

export interface CityAlias {
  name: string;
  aliases: string[];
  country?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

export const POPULAR_CITIES: Record<string, CityAlias> = {
  'bangalore': {
    name: 'Bangalore',
    aliases: ['Bengaluru', 'Bangaluru', 'Bangalore'],
    country: 'India',
    coordinates: { lat: 12.9716, lon: 77.5946 },
  },
  'mumbai': {
    name: 'Mumbai',
    aliases: ['Bombay', 'Mumbai'],
    country: 'India',
    coordinates: { lat: 19.0760, lon: 72.8777 },
  },
  'delhi': {
    name: 'Delhi',
    aliases: ['New Delhi', 'Delhi', 'NCR'],
    country: 'India',
    coordinates: { lat: 28.6139, lon: 77.2090 },
  },
  'paris': {
    name: 'Paris',
    aliases: ['Paris'],
    country: 'France',
    coordinates: { lat: 48.8566, lon: 2.3522 },
  },
  'london': {
    name: 'London',
    aliases: ['London'],
    country: 'United Kingdom',
    coordinates: { lat: 51.5074, lon: -0.1278 },
  },
  'new york': {
    name: 'New York',
    aliases: ['New York', 'NYC', 'New York City'],
    country: 'United States',
    coordinates: { lat: 40.7128, lon: -74.0060 },
  },
  'tokyo': {
    name: 'Tokyo',
    aliases: ['Tokyo'],
    country: 'Japan',
    coordinates: { lat: 35.6762, lon: 139.6503 },
  },
  'dubai': {
    name: 'Dubai',
    aliases: ['Dubai'],
    country: 'United Arab Emirates',
    coordinates: { lat: 25.2048, lon: 55.2708 },
  },
  'singapore': {
    name: 'Singapore',
    aliases: ['Singapore'],
    country: 'Singapore',
    coordinates: { lat: 1.3521, lon: 103.8198 },
  },
  'sydney': {
    name: 'Sydney',
    aliases: ['Sydney'],
    country: 'Australia',
    coordinates: { lat: -33.8688, lon: 151.2093 },
  },
  'los angeles': {
    name: 'Los Angeles',
    aliases: ['Los Angeles', 'LA', 'LAX'],
    country: 'United States',
    coordinates: { lat: 34.0522, lon: -118.2437 },
  },
  'rome': {
    name: 'Rome',
    aliases: ['Rome', 'Roma'],
    country: 'Italy',
    coordinates: { lat: 41.9028, lon: 12.4964 },
  },
  'barcelona': {
    name: 'Barcelona',
    aliases: ['Barcelona'],
    country: 'Spain',
    coordinates: { lat: 41.3851, lon: 2.1734 },
  },
  'amsterdam': {
    name: 'Amsterdam',
    aliases: ['Amsterdam'],
    country: 'Netherlands',
    coordinates: { lat: 52.3676, lon: 4.9041 },
  },
  'berlin': {
    name: 'Berlin',
    aliases: ['Berlin'],
    country: 'Germany',
    coordinates: { lat: 52.5200, lon: 13.4050 },
  },
  'istanbul': {
    name: 'Istanbul',
    aliases: ['Istanbul', 'Constantinople'],
    country: 'Turkey',
    coordinates: { lat: 41.0082, lon: 28.9784 },
  },
  'bangkok': {
    name: 'Bangkok',
    aliases: ['Bangkok'],
    country: 'Thailand',
    coordinates: { lat: 13.7563, lon: 100.5018 },
  },
  'hong kong': {
    name: 'Hong Kong',
    aliases: ['Hong Kong', 'HK'],
    country: 'Hong Kong',
    coordinates: { lat: 22.3193, lon: 114.1694 },
  },
  'shanghai': {
    name: 'Shanghai',
    aliases: ['Shanghai'],
    country: 'China',
    coordinates: { lat: 31.2304, lon: 121.4737 },
  },
  'beijing': {
    name: 'Beijing',
    aliases: ['Beijing', 'Peking'],
    country: 'China',
    coordinates: { lat: 39.9042, lon: 116.4074 },
  },
  'cairo': {
    name: 'Cairo',
    aliases: ['Cairo'],
    country: 'Egypt',
    coordinates: { lat: 30.0444, lon: 31.2357 },
  },
  'rio de janeiro': {
    name: 'Rio de Janeiro',
    aliases: ['Rio de Janeiro', 'Rio'],
    country: 'Brazil',
    coordinates: { lat: -22.9068, lon: -43.1729 },
  },
  'moscow': {
    name: 'Moscow',
    aliases: ['Moscow', 'Moskva'],
    country: 'Russia',
    coordinates: { lat: 55.7558, lon: 37.6173 },
  },
  'madrid': {
    name: 'Madrid',
    aliases: ['Madrid'],
    country: 'Spain',
    coordinates: { lat: 40.4168, lon: -3.7038 },
  },
  'vienna': {
    name: 'Vienna',
    aliases: ['Vienna', 'Wien'],
    country: 'Austria',
    coordinates: { lat: 48.2082, lon: 16.3738 },
  },
  'prague': {
    name: 'Prague',
    aliases: ['Prague', 'Praha'],
    country: 'Czech Republic',
    coordinates: { lat: 50.0755, lon: 14.4378 },
  },
  'athens': {
    name: 'Athens',
    aliases: ['Athens'],
    country: 'Greece',
    coordinates: { lat: 37.9838, lon: 23.7275 },
  },
  'lisbon': {
    name: 'Lisbon',
    aliases: ['Lisbon', 'Lisboa'],
    country: 'Portugal',
    coordinates: { lat: 38.7223, lon: -9.1393 },
  },
  'stockholm': {
    name: 'Stockholm',
    aliases: ['Stockholm'],
    country: 'Sweden',
    coordinates: { lat: 59.3293, lon: 18.0686 },
  },
  'copenhagen': {
    name: 'Copenhagen',
    aliases: ['Copenhagen', 'København'],
    country: 'Denmark',
    coordinates: { lat: 55.6761, lon: 12.5683 },
  },
  'oslo': {
    name: 'Oslo',
    aliases: ['Oslo'],
    country: 'Norway',
    coordinates: { lat: 59.9139, lon: 10.7522 },
  },
  'helsinki': {
    name: 'Helsinki',
    aliases: ['Helsinki'],
    country: 'Finland',
    coordinates: { lat: 60.1699, lon: 24.9384 },
  },
  'warsaw': {
    name: 'Warsaw',
    aliases: ['Warsaw', 'Warszawa'],
    country: 'Poland',
    coordinates: { lat: 52.2297, lon: 21.0122 },
  },
  'budapest': {
    name: 'Budapest',
    aliases: ['Budapest'],
    country: 'Hungary',
    coordinates: { lat: 47.4979, lon: 19.0402 },
  },
  'dublin': {
    name: 'Dublin',
    aliases: ['Dublin'],
    country: 'Ireland',
    coordinates: { lat: 53.3498, lon: -6.2603 },
  },
  'edinburgh': {
    name: 'Edinburgh',
    aliases: ['Edinburgh'],
    country: 'United Kingdom',
    coordinates: { lat: 55.9533, lon: -3.1883 },
  },
  'brussels': {
    name: 'Brussels',
    aliases: ['Brussels', 'Bruxelles'],
    country: 'Belgium',
    coordinates: { lat: 50.8503, lon: 4.3517 },
  },
  'zurich': {
    name: 'Zurich',
    aliases: ['Zurich', 'Zürich'],
    country: 'Switzerland',
    coordinates: { lat: 47.3769, lon: 8.5417 },
  },
  'geneva': {
    name: 'Geneva',
    aliases: ['Geneva', 'Genève'],
    country: 'Switzerland',
    coordinates: { lat: 46.2044, lon: 6.1432 },
  },
  'milan': {
    name: 'Milan',
    aliases: ['Milan', 'Milano'],
    country: 'Italy',
    coordinates: { lat: 45.4642, lon: 9.1900 },
  },
  'venice': {
    name: 'Venice',
    aliases: ['Venice', 'Venezia'],
    country: 'Italy',
    coordinates: { lat: 45.4408, lon: 12.3155 },
  },
  'florence': {
    name: 'Florence',
    aliases: ['Florence', 'Firenze'],
    country: 'Italy',
    coordinates: { lat: 43.7696, lon: 11.2558 },
  },
  'naples': {
    name: 'Naples',
    aliases: ['Naples', 'Napoli'],
    country: 'Italy',
    coordinates: { lat: 40.8518, lon: 14.2681 },
  },
  'seoul': {
    name: 'Seoul',
    aliases: ['Seoul'],
    country: 'South Korea',
    coordinates: { lat: 37.5665, lon: 126.9780 },
  },
  'taipei': {
    name: 'Taipei',
    aliases: ['Taipei'],
    country: 'Taiwan',
    coordinates: { lat: 25.0330, lon: 121.5654 },
  },
  'kuala lumpur': {
    name: 'Kuala Lumpur',
    aliases: ['Kuala Lumpur', 'KL'],
    country: 'Malaysia',
    coordinates: { lat: 3.1390, lon: 101.6869 },
  },
  'jakarta': {
    name: 'Jakarta',
    aliases: ['Jakarta'],
    country: 'Indonesia',
    coordinates: { lat: -6.2088, lon: 106.8456 },
  },
  'manila': {
    name: 'Manila',
    aliases: ['Manila'],
    country: 'Philippines',
    coordinates: { lat: 14.5995, lon: 120.9842 },
  },
  'ho chi minh city': {
    name: 'Ho Chi Minh City',
    aliases: ['Ho Chi Minh City', 'Saigon', 'HCMC'],
    country: 'Vietnam',
    coordinates: { lat: 10.8231, lon: 106.6297 },
  },
  'bangkok': {
    name: 'Bangkok',
    aliases: ['Bangkok'],
    country: 'Thailand',
    coordinates: { lat: 13.7563, lon: 100.5018 },
  },
  'mexico city': {
    name: 'Mexico City',
    aliases: ['Mexico City', 'Ciudad de México'],
    country: 'Mexico',
    coordinates: { lat: 19.4326, lon: -99.1332 },
  },
  'buenos aires': {
    name: 'Buenos Aires',
    aliases: ['Buenos Aires'],
    country: 'Argentina',
    coordinates: { lat: -34.6037, lon: -58.3816 },
  },
  'lima': {
    name: 'Lima',
    aliases: ['Lima'],
    country: 'Peru',
    coordinates: { lat: -12.0464, lon: -77.0428 },
  },
  'santiago': {
    name: 'Santiago',
    aliases: ['Santiago'],
    country: 'Chile',
    coordinates: { lat: -33.4489, lon: -70.6693 },
  },
  'bogota': {
    name: 'Bogotá',
    aliases: ['Bogotá', 'Bogota'],
    country: 'Colombia',
    coordinates: { lat: 4.7110, lon: -74.0721 },
  },
  'casablanca': {
    name: 'Casablanca',
    aliases: ['Casablanca'],
    country: 'Morocco',
    coordinates: { lat: 33.5731, lon: -7.5898 },
  },
  'johannesburg': {
    name: 'Johannesburg',
    aliases: ['Johannesburg', 'Joburg'],
    country: 'South Africa',
    coordinates: { lat: -26.2041, lon: 28.0473 },
  },
  'cape town': {
    name: 'Cape Town',
    aliases: ['Cape Town'],
    country: 'South Africa',
    coordinates: { lat: -33.9249, lon: 18.4241 },
  },
  'nairobi': {
    name: 'Nairobi',
    aliases: ['Nairobi'],
    country: 'Kenya',
    coordinates: { lat: -1.2921, lon: 36.8219 },
  },
  'lagos': {
    name: 'Lagos',
    aliases: ['Lagos'],
    country: 'Nigeria',
    coordinates: { lat: 6.5244, lon: 3.3792 },
  },
  'tel aviv': {
    name: 'Tel Aviv',
    aliases: ['Tel Aviv', 'Tel Aviv-Yafo'],
    country: 'Israel',
    coordinates: { lat: 32.0853, lon: 34.7818 },
  },
  'jerusalem': {
    name: 'Jerusalem',
    aliases: ['Jerusalem'],
    country: 'Israel',
    coordinates: { lat: 31.7683, lon: 35.2137 },
  },
  'doha': {
    name: 'Doha',
    aliases: ['Doha'],
    country: 'Qatar',
    coordinates: { lat: 25.2854, lon: 51.5310 },
  },
  'riyadh': {
    name: 'Riyadh',
    aliases: ['Riyadh'],
    country: 'Saudi Arabia',
    coordinates: { lat: 24.7136, lon: 46.6753 },
  },
  'jeddah': {
    name: 'Jeddah',
    aliases: ['Jeddah'],
    country: 'Saudi Arabia',
    coordinates: { lat: 21.4858, lon: 39.1925 },
  },
  'abu dhabi': {
    name: 'Abu Dhabi',
    aliases: ['Abu Dhabi'],
    country: 'United Arab Emirates',
    coordinates: { lat: 24.4539, lon: 54.3773 },
  },
  'kolkata': {
    name: 'Kolkata',
    aliases: ['Kolkata', 'Calcutta'],
    country: 'India',
    coordinates: { lat: 22.5726, lon: 88.3639 },
  },
  'chennai': {
    name: 'Chennai',
    aliases: ['Chennai', 'Madras'],
    country: 'India',
    coordinates: { lat: 13.0827, lon: 80.2707 },
  },
  'hyderabad': {
    name: 'Hyderabad',
    aliases: ['Hyderabad'],
    country: 'India',
    coordinates: { lat: 17.3850, lon: 78.4867 },
  },
  'pune': {
    name: 'Pune',
    aliases: ['Pune', 'Poona'],
    country: 'India',
    coordinates: { lat: 18.5204, lon: 73.8567 },
  },
  'ahmedabad': {
    name: 'Ahmedabad',
    aliases: ['Ahmedabad'],
    country: 'India',
    coordinates: { lat: 23.0225, lon: 72.5714 },
  },
  'jaipur': {
    name: 'Jaipur',
    aliases: ['Jaipur'],
    country: 'India',
    coordinates: { lat: 26.9124, lon: 75.7873 },
  },
  'goa': {
    name: 'Goa',
    aliases: ['Goa'],
    country: 'India',
    coordinates: { lat: 15.2993, lon: 74.1240 },
  },
  'kochi': {
    name: 'Kochi',
    aliases: ['Kochi', 'Cochin'],
    country: 'India',
    coordinates: { lat: 9.9312, lon: 76.2673 },
  },
  'udaipur': {
    name: 'Udaipur',
    aliases: ['Udaipur'],
    country: 'India',
    coordinates: { lat: 24.5854, lon: 73.7125 },
  },
  'varanasi': {
    name: 'Varanasi',
    aliases: ['Varanasi', 'Benares', 'Kashi'],
    country: 'India',
    coordinates: { lat: 25.3176, lon: 82.9739 },
  },
  'agra': {
    name: 'Agra',
    aliases: ['Agra'],
    country: 'India',
    coordinates: { lat: 27.1767, lon: 78.0081 },
  },
  'chicago': {
    name: 'Chicago',
    aliases: ['Chicago', 'Chi-Town'],
    country: 'United States',
    coordinates: { lat: 41.8781, lon: -87.6298 },
  },
  'san francisco': {
    name: 'San Francisco',
    aliases: ['San Francisco', 'SF', 'Frisco'],
    country: 'United States',
    coordinates: { lat: 37.7749, lon: -122.4194 },
  },
  'boston': {
    name: 'Boston',
    aliases: ['Boston'],
    country: 'United States',
    coordinates: { lat: 42.3601, lon: -71.0589 },
  },
  'washington': {
    name: 'Washington DC',
    aliases: ['Washington', 'Washington DC', 'DC'],
    country: 'United States',
    coordinates: { lat: 38.9072, lon: -77.0369 },
  },
  'miami': {
    name: 'Miami',
    aliases: ['Miami'],
    country: 'United States',
    coordinates: { lat: 25.7617, lon: -80.1918 },
  },
  'las vegas': {
    name: 'Las Vegas',
    aliases: ['Las Vegas', 'Vegas'],
    country: 'United States',
    coordinates: { lat: 36.1699, lon: -115.1398 },
  },
  'seattle': {
    name: 'Seattle',
    aliases: ['Seattle'],
    country: 'United States',
    coordinates: { lat: 47.6062, lon: -122.3321 },
  },
  'toronto': {
    name: 'Toronto',
    aliases: ['Toronto'],
    country: 'Canada',
    coordinates: { lat: 43.6532, lon: -79.3832 },
  },
  'vancouver': {
    name: 'Vancouver',
    aliases: ['Vancouver'],
    country: 'Canada',
    coordinates: { lat: 49.2827, lon: -123.1207 },
  },
  'montreal': {
    name: 'Montreal',
    aliases: ['Montreal', 'Montréal'],
    country: 'Canada',
    coordinates: { lat: 45.5017, lon: -73.5673 },
  },
};

/**
 * Find city by name or alias
 */
export function findCityByName(input: string): CityAlias | null {
  const normalized = input.toLowerCase().trim();
  
  // Direct match
  if (POPULAR_CITIES[normalized]) {
    return POPULAR_CITIES[normalized];
  }
  
  // Check aliases
  for (const city of Object.values(POPULAR_CITIES)) {
    if (city.aliases.some(alias => alias.toLowerCase() === normalized)) {
      return city;
    }
  }
  
  // Partial match
  for (const [key, city] of Object.entries(POPULAR_CITIES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return city;
    }
    if (city.aliases.some(alias => normalized.includes(alias.toLowerCase()) || alias.toLowerCase().includes(normalized))) {
      return city;
    }
  }
  
  return null;
}

