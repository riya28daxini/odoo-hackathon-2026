let API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('gt_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const apiService = {
  // Health check with dynamic port resolution (5000 or 5001)
  checkHealth: async () => {
    try {
      const res = await fetch('http://localhost:5000/api/health');
      if (res.ok) {
        API_BASE_URL = 'http://localhost:5000/api';
        return await res.json();
      }
    } catch (e) {}

    try {
      const res2 = await fetch('http://localhost:5001/api/health');
      if (res2.ok) {
        API_BASE_URL = 'http://localhost:5001/api';
        return await res2.json();
      }
    } catch (e) {}

    return { status: 'offline' };
  },

  // Auth
  register: async (formData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (data.token) localStorage.setItem('gt_auth_token', data.token);
    return data;
  },

  login: async (identifier, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (data.token) localStorage.setItem('gt_auth_token', data.token);
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  // User Profile & Wishlist
  updateProfile: async (updatedFields) => {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedFields)
    });
    return await res.json();
  },

  toggleWishlist: async (cityId) => {
    const res = await fetch(`${API_BASE_URL}/users/wishlist/${cityId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  deleteAccount: async () => {
    const res = await fetch(`${API_BASE_URL}/users/account`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    localStorage.removeItem('gt_auth_token');
    return await res.json();
  },

  // Cities & Activities
  getCities: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/cities?${query}`);
    return await res.json();
  },

  getCityById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/cities/${id}`);
    return await res.json();
  },

  getActivities: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/activities?${query}`);
    return await res.json();
  },

  // Trips
  getTrips: async () => {
    const res = await fetch(`${API_BASE_URL}/trips`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  createTrip: async (tripData) => {
    const res = await fetch(`${API_BASE_URL}/trips`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(tripData)
    });
    return await res.json();
  },

  updateTrip: async (id, tripData) => {
    const res = await fetch(`${API_BASE_URL}/trips/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(tripData)
    });
    return await res.json();
  },

  deleteTrip: async (id) => {
    const res = await fetch(`${API_BASE_URL}/trips/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  addSection: async (tripId, customTitle) => {
    const res = await fetch(`${API_BASE_URL}/trips/${tripId}/sections`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ customTitle })
    });
    return await res.json();
  },

  removeSection: async (tripId, sectionId) => {
    const res = await fetch(`${API_BASE_URL}/trips/${tripId}/sections/${sectionId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  addActivityToSection: async (tripId, sectionId, activityData) => {
    const res = await fetch(`${API_BASE_URL}/trips/${tripId}/sections/${sectionId}/activities`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(activityData)
    });
    return await res.json();
  },

  removeActivityFromSection: async (tripId, sectionId, activityId) => {
    const res = await fetch(`${API_BASE_URL}/trips/${tripId}/sections/${sectionId}/activities/${activityId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  // Community
  getCommunityTrips: async () => {
    const res = await fetch(`${API_BASE_URL}/community/trips`);
    return await res.json();
  },

  likeCommunityTrip: async (id) => {
    const res = await fetch(`${API_BASE_URL}/community/trips/${id}/like`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  forkCommunityTrip: async (id) => {
    const res = await fetch(`${API_BASE_URL}/community/trips/${id}/fork`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  // Admin Stats
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/stats`);
    return await res.json();
  }
};
