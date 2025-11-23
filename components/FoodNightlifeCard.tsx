import { PlacesResult } from '@/lib/agents/enhanced-places-agent';

interface FoodNightlifeCardProps {
  places: PlacesResult;
}

export default function FoodNightlifeCard({ places }: FoodNightlifeCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Food & Nightlife</h2>
        <div className="text-4xl">🍽️</div>
      </div>

      {places.restaurants.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Restaurants</h3>
          <ul className="space-y-2">
            {places.restaurants.slice(0, 5).map((restaurant, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-indigo-600 font-bold mt-1">🍴</span>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{restaurant.name}</p>
                  {restaurant.cuisine && (
                    <p className="text-sm text-gray-600 mt-1">Cuisine: {restaurant.cuisine}</p>
                  )}
                  {restaurant.openingHours && (
                    <p className="text-xs text-gray-500 mt-1">Hours: {restaurant.openingHours}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {places.pubs.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Pubs & Bars</h3>
          <ul className="space-y-2">
            {places.pubs.slice(0, 5).map((pub, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-amber-600 font-bold mt-1">🍺</span>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{pub.name}</p>
                  {pub.openingHours && (
                    <p className="text-xs text-gray-500 mt-1">Hours: {pub.openingHours}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {places.restaurants.length === 0 && places.pubs.length === 0 && (
        <p className="text-gray-600">No restaurants or pubs found for {places.placeName}.</p>
      )}
    </div>
  );
}

