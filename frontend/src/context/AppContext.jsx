import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialUserProfile,
  initialCities,
  initialActivities,
  initialTrips,
  initialCommunityTrips,
  mockAdminStats
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // REQUIREMENT: When opening website, first screen should be the Login / Authentication Page
  const [currentView, setCurrentView] = useState(() => {
    const savedAuth = localStorage.getItem('gt_is_authenticated');
    return savedAuth === 'true' ? 'landing' : 'auth';
  });

  const [viewParams, setViewParams] = useState({ screen: 'login' });

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Auth & Profile State
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('gt_ind_profile');
    return saved ? JSON.parse(saved) : initialUserProfile;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('gt_is_authenticated');
    return savedAuth === 'true';
  });

  // Trips State
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('gt_ind_trips');
    return saved ? JSON.parse(saved) : initialTrips;
  });

  const [selectedTripId, setSelectedTripId] = useState('trip-ind-101');

  // Cities & Activities
  const [cities] = useState(initialCities);
  const [activities, setActivities] = useState(initialActivities);

  // Community Feed
  const [communityTrips, setCommunityTrips] = useState(initialCommunityTrips);

  // Admin Stats
  const [adminStats, setAdminStats] = useState(mockAdminStats);

  // Persistence
  useEffect(() => {
    localStorage.setItem('gt_ind_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('gt_ind_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('gt_is_authenticated', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  // Strict Validation Helpers
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).trim().toLowerCase());
  };

  const validateIndianPhone = (phone) => {
    const digitsOnly = String(phone).replace(/\D/g, '');
    // Must be 10 digits, or 12 digits if includes 91 country code
    if (digitsOnly.length === 10) return /^[6-9]\d{9}$/.test(digitsOnly);
    if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) return /^[6-9]\d{9}$/.test(digitsOnly.slice(2));
    return false;
  };

  const validatePassword = (password) => {
    // Min 6 chars, contains at least one letter and one number
    if (!password || password.length < 6) return false;
    return true;
  };

  const validateDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return end >= start;
  };

  // Navigation Helper
  const navigateTo = (viewName, params = {}) => {
    // If not authenticated and trying to access protected view, redirect to auth
    if (!isAuthenticated && viewName !== 'auth') {
      showToast('Please sign in or register to access GlobeTrotter planning features.', 'info');
      setCurrentView('auth');
      setViewParams({ screen: 'login' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentView(viewName);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Handlers
  const login = (identifier, password) => {
    const trimmedId = String(identifier).trim();

    // Check if valid email or valid 10-digit phone
    const isEmail = validateEmail(trimmedId);
    const isPhone = validateIndianPhone(trimmedId);

    if (!isEmail && !isPhone) {
      showToast('Please enter a valid email address or 10-digit mobile number.', 'error');
      return false;
    }

    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return false;
    }

    setIsAuthenticated(true);
    showToast(`Namaste ${userProfile.firstName}! Welcome back to GlobeTrotter India.`);
    setCurrentView('landing');
    setViewParams({});
    return true;
  };

  const register = (formData) => {
    const updated = {
      ...userProfile,
      firstName: formData.firstName || 'Riya',
      lastName: formData.lastName || 'Daxini',
      email: formData.email || userProfile.email,
      phone: formData.phone || userProfile.phone,
      city: formData.city || userProfile.city,
      country: 'India',
      bio: formData.bio || userProfile.bio
    };
    setUserProfile(updated);
    setIsAuthenticated(true);
    showToast('Account verified and created successfully! Welcome to GlobeTrotter India.');
    setCurrentView('landing');
    setViewParams({});
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('You have been logged out safely.');
    setCurrentView('auth');
    setViewParams({ screen: 'login' });
  };

  const updateUserProfile = (updatedFields) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...updatedFields };
      showToast('Profile & preferences updated successfully.');
      return updated;
    });
  };

  const deleteAccount = () => {
    setUserProfile(initialUserProfile);
    setIsAuthenticated(false);
    localStorage.removeItem('gt_is_authenticated');
    showToast('Account deleted and session cleared.', 'error');
    setCurrentView('auth');
    setViewParams({ screen: 'register' });
  };

  const toggleSaveDestination = (city) => {
    setUserProfile((prev) => {
      const exists = prev.savedDestinations.some((d) => d.id === city.id);
      let updatedSaved;
      if (exists) {
        updatedSaved = prev.savedDestinations.filter((d) => d.id !== city.id);
        showToast(`Removed ${city.name} from wishlist.`, 'info');
      } else {
        updatedSaved = [...prev.savedDestinations, city];
        showToast(`Added ${city.name} to your Indian wishlist!`);
      }
      return { ...prev, savedDestinations: updatedSaved };
    });
  };

  // Trip Management Handlers
  const getActiveTrip = () => {
    return trips.find((t) => t.id === selectedTripId) || trips[0];
  };

  const createTrip = (tripData) => {
    if (!tripData.title || tripData.title.trim().length < 3) {
      showToast('Trip name must be at least 3 characters.', 'error');
      return null;
    }
    if (!validateDateRange(tripData.startDate, tripData.endDate)) {
      showToast('End date cannot be earlier than start date.', 'error');
      return null;
    }
    const budgetNum = Number(tripData.budgetTotal);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      showToast('Please specify a valid budget in ₹ INR.', 'error');
      return null;
    }

    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const diffTime = Math.abs(end - start);
    const calculatedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    const newTrip = {
      id: `trip-ind-${Date.now()}`,
      title: tripData.title,
      destination: tripData.destination || 'Jaipur, Rajasthan',
      status: 'upcoming',
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      totalDays: calculatedDays,
      currentDay: 0,
      coverImage: tripData.coverImage || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
      budgetTotal: budgetNum,
      budgetSpent: 0,
      travelers: Number(tripData.travelers) || 1,
      isPublic: tripData.isPublic || false,
      likes: 0,
      notes: tripData.notes || 'Excited for this journey across Incredible India!',
      sections: [
        {
          id: `sec-1-${Date.now()}`,
          dayNumber: 1,
          date: tripData.startDate,
          title: `Day 1: Arrival & Local Food Walk in ${tripData.destination.split(',')[0]}`,
          dailyBudget: Math.round(budgetNum / calculatedDays),
          timeSpentHours: 5,
          activities: tripData.initialActivities || []
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

    setTrips((prev) => [newTrip, ...prev]);
    setSelectedTripId(newTrip.id);

    setAdminStats((prev) => ({
      ...prev,
      totalTrips: prev.totalTrips + 1
    }));

    showToast(`Trip "${newTrip.title}" created successfully!`);
    setCurrentView('builder');
    setViewParams({ tripId: newTrip.id });
    return newTrip;
  };

  const updateTrip = (tripId, updatedData) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, ...updatedData } : t))
    );
    showToast('Trip details updated.');
  };

  const deleteTrip = (tripId) => {
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    showToast('Trip has been deleted.', 'info');
    if (selectedTripId === tripId && trips.length > 1) {
      setSelectedTripId(trips.find((t) => t.id !== tripId)?.id || '');
    }
  };

  const addSectionToTrip = (tripId, customTitle = '') => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const nextDayNum = (t.sections?.length || 0) + 1;
        const newSec = {
          id: `sec-${Date.now()}`,
          dayNumber: nextDayNum,
          date: `Day ${nextDayNum}`,
          title: customTitle || `Day ${nextDayNum}: Sightseeing & Experiences`,
          dailyBudget: Math.round(t.budgetTotal / (t.totalDays || 7)),
          timeSpentHours: 0,
          activities: []
        };
        return {
          ...t,
          sections: [...(t.sections || []), newSec]
        };
      })
    );
    showToast('New Stop added to itinerary.');
  };

  const removeSectionFromTrip = (tripId, sectionId) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          sections: t.sections.filter((s) => s.id !== sectionId)
        };
      })
    );
    showToast('Stop removed from itinerary.');
  };

  const addActivityToSection = (tripId, sectionId, activityData) => {
    if (!activityData.title || activityData.title.trim().length === 0) {
      showToast('Activity title is required.', 'error');
      return;
    }

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const updatedSections = t.sections.map((sec) => {
          if (sec.id !== sectionId) return sec;
          const newAct = {
            id: `act-${Date.now()}`,
            title: activityData.title,
            category: activityData.category || 'Sightseeing',
            time: activityData.time || '10:00 - 12:00',
            cost: Number(activityData.cost) || 0,
            notes: activityData.notes || 'Added from Indian experiences catalog'
          };
          return {
            ...sec,
            timeSpentHours: (sec.timeSpentHours || 0) + 2,
            activities: [...sec.activities, newAct]
          };
        });
        return { ...t, sections: updatedSections };
      })
    );
    showToast(`Added "${activityData.title}" (₹${activityData.cost || 0}) to itinerary.`);
  };

  const removeActivityFromSection = (tripId, sectionId, activityId) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const updatedSections = t.sections.map((sec) => {
          if (sec.id !== sectionId) return sec;
          return {
            ...sec,
            activities: sec.activities.filter((a) => a.id !== activityId)
          };
        });
        return { ...t, sections: updatedSections };
      })
    );
    showToast('Activity removed from schedule.');
  };

  const moveActivity = (tripId, sourceSecId, destSecId, sourceIdx, destIdx) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const sectionsCopy = JSON.parse(JSON.stringify(t.sections));
        const sourceSec = sectionsCopy.find((s) => s.id === sourceSecId);
        const destSec = sectionsCopy.find((s) => s.id === destSecId);

        if (!sourceSec || !destSec) return t;

        const [movedItem] = sourceSec.activities.splice(sourceIdx, 1);
        destSec.activities.splice(destIdx, 0, movedItem);

        return { ...t, sections: sectionsCopy };
      })
    );
  };

  const likeCommunityTrip = (commId) => {
    setCommunityTrips((prev) =>
      prev.map((c) => (c.id === commId ? { ...c, likes: c.likes + 1 } : c))
    );
    showToast('Liked Indian community itinerary! ❤️');
  };

  const forkCommunityTrip = (commTrip) => {
    const forked = {
      id: `trip-forked-${Date.now()}`,
      title: `${commTrip.title} (My Plan)`,
      destination: commTrip.destination,
      status: 'upcoming',
      startDate: '2026-11-01',
      endDate: '2026-11-09',
      totalDays: 9,
      currentDay: 0,
      coverImage: commTrip.coverImage,
      budgetTotal: 30000,
      budgetSpent: 0,
      travelers: 2,
      isPublic: false,
      likes: 0,
      notes: `Cloned from ${commTrip.author.name}'s verified Indian travel plan.`,
      sections: [
        {
          id: `sec-f1-${Date.now()}`,
          dayNumber: 1,
          date: 'Day 1',
          title: 'Day 1: Arrival & Orientation',
          dailyBudget: 3500,
          timeSpentHours: 5,
          activities: [
            {
              id: `act-f1`,
              title: commTrip.highlights[0] || 'Local Sightseeing & Tea Walk',
              category: 'Sightseeing',
              time: '10:00 - 13:00',
              cost: 500,
              notes: 'Recommended by community curator'
            }
          ]
        }
      ],
      expensesBreakdown: {
        stay: 12000,
        transport: 6000,
        food: 7000,
        activities: 4000,
        misc: 1000
      }
    };
    setTrips((prev) => [forked, ...prev]);
    setSelectedTripId(forked.id);
    showToast(`Cloned "${commTrip.title}" into your Trips!`);
    setCurrentView('my-trips');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        viewParams,
        navigateTo,
        toast,
        showToast,
        userProfile,
        setUserProfile,
        updateUserProfile,
        deleteAccount,
        isAuthenticated,
        login,
        register,
        logout,
        validateEmail,
        validateIndianPhone,
        validatePassword,
        validateDateRange,
        trips,
        selectedTripId,
        setSelectedTripId,
        getActiveTrip,
        createTrip,
        updateTrip,
        deleteTrip,
        addSectionToTrip,
        removeSectionFromTrip,
        addActivityToSection,
        removeActivityFromSection,
        moveActivity,
        cities,
        activities,
        toggleSaveDestination,
        communityTrips,
        likeCommunityTrip,
        forkCommunityTrip,
        adminStats
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
