# Quick Start Guide

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm start
```

## Example Queries to Try

1. **Weather and Places:**
   - "I'm going to Bangalore, what's the temperature and what can I visit?"
   - "Tell me about the weather and tourist attractions in Paris"

2. **Weather Only:**
   - "What's the weather in Tokyo?"
   - "What's the temperature in New York?"

3. **Places Only:**
   - "What places can I visit in London?"
   - "Tell me about tourist attractions in Mumbai"

## Project Structure

- `/lib/agents` - All agent implementations
- `/pages/api` - API routes
- `/pages` - Next.js pages
- `/components` - React components
- `/styles` - Global styles

## API Endpoints

- `POST /api/query` - Main query endpoint

## Environment Variables (Optional)

Create `.env.local`:
```
NOMINATIM_API_URL=https://nominatim.openstreetmap.org
OPEN_METEO_API_URL=https://api.open-meteo.com
OVERPASS_API_URL=https://overpass-api.de/api/interpreter
```

Note: Default values are already configured, so this is optional.

