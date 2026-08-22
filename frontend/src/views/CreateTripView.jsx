import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const CreateTripView = () => {
  const { viewParams, createTrip, cities, activities, validateDateRange, showToast } = useApp();

  const [tripName, setTripName] = useState(
    viewParams.suggestedDestination ? `Trip to ${viewParams.suggestedDestination}` : 'Royal Rajasthan Forts & Desert Odyssey'
  );
  const [selectedPlace, setSelectedPlace] = useState(viewParams.suggestedDestination || 'Jaipur, Rajasthan');
  const [startDate, setStartDate] = useState('2026-10-12');
  const [endDate, setEndDate] = useState('2026-10-18');
  const [budgetTotal, setBudgetTotal] = useState(30000);
  const [travelers, setTravelers] = useState(2);
  const [description, setDescription] = useState('Exploring heritage forts, enjoying traditional Dal Baati Churma, and taking camel safaris.');
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [selectedSuggestions, setSelectedSuggestions] = useState(['act-ind-3', 'act-ind-4']);

  // Validation errors
  const [errors, setErrors] = useState({});

  const matchingCityName = selectedPlace.split(',')[0].trim();
  const suggestedActivities = activities.filter(
    (act) => act.cityName.toLowerCase() === matchingCityName.toLowerCase()
  );

  const fallbackActivities = suggestedActivities.length > 0 ? suggestedActivities : activities.slice(0, 6);

  const toggleSuggestion = (actId) => {
    if (selectedSuggestions.includes(actId)) {
      setSelectedSuggestions(selectedSuggestions.filter((id) => id !== actId));
    } else {
      setSelectedSuggestions([...selectedSuggestions, actId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!tripName.trim() || tripName.trim().length < 3) {
      newErrors.tripName = 'Trip name must be at least 3 characters long.';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required.';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required.';
    } else if (!validateDateRange(startDate, endDate)) {
      newErrors.endDate = 'End date cannot be earlier than start date.';
    }

    if (!budgetTotal || Number(budgetTotal) <= 500) {
      newErrors.budgetTotal = 'Please provide a realistic budget of at least ₹1,000 INR.';
    }

    if (!travelers || Number(travelers) < 1) {
      newErrors.travelers = 'Must have at least 1 traveler.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fix the highlighted trip fields.', 'error');
      return;
    }

    setErrors({});

    // Map selected suggestions into initial day-1 activities
    const initialActivitiesList = fallbackActivities
      .filter((a) => selectedSuggestions.includes(a.id))
      .map((a) => ({
        id: `act-${Date.now()}-${a.id}`,
        title: a.title,
        category: a.category,
        time: a.timeOfDay === 'Morning' ? '09:00 - 12:30' : '17:00 - 20:00',
        cost: a.cost,
        notes: a.description
      }));

    const matchingCity = cities.find(
      (c) => c.name.toLowerCase() === matchingCityName.toLowerCase()
    );

    createTrip({
      title: tripName,
      destination: selectedPlace,
      startDate,
      endDate,
      budgetTotal: Number(budgetTotal),
      travelers: Number(travelers),
      notes: description,
      coverImage: customCoverUrl.trim() || matchingCity?.image || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
      initialActivities: initialActivitiesList
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* SCREEN 4 & PDF PAGE 3: CREATE TRIP SCREEN */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-700 p-8 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧳</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Create a New Trip in India</h1>
              
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8" noValidate>
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <span>📝</span> Trip Essentials & Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Trip Name *
                </label>
                <input
                  type="text"
                  value={tripName}
                  onChange={(e) => {
                    setTripName(e.target.value);
                    if (errors.tripName) setErrors({ ...errors, tripName: null });
                  }}
                  placeholder="e.g. Royal Jaipur & Udaipur Heritage Tour"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.tripName ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                  } focus:ring-2 focus:ring-teal-500 text-sm outline-none font-medium`}
                  required
                />
                {errors.tripName && <p className="text-rose-500 text-[11px] font-semibold mt-1">⚠️ {errors.tripName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Primary Destination / City *
                </label>
                <select
                  value={selectedPlace}
                  onChange={(e) => setSelectedPlace(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm outline-none bg-white font-medium"
                >
                  {cities.map((city) => (
                    <option key={city.id} value={`${city.name}, ${city.state}`}>
                      {city.name}, {city.state} ({city.region})
                    </option>
                  ))}
                  <option value="Agra & Taj Mahal, Uttar Pradesh">Agra & Taj Mahal, Uttar Pradesh (North)</option>
                  <option value="Hampi & Badami, Karnataka">Hampi & Badami, Karnataka (South)</option>
                  <option value="Darjeeling & Gangtok, Sikkim">Darjeeling & Gangtok, Sikkim (East)</option>
                  <option value="Rann of Kutch, Gujarat">Rann of Kutch, Gujarat (West)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (errors.startDate) setErrors({ ...errors, startDate: null });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.startDate ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                  } focus:ring-2 focus:ring-teal-500 text-sm outline-none`}
                  required
                />
                {errors.startDate && <p className="text-rose-500 text-[11px] font-semibold mt-1">⚠️ {errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  End Date *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (errors.endDate) setErrors({ ...errors, endDate: null });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.endDate ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                  } focus:ring-2 focus:ring-teal-500 text-sm outline-none`}
                  required
                />
                {errors.endDate && <p className="text-rose-500 text-[11px] font-semibold mt-1">⚠️ {errors.endDate}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Estimated Budget (₹ INR) *
                </label>
                <input
                  type="number"
                  value={budgetTotal}
                  onChange={(e) => {
                    setBudgetTotal(e.target.value);
                    if (errors.budgetTotal) setErrors({ ...errors, budgetTotal: null });
                  }}
                  min="1000"
                  step="500"
                  placeholder="₹ 25,000"
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.budgetTotal ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                  } focus:ring-2 focus:ring-teal-500 text-sm outline-none font-bold text-slate-800`}
                />
                {errors.budgetTotal && <p className="text-rose-500 text-[11px] font-semibold mt-1">⚠️ {errors.budgetTotal}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Travelers Count
                </label>
                <input
                  type="number"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  min="1"
                  max="25"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm outline-none font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* SCREEN 4 WIREFRAME: SUGGESTIONS FOR PLACES TO VISIT / ACTIVITIES IN INDIA */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>💡</span> Popular Experiences in {matchingCityName}
                </h3>
                <p className="text-xs text-slate-500">
                  Select experiences to automatically schedule into your Day 1 itinerary.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-teal-100 text-teal-800 rounded-lg">
                {selectedSuggestions.length} activities selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fallbackActivities.map((act) => {
                const isSelected = selectedSuggestions.includes(act.id);
                return (
                  <div
                    key={act.id}
                    onClick={() => toggleSuggestion(act.id)}
                    className={`cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/50 shadow-md ring-2 ring-teal-400/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={act.image}
                        alt={act.title}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-teal-700">{act.category}</span>
                          <span className="text-xs">{isSelected ? '✅' : '⚪'}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">{act.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {act.duration} • {act.cost === 0 ? 'FREE' : `₹${act.cost}`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-4">
            <button
              type="submit"
              className="px-8 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 transition transform active:scale-95 text-sm flex items-center gap-2"
            >
              <span>🚀</span> Save Trip & Build Itinerary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
