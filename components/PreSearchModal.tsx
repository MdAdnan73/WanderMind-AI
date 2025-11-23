import { useState, useEffect } from 'react';
import { AgeGroup, TravelPersona, UserProfileAgent } from '@/lib/agents/user-profile-agent';

interface PreSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: {
    ageGroup: AgeGroup;
    visitDate: string;
    visitDateEnd: string | null;
    persona: TravelPersona | null;
  }) => void;
}

export default function PreSearchModal({ isOpen, onClose, onComplete }: PreSearchModalProps) {
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [visitDate, setVisitDate] = useState('');
  const [visitDateEnd, setVisitDateEnd] = useState('');
  const [isDateRange, setIsDateRange] = useState(false);
  const [personas, setPersonas] = useState<TravelPersona[]>([]);

  useEffect(() => {
    if (isOpen) {
      const profileAgent = new UserProfileAgent();
      const profile = profileAgent.getProfile();
      if (profile.ageGroup) setAgeGroup(profile.ageGroup);
      if (profile.visitDate) setVisitDate(profile.visitDate);
      if (profile.visitDateEnd) {
        setVisitDateEnd(profile.visitDateEnd);
        setIsDateRange(true);
      }
      if (profile.personas && profile.personas.length > 0) {
        setPersonas(profile.personas);
      } else if (profile.persona) {
        // Migrate old single persona
        setPersonas([profile.persona]);
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ageGroup && visitDate) {
      const profileAgent = new UserProfileAgent();
      profileAgent.saveProfile({
        ageGroup,
        visitDate,
        visitDateEnd: isDateRange && visitDateEnd ? visitDateEnd : null,
        personas,
        persona: personas.length > 0 ? personas[0] : null, // Keep for backward compatibility
      });
      onComplete({
        ageGroup,
        visitDate,
        visitDateEnd: isDateRange && visitDateEnd ? visitDateEnd : null,
        persona: personas.length > 0 ? personas[0] : null, // Keep for backward compatibility
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Plan Your Trip</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Age Group */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Age Group <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(['under-18', '18-25', '26-40', '41-60', '60+'] as AgeGroup[]).map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setAgeGroup(age)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      ageGroup === age
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 hover:border-indigo-300'
                    }`}
                  >
                    {age === 'under-18' ? 'Under 18' : age.replace('-', '–')}
                  </button>
                ))}
              </div>
            </div>

            {/* Visit Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Visit <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <div>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isDateRange}
                    onChange={(e) => setIsDateRange(e.target.checked)}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-sm text-gray-700">Date range</span>
                </label>
                {isDateRange && (
                  <input
                    type="date"
                    value={visitDateEnd}
                    onChange={(e) => setVisitDateEnd(e.target.value)}
                    min={visitDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>
            </div>

            {/* Travel Persona */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Travel Persona (Optional - Select Multiple or None)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(['Adventure', 'Family', 'Romantic', 'Party', 'Budget', 'Luxury'] as TravelPersona[]).map(
                  (p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        if (personas.includes(p)) {
                          setPersonas(personas.filter(per => per !== p));
                        } else {
                          setPersonas([...personas, p]);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        personas.includes(p)
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 hover:border-indigo-300'
                      }`}
                    >
                      {p} {personas.includes(p) && '✓'}
                    </button>
                  )
                )}
              </div>
              {personas.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {personas.join(', ')}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={!ageGroup || !visitDate}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

