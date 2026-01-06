
import React, { useState, useEffect } from 'react';
import {
    Users, Star, Award, Briefcase, CheckCircle, MessageCircle,
    Search, Filter, Crown, Zap, Wrench, Paintbrush, Scissors, Car, UserPlus
} from 'lucide-react';
import { db } from '../services/firebaseService';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { User as UserType } from '../types';

interface ProfessionalProfile {
    id: string;
    userId: string;
    name: string;
    email: string;
    bio: string;
    skills: string[];
    category: string;
    experience: string;
    rating: number;
    completedGigs: number;
    isAvailable: boolean;
}

interface RegisteredProfessional {
    id: string;
    name: string;
    email: string;
    role: string;
    bio?: string;
    skills?: string[];
    category?: string;
    rating?: number;
    completedGigs?: number;
}

interface FindProfessionalProps {
    user: UserType | null;
    addNotification: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

const CATEGORY_ICONS: { [key: string]: React.ReactNode } = {
    electrician: <Zap className="w-5 h-5" />,
    plumber: <Wrench className="w-5 h-5" />,
    painter: <Paintbrush className="w-5 h-5" />,
    beautician: <Scissors className="w-5 h-5" />,
    mechanic: <Car className="w-5 h-5" />,
    default: <Briefcase className="w-5 h-5" />
};

const FindProfessional: React.FC<FindProfessionalProps> = ({ user, addNotification }) => {
    const [professionals, setProfessionals] = useState<RegisteredProfessional[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProfessional, setSelectedProfessional] = useState<RegisteredProfessional | null>(null);

    // Fetch registered professionals (WORKER users) from Firebase
    useEffect(() => {
        setIsLoading(true);

        // First check the professionals collection
        const professionalsRef = collection(db, 'professionals');
        const proQuery = query(professionalsRef, where('isAvailable', '==', true));

        // Also check the users collection for WORKER roles
        const usersRef = collection(db, 'users');

        const unsubscribeProfessionals = onSnapshot(proQuery, async (proSnapshot) => {
            const allProfessionals: RegisteredProfessional[] = [];

            // Add from professionals collection
            proSnapshot.forEach((doc) => {
                const data = doc.data();
                allProfessionals.push({
                    id: doc.id,
                    name: data.name,
                    email: data.email,
                    role: 'WORKER',
                    bio: data.bio,
                    skills: data.skills || [],
                    category: data.category,
                    rating: data.rating || 4.5,
                    completedGigs: data.completedGigs || 0
                });
            });

            // Also fetch WORKER users
            try {
                const usersSnapshot = await getDocs(query(usersRef, where('role', '==', 'WORKER')));
                usersSnapshot.forEach((doc) => {
                    const data = doc.data();
                    // Avoid duplicates
                    if (!allProfessionals.find(p => p.email === data.email)) {
                        allProfessionals.push({
                            id: doc.id,
                            name: data.name,
                            email: data.email,
                            role: 'WORKER',
                            bio: data.bio || `Professional ${data.name} ready to help!`,
                            skills: data.skills || ['Professional Service'],
                            category: data.category || 'general',
                            rating: data.rating || 4.0,
                            completedGigs: data.completedGigs || 0
                        });
                    }
                });
            } catch (err) {
                console.log('Error fetching users:', err);
            }

            // Sort by rating (highest first)
            const sortedPros = allProfessionals.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            setProfessionals(sortedPros);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching professionals:', error);
            setIsLoading(false);
        });

        return () => unsubscribeProfessionals();
    }, []);

    const filteredProfessionals = professionals.filter((pro) => {
        const matchesCategory = filterCategory === 'all' || pro.category === filterCategory;
        const matchesSearch = !searchQuery ||
            pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (pro.bio && pro.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (pro.skills && pro.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
        return matchesCategory && matchesSearch;
    });

    const uniqueCategories = professionals.map(p => p.category || 'general').filter((v, i, a) => a.indexOf(v) === i);
    const categories: string[] = ['all', ...uniqueCategories];

    const handleHire = (professional: RegisteredProfessional) => {
        addNotification(
            'Contact Request Sent',
            `Your request to hire ${professional.name} has been sent!`,
            'success'
        );
        setSelectedProfessional(null);
    };

    const renderStars = (rating: number) => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Users className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-black text-slate-900">Hire Professionals</h1>
                </div>
                <p className="text-slate-500">Discover registered professionals ready to help you</p>
            </div>

            {/* Real-time indicator */}
            <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700">Real-time updates • Registered Professionals Only</span>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or skill..."
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
                        <p className="text-slate-600 font-medium">Loading professionals...</p>
                    </div>
                </div>
            )}

            {/* Professionals Grid */}
            {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProfessionals.length === 0 ? (
                        <div className="col-span-2 text-center py-16">
                            <UserPlus className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-700 mb-2">No professionals found</h3>
                            <p className="text-slate-500">New professionals are joining every day!</p>
                            <p className="text-sm text-slate-400 mt-2">Professionals who sign up will appear here.</p>
                        </div>
                    ) : (
                        filteredProfessionals.map((pro) => (
                            <div
                                key={pro.id}
                                onClick={() => setSelectedProfessional(pro)}
                                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                                                {pro.name.charAt(0)}
                                            </div>
                                            {(pro.rating || 0) >= 4.5 && (
                                                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                                                    <Crown className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {pro.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                {CATEGORY_ICONS[pro.category || 'default'] || CATEGORY_ICONS.default}
                                                <span className="capitalize">{pro.category || 'Professional'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating & Stats */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center gap-1">
                                            {renderStars(pro.rating || 4)}
                                            <span className="text-sm font-semibold text-slate-700 ml-1">{(pro.rating || 4).toFixed(1)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-slate-500">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>{pro.completedGigs || 0} gigs done</span>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <p className="text-slate-600 text-sm line-clamp-2 mb-4">{pro.bio || 'Ready to help with your needs!'}</p>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-2">
                                        {(pro.skills || []).slice(0, 3).map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {(pro.skills || []).length > 3 && (
                                            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">
                                                +{(pro.skills || []).length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Availability Badge */}
                                <div className="px-6 py-3 bg-green-50 border-t border-green-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-sm font-medium text-green-700">Available for work</span>
                                    </div>
                                    <span className="text-sm text-green-600">View Profile →</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Professional Detail Modal */}
            {selectedProfessional && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedProfessional(null)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 text-center border-b border-slate-100">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                                {selectedProfessional.name.charAt(0)}
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-1">{selectedProfessional.name}</h2>
                            <p className="text-slate-500 capitalize">{selectedProfessional.category || 'Professional'}</p>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Rating */}
                            <div className="flex items-center justify-center gap-2 mb-6">
                                {renderStars(selectedProfessional.rating || 4)}
                                <span className="font-bold text-lg">{(selectedProfessional.rating || 4).toFixed(1)}</span>
                                <span className="text-slate-500">• {selectedProfessional.completedGigs || 0} gigs completed</span>
                            </div>

                            {/* Bio */}
                            <div className="mb-6">
                                <h3 className="font-bold text-slate-900 mb-2">About</h3>
                                <p className="text-slate-600">{selectedProfessional.bio || 'Ready to help with your needs!'}</p>
                            </div>

                            {/* Skills */}
                            {selectedProfessional.skills && selectedProfessional.skills.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-bold text-slate-900 mb-2">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProfessional.skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-xl"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleHire(selectedProfessional)}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all"
                                >
                                    <Briefcase className="w-5 h-5" />
                                    Hire Now
                                </button>
                                <button
                                    onClick={() => setSelectedProfessional(null)}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            {!isLoading && filteredProfessionals.length > 0 && (
                <div className="mt-8 p-4 bg-slate-50 rounded-2xl text-center">
                    <p className="text-slate-600">
                        <span className="font-bold text-blue-600">{filteredProfessionals.length}</span> professionals available
                    </p>
                </div>
            )}
        </div>
    );
};

export default FindProfessional;
