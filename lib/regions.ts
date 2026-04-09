export interface RegionOption {
  id: string
  city: string
  country: string
  timezone: string
  latitude?: number
  longitude?: number
}

export const REGION_OPTIONS: RegionOption[] = [
  { id: 'london', city: 'London', country: 'United Kingdom', timezone: 'Europe/London', latitude: 51.5072, longitude: -0.1276 },
  { id: 'beijing', city: 'Beijing', country: 'China', timezone: 'Asia/Shanghai', latitude: 39.9042, longitude: 116.4074 },
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { id: 'seoul', city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', latitude: 37.5665, longitude: 126.978 },
  { id: 'hong-kong', city: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', latitude: 22.3193, longitude: 114.1694 },
  { id: 'singapore', city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', latitude: 1.3521, longitude: 103.8198 },
  { id: 'dubai', city: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', latitude: 25.2048, longitude: 55.2708 },
  { id: 'paris', city: 'Paris', country: 'France', timezone: 'Europe/Paris', latitude: 48.8566, longitude: 2.3522 },
  { id: 'amsterdam', city: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', latitude: 52.3676, longitude: 4.9041 },
  { id: 'helsinki', city: 'Helsinki', country: 'Finland', timezone: 'Europe/Helsinki', latitude: 60.1699, longitude: 24.9384 },
  { id: 'berlin', city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', latitude: 52.52, longitude: 13.405 },
  { id: 'madrid', city: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid', latitude: 40.4168, longitude: -3.7038 },
  { id: 'rome', city: 'Rome', country: 'Italy', timezone: 'Europe/Rome', latitude: 41.9028, longitude: 12.4964 },
  { id: 'zurich', city: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', latitude: 47.3769, longitude: 8.5417 },
  { id: 'new-york', city: 'New York', country: 'United States', timezone: 'America/New_York', latitude: 40.7128, longitude: -74.006 },
  { id: 'san-francisco', city: 'San Francisco', country: 'United States', timezone: 'America/Los_Angeles', latitude: 37.7749, longitude: -122.4194 },
  { id: 'toronto', city: 'Toronto', country: 'Canada', timezone: 'America/Toronto', latitude: 43.6532, longitude: -79.3832 },
  { id: 'vancouver', city: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver', latitude: 49.2827, longitude: -123.1207 },
  { id: 'sydney', city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', latitude: -33.8688, longitude: 151.2093 },
  { id: 'auckland', city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', latitude: -36.8509, longitude: 174.7645 },
]
