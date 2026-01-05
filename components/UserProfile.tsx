import React, { useState, useEffect } from 'react';
import { User as UserType } from '../types';
import { authService } from '../services/authService';
import {
    User, Mail, Phone, MapPin, Briefcase, Star, Award,
    Edit3, Save, X, Camera, Plus, Trash2, Building2,
    Wrench, CheckCircle, AlertCircle
} from 'lucide-react';

interface UserProfileProps {
    user: UserType;
    onUpdateUser: (user: UserType) => void;
    addNotification: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    // Worker-specific
    skills: string[];
    experience: string;
    hourlyRate: string;
    // Customer-specific
    company: string;
    projectsPosted: number;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser, addNotification }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [profileData, setProfileData] = useState<ProfileData>({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        location: '',
        bio: '',
        skills: [],
        experience: '',
        hourlyRate: '',
        company: '',
        projectsPosted: 0
    });

    useEffect(() => {
        // Load profile data from user object
        setProfileData({
            name: user.name || '',
            email: user.email || '',
            phone: (user as any).profile?.phone || '',
            location: (user as any).profile?.location || '',
            bio: (user as any).profile?.bio || '',
            skills: (user as any).profile?.skills || [],
            experience: (user as any).profile?.experience || '',
            hourlyRate: (user as any).profile?.hourlyRate || '',
            company: (user as any).profile?.company || '',
            projectsPosted: (user as any).profile?.projectsPosted || 0
        });
    }, [user]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const response = await authService.updateProfile({
                name: profileData.name,
                profile: {
                    phone: profileData.phone,
                    location: profileData.location,
                    bio: profileData.bio,
                    skills: profileData.skills,
                    experience: profileData.experience,
                    hourlyRate: profileData.hourlyRate,
                    company: profileData.company
                }
            });

            if (response.success && response.user) {
                onUpdateUser(response.user);
                addNotification("Profile Updated", "Your profile has been saved successfully!", "success");
                setIsEditing(false);
            }
        } catch (error: any) {
            addNotification("Update Failed", error.message || "Failed to update profile", "warning");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
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

    const isWorker = user.role === 'WORKER';

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className={`rounded-[40px] p-8 shadow-2xl border relative overflow-hidden ${isWorker ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100'
                }`}>
                {/* Edit Button */}
                <div className="absolute top-6 right-6">
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-3 bg-white text-slate-500 hover:text-red-500 rounded-2xl shadow-sm transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className={`p-3 text-white rounded-2xl shadow-lg transition-all ${isWorker ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
                                    }`}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className={`flex items-center gap-2 px-4 py-3 text-white rounded-2xl shadow-lg transition-all ${isWorker ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
                                }`}
                        >
                            <Edit3 className="w-5 h-5" />
                            <span className="font-bold">Edit Profile</span>
                        </button>
                    )}
                </div>

                {/* Avatar & Basic Info */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                    <div className="relative">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-32 h-32 rounded-3xl object-cover ring-4 ring-white shadow-xl"
                        />
                        {isEditing && (
                            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-xl shadow-lg hover:bg-slate-50">
                                <Camera className="w-5 h-5 text-slate-600" />
                            </button>
                        )}
                        <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${isWorker ? 'bg-blue-600' : 'bg-emerald-600'
                            }`}>
                            {isWorker ? 'Professional' : 'Client'}
                        </div>
                    </div>

                    <div className="text-center sm:text-left flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                className="text-3xl font-black text-slate-900 bg-white border-2 border-slate-200 rounded-2xl px-4 py-2 w-full max-w-md focus:border-blue-500 focus:outline-none"
                                placeholder="Your Name"
                            />
                        ) : (
                            <h1 className="text-3xl font-black text-slate-900 mb-2">{profileData.name}</h1>
                        )}
                        <p className={`text-lg font-semibold ${isWorker ? 'text-blue-600' : 'text-emerald-600'}`}>
                            {isWorker ? 'Skilled Professional' : 'Project Owner'}
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-slate-500">
                            <Mail className="w-4 h-4" />
                            <span>{profileData.email}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {isWorker ? (
                        <>
                            <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                                <div className="text-2xl font-black text-blue-600">4.8</div>
                                <div className="text-sm text-slate-500 flex items-center justify-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500" /> Rating
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                                <div className="text-2xl font-black text-indigo-600">24</div>
                                <div className="text-sm text-slate-500">Jobs Done</div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                                <div className="text-2xl font-black text-green-600">96%</div>
                                <div className="text-sm text-slate-500">Success Rate</div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                                <div className="text-2xl font-black text-purple-600">2y</div>
                                <div className="text-sm text-slate-500">Experience</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                                <div className="text-2xl font-black text-emerald-600">12</div>
                                <div className="text-sm text-slate-500">Jobs Posted</div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                                <div className="text-2xl font-black text-blue-600">8</div>
                                <div className="text-sm text-slate-500">Active Projects</div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                                <div className="text-2xl font-black text-green-600">₹45K</div>
                                <div className="text-sm text-slate-500">Total Spent</div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                                <div className="text-2xl font-black text-teal-600">15</div>
                                <div className="text-sm text-slate-500">Hired Pros</div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Profile Details */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <User className={`w-5 h-5 ${isWorker ? 'text-blue-600' : 'text-emerald-600'}`} />
                        Contact Information
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-500 mb-2">Phone Number</label>
                            {isEditing ? (
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            ) : (
                                <p className="text-lg text-slate-900 flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-slate-400" />
                                    {profileData.phone || 'Not provided'}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-500 mb-2">Location</label>
                            {isEditing ? (
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={profileData.location}
                                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                        placeholder="Bangalore, Karnataka"
                                    />
                                </div>
                            ) : (
                                <p className="text-lg text-slate-900 flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-slate-400" />
                                    {profileData.location || 'Not provided'}
                                </p>
                            )}
                        </div>

                        {!isWorker && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-500 mb-2">Company</label>
                                {isEditing ? (
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={profileData.company}
                                            onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                            placeholder="Your Company Name"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-lg text-slate-900 flex items-center gap-3">
                                        <Building2 className="w-5 h-5 text-slate-400" />
                                        {profileData.company || 'Not provided'}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bio / About */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Briefcase className={`w-5 h-5 ${isWorker ? 'text-blue-600' : 'text-emerald-600'}`} />
                        {isWorker ? 'About Me' : 'About'}
                    </h3>

                    {isEditing ? (
                        <textarea
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none h-40"
                            placeholder={isWorker
                                ? "Tell clients about your experience, expertise, and what makes you unique..."
                                : "Tell professionals about your projects and what you're looking for..."
                            }
                        />
                    ) : (
                        <p className="text-slate-600 leading-relaxed">
                            {profileData.bio || (isWorker
                                ? "No bio added yet. Click 'Edit Profile' to add your professional summary."
                                : "No description added yet. Click 'Edit Profile' to tell professionals about your projects."
                            )}
                        </p>
                    )}
                </div>

                {/* Worker-specific: Skills */}
                {isWorker && (
                    <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Wrench className="w-5 h-5 text-blue-600" />
                            Skills & Expertise
                        </h3>

                        {isEditing && (
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                                    className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                    placeholder="Add a skill (e.g., Plumbing)"
                                />
                                <button
                                    onClick={handleAddSkill}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {profileData.skills.length > 0 ? (
                                profileData.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm flex items-center gap-2"
                                    >
                                        {skill}
                                        {isEditing && (
                                            <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500">
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </span>
                                ))
                            ) : (
                                <p className="text-slate-500 italic">No skills added yet</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Worker-specific: Experience & Rate */}
                {isWorker && (
                    <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Award className="w-5 h-5 text-blue-600" />
                            Experience & Rates
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-500 mb-2">Years of Experience</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.experience}
                                        onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                        placeholder="e.g., 5 years"
                                    />
                                ) : (
                                    <p className="text-lg text-slate-900">{profileData.experience || 'Not specified'}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-500 mb-2">Hourly Rate</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.hourlyRate}
                                        onChange={(e) => setProfileData({ ...profileData, hourlyRate: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                        placeholder="e.g., ₹500/hour"
                                    />
                                ) : (
                                    <p className="text-lg text-slate-900">{profileData.hourlyRate || 'Not specified'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Customer-specific: Preferences */}
                {!isWorker && (
                    <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 md:col-span-2">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                            Hiring Preferences
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <h4 className="font-bold text-emerald-800 mb-2">Preferred Categories</h4>
                                <div className="flex flex-wrap gap-1">
                                    {['Plumbing', 'Electrical', 'Cleaning'].map((cat) => (
                                        <span key={cat} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <h4 className="font-bold text-blue-800 mb-2">Budget Range</h4>
                                <p className="text-blue-700">₹500 - ₹5,000 per job</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                                <h4 className="font-bold text-purple-800 mb-2">Verified Pros Only</h4>
                                <p className="text-purple-700 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Enabled
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Verification Badge */}
            <div className={`mt-8 p-6 rounded-3xl border-2 border-dashed flex items-center justify-between ${isWorker ? 'border-blue-200 bg-blue-50/50' : 'border-emerald-200 bg-emerald-50/50'
                }`}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isWorker ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">Complete Your Profile</h4>
                        <p className="text-slate-500 text-sm">
                            {isWorker
                                ? "Add more details to get verified and attract more clients!"
                                : "Complete your profile to help professionals understand your needs better."
                            }
                        </p>
                    </div>
                </div>
                <div className={`text-2xl font-black ${isWorker ? 'text-blue-600' : 'text-emerald-600'}`}>
                    60%
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
