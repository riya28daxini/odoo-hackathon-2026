import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ItineraryBuilderView = () => {
  const {
    trips,
    selectedTripId,
    setSelectedTripId,
    getActiveTrip,
    addSectionToTrip,
    removeSectionFromTrip,
    addActivityToSection,
    removeActivityFromSection,
    moveActivity,
    navigateTo,
    showToast
  } = useApp();

  const trip = getActiveTrip() || trips[0];

  // Quick activity adder state
  const [activeModalSectionId, setActiveModalSectionId] = useState(null);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityCategory, setNewActivityCategory] = useState('Royal Heritage');
  const [newActivityTime, setNewActivityTime] = useState('10:00 - 12:30');
  const [newActivityCost, setNewActivityCost] = useState(500);
  const [newActivityNotes, setNewActivityNotes] = useState('');

  // Add Stop / City modal state (PDF Requirement: Add Stop button)
  const [isAddStopModalOpen, setIsAddStopModalOpen] = useState(false);
  const [newStopCity, setNewStopCity] = useState('Udaipur, Rajasthan');
  const [newStopDays, setNewStopDays] = useState('2');

  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState(null); // { secId, actIdx }

  if (!trip) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">No Trip Selected</h2>
        <p className="text-slate-500 text-sm mt-2">Create an Indian trip first to start building itineraries.</p>
        <button
          onClick={() => navigateTo('create-trip')}
          className="mt-4 px-6 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-xs"
        >
          + Create Trip
        </button>
      </div>
    );
  }

  const handleAddActivitySubmit = (e) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) {
      showToast('Activity title is required.', 'error');
      return;
    }

    addActivityToSection(trip.id, activeModalSectionId, {
      title: newActivityTitle,
      category: newActivityCategory,
      time: newActivityTime,
      cost: Number(newActivityCost) || 0,
      notes: newActivityNotes
    });

    setNewActivityTitle('');
    setNewActivityNotes('');
    setActiveModalSectionId(null);
  };

  const handleAddStopSubmit = (e) => {
    e.preventDefault();
    addSectionToTrip(trip.id, `Stop at ${newStopCity} (${newStopDays} Days)`);
    setIsAddStopModalOpen(false);
  };

  const handleDragStart = (secId, actIdx) => {
    setDraggedItem({ secId, actIdx });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (destSecId, destIdx) => {
    if (!draggedItem) return;
    const { secId: sourceSecId, actIdx: sourceIdx } = draggedItem;
    moveActivity(trip.id, sourceSecId, destSecId, sourceIdx, destIdx);
    setDraggedItem(null);
    showToast('Activity reordered successfully!');
  };

  const totalCalculatedCost = trip.sections?.reduce((secAcc, sec) => {
    return secAcc + (sec.activities?.reduce((actAcc, act) => actAcc + (Number(act.cost) || 0), 0) || 0);
  }, 0) || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Controls & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
            <span>📋 PDF Section 5: Itinerary Builder (Interactive Drag & Drop)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{trip.title}</h1>
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 mt-1">
            <span>📍 {trip.destination}</span>
            <span>•</span>
            <span>📅 {trip.startDate} to {trip.endDate}</span>
            <span>•</span>
            <span>👥 {trip.travelers} Travelers</span>
          </p>
        </div>

        {/* Trip Switcher Dropdown & Nav Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={trip.id}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-slate-100 border border-slate-300 rounded-xl outline-none"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.sections?.length || 0} Stops)
              </option>
            ))}
          </select>

          {/* PDF Requirement: "Add Stop" button */}
          <button
            onClick={() => setIsAddStopModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <span>📍</span> Add Stop
          </button>

          <button
            onClick={() => navigateTo('itinerary-detail', { tripId: trip.id })}
            className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl border border-teal-200 transition"
          >
            💰 Budget View (₹)
          </button>
          <button
            onClick={() => navigateTo('calendar')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            📅 Calendar View
          </button>
        </div>
      </div>

      {/* OVERALL STATS SUMMARY BAR (₹ INR) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Stops & Days</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{trip.sections?.length || 0} Days</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Activities</span>
          <p className="text-2xl font-black text-teal-600 mt-1">
            {trip.sections?.reduce((acc, s) => acc + (s.activities?.length || 0), 0) || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Activity Spend Total</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">₹{totalCalculatedCost.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Trip Budget</span>
          <p className="text-2xl font-black text-slate-900 mt-1">₹{trip.budgetTotal?.toLocaleString()}</p>
        </div>
      </div>

      {/* SECTIONS LIST WITH DRAG & DROP & OVERBUDGET WARNINGS */}
      <div className="space-y-6">
        {trip.sections && trip.sections.map((section, secIdx) => {
          const sectionActivityTotal = section.activities?.reduce((acc, a) => acc + (Number(a.cost) || 0), 0) || 0;
          const isOverBudget = section.dailyBudget && sectionActivityTotal > section.dailyBudget;

          return (
            <div
              key={section.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(section.id, section.activities.length)}
              className={`bg-white rounded-3xl border-2 shadow-md p-6 sm:p-8 space-y-6 transition ${
                isOverBudget ? 'border-amber-300 bg-amber-50/10' : 'border-slate-200 hover:border-teal-300'
              }`}
            >
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-wider">
                      Stop / Day {section.dayNumber || secIdx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{section.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Drag items to re-order activity sequence for this day.
                  </p>
                </div>

                {/* Metrics: Daily Budget (₹), Time to spend, Overbudget Alert */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 font-medium mr-1">Daily Budget:</span>
                    <span className="font-bold text-slate-800">₹{section.dailyBudget || 3500}</span>
                  </div>
                  <div className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 font-medium mr-1">Time:</span>
                    <span className="font-bold text-slate-800">{section.timeSpentHours || 6} hrs</span>
                  </div>

                  {isOverBudget && (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-[10px] font-bold animate-pulse">
                      ⚠️ Over Budget (₹{sectionActivityTotal})
                    </span>
                  )}

                  {trip.sections.length > 1 && (
                    <button
                      onClick={() => removeSectionFromTrip(trip.id, section.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold transition"
                      title="Remove Section"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              {/* Activities List / Drop Zone */}
              <div className="space-y-3 min-h-[60px] p-2 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                {section.activities && section.activities.length > 0 ? (
                  section.activities.map((activity, actIdx) => (
                    <div
                      key={activity.id}
                      draggable
                      onDragStart={() => handleDragStart(section.id, actIdx)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => {
                        e.stopPropagation();
                        handleDrop(section.id, actIdx);
                      }}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex items-center justify-between gap-4 cursor-grab active:cursor-grabbing group"
                    >
                      {/* Drag Handle & Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-slate-300 group-hover:text-teal-600 font-bold text-lg select-none">
                          ⋮⋮
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                              {activity.category}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">🕒 {activity.time}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-0.5">{activity.title}</h4>
                          {activity.notes && (
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{activity.notes}</p>
                          )}
                        </div>
                      </div>

                      {/* Cost & Delete Action */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {activity.cost === 0 ? 'FREE' : `₹${activity.cost}`}
                        </span>
                        <button
                          onClick={() => removeActivityFromSection(trip.id, section.id, activity.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition text-xs"
                          title="Remove activity"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    No activities scheduled for this stop yet. Drag activities here or click "+ Add Activity".
                  </div>
                )}
              </div>

              {/* Section Bottom Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setActiveModalSectionId(section.id)}
                  className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-xl border border-teal-200 transition flex items-center gap-1.5"
                >
                  <span>➕</span> Add Activity to Day {section.dayNumber}
                </button>

                <button
                  onClick={() => navigateTo('search-browse', { targetSectionId: section.id })}
                  className="text-xs text-slate-600 hover:text-teal-600 font-semibold hover:underline"
                >
                  Browse Experiences Catalog →
                </button>
              </div>
            </div>
          );
        })}

        {/* ADD ANOTHER SECTION BUTTON */}
        <div className="text-center pt-4">
          <button
            onClick={() => addSectionToTrip(trip.id)}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/20 text-sm transition transform active:scale-95 flex items-center justify-center gap-2 mx-auto"
          >
            <span>➕</span> Add Another Section / Day
          </button>
        </div>
      </div>

      {/* PDF REQUIREMENT: ADD STOP MODAL */}
      {isAddStopModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-slate-900">Add New Travel Stop / City</h3>
              <button
                onClick={() => setIsAddStopModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStopSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Select City / Stop</label>
                <select
                  value={newStopCity}
                  onChange={(e) => setNewStopCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white outline-none font-medium"
                >
                  <option value="Udaipur, Rajasthan">Udaipur, Rajasthan (City of Lakes)</option>
                  <option value="Manali, Himachal Pradesh">Manali, Himachal Pradesh (Snow & Valleys)</option>
                  <option value="Alleppey, Kerala">Alleppey, Kerala (Backwaters)</option>
                  <option value="Varanasi, Uttar Pradesh">Varanasi, Uttar Pradesh (Ghats & Aarti)</option>
                  <option value="Leh-Ladakh">Leh-Ladakh (Pangong & Monasteries)</option>
                  <option value="Goa">Goa (Beaches & Water Sports)</option>
                  <option value="Rishikesh, Uttarakhand">Rishikesh, Uttarakhand (Rafting & Yoga)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Stay Duration (Days)</label>
                <input
                  type="number"
                  value={newStopDays}
                  onChange={(e) => setNewStopDays(e.target.value)}
                  min="1"
                  max="10"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none font-bold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddStopModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Add Stop to Itinerary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK ADD ACTIVITY MODAL */}
      {activeModalSectionId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b">
              <h3 className="text-lg font-bold text-slate-900">Add New Activity in India</h3>
              <button
                onClick={() => setActiveModalSectionId(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddActivitySubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Activity Title *
                </label>
                <input
                  type="text"
                  value={newActivityTitle}
                  onChange={(e) => setNewActivityTitle(e.target.value)}
                  placeholder="e.g. Amber Fort Guided Heritage Walk"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newActivityCategory}
                    onChange={(e) => setNewActivityCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white"
                  >
                    <option value="Royal Heritage">Royal Heritage</option>
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Food & Street Treats">Food & Street Treats</option>
                    <option value="Adventure & Rafting">Adventure & Rafting</option>
                    <option value="Nature & Trekking">Nature & Trekking</option>
                    <option value="Spiritual & Aarti">Spiritual & Aarti</option>
                    <option value="Transport (Cab/Train)">Transport (Cab/Train)</option>
                    <option value="Stay / Resort">Stay / Resort</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    value={newActivityTime}
                    onChange={(e) => setNewActivityTime(e.target.value)}
                    placeholder="10:00 - 12:30"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Estimated Cost (₹ INR)
                </label>
                <input
                  type="number"
                  value={newActivityCost}
                  onChange={(e) => setNewActivityCost(Number(e.target.value))}
                  min="0"
                  placeholder="₹ 500"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Notes & Booking Details
                </label>
                <textarea
                  rows="2"
                  value={newActivityNotes}
                  onChange={(e) => setNewActivityNotes(e.target.value)}
                  placeholder="Booking IDs, dress codes, camera permits..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModalSectionId(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md transition"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
