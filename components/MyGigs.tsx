
import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, MapPin, Clock, ArrowRight, PlusCircle, X, Sparkles, Loader2, CheckCircle2, User, DollarSign } from 'lucide-react';
import { db, Gig } from '../services/firebaseService';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { User as UserType } from '../types';

interface MyGigsProps {
  addNotification: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  userRole?: 'WORKER' | 'CUSTOMER';
  user?: UserType | null;
}

const MyGigs: React.FC<MyGigsProps> = ({ addNotification, userRole = 'CUSTOMER', user }) => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to user-specific gigs from Firebase
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const gigsRef = collection(db, 'gigs');

    let q;
    if (userRole === 'WORKER') {
      // For professionals: Show gigs they have ACCEPTED
      q = query(
        gigsRef,
        where('acceptedBy', '==', user.id),
        orderBy('updatedAt', 'desc')
      );
    } else {
      // For clients: Show gigs they have POSTED
      q = query(
        gigsRef,
        where('clientId', '==', user.id),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const gigsData: Gig[] = [];
      snapshot.forEach((doc) => {
        gigsData.push({ id: doc.id, ...doc.data() } as Gig);
      });
      console.log(`Fetched ${userRole} gigs:`, gigsData.length);
      setGigs(gigsData);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching my gigs:', error);
      // Try without ordering if index not available
      const simpleQuery = userRole === 'WORKER'
        ? query(gigsRef, where('acceptedBy', '==', user.id))
        : query(gigsRef, where('clientId', '==', user.id));

      onSnapshot(simpleQuery, (snapshot) => {
        const gigsData: Gig[] = [];
        snapshot.forEach((doc) => {
          gigsData.push({ id: doc.id, ...doc.data() } as Gig);
        });
        setGigs(gigsData);
        setIsLoading(false);
      });
    });

    return () => unsubscribe();
  }, [user, userRole]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'open': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'open': return 'Open';
      default: return status;
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">Login Required</h3>
          <p className="text-slate-500">Please login to view your gigs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            {userRole === 'WORKER' ? 'My Accepted Gigs' : 'My Posted Gigs'}
          </h1>
          <p className="text-slate-500">
            {userRole === 'WORKER'
              ? 'Track gigs you have accepted from clients.'
              : 'Manage your job posts posted for professionals.'}
          </p>
        </div>
      </div>

      {/* Real-time indicator */}
      <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 rounded-xl border border-green-200">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium text-green-700">Real-time updates enabled • Firebase Connected</span>
      </div>

      {/* Role-based info banner */}
      <div className={`mb-6 p-4 rounded-2xl border ${userRole === 'WORKER'
        ? 'bg-blue-50 border-blue-200'
        : 'bg-emerald-50 border-emerald-200'
        }`}>
        <p className={`text-sm font-semibold ${userRole === 'WORKER' ? 'text-blue-700' : 'text-emerald-700'
          }`}>
          {userRole === 'WORKER'
            ? `📋 You have ${gigs.length} accepted gig${gigs.length !== 1 ? 's' : ''}`
            : `💼 You have ${gigs.length} posted gig${gigs.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading your gigs...</p>
          </div>
        </div>
      )}

      {/* Gigs List */}
      {!isLoading && (
        <div className="space-y-4">
          {gigs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
              <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">
                {userRole === 'WORKER' ? 'No accepted gigs yet' : 'No posted gigs yet'}
              </h3>
              <p className="text-slate-500">
                {userRole === 'WORKER'
                  ? 'Go to "Find Work" to browse and accept gigs from clients.'
                  : 'Click "Post Gig" in the navigation to create your first gig.'}
              </p>
            </div>
          ) : (
            gigs.map((gig) => (
              <div key={gig.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600">{gig.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                        <span className="flex items-center gap-1 capitalize">
                          <Briefcase className="w-4 h-4" /> {gig.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {gig.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(gig.status)}`}>
                      {formatStatus(gig.status)}
                    </span>
                    <span className="text-xl font-black text-slate-900">{gig.budget}</span>
                  </div>
                </div>

                <p className="text-slate-600 mb-6">{gig.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-400">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {userRole === 'WORKER'
                        ? `Client: ${gig.clientName}`
                        : gig.acceptedByName
                          ? `Accepted by: ${gig.acceptedByName}`
                          : 'Waiting for professional...'}
                    </span>
                  </div>

                  {userRole === 'WORKER' ? (
                    // Worker view: Show job actions
                    <>
                      {gig.status === 'accepted' && (
                        <button className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
                          Start Work <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                      {gig.status === 'in_progress' && (
                        <button className="flex items-center gap-2 text-green-600 font-bold hover:gap-3 transition-all">
                          <CheckCircle2 className="w-5 h-5" />
                          Mark Complete
                        </button>
                      )}
                    </>
                  ) : (
                    // Customer view: Show job management actions
                    <>
                      {gig.status === 'open' && (
                        <span className="text-sm text-amber-600 font-semibold">
                          ⏳ Waiting for professional...
                        </span>
                      )}
                      {gig.status === 'accepted' && (
                        <button className="flex items-center gap-2 text-green-600 font-bold">
                          <CheckCircle2 className="w-5 h-5" />
                          Professional Hired!
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyGigs;
