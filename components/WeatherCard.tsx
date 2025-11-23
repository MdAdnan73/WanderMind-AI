interface WeatherResult {
  temperature: number;
  precipitationProbability: number;
  placeName: string;
}

interface WeatherCardProps {
  weather: WeatherResult;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Weather</h2>
        <div className="text-4xl">🌤️</div>
      </div>
      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-indigo-600">
            {weather.temperature}°C
          </span>
          <span className="text-gray-500 text-lg">in {weather.placeName}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <span>🌧️</span>
          <span>
            {weather.precipitationProbability}% chance of rain
          </span>
        </div>
        <p className="text-gray-700 mt-4 pt-4 border-t border-gray-200">
          In {weather.placeName} it's currently {weather.temperature}°C with a{' '}
          {weather.precipitationProbability} percent chance of rain.
        </p>
      </div>
    </div>
  );
}

