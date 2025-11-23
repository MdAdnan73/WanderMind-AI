/**
 * Helpline Agent
 * Provides emergency numbers and tourism helplines by country
 */

export interface Helpline {
  name: string;
  number: string;
  type: 'emergency' | 'police' | 'medical' | 'fire' | 'tourism';
  description?: string;
}

export interface HelplineResult {
  helplines: Helpline[];
  country: string;
  hasData: boolean;
}

export class HelplineAgent {
  // Common emergency numbers by country code
  private emergencyNumbers: Record<string, Helpline[]> = {
    US: [
      { name: 'Emergency', number: '911', type: 'emergency' },
      { name: 'Police', number: '911', type: 'police' },
      { name: 'Medical', number: '911', type: 'medical' },
      { name: 'Fire', number: '911', type: 'fire' },
    ],
    IN: [
      { name: 'Emergency', number: '112', type: 'emergency' },
      { name: 'Police', number: '100', type: 'police' },
      { name: 'Medical', number: '102', type: 'medical' },
      { name: 'Fire', number: '101', type: 'fire' },
    ],
    GB: [
      { name: 'Emergency', number: '999', type: 'emergency' },
      { name: 'Police', number: '999', type: 'police' },
      { name: 'Medical', number: '999', type: 'medical' },
      { name: 'Fire', number: '999', type: 'fire' },
    ],
    FR: [
      { name: 'Emergency', number: '112', type: 'emergency' },
      { name: 'Police', number: '17', type: 'police' },
      { name: 'Medical', number: '15', type: 'medical' },
      { name: 'Fire', number: '18', type: 'fire' },
    ],
    DE: [
      { name: 'Emergency', number: '112', type: 'emergency' },
      { name: 'Police', number: '110', type: 'police' },
      { name: 'Medical', number: '112', type: 'medical' },
      { name: 'Fire', number: '112', type: 'fire' },
    ],
    JP: [
      { name: 'Emergency', number: '110', type: 'emergency' },
      { name: 'Police', number: '110', type: 'police' },
      { name: 'Medical', number: '119', type: 'medical' },
      { name: 'Fire', number: '119', type: 'fire' },
    ],
    CN: [
      { name: 'Emergency', number: '110', type: 'emergency' },
      { name: 'Police', number: '110', type: 'police' },
      { name: 'Medical', number: '120', type: 'medical' },
      { name: 'Fire', number: '119', type: 'fire' },
    ],
    AU: [
      { name: 'Emergency', number: '000', type: 'emergency' },
      { name: 'Police', number: '000', type: 'police' },
      { name: 'Medical', number: '000', type: 'medical' },
      { name: 'Fire', number: '000', type: 'fire' },
    ],
  };

  /**
   * Get helplines for a location
   */
  async getHelplines(
    latitude: number,
    longitude: number,
    countryCode?: string
  ): Promise<HelplineResult> {
    // Try to detect country from coordinates or use provided code
    let country = countryCode || 'US'; // Default fallback

    // Try to get country from reverse geocoding if not provided
    if (!countryCode) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          {
            headers: {
              'User-Agent': 'Tourism-Multi-Agent-System/1.0',
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          country = data.address?.country_code?.toUpperCase() || 'US';
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
      }
    }

    const helplines = this.emergencyNumbers[country] || this.emergencyNumbers['US'];

    // Add tourism helpline (generic)
    helplines.push({
      name: 'Tourism Helpline',
      number: 'Check local tourism office',
      type: 'tourism',
      description: 'Contact local tourism information center for assistance',
    });

    return {
      helplines,
      country,
      hasData: helplines.length > 0,
    };
  }
}

