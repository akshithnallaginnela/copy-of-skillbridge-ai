
import React, { useState } from 'react';
import {
    User, Mail, LogOut, Shield, Edit2, Save, X,
    AlertTriangle, CheckCircle, Briefcase, Search
} from 'lucide-react';
import { User as UserType } from '../types';
import { authService } from '../services/authService';

interface AccountSettingsProps {
    user: UserType;
    onLogout: () => void;
    onUpdateUser: (user: UserType) => void;
    addNotification: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
    user,
    onLogout,
    onUpdateUser,
    addNotification
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(user.name);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!editedName.trim()) {
            addNotification('Error', 'Name cannot be empty', 'warning');
            return;
        }

        setIsSaving(true);
        try {
            // Update user profile
            const updatedUser = { ...user, name: editedName };
            onUpdateUser(updatedUser);
            setIsEditing(false);
            addNotification('Success', 'Profile updated successfully', 'success');
        } catch (error) {
            addNotification('Error', 'Failed to update profile', 'warning');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        onLogout();
        addNotification('Logged Out', 'You have been successfully logged out', 'info');
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Account Settings</h1>
                <p className="text-slate-500">Manage your account and preferences</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Profile Information
                    </h2>
                </div>

                <div className="p-6 space-y-6">
                    {/* Avatar and Basic Info */}
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                        placeholder="Your name"
                                    />
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
                                    >
                                        <Save className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditedName(user.name);
                                        }}
                                        className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                                        <p className="text-slate-500 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            {user.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Role Badge */}
                    <div className="p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {user.role === 'WORKER' ? (
                                    <div className="p-2 bg-blue-100 rounded-xl">
                                        <Briefcase className="w-5 h-5 text-blue-600" />
                                    </div>
                                ) : (
                                    <div className="p-2 bg-emerald-100 rounded-xl">
                                        <Search className="w-5 h-5 text-emerald-600" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-slate-500">Account Type</p>
                                    <p className="font-bold text-slate-900">
                                        {user.role === 'WORKER' ? 'Professional' : 'Client'}
                                    </p>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${user.role === 'WORKER'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                {user.role === 'WORKER' ? 'I provide services' : 'I hire professionals'}
                            </div>
                        </div>
                    </div>

                    {/* Role Lock Notice */}
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-amber-800">Account Type is Locked</p>
                            <p className="text-sm text-amber-700">
                                Your account type was set when you signed up and cannot be changed.
                                {user.role === 'WORKER'
                                    ? ' As a Professional, you can find and accept gigs from clients.'
                                    : ' As a Client, you can post gigs and hire professionals.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        Security
                    </h2>
                </div>

                <div className="p-6">
                    <button
                        className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group"
                        onClick={() => addNotification('Coming Soon', 'Password change feature will be available soon', 'info')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-xl">
                                <Shield className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-slate-900">Change Password</p>
                                <p className="text-sm text-slate-500">Update your account password</p>
                            </div>
                        </div>
                        <span className="text-slate-400 group-hover:text-blue-600 transition-colors">→</span>
                    </button>
                </div>
            </div>

            {/* Logout Section */}
            <div className="bg-white rounded-3xl border border-red-100 shadow-sm overflow-hidden">
                <div className="p-6">
                    {showLogoutConfirm ? (
                        <div className="text-center py-4">
                            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Logout</h3>
                            <p className="text-slate-500 mb-6">Are you sure you want to log out?</p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all flex items-center gap-2"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="w-full flex items-center justify-between p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-xl">
                                    <LogOut className="w-5 h-5 text-red-600" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-red-700">Logout</p>
                                    <p className="text-sm text-red-500">Sign out of your account</p>
                                </div>
                            </div>
                            <span className="text-red-400 group-hover:text-red-600 transition-colors">→</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Switch Account Info */}
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-sm text-slate-500">
                    Want to use SkillBridge as a {user.role === 'WORKER' ? 'Client' : 'Professional'}?
                </p>
                <p className="text-sm text-slate-600 font-medium mt-1">
                    You'll need to create a new account with a different email.
                </p>
            </div>
        </div>
    );
};

export default AccountSettings;
