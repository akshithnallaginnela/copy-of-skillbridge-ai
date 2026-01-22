import React, { useState, useEffect } from 'react';
import { User as UserType } from '../types';
import { authService } from '../services/authService';
import {
    User, Mail, LogOut, Edit3, Save, X, Camera, Briefcase,
    MapPin, Star, Award, CheckCircle, Clock, DollarSign,
    Phone, Wrench, Plus, Trash2, Mic
} from 'lucide-react';

interface WorkerDashboardProps {
    user: UserType;
    onLogout: () => void;
    onUpdateUser: (user: UserType) => void;
    onNavigateToProfileCreator: () => void;
    addNotification: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

interface AIProfile {
    name: string;
    specialty: string;
    bio: string;
    experience: string;
    skills: string[];
    suggestedLocation?: string;
}

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    skills: string[];
    experience: string;
    specialty: string;
    hourlyRate: string;
}

const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
    user,
    onLogout,
    onUpdateUser,
    onNavigateToProfileCreator,
    addNotification
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData>({
        name: user.name,
        email: user.email,
        phone: '+91 98765 43210',
        location: 'Mumbai, Maharashtra',
        bio: 'Professional worker with years of experience delivering quality services.',
        skills: ['Professional Work', 'Quality Service', 'Customer Satisfaction'],
        experience: '5+ years',
        specialty: 'General Worker',
        hourlyRate: '₹500/hour'
    });
    const [newSkill, setNewSkill] = useState('');
    const [activeGigs] = useState([
        { id: '1', title: 'Kitchen Renovation', status: 'In Progress', budget: '₹15,000', deadline: '2 days' },
        { id: '2', title: 'Office Wiring', status: 'Pending', budget: '₹8,000', deadline: '5 days' },
        { id: '3', title: 'Home Painting', status: 'Completed', budget: '₹12,000', deadline: 'Completed' },
    ]);

    // Load AI-generated profile from localStorage if available
    useEffect(() => {
        const storedProfile = localStorage.getItem('aiGeneratedProfile');
        if (storedProfile) {
            try {
                const aiProfile: AIProfile = JSON.parse(storedProfile);
                setProfileData(prev => ({
                    ...prev,
                    name: aiProfile.name || prev.name,
                    bio: aiProfile.bio || prev.bio,
                    experience: aiProfile.experience || prev.experience,
                    specialty: aiProfile.specialty || prev.specialty,
                    skills: aiProfile.skills && aiProfile.skills.length > 0 ? aiProfile.skills : prev.skills,
                    location: aiProfile.suggestedLocation || prev.location
                }));
            } catch (error) {
                console.error('Failed to load AI profile:', error);
            }
        }
    }, []);

    const handleSave = async () => {
        try {
            const updatedUser = {
                ...user,
                name: profileData.name,
                email: profileData.email
            };

            await authService.updateProfile(updatedUser);
            onUpdateUser(updatedUser);

            // Save profile data to localStorage
            localStorage.setItem('workerProfile', JSON.stringify(profileData));

            setIsEditing(false);
            addNotification('Success', 'Profile updated successfully!', 'success');
        } catch (error) {
            addNotification('Error', 'Failed to update profile. Please try again.', 'warning');
        }
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && profileData.skills.length < 10) {
            setProfileData({
                ...profileData,
                skills: [...profileData.skills, newSkill.trim()]
            });
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setProfileData({
            ...profileData,
            skills: profileData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header with Logout */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 text-white rounded-2xl">
                            <Briefcase className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900">Worker Dashboard</h1>
                            <p className="text-slate-500">Manage your profile and gigs</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 hover:bg-red-50 rounded-2xl transition-all shadow-sm border border-red-100"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="hidden sm:inline font-semibold">Logout</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={user.avatar || 'https://i.pravatar.cc/150?u=' + user.name}
                                        alt={profileData.name}
                                        className="w-24 h-24 rounded-3xl object-cover ring-4 ring-blue-50"
                                    />
                                    <div>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                className="text-3xl font-bold text-slate-900 border-b-2 border-blue-500 focus:outline-none mb-2"
                                            />
                                        ) : (
                                            <h2 className="text-3xl font-bold text-slate-900">{profileData.name}</h2>
                                        )}
                                        <div className="flex items-center gap-2 text-blue-600 font-semibold mt-1">
                                            <Wrench className="w-4 h-4" />
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={profileData.specialty}
                                                    onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
                                                    className="border-b border-blue-300 focus:outline-none"
                                                />
                                            ) : (
                                                <span>{profileData.specialty}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                className="p-3 bg-green-600 text-white hover:bg-green-700 rounded-2xl transition-all shadow-sm"
                                            >
                                                <Save className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="p-3 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-2xl transition-all"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="p-3 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl transition-all shadow-sm"
                                        >
                                            <Edit3 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-2xl">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">4.8</div>
                                    <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        Rating
                                    </div>
                                </div>
                                <div className="text-center border-x border-slate-200">
                                    <div className="text-2xl font-bold text-green-600">127</div>
                                    <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Jobs Done
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">98%</div>
                                    <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
                                        <Award className="w-3 h-3" />
                                        Success Rate
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="flex-1 border-b border-slate-300 focus:outline-none focus:border-blue-500"
                                        />
                                    ) : (
                                        <span>{profileData.email}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Phone className="w-5 h-5 text-blue-600" />
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="flex-1 border-b border-slate-300 focus:outline-none focus:border-blue-500"
                                        />
                                    ) : (
                                        <span>{profileData.phone}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.location}
                                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                            className="flex-1 border-b border-slate-300 focus:outline-none focus:border-blue-500"
                                        />
                                    ) : (
                                        <span>{profileData.location}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <DollarSign className="w-5 h-5 text-blue-600" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.hourlyRate}
                                            onChange={(e) => setProfileData({ ...profileData, hourlyRate: e.target.value })}
                                            className="flex-1 border-b border-slate-300 focus:outline-none focus:border-blue-500"
                                        />
                                    ) : (
                                        <span>{profileData.hourlyRate}</span>
                                    )}
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-3">About Me</h3>
                                {isEditing ? (
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        rows={4}
                                    />
                                ) : (
                                    <p className="text-slate-600 leading-relaxed">{profileData.bio}</p>
                                )}
                            </div>

                            {/* Experience */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-3">Experience</h3>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.experience}
                                        onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <p className="text-slate-600">{profileData.experience}</p>
                                )}
                            </div>

                            {/* Skills */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">Skills</h3>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {profileData.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-2"
                                        >
                                            {skill}
                                            {isEditing && (
                                                <button
                                                    onClick={() => handleRemoveSkill(skill)}
                                                    className="hover:bg-blue-200 rounded-full p-1 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </span>
                                    ))}
                                </div>
                                {isEditing && (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                                            placeholder="Add new skill..."
                                            className="flex-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={handleAddSkill}
                                            className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* AI Profile Enhancement Button */}
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <button
                                    onClick={onNavigateToProfileCreator}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <Mic className="w-5 h-5" />
                                    Enhance Profile with AI Voice-to-Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Active Gigs */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Briefcase className="w-6 h-6 text-blue-600" />
                                Active Gigs
                            </h3>
                            <div className="space-y-3">
                                {activeGigs.map((gig) => (
                                    <div
                                        key={gig.id}
                                        className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-bold text-slate-900">{gig.title}</h4>
                                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${gig.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                    gig.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}>
                                                {gig.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-slate-600">
                                            <span className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                {gig.budget}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {gig.deadline}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl shadow-xl p-6 text-white">
                            <h3 className="text-lg font-bold mb-4">This Month</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-100">Earnings</span>
                                    <span className="text-2xl font-bold">₹45,000</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-100">Jobs Completed</span>
                                    <span className="text-2xl font-bold">12</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-100">New Reviews</span>
                                    <span className="text-2xl font-bold">8</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;
