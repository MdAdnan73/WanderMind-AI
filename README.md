# Multi-Agent Tourism System

A comprehensive full-stack web application that uses a multi-agent architecture to provide personalized trip planning with weather information, tourist attractions, events, movies, transport, rentals, and more for any place in the world.

## 🌟 Features

### Core Features
- **Multi-Agent Architecture**: Implements separate specialized agents for different aspects of trip planning
- **Natural Language Processing**: Understands user queries with fuzzy matching and spell suggestions
- **Personalization**: Age-group and persona-based recommendations
- **Real-Time Data**: Fetches live data from multiple external APIs
- **Modern UI**: Clean, responsive design built with Next.js and Tailwind CSS
- **Interactive Maps**: Leaflet integration with OpenStreetMap
- **PDF Export**: Save your itinerary as PDF
- **Error Handling**: Graceful error handling with user-friendly messages

### New Features
- **Pre-Search Modal**: Collects age group, visit date, and travel persona before searching
- **Enhanced Geocoding**: Multiple candidate matches with fuzzy suggestions
- **Weather & Safety**: Current weather, 3-day forecast, UV index, and safety advice
- **Attractions**: Popular attractions and hidden gems
- **Food & Nightlife**: Restaurants and pubs with cuisine information
- **Events**: Eventbrite integration for concerts and festivals
- **Movies**: Latest releases and nearby cinemas via TMDB
- **Transport**: Metro/subway stations and traffic advisories
- **Rentals**: Bike and car rental locations
- **Helplines**: Emergency numbers and tourism helplines by country
- **Itinerary**: Personalized day plans with morning/afternoon/evening slots

## 🏗️ System Architecture

### Agents

1. **Enhanced Parent Agent (Tourism Orchestrator)**
   - Parses user input with enhanced place name extraction
   - Coordinates all sub-agents
   - Applies personalization filters based on age group and persona
   - Builds personalized itineraries
   - Handles errors and returns combined responses

2. **User Profile Agent**
   - Manages user preferences (age group, visit date, persona)
   - Stores data in localStorage
   - Provides age-based filtering rules

3. **Enhanced Geocoding Agent**
   - Uses Nominatim API with multiple candidate results
   - Implements fuzzy matching with Fuse.js
   - Provides spell suggestions when place not found

4. **Weather & Safety Agent**
   - Fetches current weather and 3-day forecast from Open-Meteo
   - Provides UV index and wind speed
   - Generates safety advice based on weather conditions and age group

5. **Enhanced Places Agent**
   - Fetches tourist attractions, hidden gems, restaurants, pubs, cinemas, rentals
   - Uses Overpass API for OpenStreetMap data
   - Supports OpenTripMap integration (optional)

6. **Events Agent**
   - Fetches events using Eventbrite API
   - Filters by location and date range
   - Graceful fallback if API key not provided

7. **Movies Agent**
   - Finds nearby cinemas using Overpass API
   - Fetches latest movie releases via TMDB API
   - Shows movie posters and ratings

8. **Transport & Traffic Agent**
   - Finds metro/subway stations
   - Provides traffic advisories based on visit date/time
   - Rule-based rush hour detection

9. **Rental Agent**
   - Finds bicycle and car rental locations
   - Provides estimated pricing

10. **Helpline Agent**
    - Provides emergency numbers by country
    - Includes police, medical, fire, and tourism helplines

11. **Input Parser Agent** (NEW)
    - Uses LLM (GPT/Gemini) to parse natural language input
    - Extracts place names and intent from any query format
    - Falls back to rule-based parsing if LLM keys not provided
    - Handles variations like "I'm going to go to Bangalore, what is the temperature there"

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tourism
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env.local` file for API keys:
```bash
cp env.example .env.local
```

Edit `.env.local` and add your API keys (optional):
```env
EVENTBRITE_KEY=your_eventbrite_api_key_here
TMDB_KEY=your_tmdb_api_key_here
OPENTRIPMAP_KEY=your_opentripmap_key_here
TRAFFIC_API_KEY=your_traffic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: 
- The application works with default functionality without API keys
- **LLM keys (OpenAI or Gemini) are highly recommended** for better natural language understanding
- Without LLM keys, the system uses rule-based parsing which may not handle all query variations
- Get OpenAI key: https://platform.openai.com/api-keys
- Get Gemini key: https://makersuite.google.com/app/apikey

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Usage

### First Time Setup

1. When you first visit, a modal will appear asking for:
   - **Age Group**: Select your age range
   - **Date of Visit**: Choose your travel date (single or range)
   - **Travel Persona**: Optional (Adventure, Family, Romantic, Party, Budget, Luxury)

2. This information is saved in your browser and used for personalized recommendations.

### Query Examples

The system now handles any natural language input format! Try these examples:

- "I'm going to go to Bangalore, let's plan my trip"
- "I'm going to go to Bangalore, what is the temperature there"
- "I'm going to go to Bangalore, what is the temperature there? And what are the places I can visit?"
- "What's the weather in Paris?"
- "Tell me about tourist attractions in Tokyo"
- "Plan my trip to New York"
- "I'm visiting London, what can I do?"

**Note**: With LLM API keys, the system can understand even more complex and varied query formats!

### Features

- **Fuzzy Matching**: If a place name is misspelled, the system suggests corrections
- **Multiple Locations**: If multiple places match, you can select the correct one
- **Personalized Results**: Results are filtered based on your age group and persona
- **Export Options**: Save your itinerary as PDF or download as JSON
- **Interactive Map**: View all locations on an interactive map

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Maps**: Leaflet with OpenStreetMap
- **PDF Export**: jsPDF + html2canvas
- **Fuzzy Matching**: Fuse.js
- **APIs**:
  - [Nominatim](https://nominatim.openstreetmap.org) - Geocoding (required)
  - [Open-Meteo](https://open-meteo.com) - Weather data (required)
  - [Overpass API](https://overpass-api.de) - Places, transport, rentals (required)
  - [Eventbrite](https://www.eventbrite.com/platform/api-keys/) - Events (optional)
  - [TMDB](https://www.themoviedb.org/settings/api) - Movies (optional)
  - [OpenTripMap](https://opentripmap.io/docs) - Enhanced places (optional)

## 📁 Project Structure

```
tourism/
├── components/              # React components
│   ├── PreSearchModal.tsx
│   ├── EnhancedTourismQuery.tsx
│   ├── EnhancedWeatherCard.tsx
│   ├── AttractionsCard.tsx
│   ├── FoodNightlifeCard.tsx
│   ├── RentalsCard.tsx
│   ├── TransportCard.tsx
│   ├── MoviesCard.tsx
│   ├── EventsCard.tsx
│   ├── TrafficAdvisoryCard.tsx
│   ├── HelplineCard.tsx
│   ├── ItineraryCard.tsx
│   └── MapComponent.tsx
├── lib/
│   └── agents/             # Agent implementations
│       ├── user-profile-agent.ts
│       ├── enhanced-geocoding-agent.ts
│       ├── weather-safety-agent.ts
│       ├── enhanced-places-agent.ts
│       ├── events-agent.ts
│       ├── movies-agent.ts
│       ├── transport-traffic-agent.ts
│       ├── rental-agent.ts
│       ├── helpline-agent.ts
│       └── enhanced-parent-agent.ts
├── pages/
│   ├── api/
│   │   ├── query.ts        # Original API endpoint
│   │   └── enhanced-query.ts  # Enhanced API endpoint
│   ├── _app.tsx
│   └── index.tsx           # Home page
├── styles/
│   └── globals.css         # Global styles
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## 🔧 API Endpoints

### POST /api/enhanced-query

Enhanced query endpoint with personalization.

**Request:**
```json
{
  "queryText": "I'm going to Bangalore next Friday, plan my trip",
  "ageGroup": "26-40",
  "visitDate": "2024-12-15",
  "visitDateEnd": null,
  "persona": "Adventure"
}
```

**Response:**
```json
{
  "success": true,
  "placeName": "Bangalore, Karnataka, India",
  "geocoding": { ... },
  "weather": { ... },
  "places": { ... },
  "events": { ... },
  "movies": { ... },
  "transport": { ... },
  "rentals": { ... },
  "helplines": { ... },
  "itinerary": [ ... ]
}
```

## 🐛 Error Handling

- Invalid place names return: "I'm not sure this place exists."
- Fuzzy suggestions provided when place not found
- API failures return meaningful error messages
- All errors are handled gracefully without breaking the UI
- Optional API keys have graceful fallbacks

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard (optional)
4. Vercel will automatically detect Next.js and deploy
5. No additional configuration needed

### Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard (optional)
6. Deploy

### Environment Variables

Add these in your deployment platform's environment variables section (all optional):
- `EVENTBRITE_KEY`
- `TMDB_KEY`
- `OPENTRIPMAP_KEY`
- `TRAFFIC_API_KEY`

## 📄 License

This project is created for educational purposes as part of an assignment.

## 🤝 Contributing

This is an assignment project. For questions or issues, please contact the project maintainer.

## 📚 API Keys (Optional)

### Getting API Keys

1. **Eventbrite**: 
   - Sign up at https://www.eventbrite.com
   - Go to https://www.eventbrite.com/platform/api-keys/
   - Create a new API key

2. **TMDB (The Movie Database)**:
   - Sign up at https://www.themoviedb.org
   - Go to Settings > API
   - Request an API key

3. **OpenTripMap**:
   - Sign up at https://opentripmap.io
   - Get your API key from the dashboard

**Note**: The app works without these keys, but adding them enhances functionality.
