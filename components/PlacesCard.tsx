interface Place {
  name: string;
  type?: string;
}

interface PlacesResult {
  places: Place[];
  placeName: string;
}

interface PlacesCardProps {
  places: PlacesResult;
}

export default function PlacesCard({ places }: PlacesCardProps) {
  if (places.places.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Tourist Attractions</h2>
          <div className="text-4xl">📍</div>
        </div>
        <p className="text-gray-600">
          No tourist attractions found near {places.placeName}.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Tourist Attractions</h2>
        <div className="text-4xl">📍</div>
      </div>
      <div className="space-y-2">
        <p className="text-gray-700 mb-4">
          In {places.placeName} these are the places you can go:
        </p>
        <ul className="space-y-2">
          {places.places.map((place, index) => (
            <li
              key={index}
              className="flex items-center gap-3 text-gray-700 text-lg"
            >
              <span className="text-indigo-600 font-bold">•</span>
              <span>{place.name}</span>
              {place.type && (
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {place.type}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

