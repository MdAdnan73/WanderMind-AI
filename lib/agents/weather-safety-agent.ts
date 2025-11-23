/**
 * Weather & Safety Agent
 * Enhanced weather with safety advice based on age group
 */

import { AgeGroup } from './user-profile-agent';

export interface WeatherForecast {
  date: string;
  temperature: number;
  precipitationProbability: number;
  windSpeed: number;
  uvIndex?: number;
  condition: string;
}

export interface WeatherSafetyResult {
  current: {
    temperature: number;
    precipitationProbability: number;
    windSpeed: number;
    uvIndex?: number;
    condition: string;
  };
  forecast: WeatherForecast[];
  safetyAdvice: string[];
  bestTimeToVisit: string;
  placeName: string;
}

export class WeatherSafetyAgent {
  private apiUrl: string;

  constructor(apiUrl?: string) {
    this.apiUrl = apiUrl || 'https://api.open-meteo.com';
  }

  /**
   * Get weather with safety advice
   */
  async getWeatherSafety(
    latitude: number,
    longitude: number,
    placeName: string,
    visitDate: string,
    ageGroup: AgeGroup | null
  ): Promise<WeatherSafetyResult | null> {
    try {
      const visitDateObj = new Date(visitDate);
      const startDate = visitDateObj.toISOString().split('T')[0];
      const endDate = new Date(visitDateObj);
      endDate.setDate(endDate.getDate() + 3);
      const endDateStr = endDate.toISOString().split('T')[0];

      const url = `${this.apiUrl}/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation_probability,windspeed_10m,uv_index&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,uv_index_max&start_date=${startDate}&end_date=${endDateStr}&timezone=auto`;

      const response = await fetch(url);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (!data || !data.current_weather) {
        return null;
      }

      const current = data.current_weather;
      const hourly = data.hourly;
      const daily = data.daily;

      // Get current hour index
      const currentTime = current.time;
      const timeIndex = hourly?.time?.findIndex((t: string) => t === currentTime) || 0;

      const uvIndex = hourly?.uv_index?.[timeIndex] || daily?.uv_index_max?.[0];

      const currentWeather = {
        temperature: Math.round(current.temperature),
        precipitationProbability: Math.round(
          hourly?.precipitation_probability?.[timeIndex] || 0
        ),
        windSpeed: Math.round(current.windspeed || 0),
        uvIndex: uvIndex ? Math.round(uvIndex) : undefined,
        condition: this.getCondition(current.weathercode),
      };

      // Build forecast
      const forecast: WeatherForecast[] = [];
      if (daily && daily.time) {
        for (let i = 0; i < Math.min(3, daily.time.length); i++) {
          forecast.push({
            date: daily.time[i],
            temperature: Math.round(
              (daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2
            ),
            precipitationProbability: Math.round(daily.precipitation_probability_max[i] || 0),
            windSpeed: Math.round(daily.windspeed_10m_max[i] || 0),
            uvIndex: daily.uv_index_max?.[i] ? Math.round(daily.uv_index_max[i]) : undefined,
            condition: this.getCondition(daily.weathercode?.[i] || 0),
          });
        }
      }

      // Generate safety advice
      const safetyAdvice = this.generateSafetyAdvice(currentWeather, ageGroup);

      // Best time to visit
      const bestTimeToVisit = this.getBestTimeToVisit(forecast, visitDate);

      return {
        current: currentWeather,
        forecast,
        safetyAdvice,
        bestTimeToVisit,
        placeName,
      };
    } catch (error) {
      console.error('Weather safety error:', error);
      return null;
    }
  }

  private getCondition(weathercode: number): string {
    // WMO Weather interpretation codes (WW)
    if (weathercode === 0) return 'Clear sky';
    if (weathercode <= 3) return 'Partly cloudy';
    if (weathercode <= 48) return 'Foggy';
    if (weathercode <= 67) return 'Rainy';
    if (weathercode <= 77) return 'Snowy';
    if (weathercode <= 82) return 'Rain showers';
    if (weathercode <= 86) return 'Snow showers';
    return 'Thunderstorm';
  }

  private generateSafetyAdvice(
    weather: WeatherSafetyResult['current'],
    ageGroup: AgeGroup | null
  ): string[] {
    const advice: string[] = [];

    // UV Index advice
    if (weather.uvIndex !== undefined) {
      if (weather.uvIndex >= 8) {
        advice.push('High UV index - seek shade and use sunscreen');
        if (ageGroup === 'under-18' || ageGroup === '60+') {
          advice.push('Avoid midday sun exposure');
        }
      } else if (weather.uvIndex >= 6) {
        advice.push('Moderate UV - use sunscreen');
      }
    }

    // Precipitation advice
    if (weather.precipitationProbability > 70) {
      advice.push('High chance of rain - carry an umbrella');
      if (ageGroup === '60+') {
        advice.push('Wet conditions - be cautious on slippery surfaces');
      }
    }

    // Wind advice
    if (weather.windSpeed > 20) {
      advice.push('Strong winds expected - secure loose items');
    }

    // Temperature advice
    if (weather.temperature < 5) {
      advice.push('Very cold - dress warmly');
      if (ageGroup === '60+') {
        advice.push('Cold weather - take extra precautions');
      }
    } else if (weather.temperature > 35) {
      advice.push('Very hot - stay hydrated and seek shade');
      if (ageGroup === 'under-18' || ageGroup === '60+') {
        advice.push('Extreme heat - limit outdoor activities during peak hours');
      }
    }

    return advice;
  }

  private getBestTimeToVisit(forecast: WeatherForecast[], visitDate: string): string {
    if (forecast.length === 0) return 'Check weather conditions before visiting';

    const visitDateObj = new Date(visitDate);
    const visitDay = forecast.find(
      (f) => new Date(f.date).toDateString() === visitDateObj.toDateString()
    );

    if (!visitDay) {
      return 'Weather looks favorable for your visit';
    }

    if (visitDay.precipitationProbability < 30 && visitDay.temperature >= 15 && visitDay.temperature <= 30) {
      return 'Perfect weather conditions expected for your visit';
    }

    if (visitDay.precipitationProbability > 60) {
      return 'Rain expected - consider indoor activities or rescheduling';
    }

    return 'Weather conditions are acceptable for your visit';
  }
}

