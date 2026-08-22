import { JsonDB } from '../config/db.js';

export const getTrips = async (req, res) => {
  try {
    const userId = req.user?.id || 'usr-ind-101';
    const db = JsonDB.read();
    const userTrips = (db.trips || []).filter((t) => !t.userId || t.userId === userId);

    return res.json({
      success: true,
      count: userTrips.length,
      trips: userTrips
    });
  } catch (error) {
    console.error('Get Trips Error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching trips.' });
  }
};

export const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = JsonDB.read();
    const trip = (db.trips || []).find((t) => t.id === id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    return res.json({
      success: true,
      trip
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching trip details.' });
  }
};

export const createTrip = async (req, res) => {
  try {
    const userId = req.user?.id || 'usr-ind-101';
    const {
      title,
      destination,
      startDate,
      endDate,
      budgetTotal,
      travelers,
      isPublic,
      notes,
      coverImage,
      initialActivities
    } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Trip name must be at least 3 characters.' });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Start date and end date are required.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      return res.status(400).json({ success: false, message: 'End date cannot be earlier than start date.' });
    }

    const budgetNum = Number(budgetTotal) || 25000;
    const diffTime = Math.abs(end - start);
    const calculatedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    const db = JsonDB.read();

    const newTrip = {
      id: `trip-ind-${Date.now()}`,
      userId,
      title: title.trim(),
      destination: destination || 'Jaipur, Rajasthan',
      status: 'upcoming',
      startDate,
      endDate,
      totalDays: calculatedDays,
      currentDay: 0,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
      budgetTotal: budgetNum,
      budgetSpent: 0,
      travelers: Number(travelers) || 1,
      isPublic: isPublic || false,
      likes: 0,
      notes: notes || 'Excited for this journey across Incredible India!',
      sections: [
        {
          id: `sec-1-${Date.now()}`,
          dayNumber: 1,
          date: startDate,
          title: `Day 1: Arrival & Local Food Walk in ${(destination || 'Jaipur').split(',')[0]}`,
          dailyBudget: Math.round(budgetNum / calculatedDays),
          timeSpentHours: 5,
          activities: initialActivities || []
        }
      ],
      expensesBreakdown: {
        stay: Math.round(budgetNum * 0.4),
        transport: Math.round(budgetNum * 0.2),
        food: Math.round(budgetNum * 0.2),
        activities: Math.round(budgetNum * 0.15),
        misc: Math.round(budgetNum * 0.05)
      }
    };

    db.trips.unshift(newTrip);

    // Update admin stats total trips
    if (db.adminStats) {
      db.adminStats.totalTrips += 1;
    }

    JsonDB.write(db);

    return res.status(201).json({
      success: true,
      message: `Trip "${newTrip.title}" created successfully!`,
      trip: newTrip
    });
  } catch (error) {
    console.error('Create Trip Error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating trip.' });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const db = JsonDB.read();
    const tripIndex = db.trips.findIndex((t) => t.id === id);

    if (tripIndex === -1) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    db.trips[tripIndex] = {
      ...db.trips[tripIndex],
      ...updatedData
    };

    JsonDB.write(db);

    return res.json({
      success: true,
      message: 'Trip details updated.',
      trip: db.trips[tripIndex]
    });
  } catch (error) {
    console.error('Update Trip Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating trip.' });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const db = JsonDB.read();

    db.trips = db.trips.filter((t) => t.id !== id);
    JsonDB.write(db);

    return res.json({
      success: true,
      message: 'Trip has been deleted.'
    });
  } catch (error) {
    console.error('Delete Trip Error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting trip.' });
  }
};

export const addSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { customTitle } = req.body;

    const db = JsonDB.read();
    const trip = db.trips.find((t) => t.id === id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    const nextDayNum = (trip.sections?.length || 0) + 1;
    const newSec = {
      id: `sec-${Date.now()}`,
      dayNumber: nextDayNum,
      date: `Day ${nextDayNum}`,
      title: customTitle || `Day ${nextDayNum}: Sightseeing & Experiences`,
      dailyBudget: Math.round(trip.budgetTotal / (trip.totalDays || 7)),
      timeSpentHours: 0,
      activities: []
    };

    trip.sections = [...(trip.sections || []), newSec];
    JsonDB.write(db);

    return res.json({
      success: true,
      message: 'New Stop added to itinerary.',
      trip
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error adding section.' });
  }
};

export const removeSection = async (req, res) => {
  try {
    const { id, sectionId } = req.params;
    const db = JsonDB.read();
    const trip = db.trips.find((t) => t.id === id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    trip.sections = (trip.sections || []).filter((s) => s.id !== sectionId);
    JsonDB.write(db);

    return res.json({
      success: true,
      message: 'Stop removed from itinerary.',
      trip
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error removing section.' });
  }
};

export const addActivity = async (req, res) => {
  try {
    const { id, sectionId } = req.params;
    const activityData = req.body;

    if (!activityData.title || !activityData.title.trim()) {
      return res.status(400).json({ success: false, message: 'Activity title is required.' });
    }

    const db = JsonDB.read();
    const trip = db.trips.find((t) => t.id === id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    const section = (trip.sections || []).find((s) => s.id === sectionId);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Itinerary section not found.' });
    }

    const newAct = {
      id: `act-${Date.now()}`,
      title: activityData.title.trim(),
      category: activityData.category || 'Sightseeing',
      time: activityData.time || '10:00 - 12:00',
      cost: Number(activityData.cost) || 0,
      notes: activityData.notes || 'Added from Indian experiences catalog'
    };

    section.activities = [...(section.activities || []), newAct];
    section.timeSpentHours = (section.timeSpentHours || 0) + 2;

    // Recalculate trip budget spent
    const totalSpent = trip.sections.reduce((acc, sec) => {
      return acc + (sec.activities || []).reduce((actAcc, act) => actAcc + (act.cost || 0), 0);
    }, 0);
    trip.budgetSpent = totalSpent;

    JsonDB.write(db);

    return res.json({
      success: true,
      message: `Added "${activityData.title}" (₹${activityData.cost || 0}) to itinerary.`,
      trip
    });
  } catch (error) {
    console.error('Add Activity Error:', error);
    return res.status(500).json({ success: false, message: 'Server error adding activity.' });
  }
};

export const removeActivity = async (req, res) => {
  try {
    const { id, sectionId, activityId } = req.params;
    const db = JsonDB.read();
    const trip = db.trips.find((t) => t.id === id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    const section = (trip.sections || []).find((s) => s.id === sectionId);
    if (section) {
      section.activities = (section.activities || []).filter((a) => a.id !== activityId);
    }

    // Recalculate spent
    const totalSpent = trip.sections.reduce((acc, sec) => {
      return acc + (sec.activities || []).reduce((actAcc, act) => actAcc + (act.cost || 0), 0);
    }, 0);
    trip.budgetSpent = totalSpent;

    JsonDB.write(db);

    return res.json({
      success: true,
      message: 'Activity removed from schedule.',
      trip
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error removing activity.' });
  }
};

export const reorderActivities = async (req, res) => {
  try {
    const { id } = req.params;
    const { sourceSecId, destSecId, sourceIdx, destIdx } = req.body;

    const db = JsonDB.read();
    const trip = db.trips.find((t) => t.id === id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    const sourceSec = trip.sections.find((s) => s.id === sourceSecId);
    const destSec = trip.sections.find((s) => s.id === destSecId);

    if (sourceSec && destSec) {
      const [movedItem] = sourceSec.activities.splice(sourceIdx, 1);
      destSec.activities.splice(destIdx, 0, movedItem);
      JsonDB.write(db);
    }

    return res.json({
      success: true,
      message: 'Activity reordered successfully.',
      trip
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error reordering activities.' });
  }
};
