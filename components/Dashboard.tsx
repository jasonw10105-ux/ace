
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { recommendationEngine } from '../services/recommendationEngine'
import { NeuralRecommendationRail } from './NeuralRecommendationRail'
import { CollectorNeuralMap } from './CollectorNeuralMap'
import { NeuralPulseFeed } from './NeuralPulseFeed'
import { 
  Plus, Users, MessageSquare, TrendingUp, Heart, 
  DollarSign, Clock, Search, Zap, ShieldCheck, 
  ShoppingBag, ArrowUpRight, Activity, Calendar
} from 'lucide-react'
import { UserProfile } from '../types'

interface DashboardProps {
  user: UserProfile;
  onAction: (v: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onAction }) => {
  const navigate = useNavigate();
  const isArtist = user.role === 'artist' || user.role === 'both';
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  
  useEffect(() => {
    const loadRecs = async () => {
      setLoadingRecs(true);
      const recs = await recommendationEngine.getPersonalizedRecommendations(user.id);
      setRecommendations(recs);
      setLoadingRecs(false);
    };
    loadRecs();
  }, [user.id]);

  if (isArtist) {
    return (
      <div className="dashboard-page-container bg-white pt-32 px-6 pb-40">
        <Helmet><title>Studio Dashboard | ArtFlow</title></Helmet>
        <div className="max-w-7xl mx-auto space-y-12">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-4">
                 <Activity size={12} className="animate-pulse" /> Neural Studio Feed
              </div>
              <h1 className="text-6xl font-serif font-bold italic tracking-tight">Morning, Visionary.</h1>
              <p className="text-gray-400 text-xl font-light">Your portfolio resonances with <span className="text-black font-medium">92% alignment</span>.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => navigate('/analytics')} className="px-8 py-4 bg-gray-50 text-black border border-gray-100 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-2">
                Market Trends
              </button>
              <button onClick={() => navigate('/upload-new')} className="px-10 py-4 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-2">
                <Plus size={18} /> Add Artwork
              </button>
            </div>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 bg-gray-50 rounded-[3rem] border border-gray-100 p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
                <Activity size={48} className="text-gray-200" />
                <h3 className="text-2xl font-serif font-bold italic text-gray-400">Studio Insights Calibrating...</h3>
                <p className="text-sm text-gray-400 max-w-xs">New interaction signals from the Berlin sector are being synthesized into your performance matrix.</p>
             </div>
             <NeuralPulseFeed />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page-container bg-white pt-32 px-6 pb-40">
      <Helmet><title>Collector Vault | ArtFlow</title></Helmet>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <div className="flex items-center gap-2 text-purple-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-4">
               <ShieldCheck size={12} className="animate-pulse" /> Identity Secured
            </div>
            <h1 className="text-7xl font-serif font-bold italic tracking-tight">The Vault.</h1>
            <p className="text-gray-400 text-xl font-light max-w-xl leading-relaxed">
              Managing beauty, <span className="text-black font-medium italic">synthesizing legacy</span>. Your collection is a living roadmap.
            </p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/roadmap')} className="px-8 py-4 bg-gray-50 border border-gray-100 text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-2">
              <Activity size={18} /> Collection Roadmap
            </button>
            <button onClick={() => navigate('/artworks')} className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-2">
              <Search size={18} /> Discover Art
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-16">
            
            {/* Stats Row */}
            <section className="bg-gray-50 border border-gray-100 rounded-[3.5rem] p-12">
               <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-10 flex items-center gap-3">
                  <Activity size={14} className="text-purple-500" /> Collection Synthesis
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 group hover:border-black transition-all cursor-pointer" onClick={() => navigate('/vault')}>
                     <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Portfolio Value</p>
                     <p className="text-4xl font-serif font-bold italic">$42,850</p>
                     <div className="mt-4 flex items-center gap-2 text-green-500 font-bold text-[10px] uppercase">
                        <TrendingUp size={12} /> +12.4% Yield
                     </div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 group hover:border-black transition-all cursor-pointer" onClick={() => navigate('/vault')}>
                     <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Assets Owned</p>
                     <p className="text-4xl font-serif font-bold italic">14</p>
                     <div className="mt-4 flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase">
                        <ShieldCheck size={12} /> Verified Origin
                     </div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 group hover:border-black transition-all cursor-pointer" onClick={() => navigate('/artists')}>
                     <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Followed Artists</p>
                     <p className="text-4xl font-serif font-bold italic">8</p>
                     <div className="mt-4 flex items-center gap-2 text-purple-500 font-bold text-[10px] uppercase">
                        <Users size={12} /> 3 Active Drops
                     </div>
                  </div>
               </div>
            </section>

            {/* AI Recommendations Rail */}
            <NeuralRecommendationRail 
              title="Aesthetic Alignment"
              subtitle="Matches synthesized from your recent interaction loops."
              recommendations={recommendations}
              onSelect={(art) => navigate(`/artwork/${art.id}`)}
            />

            {/* Quick Action Matrix */}
            <section className="bg-white border border-gray-100 rounded-[3rem] p-12 shadow-sm">
               <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-10">Vault Controls</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'My Vault', icon: ShoppingBag, route: '/vault', color: 'bg-blue-50 text-blue-500' },
                    { label: 'Followed', icon: Users, route: '/artists', color: 'bg-purple-50 text-purple-500' },
                    { label: 'Negotiations', icon: MessageSquare, route: '/negotiations', color: 'bg-orange-50 text-orange-500' },
                    { label: 'Calendar', icon: Calendar, route: '/calendar', color: 'bg-green-50 text-green-500' }
                  ].map(action => (
                    <button 
                      key={action.label} 
                      onClick={() => navigate(action.route)}
                      className="flex flex-col items-center gap-4 p-8 rounded-[2rem] border border-gray-50 hover:border-black transition-all group"
                    >
                      <div className={`p-4 rounded-2xl ${action.color} group-hover:scale-110 transition-transform`}>
                        <action.icon size={24} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-center">{action.label}</span>
                    </button>
                  ))}
               </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
             <CollectorNeuralMap 
              vectors={[
                { label: 'Cyber-Realism', value: 0.88 },
                { label: 'Minimalist Vector', value: 0.72 },
                { label: 'Chromatic Abstraction', value: 0.45 }
              ]}
             />

             <NeuralPulseFeed />

             {/* Roadmap Preview */}
             <div className="bg-gray-900 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl group-hover:scale-150 transition-transform"></div>
                <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400 mb-6">Active Thesis</h4>
                <p className="text-2xl font-serif font-bold italic mb-6 leading-tight">Modern European Abstraction</p>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold uppercase text-gray-500">Acquisition Target</span>
                      <span className="text-sm font-mono">$50,000</span>
                   </div>
                   <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[35%] transition-all duration-1000"></div>
                   </div>
                </div>
                <button onClick={() => navigate('/roadmap')} className="w-full mt-10 py-4 bg-white text-black rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all flex items-center justify-center gap-2">
                   Open Strategy <ArrowUpRight size={14} />
                </button>
             </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
