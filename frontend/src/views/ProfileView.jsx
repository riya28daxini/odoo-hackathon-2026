import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ProfileView = () => {
  const {
    userProfile,
    updateUserProfile,
    deleteAccount,
    trips,
    setSelectedTripId,
    navigateTo,
    toggleSaveDestination,
    validateEmail,
    validateIndianPhone,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'edit', 'saved', 'settings', 'danger'

  // Edit form state
  const [editForm, setEditForm] = useState({
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    email: userProfile.email,
    phone: userProfile.phone,
    city: userProfile.city,
    country: 'India',
    bio: userProfile.bio,
    avatar: userProfile.avatar,
    language: userProfile.language || 'English (India)',
    currency: 'INR (₹)'
  });

  const [editErrors, setEditErrors] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const plannedTrips = trips.filter((t) => t.status === 'upcoming' || t.status === 'ongoing');
  const previousTrips = trips.filter((t) => t.status === 'completed');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const errors = {};

    if (!editForm.firstName.trim()) errors.firstName = 'First name is required';
    if (!editForm.lastName.trim()) errors.lastName = 'Last name is required';
    if (!editForm.email.trim() || !validateEmail(editForm.email)) {
      errors.email = 'Valid email is required';
    }
    if (!editForm.phone.trim() || !validateIndianPhone(editForm.phone)) {
      errors.phone = 'Valid 10-digit mobile number required';
    }

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      showToast('Please fix the errors in the profile form.', 'error');
      return;
    }

    setEditErrors({});
    updateUserProfile(editForm);
    setActiveTab('overview');
  };

  const indianLanguagesList = [
    { code: 'en-in', name: 'English (India)', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* SCREEN 7 & PDF PAGE 5/6: USER PROFILE HEADER */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Cover / Backdrop */}
        <div className="h-40 bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-700 relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setActiveTab('edit')}
              className="px-4 py-2 bg-white/90 hover:bg-white text-slate-800 text-xs font-bold rounded-xl shadow-md backdrop-blur-md transition flex items-center gap-1.5"
            >
              <span>✏️</span> Edit Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl backdrop-blur-md border border-white/20 transition flex items-center gap-1.5"
            >
              <span>⚙️</span> Settings & Languages
            </button>
          </div>
        </div>

        {/* Profile Info Bar */}
        <div className="px-6 sm:px-10 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-14 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <img
                src={userProfile.avatar}
                alt={userProfile.firstName}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
              />
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {userProfile.firstName} {userProfile.lastName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                    🇮🇳 Verified Indian Traveler
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>📍 {userProfile.city}, India</span>
                  <span>•</span>
                  <span>✉️ {userProfile.email}</span>
                  <span>•</span>
                  <span>📱 {userProfile.phone}</span>
                </p>
              </div>
            </div>

            {/* Travel Score Badge */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center text-xl font-bold">
                🇮🇳
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Explorer Rank</span>
                <span className="text-sm font-extrabold text-slate-800">{userProfile.travelScore} pts (Level 9)</span>
              </div>
            </div>
          </div>

          {/* User Bio */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            {userProfile.bio}
          </p>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-xl font-extrabold text-teal-600 block">{userProfile.placesVisitedCount}</span>
              <span className="text-[11px] font-bold text-slate-500">States Explored</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-xl font-extrabold text-slate-900 block">{trips.length}</span>
              <span className="text-[11px] font-bold text-slate-500">Total Indian Trips</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-xl font-extrabold text-teal-600 block">{userProfile.savedDestinations?.length || 0}</span>
              <span className="text-[11px] font-bold text-slate-500">Wishlist Places</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-xl font-extrabold text-slate-900 block">{userProfile.reviewsCount}</span>
              <span className="text-[11px] font-bold text-slate-500">Community Reviews</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-slate-200 bg-slate-50 px-6 sm:px-10 overflow-x-auto">
          {[
            { id: 'overview', label: 'Trips Overview', icon: '🗺️' },
            { id: 'saved', label: `Saved Destinations (${userProfile.savedDestinations?.length || 0})`, icon: '❤️' },
            { id: 'edit', label: 'Edit Profile Information', icon: '👤' },
            { id: 'settings', label: 'Language & Indian Preferences', icon: '🌐' },
            { id: 'danger', label: 'Account Safety & Delete', icon: '⚠️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-700 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: PLANNED TRIPS & PREVIOUS TRIPS */}
      {activeTab === 'overview' && (
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <span>✈️</span> Active & Planned Indian Trips
                </h3>
                <p className="text-xs text-slate-500">Upcoming departures and ongoing itineraries</p>
              </div>
              <button
                onClick={() => navigateTo('create-trip')}
                className="text-xs font-bold text-teal-600 hover:underline"
              >
                + Plan Another Trip
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plannedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div className="relative h-44">
                    <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase">
                      {trip.status}
                    </span>
                  </div>
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{trip.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">📍 {trip.destination}</p>
                      <p className="text-xs text-slate-400 mt-1">📅 {trip.startDate} - {trip.endDate}</p>
                      <p className="text-xs font-bold text-teal-700 mt-1">Budget: ₹{trip.budgetTotal?.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setSelectedTripId(trip.id);
                          navigateTo('builder', { tripId: trip.id });
                        }}
                        className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition"
                      >
                        View Itinerary
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Trips Section */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <span>🏆</span> Completed Indian Trips & Memories
              </h3>
              <p className="text-xs text-slate-500">Archived travel logs and completed itineraries</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {previousTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col justify-between opacity-90 hover:opacity-100 transition"
                >
                  <div className="relative h-44">
                    <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 text-[10px] font-bold uppercase">
                      ✓ Completed
                    </span>
                  </div>
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{trip.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">📍 {trip.destination}</p>
                      <p className="text-xs text-slate-400 mt-1">Spent: ₹{trip.budgetSpent?.toLocaleString()} INR</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setSelectedTripId(trip.id);
                          navigateTo('itinerary-detail', { tripId: trip.id });
                        }}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                      >
                        View Trip Summary
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAVED DESTINATIONS WISHLIST (PDF Page 6) */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Saved Indian Destinations</h3>
              <p className="text-xs text-slate-500">Places across India on your bucket list</p>
            </div>
            <button
              onClick={() => navigateTo('search-browse')}
              className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
            >
              + Discover More Indian Places
            </button>
          </div>

          {userProfile.savedDestinations && userProfile.savedDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProfile.savedDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <button
                      onClick={() => toggleSaveDestination(dest)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-rose-500 flex items-center justify-center shadow-md text-sm"
                    >
                      ❤️
                    </button>
                  </div>
                  <div className="p-5 space-y-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{dest.name}</h4>
                      <p className="text-xs text-slate-500">{dest.state}, India • {dest.category || 'Featured'}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-700">~₹{dest.avgCostPerDay} / day</span>
                      <button
                        onClick={() =>
                          navigateTo('create-trip', {
                            suggestedDestination: `${dest.name}, ${dest.state}`
                          })
                        }
                        className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-xl transition"
                      >
                        Plan Trip Here →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
              <p className="text-sm text-slate-500">No saved destinations yet. Browse Indian cities and click the heart icon!</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EDIT PROFILE INFORMATION (PDF Page 6) */}
      {activeTab === 'edit' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Edit Profile Details (PDF Requirement)</h3>
          <form onSubmit={handleSaveProfile} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
                  required
                />
                {editErrors.firstName && <p className="text-rose-500 text-[11px] mt-0.5">{editErrors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
                  required
                />
                {editErrors.lastName && <p className="text-rose-500 text-[11px] mt-0.5">{editErrors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
                  required
                />
                {editErrors.email && <p className="text-rose-500 text-[11px] mt-0.5">{editErrors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Mobile Phone (10 Digits) *</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
                />
                {editErrors.phone && <p className="text-rose-500 text-[11px] mt-0.5">{editErrors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Home City in India</label>
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  value="India"
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-100 text-slate-600 text-sm outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Bio & Travel Interests</label>
              <textarea
                rows="3"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Avatar Photo URL (PDF Requirement)</label>
              <input
                type="url"
                value={editForm.avatar}
                onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: LANGUAGE & INDIAN PREFERENCES (PDF Page 6) */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Language & Preferences (PDF Requirement)</h3>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              🌐 Preferred Indian Language Selection
            </label>
            <p className="text-xs text-slate-500">Choose your preferred Indian language for itinerary notes and platform interface.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              {indianLanguagesList.map((lang) => (
                <label
                  key={lang.code}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                    userProfile.language === lang.name
                      ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                      : 'bg-white border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{lang.name}</span>
                    <span className="text-[11px] text-slate-500">{lang.native}</span>
                  </div>
                  <input
                    type="radio"
                    name="lang"
                    checked={userProfile.language === lang.name}
                    onChange={() => updateUserProfile({ language: lang.name })}
                    className="text-teal-600"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DANGER ZONE & DELETE ACCOUNT (PDF Page 6) */}
      {activeTab === 'danger' && (
        <div className="bg-rose-50/50 rounded-3xl border border-rose-200 p-6 sm:p-10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="text-xl font-bold text-rose-900">Delete Account (PDF Requirement)</h3>
              <p className="text-xs text-rose-600 mt-0.5">
                Permanently delete your profile, Indian travel logs, and saved destinations.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md transition"
            >
              Delete Account Permanently
            </button>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-rose-900">Confirm Account Deletion?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete your account and all saved itineraries?
            </p>
            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  deleteAccount();
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
