import { TransportResult } from '@/lib/agents/transport-traffic-agent';

interface TrafficAdvisoryCardProps {
  transport: TransportResult;
}

export default function TrafficAdvisoryCard({ transport }: TrafficAdvisoryCardProps) {
  if (!transport.trafficAdvisory) return null;

  const severityColors = {
    high: 'bg-red-50 border-red-200',
    medium: 'bg-yellow-50 border-yellow-200',
    low: 'bg-green-50 border-green-200',
  };

  return (
    <div className={`rounded-xl shadow-lg p-6 border-2 ${severityColors[transport.trafficAdvisory.severity]}`}>
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Traffic Advisory</h2>
        <div className="text-4xl">
          {transport.trafficAdvisory.severity === 'high' ? '🚨' : '⚠️'}
        </div>
      </div>

      <p className="text-gray-800 font-medium mb-2">{transport.trafficAdvisory.message}</p>

      {transport.trafficAdvisory.rushHourTimes && (
        <p className="text-sm text-gray-700 mb-3">
          <span className="font-semibold">Peak hours:</span> {transport.trafficAdvisory.rushHourTimes}
        </p>
      )}

      {transport.trafficAdvisory.alternatives.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Suggested Alternatives:</p>
          <ul className="list-disc list-inside space-y-1">
            {transport.trafficAdvisory.alternatives.map((alt, index) => (
              <li key={index} className="text-sm text-gray-700">{alt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

