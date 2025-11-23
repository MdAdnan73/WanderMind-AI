import { EventsResult } from '@/lib/agents/events-agent';

interface EventsCardProps {
  events: EventsResult;
}

export default function EventsCard({ events }: EventsCardProps) {
  if (!events.hasData && events.events.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Events</h2>
          <div className="text-4xl">🎉</div>
        </div>
        <p className="text-gray-600">
          No public events found for your visit date. Try checking +/- 3 days or enable Eventbrite API key for more data.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Events</h2>
        <div className="text-4xl">🎉</div>
      </div>

      {events.events.length > 0 ? (
        <ul className="space-y-3">
          {events.events.map((event, index) => (
            <li key={index} className="border-b border-gray-200 pb-3 last:border-0">
              <p className="font-semibold text-gray-800">{event.name}</p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">
                {event.date && (
                  <span>📅 {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                )}
                {event.time && <span>🕐 {event.time}</span>}
                {event.venue && <span>📍 {event.venue}</span>}
              </div>
              {event.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.description}</p>
              )}
              {event.url && (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:underline mt-2 inline-block"
                >
                  Learn more →
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No events found for {events.placeName} on your visit date.</p>
      )}
    </div>
  );
}

