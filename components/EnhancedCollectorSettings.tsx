
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { 
  Trash2, User, Lock, Shield, Mail, Clock, Bell, Brain, Palette, 
  TrendingUp, BarChart3, Download, Camera, Eye, Heart, 
  Target, Sparkles, Zap, Globe, FileText, ArrowLeft, Loader2,
  Activity
} from 'lucide-react';
import { UserProfile, LearnedPreferences } from '../types';
import toast from 'react-hot-toast';

interface EnhancedCollectorSettingsProps {
  user: UserProfile;
  onSave: (updates: any) => void;
  onBack: () => void;
}

export const EnhancedCollectorSettings: React.FC<EnhancedCollectorSettingsProps> = ({ user, onSave, onBack }) => {
  const [activeTab, setActiveTab] = useState<'account' | 'ai-intelligence' | 'notifications' | 'preferences' | 'security'>('account');
  const [isSaving, setIsSaving] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: user.full_name || '',
    displayName: user.display_name || '',
    location: user.location || '',
    bio: user.bio || '',
    email: user.email || '',
    preferredMediums: user.preferences?.favoriteMediums.join(', ') || '',
    preferredStyles: user.preferences?.favoriteStyles.join(', ') || '',
    minBudget: user.preferences?.priceRange?.[0] || 0,
    maxBudget: user.preferences?.priceRange?.[1] || 10000,
    notifyByEmail: true,
    notifyPriceDrops: true,
    notifyNewWorks: true
  });

  const handleSave = async () => {
    setIsSaving(true);
    const updates = {
      full_name: formData.fullName,
      display_name: formData.displayName,
      location: formData.location,
      bio: formData.bio,
      preferences: {
        ...user.preferences,
        favoriteMediums: formData.preferredMediums.split(',').map(s => s.trim()).filter(Boolean),
        favoriteStyles: formData.preferredStyles.split(',').map(s => s.trim()).filter(Boolean),
        priceRange: [formData.minBudget, formData.maxBudget]
      }
    };

    try {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (error) throw error;
      onSave(updates);
      toast.success('Neural Profile Resynthesized');
    } catch (e) {
      toast.error('Sync failure');
    } finally {
      setIsSaving(false);
    }
  };

  const aiPerf = user.learned_preferences?.ai_performance || {
    recommendation_accuracy: 0.92,
    discovery_success_rate: 0.78,
    learning_velocity: 0.85,
    total_interactions: 420
  };

  const TabButton = ({ id, label, icon: Icon, desc }: { id: typeof activeTab, label: string, icon: any, desc: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full p-6 text-left rounded-3xl border-2 transition-all flex items-center gap-6 group ${
        activeTab === id ? 'bg-black border-black text-white shadow-xl' : 'bg-white border-transparent hover:border-gray-100 text-gray-400'
      }`}
    >
      <div className={`p-4 rounded-2xl transition-colors ${activeTab === id ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-50 text-gray-300'}`}>
         <Icon size={20} />
      </div>
      <div className="flex-1">
         <p className="font-bold text-sm uppercase tracking-widest leading-none mb-1">{label}</p>
         <p className="text-[10px] opacity-60 leading-tight">{desc}</p>
      </div>
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <Helmet><title>Settings | ArtFlow Intelligence</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <button onClick={onBack} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-4 flex items-center gap-2 group transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Collector Hub
          </button>
          <h1 className="text-6xl font-serif font-bold italic tracking-tight">Intelligence Controls.</h1>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-black text-white px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center gap-2 disabled:opacity-30"
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
          {isSaving ? 'Encrypting...' : 'Save Synthesis'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-3">
          <TabButton id="account" label="Identity" icon={User} desc="Profile and origin credentials" />
          <TabButton id="ai-intelligence" label="AI Synthesis" icon={Brain} desc="Neural taste and behavior map" />
          <TabButton id="notifications" label="Signals" icon={Bell} desc="Alerts and loop frequencies" />
          <TabButton id="preferences" label="Vectors" icon={Palette} desc="Style and budget parameters" />
          <TabButton id="security" label="Privacy" icon={Shield} desc="Data rights and vault security" />
          
          <div className="mt-12 p-8 bg-gray-900 rounded-[2.5rem] text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl"></div>
             <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4">Neural Health</p>
             <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-white flex items-center justify-center">
                   <span className="font-bold text-xl">96</span>
                </div>
                <div className="text-sm font-light text-gray-400">Your profile is <span className="text-white font-bold">fully calibrated</span> with current market shifts.</div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white border border-gray-100 rounded-[3rem] p-12 shadow-sm min-h-[600px]">
            {activeTab === 'account' && (
              <div className="space-y-10 animate-in slide-in-from-right-4">
                <div className="flex items-center gap-10">
                  <div className="w-32 h-32 rounded-full bg-gray-50 border-4 border-white shadow-xl flex items-center justify-center text-4xl font-serif font-bold text-gray-200 overflow-hidden relative group cursor-pointer">
                    {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" alt="Avatar" /> : user.email[0].toUpperCase()}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Camera size={24} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-serif font-bold italic mb-2">Visual ID</h3>
                    <p className="text-sm text-gray-400 font-light max-w-xs">Your aesthetic signature is visible to the studios you interact with.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Display Identity</label>
                    <input type="text" value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl focus:bg-white outline-none border border-transparent focus:border-black transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Primary Location</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl focus:bg-white outline-none border border-transparent focus:border-black transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Curation Thesis / Bio</label>
                  <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={5} className="w-full px-8 py-6 bg-gray-50 rounded-[2rem] focus:bg-white outline-none border border-transparent focus:border-black transition-all resize-none font-light leading-relaxed shadow-inner" placeholder="Tell us about your collecting journey..." />
                </div>
              </div>
            )}

            {activeTab === 'ai-intelligence' && (
              <div className="space-y-12 animate-in slide-in-from-right-4">
                 <div className="grid grid-cols-3 gap-6">
                    {[
                      { label: 'Match Accuracy', val: `${Math.round(aiPerf.recommendation_accuracy * 100)}%`, icon: TrendingUp, color: 'text-green-500' },
                      { label: 'Discovery Velocity', val: `${Math.round(aiPerf.discovery_success_rate * 100)}%`, icon: Zap, color: 'text-blue-500' },
                      { label: 'Interactions', val: aiPerf.total_interactions, icon: Activity, color: 'text-purple-500' }
                    ].map(s => (
                      <div key={s.label} className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 group hover:border-black transition-all">
                        <s.icon className={`${s.color} mb-4 group-hover:scale-110 transition-transform`} size={20} />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
                        <p className="text-3xl font-serif font-bold italic">{s.val}</p>
                      </div>
                    ))}
                 </div>

                 <section>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
                       <Palette size={14} className="text-blue-500" /> Chromatic Preferences
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                       {['Warm Neutrals', 'High-Contrast Monochromes'].map(p => (
                         <div key={p} className="p-6 bg-white border border-gray-100 rounded-2xl flex items-center justify-between">
                            <span className="font-bold text-sm italic font-serif">{p}</span>
                            <div className="flex gap-1">
                               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                               <div className="w-2 h-2 rounded-full bg-blue-500/20"></div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>

                 <section>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
                       <Clock size={14} className="text-blue-500" /> Behavioral Intelligence
                    </h4>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center p-6 bg-gray-50 rounded-2xl">
                          <span className="text-sm font-bold">Peak Signal Window</span>
                          <span className="text-xs font-mono uppercase font-bold">11:00 PM - 02:00 AM EST</span>
                       </div>
                       <div className="flex justify-between items-center p-6 bg-gray-50 rounded-2xl">
                          <span className="text-sm font-bold">Average Study Time</span>
                          <span className="text-xs font-mono uppercase font-bold">8.4 Minutes / Asset</span>
                       </div>
                    </div>
                 </section>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-12 animate-in slide-in-from-right-4">
                 <section className="space-y-6">
                    <h3 className="text-2xl font-serif font-bold italic">Identity Export</h3>
                    <p className="text-gray-500 leading-relaxed font-light">Download an encrypted package of your entire interaction history, acquired documentation, and aesthetic DNA mapping.</p>
                    <button className="flex items-center gap-2 px-8 py-4 bg-gray-50 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                       <Download size={16} /> Request Secure Archive
                    </button>
                 </section>

                 <div className="pt-12 border-t border-gray-100">
                    <h3 className="text-2xl font-serif font-bold italic text-red-500 mb-6">Danger Protocol</h3>
                    <div className="p-8 bg-red-50 rounded-[2.5rem] border border-red-100 flex items-center justify-between">
                       <div>
                          <h4 className="font-bold text-red-900 mb-1">Delete Neural Signature</h4>
                          <p className="text-sm text-red-700 opacity-70">Permanently erase all taste profiles and collection history. This cannot be undone.</p>
                       </div>
                       <button className="px-8 py-4 bg-red-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-600 shadow-xl shadow-red-500/20">Deactivate ID</button>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
