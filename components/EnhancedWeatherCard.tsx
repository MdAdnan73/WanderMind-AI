import { WeatherSafetyResult } from '@/lib/agents/weather-safety-agent';

interface EnhancedWeatherCardProps {
  weather: WeatherSafetyResult;
}

export default function EnhancedWeatherCard({ weather }: EnhancedWeatherCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Weather & Safety</h2>
        <div className="text-4xl">🌤️</div>
      </div>

      {/* Current Weather */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-5xl font-bold text-indigo-600">
            {weather.current.temperature}°C
          </span>
          <span className="text-gray-500 text-lg">in {weather.placeName}</span>
        </div>
        <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <span>🌧️</span>
            <span>{weather.current.precipitationProbability}% chance of rain</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💨</span>
            <span>{weather.current.windSpeed} km/h wind</span>
          </div>
          {weather.current.uvIndex !== undefined && (
            <div className="flex items-center gap-1">
              <span>☀️</span>
              <span>UV Index: {weather.current.uvIndex}</span>
            </div>
          )}
        </div>
        <p className="text-gray-600 mt-2">{weather.current.condition}</p>
      </div>

      {/* Forecast */}
      {weather.forecast.length > 0 && (
        <div className="mb-6 pt-4 border-t border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">3-Day Forecast</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {weather.forecast.map((day, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-700">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{day.temperature}°C</p>
                <p className="text-xs text-gray-600 mt-1">{day.precipitationProbability}% rain</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Advice */}
      {weather.safetyAdvice.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-2">Safety Advice</h3>
          <ul className="space-y-1">
            {weather.safetyAdvice.map((advice, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span>⚠️</span>
                <span>{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Best Time to Visit */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Best time to visit:</span> {weather.bestTimeToVisit}
        </p>
      </div>
    </div>
  );
}

