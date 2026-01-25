
import React, { useState } from 'react';
import {
    Send, Briefcase, MapPin, DollarSign, FileText, X,
    Zap, Wrench, Paintbrush, Scissors, Car, Sparkles, Utensils
} from 'lucide-react';
import { gigService } from '../services/authService';
import { User as UserType } from '../types';

interface PostGigProps {
    user: UserType | null;
    onClose: () => void;
    addNotification: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

const CATEGORIES = [
    { id: 'electrician', name: 'Electrician', icon: <Zap className="w-5 h-5" /> },
    { id: 'plumber', name: 'Plumber', icon: <Wrench className="w-5 h-5" /> },
    { id: 'painter', name: 'Painter', icon: <Paintbrush className="w-5 h-5" /> },
    { id: 'beautician', name: 'Beautician', icon: <Scissors className="w-5 h-5" /> },
    { id: 'mechanic', name: 'Mechanic', icon: <Car className="w-5 h-5" /> },
    { id: 'cleaning', name: 'Cleaning', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'cook', name: 'Cook', icon: <Utensils className="w-5 h-5" /> },
];

const PostGig: React.FC<PostGigProps> = ({ user, onClose, addNotification }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [budget, setBudget] = useState('');
    const [location, setLocation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            addNotification('Error', 'Please login to post a gig', 'warning');
            return;
        }

        if (!title || !description || !category || !budget || !location) {
            addNotification('Error', 'Please fill all fields', 'warning');
            return;
        }

        setIsSubmitting(true);
        try {
            // Use backend API instead of Firebase
            await gigService.createGig({
                title,
                description,
                category,
                budget,
                location
            });

            addNotification(
                'Gig Posted! 🎉',
                'Your gig is now visible to professionals.',
                'success'
            );
            onClose();
        } catch (error: any) {
            console.error('Error posting gig:', error);
            // Extract the actual error message from the API response
            let errorMessage = 'Failed to post gig. Please try again.';

            if (error.message) {
                errorMessage = error.message;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            addNotification('Error', errorMessage, 'warning');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Post a New Gig</h2>
                            <p className="text-sm text-slate-500">Professionals will see this instantly</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Gig Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Need Electrician for Home Wiring"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Category
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${category === cat.id
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                >
                                    {cat.icon}
                                    <span className="text-sm">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your requirements in detail..."
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                            required
                        />
                    </div>

                    {/* Budget */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Budget Range
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                placeholder="e.g., ₹2,000 - ₹5,000"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Location
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g., Indiranagar, Bangalore"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${isSubmitting
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                                Posting...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Post Gig
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostGig;
