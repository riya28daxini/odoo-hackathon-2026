import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialUserProfile,
  initialCities,
  initialActivities,
  initialTrips,
  initialCommunityTrips,
  mockAdminStats
} from '../data/mockData';
import { apiService } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Backend Connection Status
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // View Navigation State
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
  const [cities, setCities] = useState(initialCities);
  const [activities, setActivities] = useState(initialActivities);

  // Community Feed
  const [communityTrips, setCommunityTrips] = useState(initialCommunityTrips);

  // Admin Stats
  const [adminStats, setAdminStats] = useState(mockAdminStats);

  // Initial Sync with Backend Server if running
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const health = await apiService.checkHealth();
        if (health && health.status === 'online') {
          setIsBackendConnected(true);

          // Sync Cities
          const citiesRes = await apiService.getCities();
          if (citiesRes.success && citiesRes.cities?.length) {
            setCities(citiesRes.cities);
          }

          // Sync Activities
          const actRes = await apiService.getActivities();
          if (actRes.success && actRes.activities?.length) {
            setActivities(actRes.activities);
          }

          // Sync Community Trips
          const commRes = await apiService.getCommunityTrips();
          if (commRes.success && commRes.communityTrips?.length) {
            setCommunityTrips(commRes.communityTrips);
          }

          // Sync Admin Stats
          const adminRes = await apiService.getAdminStats();
          if (adminRes.success && adminRes.adminStats) {
            setAdminStats(adminRes.adminStats);
          }

          // Sync Trips if logged in
          const tripsRes = await apiService.getTrips();
          if (tripsRes.success && tripsRes.trips?.length) {
            setTrips(tripsRes.trips);
            if (!tripsRes.trips.some((t) => t.id === selectedTripId)) {
              setSelectedTripId(tripsRes.trips[0].id);
            }
          }
        }
      } catch (e) {
        console.log('Running in standalone mode with mock data fallback.');
      }
    };

    fetchInitialData();
  }, []);

  // Persistence to localStorage
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
    if (digitsOnly.length === 10) return /^[6-9]\d{9}$/.test(digitsOnly);
    if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) return /^[6-9]\d{9}$/.test(digitsOnly.slice(2));
    return false;
  };

  const validatePassword = (password) => {
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
  const login = async (identifier, password) => {
    const trimmedId = String(identifier).trim();
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

    if (isBackendConnected) {
      try {
        const res = await apiService.login(trimmedId, password);
        if (res.success && res.user) {
          setUserProfile(res.user);
          setIsAuthenticated(true);
          showToast(res.message || `Namaste ${res.user.firstName}! Welcome back.`);
          setCurrentView('landing');
          setViewParams({});
          
          // Refresh User Trips
          const tripsRes = await apiService.getTrips();
          if (tripsRes.success && tripsRes.trips) {
            setTrips(tripsRes.trips);
          }
          return true;
        } else {
          showToast(res.message || 'Login failed', 'error');
          return false;
        }
      } catch (err) {
        console.error('Backend Login Error, falling back:', err);
      }
    }

    // Local Fallback
    setIsAuthenticated(true);
    showToast(`Namaste ${userProfile.firstName}! Welcome back to GlobeTrotter India.`);
    setCurrentView('landing');
    setViewParams({});
    return true;
  };

  const register = async (formData) => {
    if (isBackendConnected) {
      try {
        const res = await apiService.register(formData);
        if (res.success && res.user) {
          setUserProfile(res.user);
          setIsAuthenticated(true);
          showToast(res.message || 'Account verified and created successfully!');
          setCurrentView('landing');
          setViewParams({});
          return true;
        }
      } catch (e) {
        console.error('Backend Register error, falling back:', e);
      }
    }

    const updated = {
      ...userProfile,
      firstName: formData.firstName || 'Aarav',
      lastName: formData.lastName || 'Sharma',
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
    localStorage.removeItem('gt_auth_token');
    showToast('You have been logged out safely.');
    setCurrentView('auth');
    setViewParams({ screen: 'login' });
  };

  const updateUserProfile = async (updatedFields) => {
    if (isBackendConnected) {
      try {
        const res = await apiService.updateProfile(updatedFields);
        if (res.success && res.user) {
          setUserProfile(res.user);
          showToast('Profile & preferences updated successfully.');
          return;
        }
      } catch (e) {
        console.error('Update Profile error:', e);
      }
    }

    setUserProfile((prev) => {
      const updated = { ...prev, ...updatedFields };
      showToast('Profile & preferences updated successfully.');
      return updated;
    });
  };

  const deleteAccount = async () => {
    if (isBackendConnected) {
      try {
        await apiService.deleteAccount();
      } catch (e) {
        console.error('Delete Account error:', e);
      }
    }

    setUserProfile(initialUserProfile);
    setIsAuthenticated(false);
    localStorage.removeItem('gt_is_authenticated');
    localStorage.removeItem('gt_auth_token');
    showToast('Account deleted and session cleared.', 'error');
    setCurrentView('auth');
    setViewParams({ screen: 'register' });
  };

  const toggleSaveDestination = async (city) => {
    if (isBackendConnected) {
      try {
        const res = await apiService.toggleWishlist(city.id);
        if (res.success && res.savedDestinations) {
          setUserProfile((prev) => ({ ...prev, savedDestinations: res.savedDestinations }));
          showToast(res.message);
          return;
        }
      } catch (e) {
        console.error('Toggle Wishlist error:', e);
      }
    }

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

  const createTrip = async (tripData) => {
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

    if (isBackendConnected) {
      try {
        const res = await apiService.createTrip(tripData);
        if (res.success && res.trip) {
          setTrips((prev) => [res.trip, ...prev]);
          setSelectedTripId(res.trip.id);
          showToast(res.message);
          setCurrentView('builder');
          setViewParams({ tripId: res.trip.id });
          return res.trip;
        }
      } catch (e) {
        console.error('Create Trip error:', e);
      }
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

  const updateTrip = async (tripId, updatedData) => {
    if (isBackendConnected) {
      try {
        const res = await apiService.updateTrip(tripId, updatedData);
        if (res.success && res.trip) {
          setTrips((prev) => prev.map((t) => (t.id === tripId ? res.trip : t)));
          showToast(res.message);
          return;
        }
      } catch (e) {
        console.error('Update Trip error:', e);
      }
    }

    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, ...updatedData } : t))
    );
    showToast('Trip details updated.');
  };

  const deleteTrip = async (tripId) => {
    if (isBackendConnected) {
      try {
        await apiService.deleteTrip(tripId);
      } catch (e) {
        console.error('Delete Trip error:', e);
      }
    }

    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    showToast('Trip has been deleted.', 'info');
    if (selectedTripId === tripId && trips.length > 1) {
      setSelectedTripId(trips.find((t) => t.id !== tripId)?.id || '');
    }
  };

  const addSectionToTrip = async (tripId, customTitle = '') => {
    if (isBackendConnected) {
      try {
        const res = await apiService.addSection(tripId, customTitle);
        if (res.success && res.trip) {
          setTrips((prev) => prev.map((t) => (t.id === tripId ? res.trip : t)));
          showToast(res.message);
          return;
        }
      } catch (e) {
        console.error('Add Section error:', e);
      }
    }

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

  const removeSectionFromTrip = async (tripId, sectionId) => {
    if (isBackendConnected) {
      try {
        const res = await apiService.removeSection(tripId, sectionId);
        if (res.success && res.trip) {
          setTrips((prev) => prev.map((t) => (t.id === tripId ? res.trip : t)));
          showToast(res.message);
          return;
        }
      } catch (e) {
        console.error('Remove Section error:', e);
      }
    }

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

  const addActivityToSection = async (tripId, sectionId, activityData) => {
    if (!activityData.title || activityData.title.trim().length === 0) {
      showToast('Activity title is required.', 'error');
      return;
    }

    if (isBackendConnected) {
      try {
        const res = await apiService.addActivityToSection(tripId, sectionId, activityData);
        if (res.success && res.trip) {
          setTrips((prev) => prev.map((t) => (t.id === tripId ? res.trip : t)));
          showToast(res.message);
          return;
        }
      } catch (e) {
        console.error('Add Activity error:', e);
      }
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

  const removeActivityFromSection = async (tripId, sectionId, activityId) => {
    if (isBackendConnected) {
      try {
        const res = await apiService.removeActivityFromSection(tripId, sectionId, activityId);
        if (res.success && res.trip) {
          setTrips((prev) => prev.map((t) => (t.id === tripId ? res.trip : t)));
          showToast(res.message);
          return;
        }
      } catch (e) {
        console.error('Remove Activity error:', e);
      }
    }

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

  const likeCommunityTrip = async (commId) => {
    if (isBackendConnected) {
      try {
        const res = await apiService.likeCommunityTrip(commId);
        if (res.success) {
          setCommunityTrips((prev) =>
            prev.map((c) => (c.id === commId ? { ...c, likes: res.likes } : c))
          );
          showToast(res.message);
          return;
        }
      } catch (e) {
        console.error('Like Community Trip error:', e);
      }
    }

    setCommunityTrips((prev) =>
      prev.map((c) => (c.id === commId ? { ...c, likes: c.likes + 1 } : c))
    );
    showToast('Liked Indian community itinerary! ❤️');
  };

  const forkCommunityTrip = async (commTrip) => {
    if (isBackendConnected) {
      try {
        const res = await apiService.forkCommunityTrip(commTrip.id);
        if (res.success && res.trip) {
          setTrips((prev) => [res.trip, ...prev]);
          setSelectedTripId(res.trip.id);
          showToast(res.message);
          setCurrentView('my-trips');
          return;
        }
      } catch (e) {
        console.error('Fork Community Trip error:', e);
      }
    }

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
        isBackendConnected,
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
