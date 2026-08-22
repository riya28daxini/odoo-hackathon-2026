import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

// Views
import { LandingView } from './views/LandingView';
import { AuthView } from './views/AuthView';
// import { MyTripsView } from './views/MyTripsView';
// import { CreateTripView } from './views/CreateTripView';
// import { ItineraryBuilderView } from './views/ItineraryBuilderView';
// import { ItineraryDetailView } from './views/ItineraryDetailView';
// import { SearchBrowseView } from './views/SearchBrowseView';
// import { CalendarView } from './views/CalendarView';
// import { CommunityView } from './views/CommunityView';
// import { ProfileView } from './views/ProfileView';
// import { AdminDashboardView } from './views/AdminDashboardView';

export function App() {
  const { currentView } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingView />;
      case 'auth':
        return <AuthView />;
      case 'my-trips':
        return <MyTripsView />;
      case 'create-trip':
        return <CreateTripView />;
      case 'builder':
        return <ItineraryBuilderView />;
      case 'itinerary-detail':
        return <ItineraryDetailView />;
      case 'search-browse':
      case 'city-search':
      case 'activity-search':
        return <SearchBrowseView />;
      case 'calendar':
        return <CalendarView />;
      case 'community':
        return <CommunityView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminDashboardView />;
      default:
        return <LandingView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white font-sans">
      <Navbar />
      <main className="flex-1">
        {renderView()}
      </main>
      <Footer />
      <Toast />
    </div>
  );
}

export default App;
