/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NOMINATIM_API_URL: process.env.NOMINATIM_API_URL || 'https://nominatim.openstreetmap.org',
    OPEN_METEO_API_URL: process.env.OPEN_METEO_API_URL || 'https://api.open-meteo.com',
    OVERPASS_API_URL: process.env.OVERPASS_API_URL || 'https://overpass-api.de/api/interpreter',
    EVENTBRITE_KEY: process.env.EVENTBRITE_KEY,
    TMDB_KEY: process.env.TMDB_KEY,
    OPENTRIPMAP_KEY: process.env.OPENTRIPMAP_KEY,
    TRAFFIC_API_KEY: process.env.TRAFFIC_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
}

module.exports = nextConfig

