import { TransportResult } from '@/lib/agents/transport-traffic-agent';

interface TransportCardProps {
  transport: TransportResult;
}

export default function TransportCard({ transport }: TransportCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Transport & Traffic</h2>
        <div className="text-4xl">🚇</div>
      </div>

      {transport.metroStations.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Metro/Subway Stations</h3>
          <ul className="space-y-2">
            {transport.metroStations.slice(0, 5).map((station, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-indigo-600 font-bold mt-1">🚉</span>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{station.name}</p>
                  {station.line && (
                    <p className="text-sm text-gray-600 mt-1">Line: {station.line}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {transport.trafficAdvisory && (
        <div className={`pt-4 border-t border-gray-200 ${
          transport.trafficAdvisory.severity === 'high' ? 'bg-red-50 p-4 rounded-lg' :
          transport.trafficAdvisory.severity === 'medium' ? 'bg-yellow-50 p-4 rounded-lg' :
          'bg-green-50 p-4 rounded-lg'
        }`}>
          <h3 className="font-semibold text-gray-700 mb-2">Traffic Advisory</h3>
          <p className="text-gray-800 mb-2">{transport.trafficAdvisory.message}</p>
          {transport.trafficAdvisory.rushHourTimes && (
            <p className="text-sm text-gray-600 mb-2">
              Peak hours: {transport.trafficAdvisory.rushHourTimes}
            </p>
          )}
          {transport.trafficAdvisory.alternatives.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Alternatives:</p>
              <ul className="list-disc list-inside space-y-1">
                {transport.trafficAdvisory.alternatives.map((alt, index) => (
                  <li key={index} className="text-sm text-gray-600">{alt}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {transport.metroStations.length === 0 && !transport.trafficAdvisory && (
        <p className="text-gray-600">No transport information available for {transport.placeName}.</p>
      )}
    </div>
  );
}

