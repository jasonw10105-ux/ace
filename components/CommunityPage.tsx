
import React from 'react';
import { 
  Heart, Sparkles, User, ShieldCheck, Zap, 
  TrendingUp, Globe, Layers, ArrowRight,
  Eye, Activity, MessageSquare, Compass,
  MapPin, Lock
} from 'lucide-react';
import { Box, Flex, Text, Button, Grid, Separator } from '../flow';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';

interface CommunityPageProps {
  user: UserProfile | null;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ user }) => {
  const navigate = useNavigate();
  
  const pulseEvents = [
    { 
      type: 'acquisition', 
      user: 'Aesthetic Seeker', 
      location: 'Berlin, DE', 
      action: 'vaulted a original', 
      asset: 'Midnight Brutalism #04',
      time: '12m ago',
      color: 'bg-blue-50 text-blue-600',
      icon: <ShieldCheck size={14} />
    },
    { 
      type: 'signal', 
      user: 'Marcus T.', 
      location: 'London, UK', 
      action: 'shared a private loop', 
      asset: 'The Abstract Series',
      time: '24m ago',
      color: 'bg-purple-50 text-purple-600',
      icon: <Zap size={14} />
    },
    { 
      type: 'discovery', 
      user: 'Elena Studio', 
      location: 'Toronto, CA', 
      action: 'released new nodes', 
      asset: 'Chromesthesia v.2',
      time: '1h ago',
      color: 'bg-green-50 text-green-600',
      icon: <Sparkles size={14} />
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-40 animate-in fade-in duration-1000">
      <Box maxWidth="1600px" mx="auto" px={6} py={32}>
        <header className="mb-24 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b border-gray-100 pb-16">
          <Box maxWidth="800px">
            <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-6">
              <Globe size={14} className="animate-pulse" /> The Collective Spectrum
            </div>
            <h1 className="text-8xl font-serif font-bold italic tracking-tighter leading-[0.8] mb-6">Pulse.</h1>
            <p className="text-gray-400 text-2xl font-light leading-relaxed">
              Real-time activity across the <span className="text-black font-medium">Frontier Network</span>. Discover what’s resonating now.
            </p>
          </Box>
          <div className="flex gap-4">
             <div className="px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl flex items-center gap-4">
                <Activity size={20} className="text-blue-600" />
                <div className="text-left">
                   <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">Global Signal</p>
                   <p className="font-bold text-sm">98.4% Aligned</p>
                </div>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
           {/* Live Feed Column */}
           <main className="lg:col-span-8 space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-300 mb-10 flex items-center gap-3">
                 <Activity size={16} className="text-blue-500" /> Live Interaction Stream
              </h3>

              <div className="space-y-6">
                 {pulseEvents.map((ev, i) => (
                   <div key={i} className="group bg-white border border-gray-100 p-8 rounded-[3.5rem] flex items-center gap-10 hover:shadow-2xl hover:border-black transition-all duration-700 relative overflow-hidden">
                      <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                         <User size={32} className="text-gray-200" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${ev.color}`}>
                               {ev.icon} {ev.type}
                            </span>
                            <span className="text-[10px] font-mono text-gray-300 uppercase tracking-widest">{ev.time}</span>
                         </div>
                         <p className="text-2xl font-serif italic text-gray-600 leading-tight">
                            <span className="text-black font-bold not-italic">{ev.user}</span> from <span className="text-black font-bold not-italic">{ev.location}</span> {ev.action} <span className="text-blue-600 font-bold not-italic">"{ev.asset}"</span>.
                         </p>
                      </div>
                      <div className="shrink-0">
                         <button className="p-5 bg-gray-50 text-gray-400 rounded-2xl group-hover:bg-black group-hover:text-white transition-all">
                            <ArrowRight size={24} />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="pt-20">
                 {user ? (
                   <section className="bg-black text-white p-16 rounded-[5rem] shadow-2xl relative overflow-hidden group border border-blue-500/20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="relative z-10">
                       <Flex align="center" gap={4} mb={10}>
                          <Compass size={24} className="text-blue-400" />
                          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-400">Intelligence Spotlight</span>
                       </Flex>
                       {user.role === 'ARTIST' ? (
                          <>
                            <h2 className="text-6xl font-serif font-bold italic leading-tight tracking-tight mb-8">Demand for <br/>{user.preferences?.favoriteStyles?.[0] || 'Contemporary'} forms.</h2>
                            <p className="text-2xl text-gray-400 font-light leading-relaxed max-w-2xl mb-12">
                              Your creative niche is currently seeing an <span className="text-white font-bold">+18% increase</span> in collector dwelling time. High potential for private acquisitions in the Berlin sector.
                            </p>
                          </>
                       ) : (
                          <>
                            <h2 className="text-6xl font-serif font-bold italic leading-tight tracking-tight mb-8">Recalibrating your <br/>Aesthetic Thesis.</h2>
                            <p className="text-2xl text-gray-400 font-light leading-relaxed max-w-2xl mb-12">
                              The frontier is shifting toward textural minimalism. Based on your Roadmap, we recommend looking at <span className="text-white font-bold">Berlin-based sculptors</span> for your next vault anchor.
                            </p>
                          </>
                       )}
                       <button 
                        onClick={() => navigate(user.role === 'ARTIST' ? '/market-intelligence' : '/roadmap')}
                        className="px-12 py-5 bg-white text-black rounded-[2rem] font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 flex items-center gap-4"
                       >
                          Analyze My Sector <ArrowRight size={18} />
                       </button>
                    </div>
                   </section>
                 ) : (
                   <section className="bg-gray-50 border border-dashed border-gray-300 p-16 rounded-[5rem] text-center">
                      <Lock size={48} className="mx-auto text-gray-300 mb-8" />
                      <h2 className="text-4xl font-serif font-bold italic mb-4">Deep Intelligence Locked.</h2>
                      <p className="text-gray-400 max-w-xl mx-auto mb-10 text-xl font-light">Join the Frontier as an Artist or Collector to access neural market insights and personalized discovery signals.</p>
                      <Button onClick={() => navigate('/auth')}>Identity Verification Required</Button>
                   </section>
                 )}
              </div>
           </main>

           {/* Curated Sidebar */}
           <aside className="lg:col-span-4 space-y-12">
              <section className="bg-gray-50 p-10 rounded-[3.5rem] border border-gray-100">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-10">Trending Nodes</h4>
                 <div className="space-y-8">
                    {['Elena Vance', 'Kenji Sato', 'Sasha Novak'].map((artist, idx) => (
                      <div key={idx} className="flex items-center gap-5 group cursor-pointer">
                         <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-lg grayscale group-hover:grayscale-0 transition-all">
                            <img src={`https://picsum.photos/seed/${artist}/100`} alt={artist} />
                         </div>
                         <div className="flex-1">
                            <p className="font-bold text-sm leading-none mb-1">{artist}</p>
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                               <MapPin size={10} className="text-blue-500" /> Berlin sector
                            </div>
                         </div>
                         <span className="text-[10px] font-mono font-bold text-green-600">+14.2%</span>
                      </div>
                    ))}
                 </div>
                 <button onClick={() => navigate('/artists')} className="w-full mt-10 py-4 border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black hover:border-black transition-all">View All Creators</button>
              </section>

              <section className="bg-white border border-gray-100 p-10 rounded-[3.5rem] shadow-sm space-y-8">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Network Resonance</h4>
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center"><Heart size={20} fill="currentColor"/></div>
                       <div>
                          <p className="font-bold text-lg leading-none">1.2k</p>
                          <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Saves Today</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><MessageSquare size={20}/></div>
                       <div>
                          <p className="font-bold text-lg leading-none">84</p>
                          <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Active Negotiations</p>
                       </div>
                    </div>
                 </div>
              </section>

              <div className="p-10 bg-blue-50 border border-blue-100 rounded-[3.5rem] space-y-6">
                 <Flex align="center" gap={3}>
                    <ShieldCheck size={20} className="text-blue-600" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-800">Verified Ecosystem</p>
                 </Flex>
                 <p className="text-sm text-blue-700/60 leading-relaxed italic font-serif">
                   "Our network is built on verified provenance. Every signal in this feed represents a cryptographically secured event within the registry."
                 </p>
              </div>
           </aside>
        </div>
      </Box>
    </div>
  );
};

export default CommunityPage;
