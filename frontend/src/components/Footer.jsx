import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white text-lg">
                🌐
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Globetrotter</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering personalized travel planning with interactive itineraries, real-time cost breakdowns, and community adventures.
            </p>
            <div className="flex items-center space-x-3 text-lg">
              <span className="cursor-pointer hover:text-white transition">📸</span>
              <span className="cursor-pointer hover:text-white transition">🐦</span>
              <span className="cursor-pointer hover:text-white transition">💼</span>
              <span className="cursor-pointer hover:text-white transition">💬</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">Explore & Plan</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => navigateTo('search-browse')} className="hover:text-white">City & Place Search</button></li>
              <li><button onClick={() => navigateTo('search-browse')} className="hover:text-white">Activity Finder</button></li>
              <li><button onClick={() => navigateTo('create-trip')} className="hover:text-white">Create New Trip</button></li>
              <li><button onClick={() => navigateTo('builder')} className="hover:text-white">Drag & Drop Itinerary</button></li>
              <li><button onClick={() => navigateTo('calendar')} className="hover:text-white">Calendar Timeline</button></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">Platform & Admin</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => navigateTo('community')} className="hover:text-white">Community Shared Trips</button></li>
              <li><button onClick={() => navigateTo('itinerary-detail')} className="hover:text-white">Budget & Cost Calculation</button></li>
              <li><button onClick={() => navigateTo('profile')} className="hover:text-white">User Profile & Wishlist</button></li>
              <li><button onClick={() => navigateTo('admin')} className="hover:text-white">Admin Dashboard & Charts</button></li>
              <li><button onClick={() => navigateTo('auth')} className="hover:text-white">Authentication & Security</button></li>
            </ul>
          </div>

          {/* Newsletter / Hackathon info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-xs tracking-wider uppercase">Hackathon Project</h4>
            <p className="text-xs text-slate-400">
              Built for the Globetrotter Travel Planning Innovation Showcase with all 12 frontend modules.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between text-xs text-brand-400 font-semibold mb-1">
                <span>System Status</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400">All 12 modules operational & responsive.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Globetrotter Technologies. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed & engineered with ❤️ for world travelers.</p>
        </div>
      </div>
    </footer>
  );
};
