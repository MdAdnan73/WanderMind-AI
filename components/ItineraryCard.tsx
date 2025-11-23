import { ItinerarySlot } from '@/lib/agents/enhanced-parent-agent';

interface ItineraryCardProps {
  itinerary: ItinerarySlot[];
  placeName: string;
}

export default function ItineraryCard({ itinerary, placeName }: ItineraryCardProps) {
  if (itinerary.length === 0) return null;

  const timeLabels = {
    morning: '🌅 Morning (8 AM - 12 PM)',
    afternoon: '☀️ Afternoon (12 PM - 5 PM)',
    evening: '🌙 Evening (5 PM - 9 PM)',
    night: '🌃 Night (9 PM - 12 AM)',
  };

  // Group itinerary by date
  const itineraryByDate: Record<string, ItinerarySlot[]> = {};
  itinerary.forEach(slot => {
    if (!itineraryByDate[slot.date]) {
      itineraryByDate[slot.date] = [];
    }
    itineraryByDate[slot.date].push(slot);
  });

  const dates = Object.keys(itineraryByDate).sort();
  const isMultiDay = dates.length > 1;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Itinerary</h2>
        <div className="text-4xl">📅</div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {isMultiDay 
          ? `Suggested ${dates.length}-day plan for ${placeName}`
          : `Suggested plan for ${placeName}`
        }
      </p>

      <div className="space-y-6">
        {dates.map((date, dateIndex) => {
          const daySlots = itineraryByDate[date];
          const dateObj = new Date(date);
          const dayLabel = isMultiDay 
            ? `Day ${dateIndex + 1}: ${dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`
            : dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

          return (
            <div key={date} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-4">{dayLabel}</h3>
              <div className="space-y-4">
                {daySlots.map((slot, slotIndex) => (
                  <div key={slotIndex} className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="font-semibold text-gray-800 mb-2">{timeLabels[slot.time]}</h4>
                    <ul className="space-y-1 mb-2">
                      {slot.activities.map((activity, actIndex) => (
                        <li key={actIndex} className="text-gray-700 flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">•</span>
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                    {slot.dining && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-semibold">Dining:</span> {slot.dining}
                      </p>
                    )}
                    {slot.travelTime && (
                      <p className="text-xs text-gray-500 mt-1">Travel time: {slot.travelTime}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

