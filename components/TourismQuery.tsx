import { useState } from 'react';
import WeatherCard from './WeatherCard';
import PlacesCard from './PlacesCard';

interface WeatherResult {
  temperature: number;
  precipitationProbability: number;
  placeName: string;
}

interface Place {
  name: string;
  type?: string;
}

interface PlacesResult {
  places: Place[];
  placeName: string;
}

interface TourismResponse {
  success: boolean;
  placeName?: string;
  weather?: WeatherResult | null;
  places?: PlacesResult | null;
  error?: string;
}

export default function TourismQuery() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TourismResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data: TourismResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({
        success: false,
        error: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., I'm going to Bangalore, what's the temperature and what can I visit?"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : 'Ask'}
          </button>
        </div>
      </form>

      {result && (
        <div className="space-y-6">
          {result.error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
              <p className="font-semibold">Error</p>
              <p>{result.error}</p>
            </div>
          )}

          {result.success && (
            <>
              {result.weather && (
                <WeatherCard weather={result.weather} />
              )}
              {result.places && (
                <PlacesCard places={result.places} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

