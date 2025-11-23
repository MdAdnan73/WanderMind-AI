import { useState, useEffect } from 'react';

interface NewsItem {
  title: string;
  description: string;
  source: string;
  date: string;
  url?: string;
}

interface Concert {
  name: string;
  artist: string;
  date: string;
  location: string;
  url?: string;
}

export default function HomePage({ onStartPlanning }: { onStartPlanning: () => void }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tourism news and concerts
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    // Simulated news data - in production, you'd fetch from a news API
    const mockNews: NewsItem[] = [
      {
        title: 'Global Tourism Recovery Continues in 2024',
        description: 'International tourism is showing strong signs of recovery with record numbers of travelers exploring new destinations.',
        source: 'Tourism Today',
        date: new Date().toLocaleDateString(),
      },
      {
        title: 'Sustainable Travel Trends on the Rise',
        description: 'More travelers are choosing eco-friendly accommodations and carbon-neutral travel options.',
        source: 'Travel Weekly',
        date: new Date(Date.now() - 86400000).toLocaleDateString(),
      },
      {
        title: 'New Visa-Free Destinations Announced',
        description: 'Several countries have announced visa-free travel for tourists, making international travel easier.',
        source: 'World Travel News',
        date: new Date(Date.now() - 172800000).toLocaleDateString(),
      },
    ];

    // Simulated concerts - in production, fetch from Eventbrite or similar
    const mockConcerts: Concert[] = [
      {
        name: 'Summer Music Festival',
        artist: 'Various Artists',
        date: new Date(Date.now() + 7 * 86400000).toLocaleDateString(),
        location: 'Multiple Cities',
      },
      {
        name: 'Jazz Night',
        artist: 'The Jazz Collective',
        date: new Date(Date.now() + 14 * 86400000).toLocaleDateString(),
        location: 'New York, USA',
      },
      {
        name: 'Rock Concert Series',
        artist: 'Rock Legends Tour',
        date: new Date(Date.now() + 21 * 86400000).toLocaleDateString(),
        location: 'Los Angeles, USA',
      },
    ];

    setNews(mockNews);
    setConcerts(mockConcerts);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          🌍 Plan Your Perfect Trip
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Get personalized travel recommendations with weather, attractions, events, and more for any destination worldwide.
        </p>
        <button
          onClick={onStartPlanning}
          className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
        >
          Start Planning Your Trip
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="text-4xl mb-3">🌤️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Weather Forecast</h3>
          <p className="text-gray-600">Get detailed weather information and safety advice for your destination.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="text-4xl mb-3">📍</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Attractions & Hidden Gems</h3>
          <p className="text-gray-600">Discover popular attractions and local hidden gems.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Events & Activities</h3>
          <p className="text-gray-600">Find concerts, festivals, and events happening during your visit.</p>
        </div>
      </div>

      {/* Latest Concerts */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🎵 Upcoming Concerts</h2>
        {loading ? (
          <p className="text-gray-600">Loading concerts...</p>
        ) : concerts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {concerts.map((concert, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-1">{concert.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{concert.artist}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>📅 {concert.date}</span>
                  <span>📍 {concert.location}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No upcoming concerts found.</p>
        )}
      </div>

      {/* Tourism News */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📰 Tourism News</h2>
        {loading ? (
          <p className="text-gray-600">Loading news...</p>
        ) : news.length > 0 ? (
          <div className="space-y-4">
            {news.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No news available.</p>
        )}
      </div>
    </div>
  );
}

