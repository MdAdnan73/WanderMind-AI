/**
 * Movies Agent
 * Finds cinemas and latest movies using TMDB API
 */

export interface Cinema {
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  contact?: string;
}

export interface Movie {
  title: string;
  overview?: string;
  releaseDate?: string;
  rating?: number;
  posterUrl?: string;
}

export interface MoviesResult {
  cinemas: Cinema[];
  latestMovies: Movie[];
  placeName: string;
  hasData: boolean;
}

export class MoviesAgent {
  private tmdbKey?: string;
  private tmdbUrl = 'https://api.themoviedb.org/3';
  private overpassUrl: string;

  constructor(tmdbKey?: string, overpassUrl?: string) {
    this.tmdbKey = tmdbKey;
    this.overpassUrl = overpassUrl || 'https://overpass-api.de/api/interpreter';
  }

  /**
   * Get cinemas and latest movies
   */
  async getMovies(
    latitude: number,
    longitude: number,
    placeName: string
  ): Promise<MoviesResult> {
    const [cinemas, movies] = await Promise.all([
      this.getCinemas(latitude, longitude),
      this.getLatestMovies(),
    ]);

    return {
      cinemas: cinemas.slice(0, 5),
      latestMovies: movies.slice(0, 5),
      placeName,
      hasData: cinemas.length > 0 || movies.length > 0,
    };
  }

  private async getCinemas(latitude: number, longitude: number): Promise<Cinema[]> {
    const query = `[out:json][timeout:25];
(
  node["amenity"="cinema"](around:10000,${latitude},${longitude});
  way["amenity"="cinema"](around:10000,${latitude},${longitude});
);
out body;
>;
out skel qt;`;

    try {
      const response = await fetch(this.overpassUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();

      if (!data || !data.elements) {
        return [];
      }

      return data.elements
        .filter((element: any) => element.tags && element.tags.name)
        .map((element: any) => {
          const lat = element.lat || (element.center && element.center.lat);
          const lon = element.lon || (element.center && element.center.lon);

          return {
            name: element.tags.name,
            address: element.tags['addr:full'] || element.tags['addr:street'],
            latitude: lat ? parseFloat(lat) : 0,
            longitude: lon ? parseFloat(lon) : 0,
            contact: element.tags.phone || element.tags.website,
          };
        })
        .filter((c: Cinema) => c.latitude !== 0 && c.longitude !== 0);
    } catch (error) {
      console.error('Cinema fetch error:', error);
      return [];
    }
  }

  private async getLatestMovies(): Promise<Movie[]> {
    if (!this.tmdbKey) {
      return [];
    }

    try {
      const url = `${this.tmdbUrl}/movie/now_playing?api_key=${this.tmdbKey}&language=en-US&page=1`;

      const response = await fetch(url);

      if (!response.ok) {
        return [];
      }

      const data = await response.json();

      if (!data || !data.results) {
        return [];
      }

      return data.results.map((movie: any) => ({
        title: movie.title,
        overview: movie.overview?.substring(0, 150),
        releaseDate: movie.release_date,
        rating: movie.vote_average,
        posterUrl: movie.poster_path
          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
          : undefined,
      }));
    } catch (error) {
      console.error('TMDB API error:', error);
      return [];
    }
  }
}

