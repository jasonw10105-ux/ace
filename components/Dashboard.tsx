
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { recommendationEngine } from '../services/recommendationEngine'
import { IntelligenceRecommendationRail } from './IntelligenceRecommendationRail'
import { CollectorDiscoveryMap } from './CollectorDiscoveryMap'
import { EcosystemPulseFeed } from './EcosystemPulseFeed'
import { 
  Plus, Users, MessageSquare, TrendingUp, Heart, 
  DollarSign, Search, Zap, ShieldCheck, 
  ShoppingBag, Activity, Calendar,
  BarChart3, FileText, Sparkles
} from 'lucide-react'
import { UserProfile } from '../types'

interface DashboardProps {
  user: UserProfile;
  onAction: (v: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onAction }) => {
  const navigate = useNavigate();
  const isArtist = user.role === 'ARTIST' || user.role === 'BOTH';
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
      <div className="dashboard-page-container bg-white pt-24 lg:pt-32 px-4 lg:px-6 pb-20 lg:pb-40">
        <Helmet><title>Studio Dashboard | ArtFlow</title></Helmet>
        <div className="max-w-7xl mx-auto space-y-8 lg:space-y-12">
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 lg:gap-8 mb-6 lg:mb-12">
            <div className="w-full">
              <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-4">
                 <Activity size={12} className="animate-pulse" /> Market Intelligence
              </div>
              <h1 className="text-4xl lg:text-6xl font-serif font-bold italic tracking-tight">Studio Overview.</h1>
              <p className="text-gray-400 text-lg lg:text-xl font-light">Portfolio alignment is optimized at <span className="text-black font-medium">92%</span>.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button onClick={() => navigate('/crm')} className="w-full sm:w-auto px-8 py-3 lg:py-4 bg-gray-50 text-black border border-gray-100 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                Network Activity
              </button>
              <button onClick={() => navigate('/upload-new')} className="w-full sm:w-auto px-8 py-3 lg:py-4 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2">
                <Plus size={18} /> Add Artwork
              </button>
            </div>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
             <div className="lg:col-span-8 space-y-8 lg:space-y-12">
                <section className="bg-black text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                   <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-8">
                      <Sparkles size={14} /> Intelligence Tool
                   </div>
                   <h2 className="text-4xl font-serif font-bold italic mb-4">Press Dossier.</h2>
                   <p className="text-gray-400 text-lg font-light leading-relaxed mb-10 max-w-lg">
                      Synthesize current series data into a professional press kit for gallery submission.
                   </p>
                   <button 
                    onClick={() => navigate('/press-pack')}
                    className="px-10 py-5 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 flex items-center gap-3"
                   >
                      <FileText size={18} /> Generate Pack
                   </button>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-gray-50 rounded-[3rem] border border-gray-100 p-8 lg:p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]">
                      <BarChart3 size={48} className="text-gray-200" />
                      <h3 className="text-xl font-serif font-bold italic text-gray-400">Analyzing Reach...</h3>
                      <p className="text-sm text-gray-400 max-w-xs">Collector engagement is being synchronized.</p>
                   </div>
                   <section className="bg-white border border-gray-100 rounded-[3rem] p-12 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-10">Studio Controls</h3>
                      <div className="grid grid-cols-2 gap-4">
                         {[
                           { label: 'Inventory', icon: ShoppingBag, route: '/artworks', color: 'bg-blue-50 text-blue-500' },
                           { label: 'Network', icon: Users, route: '/crm', color: 'bg-purple-50 text-purple-500' },
                           { label: 'Performance', icon: BarChart3, route: '/analytics', color: 'bg-green-50 text-green-500' },
                           { label: 'Settings', icon: Calendar, route: '/settings', color: 'bg-gray-50 text-gray-400' }
                         ].map(action => (
                           <button 
                             key={action.label} 
                             onClick={() => navigate(action.route)}
                             className="flex flex-col items-center gap-3 p-6 rounded-[2rem] border border-gray-50 hover:border-black transition-all group"
                           >
                             <div className={`p-4 rounded-2xl ${action.color} group-hover:scale-110 transition-transform`}>
                               <action.icon size={20} />
                             </div>
                             <span className="text-[9px] font-black uppercase tracking-widest text-center">{action.label}</span>
                           </button>
                         ))}
                      </div>
                   </section>
                </div>
             </div>
             
             <aside className="lg:col-span-4 space-y-8 lg:space-y-12">
                <EcosystemPulseFeed />
                <div className="bg-gray-50 p-8 rounded-[3rem] border border-gray-100">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Market Affinity</h4>
                   <div className="space-y-6">
                      {[
                        { label: 'Abstraction', val: 84 },
                        { label: 'Cyber-Realism', val: 62 },
                        { label: 'Minimalist', val: 45 }
                      ].map(v => (
                        <div key={v.label} className="space-y-2">
                           <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                              <span>{v.label}</span>
                              <span className="text-blue-500">{v.val}%</span>
                           </div>
                           <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${v.val}%` }}></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page-container bg-white pt-24 lg:pt-32 px-4 lg:px-6 pb-20 lg:pb-40">
      <Helmet><title>Collection Vault | ArtFlow</title></Helmet>
      
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 lg:mb-16 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 lg:gap-8">
          <div className="w-full">
            <div className="flex items-center gap-2 text-purple-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-4">
               <ShieldCheck size={12} className="animate-pulse" /> Vault Secured
            </div>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold italic tracking-tight">Your Vault.</h1>
            <p className="text-gray-400 text-lg lg:text-xl font-light max-w-xl leading-relaxed">
              Managing beauty, <span className="text-black font-medium italic">building a legacy</span>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button onClick={() => navigate('/roadmap')} className="w-full sm:w-auto px-6 py-3 lg:py-4 bg-gray-50 border border-gray-100 text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
              <Activity size={18} /> Roadmap
            </button>
            <button onClick={() => navigate('/artworks')} className="w-full sm:w-auto px-6 py-3 lg:py-4 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-2">
              <Search size={18} /> Discover
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 space-y-8 lg:space-y-16">
            <section className="bg-gray-50 border border-gray-100 rounded-[2rem] lg:rounded-[3.5rem] p-6 lg:p-12">
               <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 lg:mb-10 flex items-center gap-3">
                  <Activity size={14} className="text-purple-500" /> Asset Overview
               </h2>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-8">
                  <div className="bg-white p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] border border-gray-100 group hover:border-black transition-all cursor-pointer" onClick={() => navigate('/vault')}>
                     <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Registry Value</p>
                     <p className="text-2xl lg:text-4xl font-serif font-bold italic">$42,850</p>
                  </div>
                  <div className="bg-white p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] border border-gray-100 group hover:border-black transition-all cursor-pointer" onClick={() => navigate('/vault')}>
                     <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Assets Vaulted</p>
                     <p className="text-2xl lg:text-4xl font-serif font-bold italic">14</p>
                  </div>
                  <div className="bg-white p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] border border-gray-100 group hover:border-black transition-all cursor-pointer" onClick={() => navigate('/artists')}>
                     <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Creators Logged</p>
                     <p className="text-2xl lg:text-4xl font-serif font-bold italic">8</p>
                  </div>
               </div>
            </section>

            <IntelligenceRecommendationRail 
              title="Intelligence Matches"
              subtitle="Works selected for your unique creative signature."
              recommendations={recommendations}
              onSelect={(art) => navigate(`/artwork/${art.id}`)}
            />

            <section className="bg-white border border-gray-100 rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-12 shadow-sm">
               <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 lg:mb-10">Studio Controls</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                  {[
                    { label: 'Vault', icon: ShoppingBag, route: '/vault', color: 'bg-blue-50 text-blue-500' },
                    { label: 'Followed', icon: Users, route: '/artists', color: 'bg-purple-50 text-purple-500' },
                    { label: 'Inquiries', icon: MessageSquare, route: '/crm', color: 'bg-orange-50 text-orange-500' },
                    { label: 'Calendar', icon: Calendar, route: '/calendar', color: 'bg-green-50 text-green-500' }
                  ].map(action => (
                    <button 
                      key={action.label} 
                      onClick={() => navigate(action.route)}
                      className="flex flex-col items-center gap-3 lg:gap-4 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] border border-gray-50 hover:border-black transition-all group"
                    >
                      <div className={`p-3 lg:p-4 rounded-2xl ${action.color} group-hover:scale-110 transition-transform`}>
                        <action.icon size={20} />
                      </div>
                      <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-center">{action.label}</span>
                    </button>
                  ))}
               </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-8 lg:space-y-12">
             <CollectorDiscoveryMap 
              vectors={[
                { label: 'Abstraction', value: 0.88 },
                { label: 'Minimalism', value: 0.72 },
                { label: 'Contemporary', value: 0.45 }
              ]}
             />
             <EcosystemPulseFeed />
          </aside>
        </div>
      </div>
    </div>
  )
}
