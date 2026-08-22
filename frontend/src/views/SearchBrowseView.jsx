import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const SearchBrowseView = () => {
  const {
    cities,
    activities,
    trips,
    selectedTripId,
    addActivityToSection,
    toggleSaveDestination,
    viewParams,
    navigateTo,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('activities'); // 'activities' or 'cities'
  const [searchQuery, setSearchQuery] = useState(viewParams.initialSearch || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedSort, setSelectedSort] = useState('rating'); // 'rating', 'price-asc', 'price-desc'

  const [selectedTripModalActivity, setSelectedTripModalActivity] = useState(null);
  const [targetTripId, setTargetTripId] = useState(selectedTripId || trips[0]?.id);
  const [targetSectionId, setTargetSectionId] = useState('');

  const targetTrip = trips.find((t) => t.id === targetTripId) || trips[0];

  // Activities Filtering & Sorting
  const filteredActivities = activities
    .filter((act) => {
      const matchesSearch =
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || act.category.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (selectedSort === 'rating') return b.rating - a.rating;
      if (selectedSort === 'price-asc') return a.cost - b.cost;
      if (selectedSort === 'price-desc') return b.cost - a.cost;
      return 0;
    });

  // Cities Filtering & Region Filtering (PDF Page 4)
  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || city.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const categories = [
    'All',
    'Royal Heritage',
    'Adventure',
    'Food',
    'Nature',
    'Backwaters',
    'Spiritual',
    'Sightseeing'
  ];

  const regions = ['All', 'North India', 'South India', 'West India'];

  const handleOpenAddModal = (activity) => {
    setSelectedTripModalActivity(activity);
    if (targetTrip?.sections && targetTrip.sections.length > 0) {
      setTargetSectionId(targetTrip.sections[0].id);
    }
  };

  const handleConfirmAddToTrip = () => {
    if (!selectedTripModalActivity || !targetSectionId) {
      showToast('Please select a valid day stop in your trip.', 'error');
      return;
    }

    addActivityToSection(targetTripId, targetSectionId, {
      title: selectedTripModalActivity.title,
      category: selectedTripModalActivity.category,
      time: selectedTripModalActivity.timeOfDay === 'Morning' ? '09:00 - 12:30' : '16:00 - 19:30',
      cost: selectedTripModalActivity.cost,
      notes: selectedTripModalActivity.description
    });

    setSelectedTripModalActivity(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER & SEARCH CONTROLS (PDF Page 4: City Search & Activity Search) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              🔍 PDF Section 7 & 8: City Search & Activity Search in India
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Indian Destinations & Curated Experiences
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Filter by region, category, budget (₹ INR), and attach directly to your itinerary stops.
            </p>
          </div>

          {/* Toggle between Activities & Cities */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'activities'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎡 Experiences & Tours ({activities.length})
            </button>
            <button
              onClick={() => setActiveTab('cities')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'cities'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏙️ Indian Cities ({cities.length})
            </button>
          </div>
        </div>

        {/* Search Bar with Filter & Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          <div className="md:col-span-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Indian forts, treks, street food, temples, or cities..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <span className="absolute left-3.5 top-3.5 text-slate-400">🔍</span>
          </div>

          {activeTab === 'activities' ? (
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-3 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 outline-none text-slate-700 font-medium"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    Category: {c}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="md:col-span-3">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-3 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 outline-none text-slate-700 font-medium"
              >
                {regions.map((r) => (
                  <option key={r} value={r}>
                    Region: {r}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="md:col-span-3">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full px-3 py-3 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 outline-none text-slate-700 font-medium"
            >
              <option value="rating">Sort by: Top Rated ⭐</option>
              <option value="price-asc">Sort by: Price Low to High (₹) 💲</option>
              <option value="price-desc">Sort by: Price High to Low (₹) 💎</option>
            </select>
          </div>
        </div>
      </div>

      {/* ACTIVITY SEARCH RESULTS LIST */}
      {activeTab === 'activities' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Indian Experiences Results ({filteredActivities.length} available)
            </h3>
            <span className="text-xs text-slate-400">All pricing in ₹ INR</span>
          </div>

          {filteredActivities.length > 0 ? (
            <div className="space-y-4">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 group"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover flex-shrink-0 shadow-inner group-hover:scale-105 transition duration-300"
                    />
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                          {act.category}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">📍 {act.cityName}</span>
                        <span className="text-xs text-amber-500 font-bold flex items-center gap-0.5">
                          ⭐ {act.rating}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 leading-snug">{act.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {act.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 pt-0.5">
                        <span>🕒 {act.duration}</span>
                        <span>•</span>
                        <span>Time: {act.timeOfDay}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Cost (₹) & "Add to trip" */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Cost / Person</span>
                      <span className="text-lg font-black text-slate-900">
                        {act.cost === 0 ? 'FREE' : `₹${act.cost}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAddModal(act)}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition whitespace-nowrap"
                      >
                        + Add to Trip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
              <p className="text-sm text-slate-500">No experiences found matching your query.</p>
            </div>
          )}
        </div>
      ) : (
        /* CITY SEARCH CARDS (PDF Page 4) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCities.map((city) => (
            <div
              key={city.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-44">
                <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => toggleSaveDestination(city)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-rose-500 flex items-center justify-center text-sm shadow"
                >
                  ❤️
                </button>
                <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-white text-xs rounded font-bold">
                  ⭐ {city.rating}
                </div>
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{city.name}</h4>
                  <p className="text-xs text-slate-500">{city.state} • {city.region}</p>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5">{city.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">₹{city.avgCostPerDay} / day</span>
                  <button
                    onClick={() =>
                      navigateTo('create-trip', {
                        suggestedDestination: `${city.name}, ${city.state}`
                      })
                    }
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-xl transition"
                  >
                    + Add to Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD TO TRIP MODAL */}
      {selectedTripModalActivity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-slate-900">Add to Indian Itinerary</h3>
              <button
                onClick={() => setSelectedTripModalActivity(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={selectedTripModalActivity.image}
                alt={selectedTripModalActivity.title}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  {selectedTripModalActivity.title}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {selectedTripModalActivity.category} • ₹{selectedTripModalActivity.cost}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Target Trip</label>
                <select
                  value={targetTripId}
                  onChange={(e) => {
                    setTargetTripId(e.target.value);
                    const t = trips.find((item) => item.id === e.target.value);
                    if (t?.sections && t.sections.length > 0) {
                      setTargetSectionId(t.sections[0].id);
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white outline-none font-medium"
                >
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.destination})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Select Day Stop
                </label>
                <select
                  value={targetSectionId}
                  onChange={(e) => setTargetSectionId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white outline-none font-medium"
                >
                  {targetTrip?.sections && targetTrip.sections.length > 0 ? (
                    targetTrip.sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        Day {sec.dayNumber}: {sec.title}
                      </option>
                    ))
                  ) : (
                    <option value="">No sections available</option>
                  )}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setSelectedTripModalActivity(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAddToTrip}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Confirm Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
