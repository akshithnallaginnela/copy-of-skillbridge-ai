
import React, { useState, useEffect } from 'react';
import {
    Users, Star, Award, Briefcase, CheckCircle, MessageCircle,
    Search, Filter, Sparkles, Crown, Zap, Wrench, Paintbrush, Scissors, Car
} from 'lucide-react';
import {
    ProfessionalProfile,
    subscribeToProfessionals
} from '../services/firebaseService';
import { User as UserType } from '../types';

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
    const [professionals, setProfessionals] = useState<ProfessionalProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProfessional, setSelectedProfessional] = useState<ProfessionalProfile | null>(null);

    // Subscribe to real-time professional updates
    useEffect(() => {
        setIsLoading(true);
        const unsubscribe = subscribeToProfessionals((updatedProfessionals) => {
            // Sort by rating
            const sorted = updatedProfessionals.sort((a, b) => b.rating - a.rating);
            setProfessionals(sorted);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredProfessionals = professionals.filter((pro) => {
        const matchesCategory = filterCategory === 'all' || pro.category === filterCategory;
        const matchesSearch = !searchQuery ||
            pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pro.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pro.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const categories = ['all', ...new Set(professionals.map(p => p.category))];

    const handleHire = (professional: ProfessionalProfile) => {
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
                    <h1 className="text-3xl font-black text-slate-900">Find Professionals</h1>
                </div>
                <p className="text-slate-500">Discover and hire top-rated professionals for your needs</p>
            </div>

            {/* Real-time indicator */}
            <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700">Real-time updates enabled</span>
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
                            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-700 mb-2">No professionals found</h3>
                            <p className="text-slate-500">New professionals are joining every day!</p>
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
                                            {pro.rating >= 4.5 && (
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
                                                {CATEGORY_ICONS[pro.category] || CATEGORY_ICONS.default}
                                                <span className="capitalize">{pro.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating & Stats */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center gap-1">
                                            {renderStars(pro.rating)}
                                            <span className="text-sm font-semibold text-slate-700 ml-1">{pro.rating.toFixed(1)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-slate-500">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>{pro.completedGigs} gigs done</span>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <p className="text-slate-600 text-sm line-clamp-2 mb-4">{pro.bio}</p>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-2">
                                        {pro.skills.slice(0, 3).map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {pro.skills.length > 3 && (
                                            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">
                                                +{pro.skills.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Availability Badge */}
                                {pro.isAvailable && (
                                    <div className="px-6 py-3 bg-green-50 border-t border-green-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-sm font-medium text-green-700">Available for work</span>
                                        </div>
                                        <span className="text-sm text-green-600">Contact →</span>
                                    </div>
                                )}
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
                            <p className="text-slate-500 capitalize">{selectedProfessional.category}</p>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Rating */}
                            <div className="flex items-center justify-center gap-2 mb-6">
                                {renderStars(selectedProfessional.rating)}
                                <span className="font-bold text-lg">{selectedProfessional.rating.toFixed(1)}</span>
                                <span className="text-slate-500">• {selectedProfessional.completedGigs} gigs completed</span>
                            </div>

                            {/* Bio */}
                            <div className="mb-6">
                                <h3 className="font-bold text-slate-900 mb-2">About</h3>
                                <p className="text-slate-600">{selectedProfessional.bio}</p>
                            </div>

                            {/* Experience */}
                            <div className="mb-6">
                                <h3 className="font-bold text-slate-900 mb-2">Experience</h3>
                                <p className="text-slate-600">{selectedProfessional.experience}</p>
                            </div>

                            {/* Skills */}
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
