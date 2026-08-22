import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const LandingView = () => {
  const { navigateTo, cities, trips, toggleSaveDestination, userProfile, setSelectedTripId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || city.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const regions = ['All', 'North India', 'South India', 'West India'];

  const ongoingTrip = trips.find((t) => t.status === 'ongoing') || trips[0];

  return (
    <div className="space-y-12 pb-16">
      {/* SCREEN 3: HERO BANNER SECTION (INDIAN THEME) */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl mx-4 sm:mx-6 lg:mx-8 mt-6">
        <div
          className="relative min-h-[480px] sm:min-h-[520px] flex items-center justify-center text-center px-4 sm:px-8 py-16 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600&auto=format&fit=crop&q=80')`
          }}
        >
          {/* Hero Content */}
          <div className="max-w-3xl space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-semibold backdrop-blur-md">
              <span>🇮🇳 Discover Incredible India with Personalized Itineraries</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight font-serif">
              Namaste {userProfile.firstName}! <br />
              <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-amber-300 bg-clip-text text-transparent italic">
                Plan Your Dream Indian Journey.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              From Royal Rajasthan havelis to serene Kerala backwaters, snow-clad Manali slopes, and Goa sunsets—tailor multi-city stops, track daily budgets in ₹ INR, and explore India with ease.
            </p>

            {/* Quick Search Bar */}
            <div className="bg-white/95 backdrop-blur-md p-2 sm:p-3 rounded-2xl shadow-2xl border border-white/40 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2">
                <span className="text-slate-400">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Indian destinations (e.g. Goa, Jaipur, Manali, Ladakh, Kerala)..."
                  className="w-full text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
                />
              </div>
              <button
                onClick={() => navigateTo('search-browse', { initialSearch: searchQuery })}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm rounded-xl shadow-md transition whitespace-nowrap"
              >
                Search Destinations
              </button>
            </div>

            {/* Quick Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigateTo('create-trip')}
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <span>➕</span> Plan New Trip
              </button>
              <button
                onClick={() => navigateTo('community')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 backdrop-blur-md transition flex items-center gap-2"
              >
                <span>👥</span> Indian Community Itineraries
              </button>
            </div>
          </div>
        </div>
      </div>

      

      {/* TOP REGIONAL ADAPTORS & RECOMMENDED DESTINATIONS (Screen 3 & PDF Page 3) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Recommended Indian Destinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Curated travel spots across North, South, West, and Central India
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl overflow-x-auto">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  selectedRegion === region
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* City Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCities.map((city) => (
            <div
              key={city.id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-200/80 overflow-hidden transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-bold">
                  {city.badge || city.state}
                </div>
                <button
                  onClick={() => toggleSaveDestination(city)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-rose-500 hover:bg-white transition shadow-sm"
                  title="Save to Wishlist"
                >
                  ❤️
                </button>
                <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold flex items-center gap-1">
                  <span>⭐</span> {city.rating} ({city.reviews})
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-600 transition">
                      {city.name}
                    </h3>
                    <span className="text-xs text-slate-500">{city.state}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {city.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Avg Cost / Day</span>
                    <span className="font-bold text-slate-800">₹{city.avgCostPerDay}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Best Season</span>
                    <span className="font-bold text-slate-800">{city.bestTimeToVisit.split('(')[0]}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() =>
                      navigateTo('create-trip', {
                        suggestedDestination: `${city.name}, ${city.state}`,
                        suggestedCity: city
                      })
                    }
                    className="w-full py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-xl transition text-center"
                  >
                    + Plan Trip
                  </button>
                  <button
                    onClick={() => navigateTo('search-browse', { initialSearch: city.name })}
                    className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition text-center"
                  >
                    View Places
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT TRIPS SECTION (Screen 3 & PDF Page 3) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              My Recent Indian Journeys
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Access your ongoing, upcoming departures, and completed memories
            </p>
          </div>
          <button
            onClick={() => navigateTo('my-trips')}
            className="text-xs sm:text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline"
          >
            View All Trips ({trips.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trips.slice(0, 3).map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden hover:shadow-lg transition flex flex-col justify-between"
            >
              <div className="relative h-44">
                <img
                  src={trip.coverImage}
                  alt={trip.title}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    trip.status === 'ongoing'
                      ? 'bg-emerald-500 text-white'
                      : trip.status === 'upcoming'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {trip.status}
                </span>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold">
                  {trip.startDate} ~ {trip.endDate}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{trip.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <span>📍</span> {trip.destination}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Budget</span>
                    <span className="font-bold text-slate-800">₹{trip.budgetTotal?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Stops / Days</span>
                    <span className="font-bold text-teal-600">{trip.sections?.length || 0} Days</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Travelers</span>
                    <span className="font-bold text-slate-800">{trip.travelers} Persons</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSelectedTripId(trip.id);
                      navigateTo('builder', { tripId: trip.id });
                    }}
                    className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition text-center"
                  >
                    Edit Itinerary
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTripId(trip.id);
                      navigateTo('itinerary-detail', { tripId: trip.id });
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition text-center"
                  >
                    Budget
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
