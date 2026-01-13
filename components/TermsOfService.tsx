
import React from 'react';
import { FileText, Shield, AlertCircle } from 'lucide-react';

interface TermsOfServiceProps {
    onBack: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
    const lastUpdated = 'January 9, 2026';

    const sections = [
        {
            title: '1. Acceptance of Terms',
            content: `By accessing or using SkillBridge ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.

These terms apply to all users of the Platform, including professionals offering services and clients seeking services.`
        },
        {
            title: '2. User Accounts',
            content: `2.1 You must be at least 18 years old to create an account.

2.2 You are responsible for maintaining the confidentiality of your account credentials.

2.3 You agree to provide accurate, current, and complete information during registration.

2.4 One person may not maintain multiple accounts. Account sharing is prohibited.

2.5 Your account type (Professional or Client) is determined at registration and cannot be changed.`
        },
        {
            title: '3. Professional Services',
            content: `3.1 Professionals on SkillBridge are independent contractors, not employees of SkillBridge.

3.2 Professionals must possess valid licenses and certifications required for their services.

3.3 Professionals are responsible for the quality of their work and must adhere to local laws and regulations.

3.4 SkillBridge does not guarantee work availability for professionals.`
        },
        {
            title: '4. Client Responsibilities',
            content: `4.1 Clients must provide accurate information about their service requirements.

4.2 Clients must make timely payments for services rendered.

4.3 Clients should provide a safe working environment for professionals.

4.4 Clients are responsible for obtaining any necessary permits for work on their property.`
        },
        {
            title: '5. Payments and Fees',
            content: `5.1 All payments must be made through the SkillBridge platform.

5.2 SkillBridge charges a service fee on completed transactions.

5.3 Professionals receive payment within 2-3 business days of job completion.

5.4 Refunds are handled on a case-by-case basis according to our Refund Policy.

5.5 Users are responsible for any applicable taxes on their earnings.`
        },
        {
            title: '6. Prohibited Conduct',
            content: `You agree NOT to:

• Use the Platform for any illegal purpose
• Harass, abuse, or harm other users
• Post false or misleading information
• Circumvent Platform fees by arranging payment outside the platform
• Create fake accounts or reviews
• Share your account credentials with others
• Scrape or collect user data without authorization
• Interfere with the Platform's operation`
        },
        {
            title: '7. Content Guidelines',
            content: `7.1 Users retain ownership of content they post (photos, descriptions, reviews).

7.2 By posting content, you grant SkillBridge a license to use, display, and distribute it.

7.3 Content must not violate copyright, be obscene, or promote illegal activities.

7.4 SkillBridge reserves the right to remove content that violates these guidelines.`
        },
        {
            title: '8. Dispute Resolution',
            content: `8.1 Users should first attempt to resolve disputes directly with each other.

8.2 SkillBridge may offer mediation for unresolved disputes.

8.3 SkillBridge's decision in disputes is final.

8.4 For legal disputes, the courts of Bangalore, Karnataka shall have exclusive jurisdiction.`
        },
        {
            title: '9. Limitation of Liability',
            content: `9.1 SkillBridge is a platform that connects users and is not responsible for the quality of services provided by professionals.

9.2 SkillBridge is not liable for any indirect, incidental, or consequential damages.

9.3 Our total liability shall not exceed the fees paid by you in the past 12 months.`
        },
        {
            title: '10. Account Termination',
            content: `10.1 You may close your account at any time through Account Settings.

10.2 SkillBridge may suspend or terminate accounts that violate these terms.

10.3 Upon termination, you lose access to your account and any associated data.`
        },
        {
            title: '11. Changes to Terms',
            content: `11.1 SkillBridge may update these terms at any time.

11.2 Users will be notified of significant changes via email or Platform notification.

11.3 Continued use of the Platform after changes constitutes acceptance of new terms.`
        },
        {
            title: '12. Contact Information',
            content: `For questions about these Terms of Service, please contact us at:

Email: legal@skillbridge.com
Address: 123, Tech Park, HSR Layout, Bangalore, Karnataka 560102`
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <button
                        onClick={onBack}
                        className="mb-6 text-white/70 hover:text-white transition-colors"
                    >
                        ← Back to Home
                    </button>
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Terms of Service</h1>
                    <p className="text-white/80">
                        Last updated: {lastUpdated}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Important Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-amber-800 mb-1">Important</h3>
                        <p className="text-amber-700 text-sm">
                            Please read these terms carefully before using SkillBridge. By using our platform,
                            you agree to be bound by these terms and conditions.
                        </p>
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                    {sections.map((section, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                        >
                            <h2 className="text-xl font-bold text-slate-900 mb-4">{section.title}</h2>
                            <div className="text-slate-600 whitespace-pre-line leading-relaxed">
                                {section.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-slate-500 text-sm">
                    <p>
                        By using SkillBridge, you acknowledge that you have read, understood,
                        and agree to be bound by these Terms of Service.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
