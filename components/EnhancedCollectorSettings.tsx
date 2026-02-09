
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { 
  Trash2, User, Lock, Shield, Mail, Clock, Bell, Brain, Palette, 
  TrendingUp, BarChart3, Download, Camera, Eye, Heart, 
  Target, Sparkles, Zap, Globe, FileText, ArrowLeft, Loader2,
  Activity, Instagram, Twitter, Linkedin, Link as LinkIcon,
  X, RefreshCw, AlertCircle
} from 'lucide-react';
import { UserProfile, SocialLinks } from '../types';
import { geminiService } from '../services/geminiService';
import { GoogleGenAI } from "@google/genai";
import toast from 'react-hot-toast';
import { Box, Flex, Text, Button, Input, Separator } from '../flow';

interface EnhancedCollectorSettingsProps {
  user: UserProfile;
  onSave: (updates: any) => void;
  onBack: () => void;
}

export const EnhancedCollectorSettings: React.FC<EnhancedCollectorSettingsProps> = ({ user, onSave, onBack }) => {
  const [activeTab, setActiveTab] = useState<'account' | 'ai-intelligence' | 'notifications' | 'preferences' | 'security'>('account');
  const [isSaving, setIsSaving] = useState(false);
  const [isSynthesizingBio, setIsSynthesizingBio] = useState(false);
  const [isResettingDNA, setIsResettingDNA] = useState(false);
  
  // Learned interests state
  const [learnedInterests, setLearnedInterests] = useState<string[]>([
    'Minimalist Abstraction', 'High-Tension Red', 'Berlin Brutalism', 
    'Cyber-Realism', 'Textural Linen', 'Large Scale', 'Monochrome Oils'
  ]);

  const [formData, setFormData] = useState({
    fullName: user.full_name || '',
    displayName: user.display_name || '',
    location: user.location || '',
    bio: user.bio || '',
    email: user.email || '',
    website: user.website || '',
    social_links: user.social_links || { instagram: '', twitter: '', linkedin: '' } as SocialLinks,
    preferredMediums: user.preferences?.favoriteMediums?.join(', ') || '',
    preferredStyles: user.preferences?.favoriteStyles?.join(', ') || '',
    minBudget: user.preferences?.priceRange?.[0] || 0,
    maxBudget: user.preferences?.priceRange?.[1] || 10000,
  });

  const handleSynthesizeBio = async () => {
    setIsSynthesizingBio(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a sophisticated, Artsy-style professional bio for an art world participant. Name: ${formData.fullName}. Location: ${formData.location}. Interests: ${formData.preferredStyles}. Keep it under 60 words.`,
      });
      const generatedBio = response.text || '';
      setFormData(prev => ({ ...prev, bio: generatedBio.trim() }));
      toast.success('Bio synthesized by Neural Engine');
    } catch (e) {
      toast.error('Synthesis interrupt');
    } finally {
      setIsSynthesizingBio(false);
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setLearnedInterests(prev => prev.filter(i => i !== interest));
    toast.success(`Signal disconnected: ${interest}`);
  };

  const handleResetDNA = async () => {
    setIsResettingDNA(true);
    await new Promise(r => setTimeout(r, 1500));
    setLearnedInterests([]);
    setIsResettingDNA(false);
    toast.success('Aesthetic DNA Purged. System recalibrating...');
  };

  const handleSave = async () => {
    setIsSaving(true);
    const updates = {
      full_name: formData.fullName,
      display_name: formData.displayName,
      location: formData.location,
      bio: formData.bio,
      website: formData.website,
      social_links: formData.social_links,
      preferences: {
        ...user.preferences,
        favoriteMediums: formData.preferredMediums.split(',').map(s => s.trim()).filter(Boolean),
        favoriteStyles: formData.preferredStyles.split(',').map(s => s.trim()).filter(Boolean),
        priceRange: [formData.minBudget, formData.maxBudget],
        learnedInterests // Save the refined interests
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

  const TabButton = ({ id, label, icon: Icon, desc }: { id: typeof activeTab, label: string, icon: any, desc: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full p-6 text-left rounded-sm border transition-all flex items-center gap-6 group ${
        activeTab === id ? 'bg-black border-black text-white shadow-xl' : 'bg-white border-gray-100 text-gray-400 hover:border-black hover:text-black'
      }`}
    >
      <div className={`p-3 rounded-sm transition-colors ${activeTab === id ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400'}`}>
         <Icon size={18} />
      </div>
      <div className="flex-1">
         <p className="font-bold text-xs uppercase tracking-widest leading-none mb-1">{label}</p>
         <p className="text-[10px] opacity-60 leading-tight font-mono">{desc}</p>
      </div>
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <Helmet><title>Settings | ArtFlow Intelligence</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b border-gray-200 pb-12">
        <div>
          <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black mb-4 flex items-center gap-2 group transition-colors">
            <ArrowLeft size={14} /> Back to Hub
          </button>
          <h1 className="text-6xl font-serif font-bold italic tracking-tight">Identity Spectrum.</h1>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          size="lg"
          className="shadow-2xl"
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} className="mr-2" />}
          {isSaving ? 'Resynthesizing...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-2">
          <TabButton id="account" label="Identity" icon={User} desc="Public Origin Data" />
          <TabButton id="ai-intelligence" label="Aesthetic DNA" icon={Brain} desc="Learned Match Calibration" />
          <TabButton id="notifications" label="Signal Flow" icon={Bell} desc="Loop frequencies" />
          <TabButton id="preferences" label="Market Vectors" icon={Palette} desc="Buy parameters" />
          <TabButton id="security" label="Encryption" icon={Shield} desc="Vault Access" />
        </div>

        <div className="lg:col-span-8">
          <Box bg="white" border="1px solid #E5E5E5" p={8} borderRadius="2px" minHeight="600px">
            {activeTab === 'account' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="flex items-center gap-12 border-b border-gray-50 pb-12">
                  <div className="w-32 h-32 bg-gray-50 border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden relative group cursor-pointer">
                    {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" alt="Avatar" /> : <Text variant="h1" color="#DDD">{user.email?.[0]?.toUpperCase()}</Text>}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Camera size={20} className="text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Text variant="label" color="#999">Visual ID</Text>
                    <Text variant="h2" weight="normal" italic className="block">Registry Representation</Text>
                    <Text size={12} color="#707070" className="block font-mono">Profile completions: 84%</Text>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <Text variant="label" color="#000">Legal Identity</Text>
                    <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-4 bg-gray-50 border-none focus:ring-1 focus:ring-black outline-none transition-all font-sans text-sm" placeholder="Full Name" />
                  </div>
                  <div className="space-y-2">
                    <Text variant="label" color="#000">Geo Sector</Text>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-4 bg-gray-50 border-none focus:ring-1 focus:ring-black outline-none transition-all font-sans text-sm" placeholder="City, Country" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Flex justify="between" align="center">
                    <Text variant="label" color="#000">Curatorial Narrative</Text>
                    <button 
                      onClick={handleSynthesizeBio}
                      disabled={isSynthesizingBio}
                      className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2 hover:opacity-70 disabled:opacity-30"
                    >
                      {isSynthesizingBio ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12} />}
                      Neural Assist
                    </button>
                  </Flex>
                  <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={5} className="w-full px-6 py-6 bg-gray-50 border-none focus:ring-1 focus:ring-black outline-none transition-all resize-none font-serif italic text-lg leading-relaxed shadow-inner" placeholder="The narrative that defines your frontier..." />
                </div>

                <div className="space-y-8 pt-8 border-t border-gray-50">
                  <Text variant="label" color="#000">External Handshakes</Text>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 bg-gray-50 p-4 border border-transparent focus-within:border-black transition-all">
                       <Instagram size={18} className="text-gray-400" />
                       <input type="text" value={formData.social_links.instagram} onChange={e => setFormData({...formData, social_links: {...formData.social_links, instagram: e.target.value}})} className="bg-transparent border-none outline-none text-xs w-full" placeholder="Instagram Username" />
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 p-4 border border-transparent focus-within:border-black transition-all">
                       <Twitter size={18} className="text-gray-400" />
                       <input type="text" value={formData.social_links.twitter} onChange={e => setFormData({...formData, social_links: {...formData.social_links, twitter: e.target.value}})} className="bg-transparent border-none outline-none text-xs w-full" placeholder="Twitter/X Handle" />
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 p-4 border border-transparent focus-within:border-black transition-all">
                       <Linkedin size={18} className="text-gray-400" />
                       <input type="text" value={formData.social_links.linkedin} onChange={e => setFormData({...formData, social_links: {...formData.social_links, linkedin: e.target.value}})} className="bg-transparent border-none outline-none text-xs w-full" placeholder="LinkedIn Profile" />
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 p-4 border border-transparent focus-within:border-black transition-all">
                       <LinkIcon size={18} className="text-gray-400" />
                       <input type="url" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="bg-transparent border-none outline-none text-xs w-full" placeholder="Professional Website" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai-intelligence' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <header className="space-y-2">
                  <Text variant="h2" italic weight="normal">Aesthetic DNA Refinement</Text>
                  <Text size={14} color="#707070" className="block leading-relaxed">
                    The system continuously maps your interaction signals. You can manually refine these weights or remove disconnected interests.
                  </Text>
                </header>

                <div className="p-10 bg-gray-50 border border-gray-100 space-y-12">
                   <div className="space-y-4">
                      <Flex justify="between" align="end">
                        <Text variant="label" size={10} color="#999">Discovery Precision</Text>
                        <Text weight="bold" size={12} font="mono">84% Accurate</Text>
                      </Flex>
                      <div className="h-[2px] bg-gray-200 w-full overflow-hidden">
                        <div className="h-full bg-black w-[84%] transition-all duration-1000"></div>
                      </div>
                   </div>

                   <section className="space-y-6">
                      <Flex justify="between" align="center">
                        <Text variant="label" color="#000">Learned Interest Vectors</Text>
                        <button 
                          onClick={handleResetDNA} 
                          disabled={isResettingDNA}
                          className="text-[9px] font-black uppercase tracking-widest text-red-500 flex items-center gap-2 hover:opacity-60 transition-opacity"
                        >
                          {isResettingDNA ? <RefreshCw size={10} className="animate-spin" /> : <Trash2 size={10} />}
                          Purge Neural Map
                        </button>
                      </Flex>
                      
                      <div className="flex flex-wrap gap-2">
                        {learnedInterests.length > 0 ? learnedInterests.map(interest => (
                          <div 
                            key={interest} 
                            className="bg-white border border-gray-200 pl-4 pr-2 py-2 rounded-full flex items-center gap-3 group hover:border-black transition-all"
                          >
                            <Text size={11} weight="bold" color="#000">{interest}</Text>
                            <button 
                              onClick={() => handleRemoveInterest(interest)}
                              className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        )) : (
                          <div className="w-full py-12 text-center border-2 border-dashed border-gray-200 rounded-3xl">
                            <Brain size={32} className="mx-auto text-gray-200 mb-4" />
                            <Text size={13} color="#999" italic>No active interests mapped. Interactions will populate this feed.</Text>
                          </div>
                        )}
                      </div>
                   </section>

                   <Separator />

                   <div className="bg-blue-50 border border-blue-100 p-8 rounded-[2rem] flex items-start gap-6">
                      <Zap className="text-blue-600 shrink-0" size={24} />
                      <div className="space-y-2">
                         <Text weight="bold" size={14} color="#1023D7" className="block">Strategy Calibration</Text>
                         <Text size={13} color="#1023D7" className="block leading-relaxed font-light">
                            Your <span className="font-bold">Collection Roadmap</span> currently prioritizes minimalist acquisitions. 
                            The engine will bias results to fit your $5k-$8k tactical segment.
                         </Text>
                         <button 
                          onClick={() => onBack()} 
                          className="text-[10px] font-black uppercase tracking-widest text-blue-600 border-b border-blue-200 pb-0.5 hover:border-blue-600 transition-all mt-2"
                         >
                           View Active Roadmap
                         </button>
                      </div>
                   </div>
                </div>

                <div className="bg-white border border-red-100 p-8 rounded-[2rem] flex items-start gap-6">
                   <AlertCircle className="text-red-500 shrink-0" size={24} />
                   <div className="space-y-1">
                      <Text weight="bold" size={14} color="#C82828" className="block">Privacy Guard</Text>
                      <Text size={12} color="#707070" className="block leading-relaxed">
                         Interests are only visible to your private account and used to calibrate the 
                         <span className="font-bold italic"> Advisor</span>. They are never shared with artists or 3rd parties.
                      </Text>
                   </div>
                </div>
              </div>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};
