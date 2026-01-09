
import React from 'react';
import {
    Shield, CheckCircle, Lock, Eye, AlertTriangle,
    UserCheck, CreditCard, MessageCircle, Phone
} from 'lucide-react';

interface SafetyPageProps {
    onBack: () => void;
}

const SafetyPage: React.FC<SafetyPageProps> = ({ onBack }) => {
    const safetyFeatures = [
        {
            icon: <UserCheck className="w-8 h-8" />,
            title: 'Verified Profiles',
            description: 'All professionals go through ID verification and skill assessment before joining the platform.',
            color: 'blue'
        },
        {
            icon: <Lock className="w-8 h-8" />,
            title: 'Secure Payments',
            description: 'All payments are processed through secure, encrypted channels. Your financial data is protected.',
            color: 'green'
        },
        {
            icon: <Eye className="w-8 h-8" />,
            title: 'Transparent Reviews',
            description: 'Real reviews from real customers. We don\'t allow fake or manipulated ratings.',
            color: 'purple'
        },
        {
            icon: <MessageCircle className="w-8 h-8" />,
            title: 'In-App Communication',
            description: 'Keep all communication within the app. We log conversations for your safety.',
            color: 'orange'
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: 'Insurance Coverage',
            description: 'Work done through SkillBridge is covered by our service guarantee program.',
            color: 'teal'
        },
        {
            icon: <Phone className="w-8 h-8" />,
            title: '24/7 Support',
            description: 'Our support team is available round the clock for any safety concerns.',
            color: 'red'
        }
    ];

    const tips = [
        'Always verify the professional\'s identity before letting them into your home',
        'Keep all communication within the SkillBridge platform',
        'Never pay directly in cash - use the secure payment system',
        'Check reviews and ratings before hiring',
        'Report any suspicious behavior immediately',
        'Take photos before and after work for documentation'
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <button
                        onClick={onBack}
                        className="mb-6 text-white/70 hover:text-white transition-colors"
                    >
                        ← Back to Home
                    </button>
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Safety First</h1>
                    <p className="text-xl text-white/80">
                        Your security is our top priority. Here's how we keep you protected.
                    </p>
                </div>
            </div>

            {/* Safety Features */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-slate-900 mb-4">How We Keep You Safe</h2>
                    <p className="text-lg text-slate-600">Multiple layers of protection for clients and professionals</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {safetyFeatures.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${feature.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                    feature.color === 'green' ? 'bg-green-100 text-green-600' :
                                        feature.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                                            feature.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                                                feature.color === 'teal' ? 'bg-teal-100 text-teal-600' :
                                                    'bg-red-100 text-red-600'
                                }`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-slate-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-white py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Safety Tips</h2>
                        <p className="text-lg text-slate-600">Follow these guidelines for a safe experience</p>
                    </div>

                    <div className="space-y-4">
                        {tips.map((tip, idx) => (
                            <div
                                key={idx}
                                className="flex items-start gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100"
                            >
                                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <p className="text-slate-700 font-medium">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Report Section */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 border border-red-100">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Report a Safety Concern</h3>
                            <p className="text-slate-600 mb-4">
                                If you encounter any suspicious behavior, harassment, or safety issues, please report immediately.
                                Our team will investigate within 24 hours.
                            </p>
                            <button className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all">
                                Report an Issue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SafetyPage;
