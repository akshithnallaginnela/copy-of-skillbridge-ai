
import React, { useState, useCallback } from 'react';
import { Mic, Send, Loader2, Sparkles, User, Wrench, CheckCircle } from 'lucide-react';
import { generateProfileFromVoice } from '../services/geminiService';

interface ProfileCreatorProps {
  onProfileCreated: (profile: any) => void;
}

const ProfileCreator: React.FC<ProfileCreatorProps> = ({ onProfileCreated }) => {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsGenerating(true);
    try {
      const profile = await generateProfileFromVoice(input);
      onProfileCreated(profile);
    } catch (error) {
      console.error("Failed to generate profile:", error);
      alert("Something went wrong while creating your profile. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + ' ' + transcript);
    };

    recognition.start();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-xl border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">AI Profile Creator</h2>
          <p className="text-slate-500">Just speak or type your experience, we'll do the rest.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell us about yourself: 'I am Ramesh, an electrician with 10 years experience in Mumbai. I specialize in solar panels and wiring...'"
            className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-slate-700"
          />
          <button
            onClick={startListening}
            className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !input.trim()}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Crafting your profile...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Build My Professional Portfolio
            </>
          )}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
          <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-xl">
            <User className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Professional Bio</span>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-purple-50 rounded-xl">
            <Wrench className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-xs font-semibold text-purple-800 uppercase tracking-wider">Skill Mapping</span>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-green-50 rounded-xl">
            <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-xs font-semibold text-green-800 uppercase tracking-wider">Auto-Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCreator;
