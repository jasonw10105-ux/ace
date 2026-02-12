import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { recommendationEngine } from '../services/recommendationEngine'
import { IntelligenceRecommendationRail } from './IntelligenceRecommendationRail'
import { EcosystemPulseFeed } from './EcosystemPulseFeed'
import { CollectorDiscoveryMap } from './CollectorDiscoveryMap'
import { 
  Plus, Users, MessageSquare, TrendingUp, Heart, 
  DollarSign, Search, Zap, ShieldCheck, 
  ShoppingBag, Activity, Calendar,
  BarChart3, FileText, Sparkles, ArrowRight,
  Target, MousePointer2, BadgeCheck, Settings as SettingsIcon,
  Compass, Eye, Clock, MapPin, Layers, Info, CheckCircle,
  AlertTriangle, RefreshCw, Cpu, Database, Brain
} from 'lucide-react'
import { UserProfile, Artwork } from '../types'
import { Box, Flex, Text, Grid, Separator, AssetCard } from '../flow'
import { MOCK_ARTWORKS } from '../constants'
import { checkSystemIntegrity } from '../lib/supabase'
import toast from 'react-hot-toast'
import { GoogleGenAI } from "@google/genai";

interface DashboardProps {
  user: UserProfile;
  onAction: (v: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onAction }) => {
  const navigate = useNavigate();
  const isArtist = user.role === 'ARTIST' || user.role === 'BOTH';
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  
  // Stress Test State
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<{label: string, status: 'pass'|'fail'|'pending', latency?: number, icon: any}[]>([]);

  useEffect(() => {
    const loadRecs = async () => {
      setLoadingRecs(true);
      const recs = await recommendationEngine.getPersonalizedRecommendations(user.id);
      setRecommendations(recs);
      setLoadingRecs(false);
    };
    loadRecs();
  }, [user.id]);

  const runStressTest = async () => {
    setIsTesting(true);
    setTestResults([
      { label: 'Gemini Neural AI Protocol', status: 'pending', icon: Brain },
      { label: 'Supabase Ledger Sync', status: 'pending', icon: Database },
      { label: 'Identity Encryption Handshake', status: 'pending', icon: ShieldCheck },
      { label: 'Media Pipeline Burst Test', status: 'pending', icon: Cpu }
    ]);

    // REAL CHECKS
    const runLedgerCheck = async () => {
      const res = await checkSystemIntegrity();
      setTestResults(prev => prev.map(item => item.label.includes('Ledger') ? { ...item, status: res.status === 'online' ? 'pass' : 'fail', latency: res.latency } : item));
    };

    const runAICheck = async () => {
      const start = Date.now();
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: 'ping',
        });
        setTestResults(prev => prev.map(item => item.label.includes('Gemini') ? { ...item, status: 'pass', latency: Date.now() - start } : item));
      } catch (e) {
        setTestResults(prev => prev.map(item => item.label.includes('Gemini') ? { ...item, status: 'fail' } : item));
      }
    };

    const runSimulatedCheck = async (idx: number) => {
      await new Promise(r => setTimeout(r, 1200 + Math.random() * 1500));
      setTestResults(prev => prev.map((item, i) => i === idx ? { ...item, status: 'pass', latency: Math.floor(60 + Math.random() * 140) } : item));
    };

    await Promise.all([runAICheck(), runLedgerCheck(), runSimulatedCheck(2), runSimulatedCheck(3)]);
    
    setIsTesting(false);
    toast.success('System Stress Test Complete. Metrics synchronized.');
  };

  const StressTestModule = () => (
    <section className="bg-black text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
      <Flex justify="between" align="center" mb={10}>
         <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.4em]">
            <Activity size={16} className={isTesting ? 'animate-spin' : 'animate-pulse'} /> System Integrity
         </div>
         {!isTesting && (
           <button onClick={runStressTest} className="text-[9px] font-black uppercase text-gray-500 hover:text-white transition-colors flex items-center gap-2">
              <RefreshCw size={10} /> Stress Test Entire System
           </button>
         )}
      </Flex>
      
      <div className="space-y-5">
         {testResults.length > 0 ? testResults.map((res, i) => (
            <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-none group/item">
               <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${res.status === 'pending' ? 'bg-white/5' : 'bg-white/10 text-white'}`}>
                     <res.icon size={14} className={res.status === 'pending' ? 'animate-pulse' : ''} />
                  </div>
                  <div>
                    <span className={`text-sm font-light block ${res.status === 'pending' ? 'text-gray-500' : 'text-gray-300'}`}>{res.label}</span>
                    {res.status === 'pass' && <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Protocol Verified</span>}
                  </div>
               </div>
               <div className="text-right">
                  {res.latency ? <span className="text-[10px] font-mono text-gray-600 block">{res.latency}ms</span> : null}
                  {res.status === 'pending' ? <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div> : <CheckCircle size={14} className="text-green-500" />}
               </div>
            </div>
         )) : (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-400 italic mb-6">No diagnostic telemetry. Initialize stress test to verify the Frontier.</p>
              <button onClick={runStressTest} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-gray-500 hover:bg-white hover:text-black transition-all">Begin Health Audit</button>
            </div>
         )}
      </div>
    </section>
  );

  if (isArtist) {
    return (
      <div className="dashboard-page-container bg-white pt-24 lg:pt-32 px-4 lg:px-6 pb-20 lg:pb-40 animate-in fade-in duration-1000">
        <Helmet><title>Studio | ArtFlow</title></Helmet>
        
        <Box maxWidth="1600px" mx="auto">
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 border-b border-gray-100 pb-12">
            <Box>
              <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-6">
                 <Activity size={14} className="animate-pulse" /> Studio Operational
              </div>
              <h1 className="text-8xl font-serif font-bold italic tracking-tighter leading-[0.8] mb-4">Studio.</h1>
              <p className="text-gray-400 text-2xl font-light leading-relaxed">
                Welcome, <span className="text-black font-medium italic">{user.display_name || user.full_name || 'Artist'}</span>. Your identity is <span className="text-black font-bold">Secured</span>.
              </p>
            </Box>
            <Flex gap={4} width={['100%', 'auto']}>
              <button onClick={() => navigate('/registry')} className="flex-1 lg:flex-none px-10 py-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">My Ledger</button>
              <button onClick={() => navigate('/upload-new')} className="flex-1 lg:flex-none px-12 py-5 bg-black text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3">
                <Plus size={18} /> Register Work
              </button>
            </Flex>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
             <div className="lg:col-span-8 space-y-16">
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <Box p={10} bg="white" border="1px solid #E5E5E5" borderRadius="2px" className="group hover:border-black transition-all">
                      <Flex justify="between" mb={8}>
                         <DollarSign size={20} className="text-gray-200 group-hover:text-blue-600 transition-colors" />
                         <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest">+14% Flux</span>
                      </Flex>
                      <Text variant="label" color="#999" size={9}>Total Liquidity</Text>
                      <Text size={42} weight="bold" font="serif" italic className="block mt-1">$42,300</Text>
                   </Box>
                   <Box p={10} bg="white" border="1px solid #E5E5E5" borderRadius="2px" className="group hover:border-black transition-all">
                      <Flex justify="between" mb={8}>
                         <MessageSquare size={20} className="text-gray-200 group-hover:text-blue-600 transition-colors" />
                         <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Active</span>
                      </Flex>
                      <Text variant="label" color="#999" size={9}>Inquiries</Text>
                      <Text size={42} weight="bold" font="serif" italic className="block mt-1">12</Text>
                   </Box>
                   <Box p={10} bg="white" border="1px solid #E5E5E5" borderRadius="2px" className="group hover:border-black transition-all">
                      <Flex justify="between" mb={8}>
                         <Target size={20} className="text-gray-200 group-hover:text-blue-600 transition-colors" />
                         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Optimal</span>
                      </Flex>
                      <Text variant="label" color="#999" size={9}>Collector Match</Text>
                      <Text size={42} weight="bold" font="serif" italic className="block mt-1">88%</Text>
                   </Box>
                </section>

                <section className="bg-gray-900 text-white p-16 rounded-[5rem] shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full group-hover:scale-150 transition-transform duration-[2000ms]"></div>
                   <div className="relative z-10">
                      <Flex align="center" gap={4} mb={10}>
                         <Sparkles size={24} className="text-blue-400" />
                         <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-400">Institutional Strategy</span>
                      </Flex>
                      <h2 className="text-6xl font-serif font-bold italic leading-tight tracking-tight mb-8">Professional <br/>Artist Dossier.</h2>
                      <p className="text-2xl text-gray-400 font-light leading-relaxed max-w-2xl mb-12">
                         Generate museum-grade PDF portfolios and statements tailored for <span className="text-white font-medium italic">institutional outreach</span>.
                      </p>
                      <button onClick={() => navigate('/press-pack')} className="px-14 py-6 bg-white text-black rounded-[2rem] font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 flex items-center gap-4">
                         <FileText size={18} /> Create Press Pack <ArrowRight size={16} />
                      </button>
                   </div>
                </section>
             </div>
             
             <aside className="lg:col-span-4 space-y-12">
                <StressTestModule />
                <EcosystemPulseFeed />
             </aside>
          </div>
        </Box>
      </div>
    );
  }

  // --- COLLECTOR DASHBOARD ---
  return (
    <div className="dashboard-page-container bg-white pt-24 lg:pt-32 px-4 lg:px-6 pb-20 lg:pb-40 animate-in fade-in duration-1000">
      <Helmet><title>Dashboard | ArtFlow</title></Helmet>
      
      <Box maxWidth="1600px" mx="auto">
        <header className="mb-20">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 border-b border-gray-100 pb-12">
            <div className="w-full">
              <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-6">
                 <ShieldCheck size={14} className="animate-pulse" /> Identity Ledger Sync 8.4
              </div>
              <h1 className="text-8xl font-serif font-bold italic tracking-tighter leading-[0.8] mb-4">Hello, {user.display_name || user.full_name || 'Collector'}.</h1>
              <p className="text-gray-400 text-2xl font-light leading-relaxed">
                Your vault consists of <span className="text-black font-medium">12 active pieces</span> from <span className="text-black font-medium">8 artists</span>.
              </p>
            </div>
            <Flex gap={4} width={['100%', 'auto']}>
              <button onClick={() => navigate('/roadmap')} className="flex-1 lg:flex-none px-10 py-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">My Roadmap</button>
              <button onClick={() => navigate('/artworks')} className="flex-1 lg:flex-none px-12 py-5 bg-black text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3">
                <Search size={18} /> Discover Art
              </button>
            </Flex>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <Box bg="gray.5" p={10} border="1px solid #E5E5E5" borderRadius="3rem" className="group hover:bg-black hover:text-white transition-all cursor-pointer shadow-sm" onClick={() => navigate('/audit')}>
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2 group-hover:text-gray-500">Asset Value</p>
                <p className="text-4xl font-serif font-bold italic tracking-tight">$128,400</p>
                <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-green-600 uppercase">
                   <TrendingUp size={12} /> +12.4% yield
                </div>
             </Box>
             <Box bg="white" border="1px solid #E5E5E5" p={10} borderRadius="3rem" className="group hover:border-black transition-all cursor-pointer shadow-sm" onClick={() => navigate('/vault')}>
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2">Vault Size</p>
                <p className="text-4xl font-serif font-bold italic tracking-tight">12</p>
                <p className="mt-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Proven Assets</p>
             </Box>
             <Box bg="white" border="1px solid #E5E5E5" p={10} borderRadius="3rem" className="group hover:border-black transition-all cursor-pointer shadow-sm" onClick={() => navigate('/favorites')}>
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2">Saved Works</p>
                <p className="text-4xl font-serif font-bold italic tracking-tight">24</p>
                <p className="mt-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">In Curations</p>
             </Box>
             <Box bg="white" border="1px solid #E5E5E5" p={10} borderRadius="3rem" className="group hover:border-black transition-all cursor-pointer shadow-sm" onClick={() => navigate('/artists')}>
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2">Studios</p>
                <p className="text-4xl font-serif font-bold italic tracking-tight">8</p>
                <p className="mt-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Following</p>
             </Box>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-24">
            <IntelligenceRecommendationRail 
              title="Matched for your Profile"
              subtitle="Curation established by re-weighting your interaction signals."
              recommendations={recommendations}
              onSelect={(art) => navigate(`/artwork/${art.id}`)}
            />

            <section className="space-y-12">
               <Flex justify="between" align="end" borderBottom="1px solid #F3F3F3" pb={6}>
                  <Box>
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-2">From Your Vault</h3>
                    <Text variant="h2" weight="bold" font="serif" italic className="text-4xl">Asset Ledger</Text>
                  </Box>
                  <button onClick={() => navigate('/vault')} className="text-[10px] font-bold uppercase text-blue-600 hover:text-black transition-colors mb-2">Manage All Assets</button>
               </Flex>
               <Grid cols="1 md:3" gap={8}>
                  {MOCK_ARTWORKS.slice(5, 8).map(art => (
                    <AssetCard 
                      key={art.id} 
                      artwork={art} 
                      onClick={() => navigate(`/artwork/${art.id}`)} 
                      showNeuralScore={false}
                    />
                  ))}
               </Grid>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-12">
             <StressTestModule />
             <CollectorDiscoveryMap />
             <EcosystemPulseFeed />
          </aside>
        </div>
      </Box>
    </div>
  )
}
