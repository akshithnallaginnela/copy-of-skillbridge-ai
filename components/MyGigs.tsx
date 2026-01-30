
import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, MapPin, Clock, ArrowRight, PlusCircle, X, Sparkles, Loader2, Send, CheckCircle2 } from 'lucide-react';
import { Gig } from '../types';
import { refineGig } from '../services/geminiService';
import axios from 'axios';

interface MyGigsProps {
  addNotification: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  userRole?: 'WORKER' | 'CUSTOMER';
}

const MyGigs: React.FC<MyGigsProps> = ({ addNotification, userRole = 'CUSTOMER' }) => {
  const [gigs, setGigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [rawInput, setRawInput] = useState('');

  const [newGig, setNewGig] = useState({
    title: '',
    description: '',
    category: 'Plumbing',
    budget: '',
    location: 'My Current Location'
  });

  // Fetch user's gigs from backend
  useEffect(() => {
    fetchGigs();
  }, [userRole]);

  const fetchGigs = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      // Use different endpoints based on user role
      const endpoint = userRole === 'WORKER' ? '/api/gigs/applied' : '/api/gigs';

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setGigs(response.data.gigs || []);
      }
    } catch (error: any) {
      console.error('Error fetching gigs:', error);
      addNotification('Error', 'Failed to load your gigs', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!rawInput.trim()) return;
    setIsRefining(true);
    try {
      const refined = await refineGig(rawInput);
      setNewGig({
        ...newGig,
        title: refined.title,
        description: refined.description,
        category: refined.category,
        budget: refined.suggestedBudget
      });
      addNotification("AI Assistant", "Job details refined and formatted professionally.", "info");
    } catch (error) {
      console.error("AI Refinement failed", error);
    } finally {
      setIsRefining(false);
    }
  };

  const handlePostGig = () => {
    const gigToAdd: Gig = {
      id: 'g' + (gigs.length + 1),
      title: newGig.title,
      description: newGig.description,
      location: newGig.location,
      budget: newGig.budget,
      category: newGig.category,
      status: 'Open',
      type: 'Posted',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setGigs([gigToAdd, ...gigs]);
    setIsCreating(false);
    setRawInput('');
    setNewGig({ title: '', description: '', category: 'Plumbing', budget: '', location: 'My Current Location' });
    addNotification("Job Posted", `"${gigToAdd.title}" is now visible to professionals near you.`, "success");
  };

  const handleUpdateStatus = async (id: string, newStatus: 'Accepted' | 'Completed') => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/gigs/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Update local state
        setGigs(prev => prev.map(g => (g._id === id || g.id === id) ? { ...g, status: newStatus } : g));

        if (newStatus === 'Completed') {
          addNotification("Work Completed! 🎉", `"${response.data.gig.title}" has been marked as completed.`, "success");
        } else if (newStatus === 'Accepted') {
          addNotification("Gig Update", `Application has been accepted!`, "success");
        }

        // Refresh gigs list
        await fetchGigs();
      }
    } catch (error: any) {
      console.error('Error updating gig status:', error);
      addNotification('Error', error.response?.data?.message || 'Failed to update gig status', 'warning');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (isCreating) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-slate-900">Post a Job</h1>
          <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-slate-100 rounded-full">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">AI Assistant</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Describe what you need in plain words</h3>
            <div className="relative">
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="Ex: 'Need an electrician to fix my living room fan...'"
                className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
              />
              <button
                onClick={handleRefine}
                disabled={isRefining || !rawInput.trim()}
                className="absolute bottom-3 right-3 px-4 py-2 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isRefining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Refine
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <input
              type="text"
              value={newGig.title}
              onChange={(e) => setNewGig({ ...newGig, title: e.target.value })}
              placeholder="Job Title"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={newGig.category}
                onChange={(e) => setNewGig({ ...newGig, category: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
              >
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Beauty</option>
                <option>Cleaning</option>
                <option>Carpentry</option>
              </select>
              <input
                type="text"
                value={newGig.budget}
                onChange={(e) => setNewGig({ ...newGig, budget: e.target.value })}
                placeholder="₹ Budget"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
              />
            </div>
            <textarea
              value={newGig.description}
              onChange={(e) => setNewGig({ ...newGig, description: e.target.value })}
              placeholder="Details..."
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none"
            />
            <button
              onClick={handlePostGig}
              disabled={!newGig.title || !newGig.description}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl hover:bg-blue-700 transition-all"
            >
              Post Job
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            {userRole === 'WORKER' ? 'My Applications' : 'My Posted Jobs'}
          </h1>
          <p className="text-slate-500">
            {userRole === 'WORKER'
              ? 'Track your job applications and active work.'
              : 'Manage your job posts and review applicants.'}
          </p>
        </div>
        {userRole === 'CUSTOMER' && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg"
          >
            <PlusCircle className="w-5 h-5" />
            Post New Job
          </button>
        )}
      </div>

      {/* Role-based info banner */}
      <div className={`mb-6 p-4 rounded-2xl border ${userRole === 'WORKER'
        ? 'bg-blue-50 border-blue-200'
        : 'bg-emerald-50 border-emerald-200'
        }`}>
        <p className={`text-sm font-semibold ${userRole === 'WORKER' ? 'text-blue-700' : 'text-emerald-700'
          }`}>
          {userRole === 'WORKER'
            ? `📋 You have ${gigs.length} job application${gigs.length !== 1 ? 's' : ''} to track`
            : `💼 You have ${gigs.length} active job posting${gigs.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading your gigs...</p>
          </div>
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
          <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">
            {userRole === 'WORKER' ? 'No applications yet' : 'No posted gigs yet'}
          </h3>
          <p className="text-slate-500">
            {userRole === 'WORKER'
              ? 'Start applying for gigs in the "Find Work" section!'
              : 'Post your first gig to get started!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {gigs.map((gig) => (
            <div key={gig._id || gig.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600">{gig.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {gig.createdAt ? new Date(gig.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                      </span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {gig.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(gig.status)}`}>
                    {gig.status}
                  </span>
                  <span className="text-xl font-black text-slate-900">{gig.budget}</span>
                </div>
              </div>

              <p className="text-slate-600 mb-6">{gig.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Status Updated recently</span>
                </div>

                {userRole === 'WORKER' ? (
                  // Worker view: Show application status actions
                  <>
                    {gig.status === 'Pending' && (
                      <span className="text-sm text-amber-600 font-semibold">
                        ⏳ Waiting for client response...
                      </span>
                    )}
                    {gig.status === 'Accepted' && (
                      <div className="flex items-center gap-2 text-blue-600 font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                        Work in Progress
                      </div>
                    )}
                    {gig.status === 'Completed' && (
                      <div className="flex items-center gap-2 text-green-600 font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                        Completed! 🎉
                      </div>
                    )}
                  </>
                ) : (
                  // Customer view: Show job management actions
                  <>
                    {gig.status === 'Open' && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 font-medium">
                          Waiting for applications...
                        </span>
                      </div>
                    )}
                    {gig.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(gig._id || gig.id, 'Completed')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-md"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Mark as Completed
                      </button>
                    )}
                    {gig.status === 'Accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(gig._id || gig.id, 'Completed')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-md"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Mark as Completed
                      </button>
                    )}
                    {gig.status === 'Completed' && (
                      <div className="flex items-center gap-2 text-green-600 font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                        Work Completed ✓
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGigs;
