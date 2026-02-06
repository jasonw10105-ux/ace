
import React, { useState } from 'react';
import { User, Brain, Bell, Shield, Palette, Download, Trash2, TrendingUp, Target, Sparkles, Clock, Eye, CheckCircle } from 'lucide-react';
import { UserProfile } from '../types';

export const EnhancedCollectorSettings: React.FC<{ user: UserProfile, onSave: (u: any) => void, onBack: () => void }> = ({ user, onSave, onBack }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'intelligence' | 'notifications' | 'privacy'>('profile');
  const [localProfile, setLocalProfile] = useState({
    // Fix: Using display_name from base Profile interface
    displayName: user.display_name || '',
    bio: user.bio || '',
    location: user.location || ''
  });

  const tabs = [
    { id: 'profile', label: 'Identity', icon: User, desc: 'Public bio and profile' },
    { id: 'intelligence', label: 'AI Synthesis', icon: Brain, desc: 'Neural taste learnings' },
    { id: 'notifications', label: 'Signals', icon: Bell, desc: 'Price drops & alerts' },
    { id: 'privacy', label: 'Data Rights', icon: Shield, desc: 'Portability & visibility' }
  ];

  const aiStats = {
    topMediums: [
      { name: 'Oil on Canvas', confidence: 94, count: 124 },
      { name: 'Mixed Media', confidence: 82, count: 45 },
      { name: 'Digital Synthesis', confidence: 61, count: 12 }
    ],
    behavior: [
      { label: 'Peak Signal Hour', value: '11:00 PM EST', icon: Clock },
      { label: 'Avg Study Time', value: '8.4 mins', icon: Eye },
      { label: 'Decision Speed', value: 'Deliberate', icon: TrendingUp }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-4 flex items-center gap-2 group transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back Hub
          </button>
          <h1 className="text-5xl font-serif font-bold italic tracking-tight">Intelligence & Controls</h1>
        </div>
        <button onClick={() => onSave(localProfile)} className="bg-black text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-black/10 hover:scale-105 transition-all">Save Synthesis</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full p-6 text-left rounded-3xl border-2 transition-all group ${
                activeTab === tab.id ? 'bg-black border-black text-white shadow-xl' : 'bg-white border-transparent hover:border-gray-100 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-4 mb-2">
                <tab.icon size={20} className={activeTab === tab.id ? 'text-blue-400' : 'text-gray-300 group-hover:text-black'} />
                <span className="font-bold text-sm uppercase tracking-widest">{tab.label}</span>
              </div>
              <p className={`text-xs ${activeTab === tab.id ? 'opacity-60' : 'opacity-40 group-hover:opacity-100'}`}>{tab.desc}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white border border-gray-100 rounded-[3rem] p-12 space-y-12 animate-in slide-in-from-right-4 duration-500">
               <div className="flex items-center gap-10">
                  <div className="w-32 h-32 rounded-full bg-gray-50 border-4 border-white shadow-xl flex items-center justify-center text-4xl font-serif font-bold text-gray-200 overflow-hidden">
                    {/* Fix: Using avatar_url from base Profile interface */}
                    {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" alt="Profile" /> : user.email[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold italic mb-4">Identity Frame</h3>
                    <button className="text-xs font-bold uppercase tracking-widest text-blue-500 border-b border-blue-100 pb-1">Upload New Asset</button>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Display Identity</label>
                    <input type="text" value={localProfile.displayName} onChange={e => setLocalProfile({...localProfile, displayName: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl focus:bg-white outline-none border border-transparent focus:border-black transition-all" placeholder="The Collector" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Origin Location</label>
                    <input type="text" value={localProfile.location} onChange={e => setLocalProfile({...localProfile, location: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl focus:bg-white outline-none border border-transparent focus:border-black transition-all" placeholder="e.g. London, UK" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Curation Thesis / Bio</label>
                  <textarea value={localProfile.bio} onChange={e => setLocalProfile({...localProfile, bio: e.target.value})} rows={5} className="w-full px-6 py-4 bg-gray-50 rounded-3xl focus:bg-white outline-none border border-transparent focus:border-black transition-all resize-none" placeholder="Describe your collecting vision..." />
               </div>
            </div>
          )}

          {activeTab === 'intelligence' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
               <div className="bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
                  <div className="flex items-center gap-3 mb-10">
                     <Brain className="text-blue-400" />
                     <h3 className="text-3xl font-serif font-bold italic">Neural Synthesis</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {aiStats.behavior.map(stat => (
                       <div key={stat.label} className="p-8 bg-white/5 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
                          <stat.icon className="text-gray-500 mb-6 group-hover:text-white transition-colors" size={20} />
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">{stat.label}</p>
                          <p className="text-2xl font-serif font-bold italic">{stat.value}</p>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="bg-white border border-gray-100 rounded-[3rem] p-12">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-10">Medium Calibrations</h3>
                  <div className="space-y-8">
                     {aiStats.topMediums.map(med => (
                       <div key={med.name}>
                          <div className="flex justify-between items-end mb-4">
                             <div>
                                <span className="font-bold text-lg italic">{med.name}</span>
                                <span className="ml-3 text-[10px] font-mono text-gray-400 uppercase tracking-widest">{med.count} Signals</span>
                             </div>
                             <span className="text-blue-500 font-bold text-sm">{med.confidence}% Confident</span>
                          </div>
                          <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                             <div className="h-full bg-black transition-all duration-1000" style={{ width: `${med.confidence}%` }}></div>
                          </div>
                       </div>
                     ))}
                  </div>
                  <div className="mt-12 pt-12 border-t border-gray-50 flex justify-between items-center">
                     <p className="text-xs text-gray-400 italic">Engine last recalibrated 2 hours ago.</p>
                     <button className="text-xs font-bold uppercase tracking-widest text-red-500 hover:scale-105 transition-all">Reset Intelligence Data</button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="bg-white border border-gray-100 rounded-[3rem] p-12 space-y-12 animate-in slide-in-from-right-4 duration-500">
               <div className="space-y-6">
                  <h3 className="text-2xl font-serif font-bold italic">Data Portability</h3>
                  <p className="text-gray-500 leading-relaxed max-w-xl">Download your entire aesthetic DNA profile, interaction history, and acquired metadata in an encrypted portable package.</p>
                  <button className="px-8 py-4 bg-gray-50 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-2">
                     <Download size={16} /> Request Complete Export
                  </button>
               </div>
               <div className="pt-12 border-t border-gray-50">
                  <h3 className="text-2xl font-serif font-bold italic mb-6 text-red-500">Danger Loop</h3>
                  <div className="p-8 bg-red-50 rounded-3xl border border-red-100 flex items-center justify-between">
                     <div>
                        <h4 className="font-bold text-red-900 mb-1">Delete Neural Signature</h4>
                        <p className="text-sm text-red-700 opacity-70">This will permanently erase all taste profiles and collection history.</p>
                     </div>
                     <button className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20">Deactivate Identity</button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ArrowLeft: React.FC<{ size?: number, className?: string }> = ({ size = 24, className }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
);
