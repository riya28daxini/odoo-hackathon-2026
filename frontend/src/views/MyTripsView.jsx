import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const MyTripsView = () => {
  const { trips, setSelectedTripId, deleteTrip, navigateTo, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'ongoing', 'upcoming', 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredTrips = trips.filter((trip) => {
    const matchesTab = activeTab === 'all' || trip.status === activeTab;
    const matchesSearch =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const ongoingCount = trips.filter((t) => t.status === 'ongoing').length;
  const upcomingCount = trips.filter((t) => t.status === 'upcoming').length;
  const completedCount = trips.filter((t) => t.status === 'completed').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* SCREEN 6 & PDF PAGE 3 HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
            🛫 PDF Section 4: My Trips (Trip List)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">My Indian Travel Journeys</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your ongoing itineraries, upcoming departures, and completed trips across India.
          </p>
        </div>

        <button
          onClick={() => navigateTo('create-trip')}
          className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-2xl shadow-md text-xs transition flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <span>➕</span> Plan New Trip
        </button>
      </div>

      {/* SEARCH & STATUS TABS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: `All Trips (${trips.length})` },
            { id: 'ongoing', label: `Ongoing (${ongoingCount})` },
            { id: 'upcoming', label: `Upcoming (${upcomingCount})` },
            { id: 'completed', label: `Completed (${completedCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trips or destinations..."
            className="w-full pl-8 pr-4 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
          />
          <span className="absolute left-2.5 top-2.5 text-xs text-slate-400">🔍</span>
        </div>
      </div>

      {/* TRIP CARDS (PDF Spec: Name, date range, destination count, edit/view/delete actions) */}
      {filteredTrips.length > 0 ? (
        <div className="space-y-6">
          {filteredTrips.map((trip) => {
            const totalActivitiesCount =
              trip.sections?.reduce((acc, s) => acc + (s.activities?.length || 0), 0) || 0;

            return (
              <div
                key={trip.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row"
              >
                {/* Image / Banner */}
                <div className="relative md:w-72 h-52 md:h-auto overflow-hidden flex-shrink-0">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        trip.status === 'ongoing'
                          ? 'bg-emerald-500 text-white'
                          : trip.status === 'upcoming'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      ● {trip.status}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium flex items-center justify-between">
                    <span>📅 {trip.startDate}</span>
                    <span>→</span>
                    <span>{trip.endDate}</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                        📍 {trip.destination}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {trip.totalDays} Days Journey
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">{trip.title}</h3>

                    {trip.notes && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                        {trip.notes}
                      </p>
                    )}
                  </div>

                  {/* Summary Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Budget</span>
                      <span className="font-extrabold text-slate-800">₹{trip.budgetTotal?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Spent to Date</span>
                      <span className="font-extrabold text-emerald-600">₹{trip.budgetSpent?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Stops / Days</span>
                      <span className="font-extrabold text-teal-600">{trip.sections?.length || 0} Stops</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Activities</span>
                      <span className="font-extrabold text-slate-800">{totalActivitiesCount} Planned</span>
                    </div>
                  </div>

                  {/* Action Buttons: View, Edit, Delete (PDF Page 3) */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTripId(trip.id);
                          navigateTo('builder', { tripId: trip.id });
                        }}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition"
                      >
                        ✏️ Edit Itinerary
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTripId(trip.id);
                          navigateTo('itinerary-detail', { tripId: trip.id });
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                      >
                        💰 Budget & Costs (₹)
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTripId(trip.id);
                          navigateTo('calendar', { tripId: trip.id });
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                      >
                        📅 Calendar
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast(`Public share link copied for ${trip.title}!`)}
                        className="px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-100 transition"
                        title="Share Trip"
                      >
                        🔗 Share
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(trip.id)}
                        className="px-3 py-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-lg transition"
                        title="Delete Trip"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="text-4xl">🏝️</div>
          <h3 className="text-lg font-bold text-slate-800">No Trips Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any trips matching your current filter. Start planning your next Indian adventure!
          </p>
          <button
            onClick={() => navigateTo('create-trip')}
            className="px-6 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-md"
          >
            + Plan New Trip
          </button>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Delete this trip?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete this itinerary and its scheduled stops? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteTrip(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                Yes, Delete Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
