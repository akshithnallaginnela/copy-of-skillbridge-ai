
import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, ShieldCheck, CheckCircle, Camera, Wallet, MessageSquare, Phone } from 'lucide-react';
import { WorkerProfile } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface WorkerProfileViewProps {
  worker: WorkerProfile;
  onBack: () => void;
}

const WorkerProfileView: React.FC<WorkerProfileViewProps> = ({ worker, onBack }) => {
  const [activeTab, setActiveTab] = useState<'About' | 'Work' | 'Reviews'>('About');

  const trustData = [
    { name: 'Trust', value: worker.trustScore },
    { name: 'Gap', value: 100 - worker.trustScore },
  ];
  const COLORS = ['#2563eb', '#e2e8f0'];

  const MOCK_REVIEWS = [
    { id: 'r1', author: 'Anjali P.', rating: 5, comment: 'Incredibly professional and arrived right on time. Highly recommend!', date: '2 days ago' },
    { id: 'r2', author: 'Vikram S.', rating: 4, comment: 'Great work on the installations. Clean and efficient.', date: '1 week ago' }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 border-b border-slate-100 flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-all">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h2 className="font-bold text-slate-900">Professional Portfolio</h2>
        <div className="w-10"></div>
      </div>

      <div className="p-4 sm:p-8">
        {/* Profile Card */}
        <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
          <div className="relative">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover shadow-2xl ring-4 ring-white"
            />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg whitespace-nowrap">
              <ShieldCheck className="w-4 h-4" />
              Verified
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">{worker.name}</h1>
              <div className="flex items-center justify-center gap-1 text-amber-500 font-bold bg-amber-50 px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
                <Star className="w-4 h-4 fill-current" />
                {worker.rating}
              </div>
            </div>
            <p className="text-xl text-blue-600 font-semibold mb-3">{worker.specialty}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 font-medium">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {worker.location}</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> {worker.experience} Exp.</span>
            </div>
          </div>

          <div className="w-32 h-32 flex flex-col items-center justify-center bg-white rounded-2xl shadow-inner border border-slate-50 p-2">
            <div className="w-full h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trustData}
                    innerRadius={30}
                    outerRadius={45}
                    paddingAngle={0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {trustData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-700">{worker.trustScore}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Trust Score</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 mb-8 overflow-x-auto scrollbar-hide">
          {(['About', 'Work', 'Reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[100px] py-4 font-bold transition-all border-b-2 ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === 'About' && (
            <div className="space-y-8 animate-fade-in">
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Bio</h3>
                <p className="text-slate-600 leading-relaxed text-lg">{worker.bio}</p>
              </section>
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Expertise & Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {worker.skills.map((skill) => (
                    <span key={skill} className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'Work' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
              {worker.images.map((img, i) => (
                <div key={i} className="group relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-slate-50">
                  <img src={img} alt={`Work ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white font-medium">Work Gallery Item #{i+1}</span>
                  </div>
                </div>
              ))}
              <div className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 cursor-pointer transition-all">
                <Camera className="w-8 h-8 mb-2" />
                <span className="font-semibold text-sm">Add New Work Photo</span>
              </div>
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div className="space-y-6 animate-fade-in">
              {MOCK_REVIEWS.map(review => (
                <div key={review.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900">{review.author}</h4>
                    <span className="text-xs text-slate-400">{review.date}</span>
                  </div>
                  <div className="flex gap-0.5 text-amber-500 mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hire Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-4xl mx-auto flex gap-4">
          <button className="flex-1 py-4 bg-slate-100 text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
            <MessageSquare className="w-5 h-5" />
            Chat
          </button>
          <button className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
            <Wallet className="w-5 h-5" />
            Hire Now (UPI)
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfileView;
