import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const CommunityView = () => {
  const { communityTrips, likeCommunityTrip, forkCommunityTrip, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTripModal, setSelectedTripModal] = useState(null);

  const filteredCommunity = communityTrips.filter((trip) => {
    return (
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER & SEARCH (PDF Page 5: Shared/Public Itinerary View Screen) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              👥 PDF Section 11: Shared/Public Itinerary View & Community Feed
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Indian Travel Community & Shared Itineraries
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Get inspired by curated journeys across India, copy itineraries to your account, and share with friends.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Ladakh, Varanasi, Goa trips..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <span className="absolute left-3 top-3 text-slate-400">🔍</span>
          </div>
        </div>
      </div>

      {/* COMMUNITY FEED LIST */}
      <div className="space-y-6">
        {filteredCommunity.map((comm) => (
          <div
            key={comm.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left Cover Image */}
            <div className="relative md:w-80 h-56 md:h-auto overflow-hidden flex-shrink-0">
              <img
                src={comm.coverImage}
                alt={comm.title}
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                ⏱️ {comm.duration}
              </div>
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold">
                Est. {comm.budgetEstimate}
              </div>
            </div>

            {/* Right Details */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div>
                {/* Author Info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={comm.author.avatar}
                      alt={comm.author.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{comm.author.name}</span>
                      <span className="text-[10px] text-teal-600 font-semibold uppercase">{comm.author.badge}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">📍 {comm.destination}</span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900">{comm.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                  {comm.description}
                </p>

                {/* Highlights Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  {comm.highlights.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      ✨ {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions: Likes, Forks, Copy Trip (PDF Page 5) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => likeCommunityTrip(comm.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition"
                  >
                    <span>❤️</span> {comm.likes} Likes
                  </button>
                  <span className="text-xs text-slate-400 font-medium">
                    🍴 {comm.forks} Copies
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      showToast(`Shareable Link: https://globetrotter.in/share/${comm.id} copied!`);
                    }}
                    className="px-3.5 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-100 transition flex items-center gap-1"
                  >
                    <span>🔗</span> Share Link
                  </button>
                  <button
                    onClick={() => setSelectedTripModal(comm)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                  >
                    Read-Only View
                  </button>
                  <button
                    onClick={() => forkCommunityTrip(comm)}
                    className="px-5 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    <span>📋</span> Copy Trip to My Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* READ-ONLY PREVIEW MODAL (PDF Page 5) */}
      {selectedTripModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-slate-900">{selectedTripModal.title}</h3>
              <button
                onClick={() => setSelectedTripModal(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <img
              src={selectedTripModal.coverImage}
              alt={selectedTripModal.title}
              className="w-full h-48 rounded-2xl object-cover"
            />

            <div className="space-y-2">
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedTripModal.description}
              </p>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">Curated Highlights in India</span>
                <ul className="text-xs text-slate-700 list-disc list-inside space-y-0.5">
                  {selectedTripModal.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setSelectedTripModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600"
              >
                Close
              </button>
              <button
                onClick={() => {
                  forkCommunityTrip(selectedTripModal);
                  setSelectedTripModal(null);
                }}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Copy Trip to My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
