
import React, { useState } from 'react';
import {
    HelpCircle, Search, ChevronDown, ChevronUp,
    MessageCircle, Phone, Mail, FileText
} from 'lucide-react';

interface HelpCenterProps {
    onBack: () => void;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const categories = [
        { name: 'Getting Started', icon: '🚀', count: 12 },
        { name: 'Account & Profile', icon: '👤', count: 8 },
        { name: 'Payments & Billing', icon: '💳', count: 10 },
        { name: 'For Professionals', icon: '🔧', count: 15 },
        { name: 'For Clients', icon: '🏠', count: 11 },
        { name: 'Safety & Security', icon: '🔒', count: 7 }
    ];

    const faqs = [
        {
            category: 'Getting Started',
            question: 'How do I create an account?',
            answer: 'Click on "Join as Professional" or "Post a Job" on the homepage. You\'ll be prompted to create an account by providing your name, email, and password. Choose your role (Professional or Client) and complete your profile.'
        },
        {
            category: 'For Professionals',
            question: 'How do I find work on SkillBridge?',
            answer: 'After logging in, go to "Find Work" in the navigation. You\'ll see all available gigs posted by clients. Filter by category, location, or budget. Click "Accept Gig" to take on a job.'
        },
        {
            category: 'For Clients',
            question: 'How do I post a gig?',
            answer: 'Click "Post Gig" in the navigation. Fill in the job title, description, category, budget, and location. Your gig will be instantly visible to professionals in your area.'
        },
        {
            category: 'Payments',
            question: 'How do payments work?',
            answer: 'Clients pay through the platform when posting a gig or upon job completion. Professionals receive payments directly to their linked bank account within 2-3 business days after job completion.'
        },
        {
            category: 'Account',
            question: 'Can I change my account type?',
            answer: 'No, once you sign up as a Professional or Client, your account type is fixed. If you need to use SkillBridge as the other type, you\'ll need to create a new account with a different email.'
        },
        {
            category: 'Safety',
            question: 'How do I report a problem?',
            answer: 'Go to Account Settings and click "Report an Issue". Describe the problem in detail. Our support team will investigate and respond within 24 hours.'
        },
        {
            category: 'For Professionals',
            question: 'How do I upload my work gallery?',
            answer: 'Go to "Gallery" in the navigation (Professional accounts only). Click "Add Work" and upload before/after photos of your completed projects. Add a title and description to showcase your skills.'
        },
        {
            category: 'Payments',
            question: 'What are the platform fees?',
            answer: 'SkillBridge charges a small service fee on completed transactions. Free accounts: 10% fee. Pro accounts: 5% fee. The fee is deducted from the professional\'s earnings.'
        }
    ];

    const filteredFaqs = faqs.filter(
        faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <button
                        onClick={onBack}
                        className="mb-6 text-white/70 hover:text-white transition-colors"
                    >
                        ← Back to Home
                    </button>
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <HelpCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Help Center</h1>
                    <p className="text-xl text-white/80 mb-8">
                        Find answers to your questions
                    </p>

                    {/* Search */}
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for help..."
                            className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl text-slate-900 text-lg shadow-xl focus:ring-4 focus:ring-white/30"
                        />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="max-w-6xl mx-auto px-4 py-12 -mt-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat) => (
                        <div
                            key={cat.name}
                            className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer text-center"
                        >
                            <div className="text-3xl mb-2">{cat.icon}</div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">{cat.name}</h3>
                            <p className="text-xs text-slate-500">{cat.count} articles</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQs */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h2 className="text-2xl font-black text-slate-900 mb-8">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    {filteredFaqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <div>
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                                        {faq.category}
                                    </span>
                                    <h3 className="font-bold text-slate-900 mt-1">{faq.question}</h3>
                                </div>
                                {openFaq === idx ? (
                                    <ChevronUp className="w-5 h-5 text-slate-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                )}
                            </button>
                            {openFaq === idx && (
                                <div className="px-6 pb-6 text-slate-600 border-t border-slate-100 pt-4">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filteredFaqs.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No results found for "{searchQuery}"</p>
                    </div>
                )}
            </div>

            {/* Contact Options */}
            <div className="bg-white py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-black text-slate-900 text-center mb-8">
                        Still Need Help?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-slate-50 rounded-2xl">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                                <MessageCircle className="w-7 h-7" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Live Chat</h3>
                            <p className="text-slate-600 text-sm mb-4">Chat with our support team</p>
                            <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
                                Start Chat
                            </button>
                        </div>

                        <div className="text-center p-6 bg-slate-50 rounded-2xl">
                            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4">
                                <Phone className="w-7 h-7" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Call Us</h3>
                            <p className="text-slate-600 text-sm mb-4">Mon-Sat, 9 AM - 6 PM</p>
                            <a href="tel:+919876543210" className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all inline-block">
                                +91 98765 43210
                            </a>
                        </div>

                        <div className="text-center p-6 bg-slate-50 rounded-2xl">
                            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-4">
                                <Mail className="w-7 h-7" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Email</h3>
                            <p className="text-slate-600 text-sm mb-4">Get a response in 24 hours</p>
                            <a href="mailto:support@skillbridge.com" className="px-6 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all inline-block">
                                Send Email
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
