import React, { useState, useCallback, useEffect } from 'react';
import { AppView, WorkerProfile, Notification, User as UserType } from './types';
import Landing from './components/Landing';
import Marketplace from './components/Marketplace';
import ProfileCreator from './components/ProfileCreator';
import WorkerProfileView from './components/WorkerProfileView';
import MyGigs from './components/MyGigs';
import WorkFeed from './components/WorkFeed';
import NotificationSystem from './components/NotificationSystem';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import NearbyProfessionals from './components/NearbyProfessionals';
import FindWork from './components/FindWork';
import FindProfessional from './components/FindProfessional';
import PostGig from './components/PostGig';
import AccountSettings from './components/AccountSettings';
import WorkerDashboard from './components/WorkerDashboard';
import WorkGallery from './components/WorkGallery';
import HowItWorks from './components/HowItWorks';
import SafetyPage from './components/SafetyPage';
import PricingPage from './components/PricingPage';
import HelpCenter from './components/HelpCenter';
import ContactUs from './components/ContactUs';
import TermsOfService from './components/TermsOfService';
import { authService } from './services/authService';
import { MOCK_WORKERS } from './constants';
import { Layout, Briefcase, User, Search, Home, ClipboardList, LayoutGrid, LogOut, MapPin, Users, Plus, Camera, Mic } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPostGig, setShowPostGig] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore user session from localStorage on mount
  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser && authService.isAuthenticated()) {
      setUser(storedUser);
      // If user is logged in, show dashboard instead of landing
      setCurrentView(AppView.MARKETPLACE);
    }
    setIsInitialized(true);
  }, []);

  const addNotification = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [{ id, title, message, type, timestamp: Date.now() }, ...prev]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleProfileCreated = (profile: any) => {
    // Save the AI-generated profile to localStorage
    localStorage.setItem('aiGeneratedProfile', JSON.stringify(profile));

    const newUser: UserType = {
      id: user?.id || 'u' + Math.random().toString(36).substr(2, 5),
      name: profile.name,
      email: user?.email || 'newworker@example.com',
      role: 'WORKER',
      avatar: 'https://i.pravatar.cc/150?u=' + profile.name
    };
    setUser(newUser);
    addNotification("Profile Created", "Welcome to SkillBridge! Your professional portfolio is live.", "success");
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogin = (loggedInUser: UserType) => {
    setUser(loggedInUser);
    addNotification("Welcome", `Logged in successfully as ${loggedInUser.name}`, "success");

    // Role-based routing
    if (loggedInUser.role === 'WORKER') {
      setCurrentView(AppView.DASHBOARD);
    } else {
      setCurrentView(AppView.MARKETPLACE);
    }
  };

  const handleLogout = () => {
    setUser(null);
    addNotification("Logged Out", "You have been securely signed out.", "info");
    setCurrentView(AppView.LANDING);
  };

  const navigate = (view: AppView) => {
    const privateViews = [AppView.DASHBOARD, AppView.MY_GIGS, AppView.PROFILE_CREATOR];
    if (privateViews.includes(view) && !user) {
      setCurrentView(AppView.LOGIN);
    } else {
      setCurrentView(view);
    }
    window.scrollTo(0, 0);
  };

  const handleSelectWorkerById = (workerId: string) => {
    const worker = MOCK_WORKERS.find(w => w.id === workerId);
    if (worker) {
      setSelectedWorker(worker);
      navigate(AppView.WORKER_DETAIL);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.LOGIN:
        return <Login onLogin={handleLogin} onBack={() => navigate(AppView.LANDING)} />;
      case AppView.LANDING:
        return (
          <Landing
            onHire={() => navigate(AppView.MARKETPLACE)}
            onJoin={() => user ? navigate(AppView.PROFILE_CREATOR) : navigate(AppView.LOGIN)}
          />
        );
      case AppView.MARKETPLACE:
        return (
          <Marketplace
            onSelectWorker={(worker) => {
              setSelectedWorker(worker);
              navigate(AppView.WORKER_DETAIL);
            }}
          />
        );
      case AppView.PROFILE_CREATOR:
        return <ProfileCreator onProfileCreated={handleProfileCreated} />;
      case AppView.WORKER_DETAIL:
        return selectedWorker ? (
          <WorkerProfileView
            worker={selectedWorker}
            onBack={() => navigate(AppView.MARKETPLACE)}
          />
        ) : <Marketplace onSelectWorker={setSelectedWorker} />;
      case AppView.MY_GIGS:
        return <MyGigs addNotification={addNotification} userRole={user?.role} />;
      case AppView.SHOWCASE:
        return <WorkFeed onSelectWorker={handleSelectWorkerById} />;
      case AppView.FIND_WORK:
        return <FindWork user={user} addNotification={addNotification} />;
      case AppView.FIND_NEARBY:
        return <NearbyProfessionals />;
      case AppView.GALLERY:
        return user ? (
          <WorkGallery user={user} addNotification={addNotification} />
        ) : <Login onLogin={handleLogin} onBack={() => navigate(AppView.LANDING)} />;
      case AppView.PROFILE:
        return user ? (
          user.role === 'WORKER' ? (
            <WorkerDashboard
              user={user}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setUser(updatedUser)}
              onNavigateToProfileCreator={() => navigate(AppView.PROFILE_CREATOR)}
              addNotification={addNotification}
            />
          ) : (
            <AccountSettings
              user={user}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setUser(updatedUser)}
              addNotification={addNotification}
            />
          )
        ) : <Login onLogin={handleLogin} onBack={() => navigate(AppView.LANDING)} />;
      case AppView.HOW_IT_WORKS:
        return <HowItWorks onBack={() => navigate(AppView.LANDING)} />;
      case AppView.SAFETY:
        return <SafetyPage onBack={() => navigate(AppView.LANDING)} />;
      case AppView.PRICING:
        return <PricingPage onBack={() => navigate(AppView.LANDING)} />;
      case AppView.HELP_CENTER:
        return <HelpCenter onBack={() => navigate(AppView.LANDING)} />;
      case AppView.CONTACT_US:
        return <ContactUs onBack={() => navigate(AppView.LANDING)} />;
      case AppView.TERMS:
        return <TermsOfService onBack={() => navigate(AppView.LANDING)} />;
      case AppView.DASHBOARD:
        if (!user) return <Login onLogin={handleLogin} onBack={() => navigate(AppView.LANDING)} />;

        return user.role === 'WORKER' ? (
          <WorkerDashboard
            user={user}
            onLogout={handleLogout}
            onUpdateUser={(updatedUser) => setUser(updatedUser)}
            onNavigateToProfileCreator={() => navigate(AppView.PROFILE_CREATOR)}
            addNotification={addNotification}
          />
        ) : (
          <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <button onClick={handleLogout} className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                  <LogOut className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-6 mb-10">
                <img src={user?.avatar} className="w-24 h-24 rounded-3xl object-cover ring-4 ring-blue-50" alt="" />
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Namaste, {user?.name}!</h2>
                  <p className="text-slate-500 font-medium">Find the best talent for your next project.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 cursor-pointer hover:shadow-lg hover:bg-emerald-100 transition-all group" onClick={() => navigate(AppView.MARKETPLACE)}>
                  <div className="w-12 h-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-900 mb-2">Find Experts</h3>
                  <p className="text-emerald-700/70">Browse verified professionals in your area.</p>
                </div>
                <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 cursor-pointer hover:shadow-lg hover:bg-blue-100 transition-all group" onClick={() => navigate(AppView.MY_GIGS)}>
                  <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">My Jobs</h3>
                  <p className="text-blue-700/70">Track progress of your hired projects.</p>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-slate-50 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate(AppView.MARKETPLACE)}
                  className="flex-1 py-5 bg-blue-600 text-white font-black text-lg rounded-[24px] shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                >
                  Explore Marketplace
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <Landing onHire={() => navigate(AppView.MARKETPLACE)} onJoin={() => user ? navigate(AppView.PROFILE_CREATOR) : navigate(AppView.LOGIN)} />;
    }
  };

  // Show loading spinner while restoring session
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading SkillBridge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NotificationSystem notifications={notifications} onDismiss={dismissNotification} />

      {/* Navigation */}
      {currentView !== AppView.LANDING && currentView !== AppView.LOGIN && (
        <nav className="fixed bottom-0 left-0 right-0 sm:top-0 sm:bottom-auto bg-white/80 backdrop-blur-lg border-t sm:border-t-0 sm:border-b border-slate-100 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <div
                className="hidden sm:flex items-center gap-2 font-black text-2xl text-blue-600 cursor-pointer"
                onClick={() => navigate(AppView.LANDING)}
              >
                <Briefcase className="w-8 h-8" />
                SkillBridge
              </div>
              <div className="flex flex-1 justify-around sm:justify-end gap-1 sm:gap-2 md:gap-4">
                {user?.role === 'WORKER' ? (
                  <>
                    <button
                      onClick={() => navigate(AppView.FIND_WORK)}
                      className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 py-2 rounded-2xl transition-all ${currentView === AppView.FIND_WORK ? 'text-blue-600 sm:bg-blue-50 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      <Search className="w-5 h-5" />
                      <span className="text-[10px] sm:text-sm uppercase tracking-wider font-bold">Find Work</span>
                    </button>
                    <button
                      onClick={() => navigate(AppView.GALLERY)}
                      className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 py-2 rounded-2xl transition-all ${currentView === AppView.GALLERY ? 'text-blue-600 sm:bg-blue-50 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      <Camera className="w-5 h-5" />
                      <span className="text-[10px] sm:text-sm uppercase tracking-wider font-bold">Gallery</span>
                    </button>
                    <button
                      onClick={() => navigate(AppView.PROFILE_CREATOR)}
                      className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 py-2 rounded-2xl transition-all ${currentView === AppView.PROFILE_CREATOR ? 'text-purple-600 sm:bg-purple-50 font-bold' : 'text-purple-500 hover:text-purple-700 hover:bg-purple-50'}`}
                    >
                      <Mic className="w-5 h-5" />
                      <span className="text-[10px] sm:text-sm uppercase tracking-wider font-bold">AI Profile</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => user ? setShowPostGig(true) : navigate(AppView.LOGIN)}
                    className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 py-2 rounded-2xl transition-all text-green-600 hover:text-green-700 hover:bg-green-50`}
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-[10px] sm:text-sm uppercase tracking-wider font-bold">Post Gig</span>
                  </button>
                )}
                <button
                  onClick={() => navigate(AppView.SHOWCASE)}
                  className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 py-2 rounded-2xl transition-all ${currentView === AppView.SHOWCASE ? 'text-blue-600 sm:bg-blue-50 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                  <span className="text-[10px] sm:text-sm uppercase tracking-wider font-bold text-center">Showcase</span>
                </button>
                <button
                  onClick={() => navigate(AppView.FIND_NEARBY)}
                  className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 py-2 rounded-2xl transition-all ${currentView === AppView.FIND_NEARBY ? 'text-blue-600 sm:bg-blue-50 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="text-[10px] sm:text-sm uppercase tracking-wider font-bold text-center">Nearby</span>
                </button>
                <button
                  onClick={() => navigate(AppView.MY_GIGS)}
                  className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 py-2 rounded-2xl transition-all ${currentView === AppView.MY_GIGS ? 'text-blue-600 sm:bg-blue-50 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  <ClipboardList className="w-5 h-5" />
                  <span className="text-[10px] sm:text-sm uppercase tracking-wider font-bold">My Gigs</span>
                </button>
                <button
                  onClick={() => navigate(user ? AppView.PROFILE : AppView.LOGIN)}
                  className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 py-2 rounded-2xl transition-all ${currentView === AppView.PROFILE || currentView === AppView.PROFILE_CREATOR || currentView === AppView.DASHBOARD || currentView === AppView.LOGIN ? 'text-blue-600 sm:bg-blue-50 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  <User className="w-5 h-5" />
                  <span className="text-[10px] sm:text-sm uppercase tracking-wider font-bold text-center">Profile</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={`${currentView !== AppView.LANDING && currentView !== AppView.LOGIN ? 'pt-4 sm:pt-24 pb-20 sm:pb-8' : ''} flex-1`}>
        {renderView()}
      </main>

      {/* Footer */}
      {currentView === AppView.LANDING && (
        <footer className="bg-slate-900 text-slate-400 py-16 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
            <div className="md:col-span-2">
              <div className="flex items-center justify-center md:justify-start gap-2 font-black text-3xl text-white mb-6">
                <Briefcase className="w-10 h-10 text-blue-500" />
                SkillBridge
              </div>
              <p className="text-lg max-w-sm">The LinkedIn for skilled labor. Showcase your work, get verified, and grow your career with AI-powered portfolios.</p>
            </div>
            <div>
              <h4 className="font-bold text-white text-xl mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><button onClick={() => navigate(AppView.HOW_IT_WORKS)} className="hover:text-blue-400 transition-colors">How it Works</button></li>
                <li><button onClick={() => navigate(AppView.SAFETY)} className="hover:text-blue-400 transition-colors">Safety</button></li>
                <li><button onClick={() => navigate(AppView.PRICING)} className="hover:text-blue-400 transition-colors">Pricing</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-xl mb-6">Support</h4>
              <ul className="space-y-4">
                <li><button onClick={() => navigate(AppView.HELP_CENTER)} className="hover:text-blue-400 transition-colors">Help Center</button></li>
                <li><button onClick={() => navigate(AppView.CONTACT_US)} className="hover:text-blue-400 transition-colors">Contact Us</button></li>
                <li><button onClick={() => navigate(AppView.TERMS)} className="hover:text-blue-400 transition-colors">Terms of Service</button></li>
              </ul>
            </div>
          </div>
        </footer>
      )}

      {/* Post Gig Modal */}
      {showPostGig && (
        <PostGig
          user={user}
          onClose={() => setShowPostGig(false)}
          addNotification={addNotification}
        />
      )}
    </div>
  );
};

export default App;
