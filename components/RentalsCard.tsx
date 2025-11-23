import { RentalResult } from '@/lib/agents/rental-agent';

interface RentalsCardProps {
  rentals: RentalResult;
}

export default function RentalsCard({ rentals }: RentalsCardProps) {
  if (rentals.rentals.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Rentals</h2>
          <div className="text-4xl">🚲</div>
        </div>
        <p className="text-gray-600">No rental services found for {rentals.placeName}.</p>
      </div>
    );
  }

  const bikeRentals = rentals.rentals.filter((r) => r.type === 'bicycle');
  const carRentals = rentals.rentals.filter((r) => r.type === 'car');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Rentals</h2>
        <div className="text-4xl">🚲</div>
      </div>

      {bikeRentals.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Bicycle Rentals</h3>
          <ul className="space-y-2">
            {bikeRentals.slice(0, 5).map((rental, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-indigo-600 font-bold mt-1">🚴</span>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{rental.name}</p>
                  {rental.estimatedPrice && (
                    <p className="text-sm text-gray-600 mt-1">~{rental.estimatedPrice}</p>
                  )}
                  {rental.contact && (
                    <p className="text-xs text-gray-500 mt-1">Contact: {rental.contact}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {carRentals.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Car Rentals</h3>
          <ul className="space-y-2">
            {carRentals.slice(0, 5).map((rental, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-indigo-600 font-bold mt-1">🚗</span>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{rental.name}</p>
                  {rental.estimatedPrice && (
                    <p className="text-sm text-gray-600 mt-1">~{rental.estimatedPrice}</p>
                  )}
                  {rental.contact && (
                    <p className="text-xs text-gray-500 mt-1">Contact: {rental.contact}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

