
import React from 'react';
import {
    CheckCircle, Shield, Zap, Users, Star, ArrowRight,
    Search, Briefcase, Camera, MessageCircle, Award
} from 'lucide-react';

interface HowItWorksProps {
    onBack: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onBack }) => {
    const forProfessionals = [
        {
            step: 1,
            title: 'Create Your Profile',
            description: 'Sign up as a professional, add your skills, experience, and build your digital portfolio.',
            icon: <Briefcase className="w-8 h-8" />
        },
        {
            step: 2,
            title: 'Build Your Gallery',
            description: 'Upload before/after photos of your work to showcase your skills and build trust.',
            icon: <Camera className="w-8 h-8" />
        },
        {
            step: 3,
            title: 'Find Work',
            description: 'Browse available gigs posted by clients. Filter by category, location, and budget.',
            icon: <Search className="w-8 h-8" />
        },
        {
            step: 4,
            title: 'Accept & Complete',
            description: 'Accept gigs, communicate with clients, and complete the work to earn money.',
            icon: <CheckCircle className="w-8 h-8" />
        },
        {
            step: 5,
            title: 'Get Rated & Grow',
            description: 'Receive ratings and reviews. Build your reputation and get more clients.',
            icon: <Star className="w-8 h-8" />
        }
    ];

    const forClients = [
        {
            step: 1,
            title: 'Sign Up as Client',
            description: 'Create your account and tell us what kind of services you need.',
            icon: <Users className="w-8 h-8" />
        },
        {
            step: 2,
            title: 'Post Your Gig',
            description: 'Describe what you need done, set your budget, and location.',
            icon: <Briefcase className="w-8 h-8" />
        },
        {
            step: 3,
            title: 'Browse Professionals',
            description: 'View verified professionals, their work gallery, ratings, and reviews.',
            icon: <Search className="w-8 h-8" />
        },
        {
            step: 4,
            title: 'Hire & Communicate',
            description: 'Choose the right professional and discuss project details.',
            icon: <MessageCircle className="w-8 h-8" />
        },
        {
            step: 5,
            title: 'Rate Your Experience',
            description: 'After the work is done, rate the professional to help others.',
            icon: <Award className="w-8 h-8" />
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <button
                        onClick={onBack}
                        className="mb-6 text-white/70 hover:text-white transition-colors"
                    >
                        ← Back to Home
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">How SkillBridge Works</h1>
                    <p className="text-xl text-white/80">
                        Connecting skilled professionals with clients who need their services
                    </p>
                </div>
            </div>

            {/* For Professionals */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-slate-900 mb-4">For Professionals</h2>
                    <p className="text-lg text-slate-600">Start earning with your skills in 5 simple steps</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {forProfessionals.map((item) => (
                        <div key={item.step} className="relative">
                            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 h-full">
                                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                                    {item.icon}
                                </div>
                                <div className="text-sm font-bold text-blue-600 mb-2">Step {item.step}</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-600 text-sm">{item.description}</p>
                            </div>
                            {item.step < 5 && (
                                <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                                    <ArrowRight className="w-6 h-6 text-slate-300" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* For Clients */}
            <div className="bg-white py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-slate-900 mb-4">For Clients</h2>
                        <p className="text-lg text-slate-600">Find the perfect professional in 5 easy steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {forClients.map((item) => (
                            <div key={item.step} className="relative">
                                <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 h-full">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                                        {item.icon}
                                    </div>
                                    <div className="text-sm font-bold text-emerald-600 mb-2">Step {item.step}</div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-600 text-sm">{item.description}</p>
                                </div>
                                {item.step < 5 && (
                                    <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                                        <ArrowRight className="w-6 h-6 text-slate-300" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Why Choose SkillBridge?</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                            <Zap className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Real-Time Updates</h3>
                        <p className="text-slate-600">See new gigs and responses instantly. No waiting, no refreshing.</p>
                    </div>

                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto mb-4">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Verified Professionals</h3>
                        <p className="text-slate-600">All professionals are verified with ID and skill assessments.</p>
                    </div>

                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-amber-100 rounded-3xl flex items-center justify-center text-amber-600 mx-auto mb-4">
                            <Star className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Ratings & Reviews</h3>
                        <p className="text-slate-600">Transparent feedback system to help you make informed decisions.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
