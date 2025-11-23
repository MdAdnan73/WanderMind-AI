/**
 * Events Agent
 * Fetches events using Eventbrite API or fallback
 */

export interface Event {
  name: string;
  description?: string;
  date: string;
  time?: string;
  venue?: string;
  category?: string;
  url?: string;
}

export interface EventsResult {
  events: Event[];
  placeName: string;
  hasData: boolean;
  source: 'eventbrite' | 'fallback';
}

export class EventsAgent {
  private eventbriteKey?: string;
  private apiUrl = 'https://www.eventbriteapi.com/v3';

  constructor(eventbriteKey?: string) {
    this.eventbriteKey = eventbriteKey;
  }

  /**
   * Get events for location and date range
   */
  async getEvents(
    latitude: number,
    longitude: number,
    placeName: string,
    startDate: string,
    endDate?: string
  ): Promise<EventsResult> {
    if (this.eventbriteKey) {
      const eventbriteEvents = await this.getEventbriteEvents(
        latitude,
        longitude,
        startDate,
        endDate
      );
      if (eventbriteEvents.length > 0) {
        return {
          events: eventbriteEvents,
          placeName,
          hasData: true,
          source: 'eventbrite',
        };
      }
    }

    // Fallback: return helpful message
    return {
      events: [],
      placeName,
      hasData: false,
      source: 'fallback',
    };
  }

  private async getEventbriteEvents(
    latitude: number,
    longitude: number,
    startDate: string,
    endDate?: string
  ): Promise<Event[]> {
    try {
      const end = endDate || new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const url = `${this.apiUrl}/events/search/?location.latitude=${latitude}&location.longitude=${longitude}&start_date.range_start=${startDate}T00:00:00&start_date.range_end=${end}T23:59:59&expand=venue`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.eventbriteKey}`,
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();

      if (!data || !data.events) {
        return [];
      }

      return data.events.slice(0, 10).map((event: any) => ({
        name: event.name?.text || 'Untitled Event',
        description: event.description?.text?.substring(0, 200),
        date: event.start?.local?.split('T')[0] || startDate,
        time: event.start?.local?.split('T')[1]?.substring(0, 5),
        venue: event.venue?.name || event.venue?.address?.localized_area_display?.join(', '),
        category: event.category_id,
        url: event.url,
      }));
    } catch (error) {
      console.error('Eventbrite API error:', error);
      return [];
    }
  }
}

