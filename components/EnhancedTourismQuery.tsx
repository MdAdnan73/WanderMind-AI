import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PreSearchModal from './PreSearchModal';
import LoginModal from './LoginModal';
import EnhancedWeatherCard from './EnhancedWeatherCard';
import AttractionsCard from './AttractionsCard';
import FoodNightlifeCard from './FoodNightlifeCard';
import RentalsCard from './RentalsCard';
import TransportCard from './TransportCard';
import EventsCard from './EventsCard';
import TrafficAdvisoryCard from './TrafficAdvisoryCard';
import HelplineCard from './HelplineCard';
import ItineraryCard from './ItineraryCard';
import { UserProfileAgent, AgeGroup, TravelPersona } from '@/lib/agents/user-profile-agent';
import { EnhancedTourismResponse } from '@/lib/agents/enhanced-parent-agent';
import { GeocodingResult } from '@/lib/agents/enhanced-geocoding-agent';

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

interface EnhancedTourismQueryProps {
  onBack?: () => void;
}

export default function EnhancedTourismQuery({ onBack }: EnhancedTourismQueryProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnhancedTourismResponse | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    ageGroup: AgeGroup;
    visitDate: string;
    visitDateEnd: string | null;
    persona: TravelPersona | null;
  } | null>(null);
  const [selectedPlaceIndex, setSelectedPlaceIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('tourism_user_logged_in');
    const name = localStorage.getItem('tourism_user_name');
    if (loggedIn === 'true' && name) {
      setIsLoggedIn(true);
      setUserName(name);
    }

    // Load user profile to display
    const profileAgent = new UserProfileAgent();
    const profile = profileAgent.getProfile();
    if (profile.ageGroup && profile.visitDate) {
      setUserProfile({
        ageGroup: profile.ageGroup,
        visitDate: profile.visitDate,
        visitDateEnd: profile.visitDateEnd,
        persona: profile.persona,
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    // First, geocode to get the place
    // Then show profile modal if needed
    setLoading(true);
    setResult(null);

    try {
      // Extract place name first using the same logic as the backend
      // This is a simplified version - the backend will do the actual extraction
      // But we need to check if we can geocode something
      
      // SIMPLE AND RELIABLE EXTRACTION - same as backend
      let placeToCheck = '';
      const lowerQuery = query.toLowerCase();
      
      // Find "going to go to" or "going to"
      const goingToGoToIndex = lowerQuery.indexOf('going to go to');
      const goingToIndex = lowerQuery.indexOf('going to');
      
      if (goingToGoToIndex !== -1) {
        const afterPhrase = query.substring(goingToGoToIndex + 'going to go to'.length).trim();
        const match = afterPhrase.match(/^([^,\.\?]+?)(?:\s*[,\.]|\s+(?:what|where|when|how|let'?s|lets|plan|is|there|are|can|will|the)|\s*$)/i);
        if (match && match[1]) {
          placeToCheck = match[1].trim();
        }
      } else if (goingToIndex !== -1) {
        const afterPhrase = query.substring(goingToIndex + 'going to'.length).trim();
        const match = afterPhrase.match(/^([^,\.\?]+?)(?:\s*[,\.]|\s+(?:what|where|when|how|let'?s|lets|plan|is|there|are|can|will|the)|\s*$)/i);
        if (match && match[1]) {
          placeToCheck = match[1].trim();
        }
      }
      
      // Try "visiting" if still no match
      if (!placeToCheck) {
        const visitingIndex = lowerQuery.indexOf('visiting');
        if (visitingIndex !== -1) {
          const afterPhrase = query.substring(visitingIndex + 'visiting'.length).trim();
          const match = afterPhrase.match(/^([^,\.\?]+?)(?:\s*[,\.]|\s+(?:what|where|when|how|let'?s|lets|plan|is|there|are|can|will|the)|\s*$)/i);
          if (match && match[1]) {
            placeToCheck = match[1].trim();
          }
        }
      }
      
      // Clean the extracted place name
      if (placeToCheck) {
        placeToCheck = placeToCheck.replace(/[.,!?;:]+$/, '').trim();
        placeToCheck = placeToCheck.replace(/\s+(what|where|when|how|let'?s|lets|plan|the|is|there|are|can|will|and|or)$/i, '').trim();
        placeToCheck = placeToCheck.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
      } else {
        // Fallback: use full query
        placeToCheck = query.trim();
      }

      // Quick geocode check with extracted place name
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeToCheck)}&format=json&limit=1`,
        {
          headers: {
            'User-Agent': 'Tourism-Multi-Agent-System/1.0',
          },
        }
      );

      const geocodeData = await geocodeResponse.json();
      
      if (!geocodeData || geocodeData.length === 0) {
        setResult({
          success: false,
          error: "I'm not sure this place exists.",
        });
        setLoading(false);
        return;
      }

      // Place exists, check if we need profile info
      const profileAgent = new UserProfileAgent();
      if (!profileAgent.isComplete()) {
        setLoading(false);
        setShowProfileModal(true);
        return;
      }

      // Profile exists, proceed with query
      const profile = profileAgent.getProfile();
      await executeQuery(profile.ageGroup!, profile.visitDate!, profile.visitDateEnd, profile.persona);
    } catch (error) {
      console.error('Error:', error);
      setResult({
        success: false,
        error: 'An error occurred. Please try again.',
      });
      setLoading(false);
    }
  };

  const executeQuery = async (
    ageGroup: AgeGroup,
    visitDate: string,
    visitDateEnd: string | null,
    persona: TravelPersona | null
  ) => {
    setLoading(true);

    try {
      const response = await fetch('/api/enhanced-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          queryText: query,
          ageGroup,
          visitDate,
          visitDateEnd,
          persona,
        }),
      });

      const data: EnhancedTourismResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({
        success: false,
        error: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileComplete = (profile: {
    ageGroup: AgeGroup;
    visitDate: string;
    visitDateEnd: string | null;
    persona: TravelPersona | null;
  }) => {
    setUserProfile(profile);
    setShowProfileModal(false);
    // Only execute query if we have a query string
    if (query.trim()) {
      executeQuery(profile.ageGroup, profile.visitDate, profile.visitDateEnd, profile.persona);
    }
  };

  const handlePlaceSelection = (index: number) => {
    setSelectedPlaceIndex(index);
    if (result?.geocoding?.candidates[index] && userProfile) {
      const selectedPlace = result.geocoding.candidates[index];
      setQuery(selectedPlace.displayName);
    }
  };

  const exportToPDF = async () => {
    if (!result || !isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;

      // Get all result cards container - find the parent div with space-y-6
      const resultsContainer = document.querySelector('.space-y-6');
      if (!resultsContainer) {
        alert('No content to export');
        return;
      }

      // Create a temporary container for PDF
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '800px';
      tempContainer.style.backgroundColor = '#f3f4f6';
      tempContainer.style.padding = '40px';
      document.body.appendChild(tempContainer);

      // Add title
      const title = document.createElement('h1');
      title.textContent = `Travel Itinerary: ${result.placeName || 'Trip'}`;
      title.style.fontSize = '28px';
      title.style.fontWeight = 'bold';
      title.style.marginBottom = '10px';
      title.style.color = '#1f2937';
      tempContainer.appendChild(title);

      // Add user info if available
      if (userProfile) {
        const userInfo = document.createElement('div');
        userInfo.style.marginBottom = '30px';
        userInfo.style.padding = '15px';
        userInfo.style.backgroundColor = '#ffffff';
        userInfo.style.borderRadius = '8px';
        userInfo.innerHTML = `
          <p style="margin: 5px 0;"><strong>Age Group:</strong> ${userProfile.ageGroup === 'under-18' ? 'Under 18' : userProfile.ageGroup.replace('-', '–')}</p>
          <p style="margin: 5px 0;"><strong>Visit Date:</strong> ${new Date(userProfile.visitDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}${userProfile.visitDateEnd ? ` - ${new Date(userProfile.visitDateEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : ''}</p>
          ${userProfile.persona ? `<p style="margin: 5px 0;"><strong>Persona:</strong> ${userProfile.persona}</p>` : ''}
        `;
        tempContainer.appendChild(userInfo);
      }

      // Clone all direct children of resultsContainer (all the cards)
      Array.from(resultsContainer.children).forEach(child => {
        const cloned = child.cloneNode(true) as HTMLElement;
        cloned.style.marginBottom = '30px';
        cloned.style.pageBreakInside = 'avoid';
        tempContainer.appendChild(cloned);
      });

      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        backgroundColor: '#f3f4f6',
      });
      
      // Clean up
      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`itinerary-${result.placeName || 'trip'}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handleLogin = (email: string, name: string) => {
    localStorage.setItem('tourism_user_logged_in', 'true');
    localStorage.setItem('tourism_user_name', name);
    localStorage.setItem('tourism_user_email', email);
    setIsLoggedIn(true);
    setUserName(name);
  };

  return (
    <div className="w-full">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back to Home
        </button>
      )}

      <PreSearchModal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          // Refresh profile display
          const profileAgent = new UserProfileAgent();
          const profile = profileAgent.getProfile();
          if (profile.ageGroup && profile.visitDate) {
            setUserProfile({
              ageGroup: profile.ageGroup,
              visitDate: profile.visitDate,
              visitDateEnd: profile.visitDateEnd,
              persona: profile.persona,
            });
          }
        }}
        onComplete={handleProfileComplete}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., I'm going to Bangalore, let's plan my trip"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : 'Search'}
          </button>
        </div>
      </form>

      {/* User Profile Display */}
      {userProfile && (
        <div className="mb-6 bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Age Group:</span>
              <span className="font-semibold text-gray-800">
                {userProfile.ageGroup === 'under-18' ? 'Under 18' : userProfile.ageGroup.replace('-', '–')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Visit Date:</span>
              <span className="font-semibold text-gray-800">
                {new Date(userProfile.visitDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
                {userProfile.visitDateEnd && (
                  <> - {new Date(userProfile.visitDateEnd).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</>
                )}
              </span>
            </div>
            {(() => {
              const profileAgent = new UserProfileAgent();
              const profile = profileAgent.getProfile();
              const personas = profile.personas || (profile.persona ? [profile.persona] : []);
              return personas.length > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Persona:</span>
                  <span className="font-semibold text-gray-800">{personas.join(', ')}</span>
                </div>
              ) : null;
            })()}
            <button
              onClick={() => setShowProfileModal(true)}
              className="ml-auto text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Edit
            </button>
          </div>
        </div>
      )}

      {/* Fuzzy Suggestions */}
      {result?.geocoding && result.geocoding.suggestions.length > 0 && !result.success && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="font-semibold text-gray-800 mb-2">Did you mean:</p>
          <div className="flex flex-wrap gap-2">
            {result.geocoding.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(suggestion);
                  handleSubmit(new Event('submit') as any);
                }}
                className="px-4 py-2 bg-white border border-yellow-300 rounded-lg hover:bg-yellow-100 transition-colors text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Multiple Place Candidates */}
      {result?.geocoding && result.geocoding.candidates.length > 1 && result.success && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="font-semibold text-gray-800 mb-2">Multiple locations found. Select one:</p>
          <div className="flex flex-wrap gap-2">
            {result.geocoding.candidates.slice(0, 3).map((candidate, index) => (
              <button
                key={index}
                onClick={() => handlePlaceSelection(index)}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  selectedPlaceIndex === index
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-blue-300 bg-white hover:bg-blue-100'
                }`}
              >
                {candidate.displayName.split(',')[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {result.error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
              <p className="font-semibold">Error</p>
              <p>{result.error}</p>
            </div>
          )}

          {result.success && (
            <>
              {/* Action Bar */}
              <div className="flex flex-wrap gap-3 bg-white p-4 rounded-lg shadow border border-gray-200">
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold"
                >
                  📄 Save as PDF {isLoggedIn && `(${userName})`}
                </button>
                {result.geocoding?.primary && (
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${result.geocoding.primary.latitude}&mlon=${result.geocoding.primary.longitude}&zoom=12`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                  >
                    🗺️ Open on Map
                  </a>
                )}
              </div>

              {/* Map - only for full planning */}
              {result.intent === 'full' && result.geocoding?.primary && (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Map</h2>
                  <div className="h-96 rounded-lg overflow-hidden">
                    <MapComponent
                      latitude={result.geocoding.primary.latitude}
                      longitude={result.geocoding.primary.longitude}
                      places={result.places || null}
                      rentals={result.rentals || null}
                    />
                  </div>
                </div>
              )}

              {/* Itinerary - only for full planning */}
              {result.intent === 'full' && result.itinerary && result.itinerary.length > 0 && (
                <ItineraryCard itinerary={result.itinerary} placeName={result.placeName || ''} />
              )}

              {/* Weather */}
              {result.weather && <EnhancedWeatherCard weather={result.weather} />}

              {/* Traffic Advisory - only for full planning */}
              {result.intent === 'full' && result.transport && <TrafficAdvisoryCard transport={result.transport} />}

              {/* Attractions */}
              {result.places && <AttractionsCard places={result.places} />}

              {/* Food & Nightlife - only for full planning */}
              {result.intent === 'full' && result.places && <FoodNightlifeCard places={result.places} />}

              {/* Events - only for full planning */}
              {result.intent === 'full' && result.events && <EventsCard events={result.events} />}

              {/* Transport - only for full planning */}
              {result.intent === 'full' && result.transport && <TransportCard transport={result.transport} />}

              {/* Rentals - only for full planning */}
              {result.intent === 'full' && result.rentals && <RentalsCard rentals={result.rentals} />}

              {/* Helplines - only for full planning */}
              {result.intent === 'full' && result.helplines && <HelplineCard helplines={result.helplines} />}
            </>
          )}
        </div>
      )}
    </div>
  );
}
