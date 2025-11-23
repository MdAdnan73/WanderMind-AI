import { HelplineResult } from '@/lib/agents/helpline-agent';

interface HelplineCardProps {
  helplines: HelplineResult;
}

export default function HelplineCard({ helplines }: HelplineCardProps) {
  const typeIcons: Record<string, string> = {
    emergency: '🚨',
    police: '👮',
    medical: '🏥',
    fire: '🚒',
    tourism: '📞',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Emergency & Helplines</h2>
        <div className="text-4xl">📞</div>
      </div>

      <p className="text-sm text-gray-600 mb-4">Country: {helplines.country}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {helplines.helplines.map((helpline, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{typeIcons[helpline.type] || '📞'}</span>
              <p className="font-semibold text-gray-800">{helpline.name}</p>
            </div>
            <p className="text-2xl font-bold text-indigo-600">{helpline.number}</p>
            {helpline.description && (
              <p className="text-xs text-gray-600 mt-2">{helpline.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

