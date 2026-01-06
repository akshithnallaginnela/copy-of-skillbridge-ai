
import React, { useState, useEffect } from 'react';
import {
    Briefcase, MapPin, DollarSign, Clock, User, CheckCircle,
    Search, Filter, Zap, Wrench, Paintbrush, RefreshCw
} from 'lucide-react';
import {
    Gig,
    subscribeToOpenGigs
} from '../services/firebaseService';
import { User as UserType } from '../types';
import { db } from '../services/firebaseService';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

interface FindWorkProps {
    user: UserType | null;
    addNotification: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

const CATEGORY_ICONS: { [key: string]: React.ReactNode } = {
    electrician: <Zap className="w-5 h-5" />,
    plumber: <Wrench className="w-5 h-5" />,
    painter: <Paintbrush className="w-5 h-5" />,
    default: <Briefcase className="w-5 h-5" />
};

const FindWork: React.FC<FindWorkProps> = ({ user, addNotification }) => {
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [acceptingGigId, setAcceptingGigId] = useState<string | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Subscribe to real-time gig updates from Firebase
    useEffect(() => {
        setIsLoading(true);

        // Query for open gigs only
        const gigsRef = collection(db, 'gigs');
        const q = query(
            gigsRef,
            where('status', '==', 'open'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const gigsData: Gig[] = [];
            snapshot.forEach((doc) => {
                gigsData.push({ id: doc.id, ...doc.data() } as Gig);
            });
            console.log('Fetched gigs:', gigsData.length);
            setGigs(gigsData);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching gigs:', error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAcceptGig = async (gig: Gig) => {
        if (!user || !gig.id) return;

        setAcceptingGigId(gig.id);
        try {
            const gigRef = doc(db, 'gigs', gig.id);
            await updateDoc(gigRef, {
                status: 'accepted',
                acceptedBy: user.id,
                acceptedByName: user.name,
                updatedAt: serverTimestamp()
            });
            addNotification(
                'Gig Accepted! 🎉',
                `You accepted "${gig.title}". The client will be notified.`,
                'success'
            );
        } catch (error) {
            console.error('Error accepting gig:', error);
            addNotification('Error', 'Failed to accept gig. Please try again.', 'warning');
        } finally {
            setAcceptingGigId(null);
        }
    };

    const filteredGigs = gigs.filter((gig) => {
        const matchesCategory = filterCategory === 'all' || gig.category === filterCategory;
        const matchesSearch = !searchQuery ||
            gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            gig.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const uniqueCategories = gigs.map(g => g.category).filter((v, i, a) => a.indexOf(v) === i);
    const categories: string[] = ['all', ...uniqueCategories];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-black text-slate-900">Find Work</h1>
                </div>
                <p className="text-slate-500">Browse and accept gigs posted by clients in real-time</p>
            </div>

            {/* Real-time indicator */}
            <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700">Real-time updates enabled • Firebase Connected</span>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search gigs..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-slate-400" />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate-600 font-medium">Loading available gigs...</p>
                    </div>
                </div>
            )}

            {/* Gigs List */}
            {!isLoading && (
                <div className="space-y-4">
                    {filteredGigs.length === 0 ? (
                        <div className="text-center py-16">
                            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-700 mb-2">No gigs available</h3>
                            <p className="text-slate-500">Check back later for new opportunities!</p>
                            <p className="text-sm text-slate-400 mt-2">Gigs posted by clients will appear here in real-time.</p>
                        </div>
                    ) : (
                        filteredGigs.map((gig) => (
                            <div
                                key={gig.id}
                                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
                            >
                                <div className="p-6">
                                    {/* Gig Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                                {CATEGORY_ICONS[gig.category] || CATEGORY_ICONS.default}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{gig.title}</h3>
                                                <span className="text-sm text-slate-500 capitalize">{gig.category}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                                            <span className="text-sm font-medium text-green-700">Open</span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-slate-600 mb-4 line-clamp-2">{gig.description}</p>

                                    {/* Details */}
                                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <DollarSign className="w-4 h-4" />
                                            <span className="font-medium">{gig.budget}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <MapPin className="w-4 h-4" />
                                            <span>{gig.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <User className="w-4 h-4" />
                                            <span>Posted by {gig.clientName}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                                            <Clock className="w-4 h-4" />
                                            <span>Posted recently</span>
                                        </div>
                                        <button
                                            onClick={() => handleAcceptGig(gig)}
                                            disabled={acceptingGigId === gig.id || !user}
                                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${acceptingGigId === gig.id
                                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                                                }`}
                                        >
                                            {acceptingGigId === gig.id ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                                                    Accepting...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-5 h-5" />
                                                    Accept Gig
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Stats */}
            {!isLoading && filteredGigs.length > 0 && (
                <div className="mt-8 p-4 bg-slate-50 rounded-2xl text-center">
                    <p className="text-slate-600">
                        <span className="font-bold text-blue-600">{filteredGigs.length}</span> open gigs available
                    </p>
                </div>
            )}
        </div>
    );
};

export default FindWork;
