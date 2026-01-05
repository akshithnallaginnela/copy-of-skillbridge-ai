
import React from 'react';
import { Heart, Share2, ShieldCheck, MessageCircle, MoreHorizontal, Sparkles, Camera } from 'lucide-react';
import { MOCK_POSTS } from '../constants';
import { WorkPost } from '../types';

interface WorkFeedProps {
  onSelectWorker: (workerId: string) => void;
}

const WorkFeed: React.FC<WorkFeedProps> = ({ onSelectWorker }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Create Post */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Work Showcase</h1>
          <p className="text-slate-500">Real jobs done by verified experts.</p>
        </div>
        <button className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2">
          <Camera className="w-5 h-5" />
          <span className="hidden sm:inline font-bold">Post Work</span>
        </button>
      </div>

      {/* Feed */}
      {MOCK_POSTS.map((post) => (
        <article key={post.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group">
          {/* Post Header */}
          <div className="p-4 flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => onSelectWorker(post.workerId)}
            >
              <img src={post.workerAvatar} alt={post.workerName} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <h3 className="font-bold text-slate-900 leading-tight flex items-center gap-1">
                  {post.workerName}
                  <ShieldCheck className="w-3 h-3 text-blue-500" />
                </h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{post.workerSpecialty}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">{post.timestamp}</span>
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Work Image */}
          <div className="relative aspect-[4/3] bg-slate-100">
            <img 
              src={post.image} 
              alt="Work showcase" 
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
            {post.aiVerified && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-blue-100 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-tight">AI Verified Authenticity</span>
              </div>
            )}
          </div>

          {/* Actions & Caption */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors">
                  <Heart className="w-6 h-6" />
                  <span className="text-sm font-bold">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-600 hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button className="flex items-center gap-2 text-slate-600 hover:text-blue-500 transition-colors">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
              <button 
                onClick={() => onSelectWorker(post.workerId)}
                className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all shadow-md"
              >
                Hire Expert
              </button>
            </div>
            <p className="text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900 mr-2">{post.workerName}</span>
              {post.caption}
            </p>
          </div>
        </article>
      ))}

      {/* Load More */}
      <div className="py-8 text-center">
        <button className="px-8 py-3 text-slate-400 font-bold hover:text-blue-600 transition-colors">
          You've caught up with the community!
        </button>
      </div>
    </div>
  );
};

export default WorkFeed;
