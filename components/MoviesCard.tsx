import { MoviesResult } from '@/lib/agents/movies-agent';

interface MoviesCardProps {
  movies: MoviesResult;
}

export default function MoviesCard({ movies }: MoviesCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Movies & Cinema</h2>
        <div className="text-4xl">🎬</div>
      </div>

      {movies.cinemas.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Nearby Cinemas</h3>
          <ul className="space-y-2">
            {movies.cinemas.map((cinema, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-indigo-600 font-bold mt-1">🎭</span>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{cinema.name}</p>
                  {cinema.address && (
                    <p className="text-sm text-gray-600 mt-1">{cinema.address}</p>
                  )}
                  {cinema.contact && (
                    <p className="text-xs text-gray-500 mt-1">Contact: {cinema.contact}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {movies.latestMovies.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Latest Releases</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {movies.latestMovies.map((movie, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                {movie.posterUrl && (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                )}
                <p className="font-semibold text-gray-800">{movie.title}</p>
                {movie.rating && (
                  <p className="text-sm text-gray-600 mt-1">⭐ {movie.rating}/10</p>
                )}
                {movie.overview && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{movie.overview}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {movies.cinemas.length === 0 && movies.latestMovies.length === 0 && (
        <p className="text-gray-600">No cinema information available for {movies.placeName}.</p>
      )}
    </div>
  );
}

