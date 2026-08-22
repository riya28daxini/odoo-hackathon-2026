import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ItineraryDetailView = () => {
  const { trips, selectedTripId, setSelectedTripId, getActiveTrip, navigateTo } = useApp();
  const trip = getActiveTrip() || trips[0];

  const [selectedDayTab, setSelectedDayTab] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'timeline' (PDF Requirement)

  if (!trip) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">No Trip Found</h2>
        <button
          onClick={() => navigateTo('create-trip')}
          className="mt-4 px-6 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-xs"
        >
          + Create an Indian Trip
        </button>
      </div>
    );
  }

  // Expense breakdown calculations in ₹ INR (PDF Page 5)
  const breakdown = trip.expensesBreakdown || {
    stay: 12000,
    transport: 4500,
    food: 5800,
    activities: 3600,
    misc: 1800
  };

  const totalCalculatedExpense = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const remainingBudget = (trip.budgetTotal || 35000) - totalCalculatedExpense;
  const percentUsed = Math.min(100, Math.round((totalCalculatedExpense / (trip.budgetTotal || 35000)) * 100));

  const filteredSections = selectedDayTab === 'all'
    ? (trip.sections || [])
    : (trip.sections || []).filter((s) => `day-${s.dayNumber}` === selectedDayTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* SCREEN 9 & PDF PAGE 4/5 HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
            📊 PDF Section 6 & 9: Itinerary View, Budget & Cost Breakdown Screen
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {trip.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 mt-0.5">
            <span>📍 {trip.destination}</span>
            <span>•</span>
            <span>📅 {trip.startDate} - {trip.endDate}</span>
            <span>•</span>
            <span>👥 {trip.travelers} Travelers</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle: List or Timeline (PDF Requirement) */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'list' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              📋 List Mode
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'timeline' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              ⏱️ Timeline Mode
            </button>
          </div>

          <button
            onClick={() => navigateTo('builder', { tripId: trip.id })}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            ✏️ Edit Itinerary
          </button>
        </div>
      </div>

      {/* PDF SECTION 9: TRIP BUDGET & COST BREAKDOWN SCREEN (₹ INR) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>💰</span> Indian Travel Budget & Cost Calculation Breakdown (PDF Spec)
            </h2>
            <p className="text-xs text-slate-500">Live cost metrics across accommodation, transport, meals, and entry tickets</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${
              remainingBudget >= 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
            }`}>
              ● Budget Health: {remainingBudget >= 0 ? 'Within Budget' : 'Over Budget Alert'}
            </span>
          </div>
        </div>

        {/* 4 KPI Cards (₹ INR) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Planned Budget</span>
            <p className="text-2xl font-black text-slate-900 mt-1">₹{trip.budgetTotal?.toLocaleString()}</p>
            <span className="text-[11px] text-slate-500">Allocated budget cap</span>
          </div>
          <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200">
            <span className="text-[10px] uppercase font-bold text-teal-600">Total Calculated Cost</span>
            <p className="text-2xl font-black text-teal-800 mt-1">₹{totalCalculatedExpense?.toLocaleString()}</p>
            <span className="text-[11px] text-teal-600 font-semibold">{percentUsed}% of allocated budget</span>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-600">Remaining Balance</span>
            <p className={`text-2xl font-black mt-1 ${remainingBudget >= 0 ? 'text-emerald-800' : 'text-rose-600'}`}>
              ₹{remainingBudget?.toLocaleString()}
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold">
              {remainingBudget >= 0 ? 'Surplus Available' : 'Budget Deficit Warning'}
            </span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Average Cost / Day</span>
            <p className="text-2xl font-black text-slate-900 mt-1">
              ₹{Math.round(totalCalculatedExpense / (trip.sections?.length || 1))?.toLocaleString()} / day
            </p>
            <span className="text-[11px] text-slate-500">Across {trip.sections?.length || 1} day stops</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Budget Utilization in India</span>
            <span>{percentUsed}% (₹{totalCalculatedExpense?.toLocaleString()} / ₹{trip.budgetTotal?.toLocaleString()})</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentUsed > 95 ? 'bg-rose-500' : percentUsed > 75 ? 'bg-amber-500' : 'bg-gradient-to-r from-teal-500 to-emerald-500'
              }`}
              style={{ width: `${percentUsed}%` }}
            ></div>
          </div>
        </div>

        {/* Category Breakdown Cards (PDF Requirement: Transport, Stay, Activities, Meals) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {[
            { label: '🏨 Hotel & Resort Stay', value: breakdown.stay, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
            { label: '🚆 Train / Cab Transport', value: breakdown.transport, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-200' },
            { label: '🍛 Meals & Thalis', value: breakdown.food, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
            { label: '🎟️ Entry & Activities', value: breakdown.activities, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
            { label: '🛍️ Shopping & Misc', value: breakdown.misc, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' }
          ].map((cat, i) => (
            <div key={i} className={`p-3 rounded-xl border ${cat.bg} text-center`}>
              <span className="text-[11px] font-bold text-slate-700 block truncate">{cat.label}</span>
              <span className={`text-base font-black ${cat.color} block mt-1`}>₹{cat.value?.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400">
                {Math.round((cat.value / totalCalculatedExpense) * 100) || 0}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* PDF SECTION 6: DAY-BY-DAY ITINERARY VIEW (City headers, activity blocks with time and cost) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>🗺️</span> Day-wise Layout & City Schedules (PDF Spec)
            </h2>
            <p className="text-xs text-slate-500">Structured day plans with city headers, activity blocks, and entry costs</p>
          </div>

          {/* Day Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl overflow-x-auto">
            <button
              onClick={() => setSelectedDayTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedDayTab === 'all' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              All Days
            </button>
            {trip.sections && trip.sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedDayTab(`day-${s.dayNumber}`)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  selectedDayTab === `day-${s.dayNumber}` ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                Day {s.dayNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Sections View */}
        <div className="space-y-6">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-teal-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                    D{section.dayNumber}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{section.title}</h3>
                    <p className="text-xs text-slate-400">{section.date || `Day ${section.dayNumber}`}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                    ⏱️ {section.timeSpentHours || 6} Total Hours
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-teal-50 text-teal-700 font-bold border border-teal-200">
                    💵 ₹{section.dailyBudget || 3500} Allocated
                  </span>
                </div>
              </div>

              {/* Activity Blocks with Time and Cost */}
              <div className={`relative ${viewMode === 'timeline' ? 'pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-teal-200' : 'space-y-3'}`}>
                {section.activities && section.activities.length > 0 ? (
                  section.activities.map((act, i) => (
                    <div key={act.id} className="relative group">
                      {viewMode === 'timeline' && (
                        <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-teal-500 border-4 border-white shadow flex items-center justify-center text-[9px] text-white font-bold">
                          {i + 1}
                        </div>
                      )}

                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 hover:border-teal-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-teal-700 border border-teal-200">
                              {act.category}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">🕒 {act.time}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{act.title}</h4>
                          {act.notes && (
                            <p className="text-xs text-slate-500 mt-0.5">{act.notes}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <span className="text-xs font-bold text-slate-900 px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm">
                            {act.cost === 0 ? 'FREE' : `₹${act.cost}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No scheduled activities for this day stop.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
