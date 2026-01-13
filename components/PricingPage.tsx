
import React, { useState } from 'react';
import { Check, Star, Zap, Crown, ArrowRight } from 'lucide-react';

interface PricingPageProps {
    onBack: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onBack }) => {
    const [isAnnual, setIsAnnual] = useState(true);

    const plans = [
        {
            name: 'Free',
            description: 'Perfect for getting started',
            price: { monthly: 0, annual: 0 },
            icon: <Star className="w-8 h-8" />,
            color: 'slate',
            features: [
                'Create basic profile',
                'Browse gigs',
                'Apply to 5 gigs/month',
                'Basic support',
                'Standard visibility'
            ],
            cta: 'Get Started Free'
        },
        {
            name: 'Pro',
            description: 'For serious professionals',
            price: { monthly: 499, annual: 399 },
            icon: <Zap className="w-8 h-8" />,
            color: 'blue',
            popular: true,
            features: [
                'Everything in Free',
                'Unlimited gig applications',
                'Priority in search results',
                'Work gallery (up to 50 photos)',
                'Verified badge',
                'Priority support',
                'Analytics dashboard'
            ],
            cta: 'Start Pro Trial'
        },
        {
            name: 'Business',
            description: 'For teams and agencies',
            price: { monthly: 1499, annual: 1199 },
            icon: <Crown className="w-8 h-8" />,
            color: 'purple',
            features: [
                'Everything in Pro',
                'Team management (up to 10)',
                'Custom branding',
                'API access',
                'Dedicated account manager',
                'Bulk gig posting',
                'Advanced analytics',
                'Custom integrations'
            ],
            cta: 'Contact Sales'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <button
                        onClick={onBack}
                        className="mb-6 text-white/70 hover:text-white transition-colors"
                    >
                        ← Back to Home
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-white/80 mb-8">
                        Choose the plan that fits your needs. No hidden fees.
                    </p>

                    {/* Toggle */}
                    <div className="inline-flex items-center gap-4 bg-white/10 p-2 rounded-2xl">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`px-6 py-2 rounded-xl font-bold transition-all ${!isAnnual ? 'bg-white text-indigo-600' : 'text-white/70 hover:text-white'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`px-6 py-2 rounded-xl font-bold transition-all ${isAnnual ? 'bg-white text-indigo-600' : 'text-white/70 hover:text-white'
                                }`}
                        >
                            Annual
                            <span className="ml-2 text-sm bg-green-500 text-white px-2 py-0.5 rounded-lg">
                                Save 20%
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative bg-white rounded-3xl p-8 shadow-lg border-2 ${plan.popular ? 'border-blue-500 shadow-blue-100' : 'border-slate-100'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="px-4 py-1 bg-blue-600 text-white text-sm font-bold rounded-full">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.color === 'slate' ? 'bg-slate-100 text-slate-600' :
                                    plan.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                        'bg-purple-100 text-purple-600'
                                }`}>
                                {plan.icon}
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
                            <p className="text-slate-500 mb-6">{plan.description}</p>

                            <div className="mb-6">
                                <span className="text-4xl font-black text-slate-900">
                                    ₹{isAnnual ? plan.price.annual : plan.price.monthly}
                                </span>
                                {plan.price.monthly > 0 && (
                                    <span className="text-slate-500">/month</span>
                                )}
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.color === 'blue' ? 'text-blue-600' :
                                                plan.color === 'purple' ? 'text-purple-600' :
                                                    'text-emerald-600'
                                            }`} />
                                        <span className="text-slate-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${plan.popular
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}>
                                {plan.cta}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <div className="bg-white py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-black text-slate-900 text-center mb-12">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                        {[
                            {
                                q: 'Can I switch plans later?',
                                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.'
                            },
                            {
                                q: 'Is there a free trial?',
                                a: 'Yes, Pro and Business plans come with a 14-day free trial. No credit card required.'
                            },
                            {
                                q: 'What payment methods do you accept?',
                                a: 'We accept all major credit cards, UPI, net banking, and wallets like Paytm and Google Pay.'
                            },
                            {
                                q: 'Can I cancel anytime?',
                                a: 'Absolutely. You can cancel your subscription at any time. You\'ll retain access until the end of your billing period.'
                            }
                        ].map((faq, idx) => (
                            <div key={idx} className="p-6 bg-slate-50 rounded-2xl">
                                <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                                <p className="text-slate-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
