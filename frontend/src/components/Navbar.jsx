import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Navbar = () => {
  const { currentView, navigateTo, userProfile, isAuthenticated, logout, isBackendConnected } = useApp();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Explore', icon: '🌍' },
    { id: 'my-trips', label: 'My Trips', icon: '✈️' },
    { id: 'create-trip', label: 'Create Trip', icon: '➕' },
    { id: 'builder', label: 'Itinerary Builder', icon: '📋' },
    { id: 'search-browse', label: 'Cities & Activities', icon: '🔍' },
    { id: 'itinerary-detail', label: 'Budget & Cost', icon: '💰' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'community', label: 'Community', icon: '👥' },
    { id: 'admin', label: 'Admin Panel', icon: '📊' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition-transform">
              🌐
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-700 via-brand-600 to-cyan-600 bg-clip-text text-transparent">
                Globetrotter
              </span>
              <span className="hidden sm:inline-block ml-1 text-xs font-semibold px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                v2.0
              </span>
              {isBackendConnected && (
                <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> API Connected
                </span>
              )}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id || (item.id === 'search-browse' && (currentView === 'city-search' || currentView === 'activity-search'));
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile / Auth Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-full hover:ring-2 hover:ring-brand-400 transition-all"
                >
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.firstName}
                    className="w-9 h-9 rounded-full object-cover border border-brand-500/30"
                  />
                  <span className="hidden md:inline-block text-xs font-semibold text-slate-700">
                    {userProfile.firstName}
                  </span>
                  <span className="text-xs text-slate-400">▼</span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    onClick={() => setIsUserMenuOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-800">{userProfile.firstName} {userProfile.lastName}</p>
                      <p className="text-xs text-slate-500 truncate">{userProfile.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
                        {userProfile.role}
                      </span>
                    </div>

                    <button
                      onClick={() => navigateTo('profile', { tab: 'details' })}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                    >
                      <span>👤</span> My Profile
                    </button>
                    <button
                      onClick={() => navigateTo('profile', { tab: 'saved' })}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                    >
                      <span>❤️</span> Saved Destinations ({userProfile.savedDestinations?.length || 0})
                    </button>
                    <button
                      onClick={() => navigateTo('profile', { tab: 'settings' })}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                    >
                      <span>⚙️</span> Settings & Languages
                    </button>
                    <button
                      onClick={() => navigateTo('admin')}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                    >
                      <span>📊</span> Admin Analytics
                    </button>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-medium flex items-center gap-2"
                      >
                        <span>🚪</span> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateTo('auth', { screen: 'login' })}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-brand-600 transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigateTo('auth', { screen: 'register' })}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <span className="text-xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigateTo(item.id);
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-3 text-slate-700 hover:bg-brand-50 hover:text-brand-700"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
