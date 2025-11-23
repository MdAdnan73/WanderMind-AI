/**
 * Enhanced Geocoding Agent
 * Uses Nominatim with fuzzy matching and suggestions
 */

import Fuse from 'fuse.js';
import { findCityByName } from '../utils/popular-cities';

export interface GeocodingCandidate {
  latitude: number;
  longitude: number;
  displayName: string;
  importance: number;
  placeId: string;
}

export interface GeocodingResult {
  candidates: GeocodingCandidate[];
  primary: GeocodingCandidate | null;
  suggestions: string[];
}

export class EnhancedGeocodingAgent {
  private apiUrl: string;
  private cache: Map<string, GeocodingResult> = new Map();

  constructor(apiUrl?: string) {
    this.apiUrl = apiUrl || 'https://nominatim.openstreetmap.org';
  }

  /**
   * Geocode with multiple candidates and fuzzy suggestions
   */
  async geocode(placeName: string): Promise<GeocodingResult> {
    // Check cache
    const cacheKey = placeName.toLowerCase().trim();
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Clean and normalize place name
      const cleanPlaceName = placeName.trim().replace(/\s+/g, ' ');
      
      // Check popular cities database first
      const popularCity = findCityByName(cleanPlaceName);
      if (popularCity && popularCity.coordinates) {
        const primary: GeocodingCandidate = {
          latitude: popularCity.coordinates.lat,
          longitude: popularCity.coordinates.lon,
          displayName: popularCity.name + (popularCity.country ? `, ${popularCity.country}` : ''),
          importance: 0.9,
          placeId: `popular_${popularCity.name.toLowerCase().replace(/\s+/g, '_')}`,
        };
        
        const result: GeocodingResult = {
          candidates: [primary],
          primary,
          suggestions: [],
        };
        
        // Cache result
        this.cache.set(cacheKey, result);
        return result;
      }
      
      const encodedPlace = encodeURIComponent(cleanPlaceName);
      
      // Use more specific search parameters to get better results
      const url = `${this.apiUrl}/search?q=${encodedPlace}&format=json&limit=5&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Tourism-Multi-Agent-System/1.0',
        },
      });

      if (!response.ok) {
        return {
          candidates: [],
          primary: null,
          suggestions: [],
        };
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        // Try fuzzy matching with common city names
        const suggestions = await this.generateFuzzySuggestions(placeName);
        return {
          candidates: [],
          primary: null,
          suggestions,
        };
      }

      const candidates: GeocodingCandidate[] = data.map((item: any) => ({
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        displayName: item.display_name || placeName,
        importance: parseFloat(item.importance || '0'),
        placeId: item.place_id?.toString() || '',
      }));

      // Sort by importance, but prioritize exact name matches
      candidates.sort((a, b) => {
        const aExactMatch = a.displayName.toLowerCase().includes(cleanPlaceName.toLowerCase());
        const bExactMatch = b.displayName.toLowerCase().includes(cleanPlaceName.toLowerCase());
        
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        
        return b.importance - a.importance;
      });

      const primary = candidates[0] || null;

      // Generate suggestions from other candidates
      const suggestions = candidates
        .slice(1, 4)
        .map((c) => c.displayName.split(',')[0])
        .filter((name, index, self) => self.indexOf(name) === index);

      const result: GeocodingResult = {
        candidates,
        primary,
        suggestions,
      };

      // Cache result
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error('Geocoding error:', error);
      return {
        candidates: [],
        primary: null,
        suggestions: [],
      };
    }
  }

  /**
   * Generate fuzzy suggestions when no match found
   */
  private async generateFuzzySuggestions(placeName: string): Promise<string[]> {
    // Try a broader search
    try {
      const encodedPlace = encodeURIComponent(placeName);
      const url = `${this.apiUrl}/search?q=${encodedPlace}&format=json&limit=10`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Tourism-Multi-Agent-System/1.0',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          // Use Fuse.js for fuzzy matching
          const fuse = new Fuse(
            data.map((item: any) => item.display_name),
            {
              threshold: 0.4,
              minMatchCharLength: 3,
            }
          );

          const results = fuse.search(placeName);
          return results.slice(0, 3).map((r) => String(r.item).split(',')[0]);

        }
      }
    } catch (error) {
      console.error('Fuzzy suggestion error:', error);
    }

    return [];
  }

  /**
   * Select candidate by index
   */
  selectCandidate(result: GeocodingResult, index: number): GeocodingCandidate | null {
    if (index >= 0 && index < result.candidates.length) {
      return result.candidates[index];
    }
    return result.primary;
  }
}

