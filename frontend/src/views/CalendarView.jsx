import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const CalendarView = () => {
  const { trips, selectedTripId, setSelectedTripId, getActiveTrip, navigateTo } = useApp();
  const trip = getActiveTrip() || trips[0];

  const [currentMonth, setCurrentMonth] = useState('October 2026');
  const [selectedDayNum, setSelectedDayNum] = useState(15);

  const months = ['August 2026', 'September 2026', 'October 2026', 'November 2026', 'December 2026'];

  // 31 days grid generator
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Active Indian trip date range highlight (e.g. Oct 15-20)
  const isTripDay = (day) => {
    return day >= 15 && day <= 20;
  };

  const getTripForDay = (day) => {
    if (day >= 15 && day <= 20) {
      return {
        title: trip?.title || 'Royal Rajasthan Heritage',
        dayLabel: `Day ${day - 14}`,
        color: 'bg-teal-600 text-white'
      };
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER (PDF Page 5: Trip Calendar / Timeline Screen) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
            📅 PDF Section 10: Trip Calendar & Timeline Screen
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Indian Itinerary Calendar & Flow
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Visualize your Indian multi-city journey on an interactive calendar timeline.
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            className="px-4 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none"
          >
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CALENDAR CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Month Calendar Grid */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              onClick={() => {
                const idx = months.indexOf(currentMonth);
                if (idx > 0) setCurrentMonth(months[idx - 1]);
              }}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 font-bold text-sm"
            >
              ← Previous
            </button>
            <h2 className="text-xl font-extrabold text-slate-900">{currentMonth}</h2>
            <button
              onClick={() => {
                const idx = months.indexOf(currentMonth);
                if (idx < months.length - 1) setCurrentMonth(months[idx + 1]);
              }}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 font-bold text-sm"
            >
              Next →
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-extrabold uppercase text-slate-400">
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {/* Empty offsets */}
            <div className="h-20 sm:h-24 rounded-2xl bg-slate-50/40 opacity-40"></div>
            <div className="h-20 sm:h-24 rounded-2xl bg-slate-50/40 opacity-40"></div>

            {daysInMonth.map((day) => {
              const active = isTripDay(day);
              const isSelected = selectedDayNum === day;
              const tripBadge = getTripForDay(day);

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDayNum(day)}
                  className={`h-20 sm:h-24 rounded-2xl p-2 sm:p-2.5 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-teal-600 ring-2 ring-teal-400/40 bg-teal-50/50'
                      : active
                      ? 'border-teal-300 bg-teal-50/20 hover:border-teal-400'
                      : 'border-slate-100 hover:border-slate-300 bg-slate-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isSelected
                          ? 'bg-teal-600 text-white'
                          : active
                          ? 'text-teal-700 font-extrabold'
                          : 'text-slate-700'
                      }`}
                    >
                      {day}
                    </span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>}
                  </div>

                  {active && (
                    <div className="mt-1">
                      <span className="block text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-600 text-white truncate shadow-xs">
                        {tripBadge?.dayLabel}
                      </span>
                      <span className="hidden sm:block text-[9px] text-teal-800 font-semibold truncate mt-0.5">
                        {trip?.destination?.split(',')[0]}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Day Schedule & Quick Editing */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Daily Schedule in India</span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                {currentMonth.split(' ')[0]} {selectedDayNum}, {currentMonth.split(' ')[1]}
              </h3>
            </div>

            {isTripDay(selectedDayNum) ? (
              <div className="space-y-4">
                <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 text-xs">
                  <p className="font-bold text-teal-900">{trip.title}</p>
                  <p className="text-teal-700 text-[11px] mt-0.5">Day {selectedDayNum - 14} of {trip.totalDays}</p>
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">Scheduled Experiences</span>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-teal-700 font-bold">
                      <span>🌅 08:30 - 12:00</span>
                      <span>₹500</span>
                    </div>
                    <p className="font-bold text-slate-800">Amber Fort Guided Heritage Walk</p>
                    <p className="text-[11px] text-slate-500">Hall of Mirrors (Sheesh Mahal) & photo ops</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-amber-700 font-bold">
                      <span>🍛 18:00 - 22:00</span>
                      <span>₹1,100</span>
                    </div>
                    <p className="font-bold text-slate-800">Chokhi Dhani Royal Thali Feast</p>
                    <p className="text-[11px] text-slate-500">Puppet show & Rajasthani Kalbeliya dance</p>
                  </div>
                </div>

                <button
                  onClick={() => navigateTo('builder', { tripId: trip.id })}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Edit Day Schedule →
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 space-y-3">
                <span className="text-3xl block">⛱️</span>
                <p className="text-xs">No active Indian travel planned for this date.</p>
                <button
                  onClick={() => navigateTo('create-trip')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  + Plan Trip for this Date
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
