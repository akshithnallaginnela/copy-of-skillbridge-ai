
import React from 'react';
import { Briefcase, ArrowRight, ShieldCheck, Star, Mic, Camera } from 'lucide-react';

interface LandingProps {
  onHire: () => void;
  onJoin: () => void;
}

const Landing: React.FC<LandingProps> = ({ onHire, onJoin }) => {
  return (
    <div className="relative overflow-hidden bg-slate-50">
      {/* Decorative Blur Background */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-8 animate-bounce-slow">
              <ShieldCheck className="w-4 h-4" />
              Empowering 1 Million+ Blue-Collar Pros
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-tight mb-8">
              The <span className="text-blue-600">LinkedIn</span> for Skilled Labor.
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0">
              Transform your skills into a professional digital portfolio using AI. Showcase your work, build trust, and connect with customers.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button 
                onClick={onJoin}
                className="w-full sm:w-auto px-8 py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Join as a Professional
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={onHire}
                className="w-full sm:w-auto px-8 py-5 bg-white text-slate-900 font-bold rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
              >
                Hire an Expert
              </button>
            </div>
            
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-slate-900">15k+</span>
                <span className="text-xs uppercase tracking-widest font-bold">Electricians</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-slate-900">12k+</span>
                <span className="text-xs uppercase tracking-widest font-bold">Plumbers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-slate-900">20k+</span>
                <span className="text-xs uppercase tracking-widest font-bold">Beauticians</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 max-w-md mx-auto">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Voice-to-Profile</h3>
                    <p className="text-sm text-slate-500">Just speak to build your CV</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Work Gallery</h3>
                    <p className="text-sm text-slate-500">Before/After photo proof</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Trust Score</h3>
                    <p className="text-sm text-slate-500">AI-verified reviews</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/40?u=${i}`} className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Trusted by 500+ local contractors</p>
                </div>
              </div>
            </div>
            
            {/* Floating Card Decorative */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/5 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
