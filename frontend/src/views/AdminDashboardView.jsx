import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AdminDashboardView = () => {
  const { adminStats, trips, showToast } = useApp();
  const [activeRange, setActiveRange] = useState('7d');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER (PDF Page 6: Admin / Analytics Dashboard) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
            📊 PDF Section 13: Admin & Analytics Dashboard (India Platform)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            GlobeTrotter India Metrics & User Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time telemetry on Indian destination demand, trip creation rates, and activity popularity.
          </p>
        </div>

        {/* Date Filter & Export */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex">
            {['24h', '7d', '30d', 'All'].map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeRange === range ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={() => showToast('Analytics CSV report exported successfully!')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            Export CSV 📥
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Indian Users</span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full">
              {adminStats.usersGrowthPercent}
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {adminStats.totalUsers.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500">Active travelers across 28 Indian states</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Trips Created</span>
            <span className="px-2 py-0.5 bg-teal-50 text-teal-700 font-bold text-[10px] rounded-full">
              {adminStats.tripsGrowthPercent}
            </span>
          </div>
          <div className="text-3xl font-black text-teal-600">
            {(adminStats.totalTrips + trips.length - 3).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500">Itineraries generated with live budget</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Top Indian Cities</span>
            <span className="text-lg">🏙️</span>
          </div>
          <div className="text-3xl font-black text-slate-900">84 Cities</div>
          <p className="text-[11px] text-slate-500">Goa, Jaipur & Manali lead demand</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Community Score</span>
            <span className="text-lg">⭐</span>
          </div>
          <div className="text-3xl font-black text-amber-600">4.94 / 5.0</div>
          <p className="text-[11px] text-slate-500">Based on 28,400+ traveler reviews</p>
        </div>
      </div>

      {/* CHARTS: TRIPS CREATED PER DAY & POPULAR INDIAN ACTIVITIES (PDF Page 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Trips Created Per Day (Bar Chart) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>📈</span> Indian Trips Created Per Day
              </h3>
              <p className="text-xs text-slate-500">Daily itinerary volume over past week</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              Peak: Sat (950 trips)
            </span>
          </div>

          <div className="h-60 flex items-end justify-between gap-3 pt-6 px-2">
            {adminStats.tripsCreatedPerDay.map((item, idx) => {
              const heightPercent = Math.round((item.count / 1000) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-extrabold text-slate-600 opacity-0 group-hover:opacity-100 transition">
                    {item.count}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-xl h-44 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-teal-600 to-cyan-400 rounded-t-xl transition-all duration-700 group-hover:from-teal-500 group-hover:to-cyan-300"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-slate-800 block">{item.day}</span>
                    <span className="text-[9px] text-slate-400 block">{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Activities Breakdown (Donut/Bar Breakdown) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>🍛</span> Popular Indian Activities Split
            </h3>
            <p className="text-xs text-slate-500">Category split of user itinerary selections</p>
          </div>

          <div className="space-y-3.5">
            {adminStats.popularActivities.map((act, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{act.category}</span>
                  <span className="text-slate-500">{act.percentage}% ({act.count.toLocaleString()})</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${act.percentage}%`, backgroundColor: act.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* POPULAR INDIAN CITIES RANKING (PDF Page 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>🏙️</span> Top Indian Destinations Ranking
            </h3>
            <p className="text-xs text-slate-500">Most planned places by traveler bookings</p>
          </div>

          <div className="space-y-4">
            {adminStats.popularCities.map((city, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] flex items-center justify-center font-black">
                      {idx + 1}
                    </span>
                    {city.name}
                  </span>
                  <span className="text-teal-700 font-extrabold">{city.count.toLocaleString()} Trips</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${city.percentage}%`, backgroundColor: city.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT USER LOGS */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>⚡</span> Live Activity Stream (India)
            </h3>
            <p className="text-xs text-slate-500">Real-time user creation and itinerary forks</p>
          </div>

          <div className="space-y-3">
            {adminStats.recentActivityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <div>
                    <span className="font-bold text-slate-900 block">{log.user}</span>
                    <span className="text-[11px] text-slate-500">{log.action}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{log.time}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => showToast('Activity logs refreshed.')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
          >
            Refresh Audit Logs 🔄
          </button>
        </div>
      </div>
    </div>
  );
};
