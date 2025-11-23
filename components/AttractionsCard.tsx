import { PlacesResult } from '@/lib/agents/enhanced-places-agent';

interface AttractionsCardProps {
  places: PlacesResult;
}

export default function AttractionsCard({ places }: AttractionsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Tourist Attractions</h2>
        <div className="text-4xl">📍</div>
      </div>

      {places.attractions.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Popular Attractions</h3>
          <ul className="space-y-2">
            {places.attractions.map((place, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-indigo-600 font-bold mt-1">•</span>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{place.name}</p>
                  {place.description && (
                    <p className="text-sm text-gray-600 mt-1">{place.description.substring(0, 100)}...</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {places.hiddenGems.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Hidden Gems</h3>
          <ul className="space-y-2">
            {places.hiddenGems.map((place, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-amber-600 font-bold mt-1">💎</span>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{place.name}</p>
                  {place.description && (
                    <p className="text-sm text-gray-600 mt-1">{place.description.substring(0, 100)}...</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {places.attractions.length === 0 && places.hiddenGems.length === 0 && (
        <p className="text-gray-600">No attractions found for {places.placeName}.</p>
      )}
    </div>
  );
}

