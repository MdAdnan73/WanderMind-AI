/**
 * User Profile Agent
 * Manages user preferences: age group, visit date, travel persona
 * Stores in session/localStorage
 */

export type AgeGroup = 'under-18' | '18-25' | '26-40' | '41-60' | '60+';
export type TravelPersona = 'Adventure' | 'Family' | 'Romantic' | 'Party' | 'Budget' | 'Luxury';

export interface UserProfile {
  ageGroup: AgeGroup | null;
  visitDate: string | null; // ISO date string
  visitDateEnd: string | null; // For date ranges
  persona: TravelPersona | null; // Single persona (deprecated, use personas)
  personas: TravelPersona[]; // Multiple personas
}

export class UserProfileAgent {
  private storageKey = 'tourism_user_profile';

  /**
   * Get user profile from storage
   */
  getProfile(): UserProfile {
    if (typeof window === 'undefined') {
      return {
        ageGroup: null,
        visitDate: null,
        visitDateEnd: null,
        persona: null,
        personas: [],
      };
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migrate old single persona to personas array
        if (parsed.persona && !parsed.personas) {
          parsed.personas = [parsed.persona];
        }
        if (!parsed.personas) {
          parsed.personas = [];
        }
        return parsed;
      }
    } catch (error) {
      console.error('Error reading user profile:', error);
    }

    return {
      ageGroup: null,
      visitDate: null,
      visitDateEnd: null,
      persona: null,
      personas: [],
    };
  }

  /**
   * Save user profile to storage
   */
  saveProfile(profile: Partial<UserProfile>): void {
    if (typeof window === 'undefined') return;

    try {
      const current = this.getProfile();
      const updated = { ...current, ...profile };
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  /**
   * Check if profile is complete (has age group and date)
   */
  isComplete(): boolean {
    const profile = this.getProfile();
    return profile.ageGroup !== null && profile.visitDate !== null;
  }

  /**
   * Get age-based filtering rules
   */
  getAgeBasedRules(ageGroup: AgeGroup | null): {
    includeNightlife: boolean;
    includeAdventure: boolean;
    prioritizeComfort: boolean;
    childFriendly: boolean;
  } {
    switch (ageGroup) {
      case 'under-18':
        return {
          includeNightlife: false,
          includeAdventure: true,
          prioritizeComfort: false,
          childFriendly: true,
        };
      case '18-25':
        return {
          includeNightlife: true,
          includeAdventure: true,
          prioritizeComfort: false,
          childFriendly: false,
        };
      case '26-40':
        return {
          includeNightlife: true,
          includeAdventure: true,
          prioritizeComfort: false,
          childFriendly: false,
        };
      case '41-60':
        return {
          includeNightlife: false,
          includeAdventure: false,
          prioritizeComfort: true,
          childFriendly: false,
        };
      case '60+':
        return {
          includeNightlife: false,
          includeAdventure: false,
          prioritizeComfort: true,
          childFriendly: false,
        };
      default:
        return {
          includeNightlife: true,
          includeAdventure: true,
          prioritizeComfort: false,
          childFriendly: false,
        };
    }
  }
}

