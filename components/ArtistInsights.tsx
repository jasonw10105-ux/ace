
import React, { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { 
  BarChart3, TrendingUp, Users, Eye, Heart, Share2, 
  DollarSign, Target, Zap, AlertCircle, CheckCircle, 
  ArrowUp, ArrowDown, Minus, ArrowLeft, Loader2,
  Activity, UserPlus, Fingerprint, Clock, Search
} from 'lucide-react'
import { Box, Flex, Grid, Text, Button } from '../flow'
import { EngagementSignal } from '../types'
import toast from 'react-hot-toast'

interface ArtistInsightsProps {
  artistId: string
  onBack?: () => void
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
  format?: 'number' | 'currency' | 'percentage';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, value, change, icon, color = '#000', format = 'number'
}) => {
  const formatValue = (val: string | number) => {
    if (format === 'currency') return `$${Number(val).toLocaleString()}`
    if (format === 'percentage') return `${Number(val).toFixed(1)}%`
    return Number(val).toLocaleString()
  }

  return (
    <Box bg="white" border="1px solid #E5E5E5" p={6} borderRadius="2px" className="group hover:border-black transition-all shadow-sm">
      <Flex justify="between" align="center" mb={4}>
        <Text variant="label" color="#999" size={10}>{title}</Text>
        <Box color={color} className="opacity-40 group-hover:opacity-100 transition-opacity">{icon}</Box>
      </Flex>
      <Flex align="baseline" gap={2}>
        <Text size={32} weight="bold" tracking="-0.02em" font="serif" italic>{formatValue(value)}</Text>
        {change !== undefined && (
          <Flex align="center" gap={0.5}>
            {change > 0 ? <ArrowUp size={12} className="text-green-600" /> : <ArrowDown size={12} className="text-red-600" />}
            <Text size={10} weight="bold" color={change > 0 ? "#166534" : "#991b1b"} font="mono">
              {Math.abs(change).toFixed(1)}%
            </Text>
          </Flex>
        )}
      </Flex>
    </Box>
  )
}

const ArtistInsights: React.FC<ArtistInsightsProps> = ({ artistId, onBack }) => {
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')
  const [radarSignals, setRadarSignals] = useState<EngagementSignal[]>([
    { id: 'sig-1', collectorName: 'Sarah J.', collectorId: 'c101', artworkId: 'art-1', artworkTitle: 'Neo-Tokyo Midnight', intensity: 92, timestamp: 'Just Now', isConverted: false },
    { id: 'sig-2', collectorName: 'Michael Rossi', collectorId: 'c102', artworkId: 'art-1', artworkTitle: 'Neo-Tokyo Midnight', intensity: 45, timestamp: '2m ago', isConverted: false },
    { id: 'sig-3', collectorName: 'Elena Vance', collectorId: 'c103', artworkId: 'art-4', artworkTitle: 'Digital Rust #04', intensity: 78, timestamp: '12m ago', isConverted: true },
  ])

  useEffect(() => {
    // Simulation of live neural signal ingestion
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [artistId]);

  const handleConvertToLead = (signal: EngagementSignal) => {
    toast.success(`Collector ${signal.collectorName} promoted to Studio CRM.`);
    setRadarSignals(prev => prev.map(s => s.id === signal.id ? { ...s, isConverted: true } : s));
  };

  if (loading) {
    return (
      <Flex direction="column" align="center" justify="center" height="100vh">
        <Loader2 className="animate-spin mb-4" size={40} />
        <Text variant="label" color="#666" tracking="0.4em">Synthesizing Market Signals...</Text>
      </Flex>
    )
  }

  return (
    <Box bg="#FFFFFF" minHeight="100vh" pt={24} pb={40}>
      <Helmet><title>Studio Intelligence | ArtFlow</title></Helmet>

      <Box maxWidth="1600px" mx="auto" px={6}>
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-gray-100 pb-12">
          <Box>
            <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-black mb-10 transition-all">
              <ArrowLeft size={16} /> Return to Studio
            </button>
            <Flex align="center" gap={3} mb={6} color="#1023D7">
               <Activity size={18} className="animate-pulse" />
               <Text variant="label" size={10} weight="bold">Intelligence Ledger</Text>
            </Flex>
            <h1 className="text-8xl font-serif font-bold italic tracking-tighter leading-none">Insights.</h1>
          </Box>

          <Flex bg="#F8F8F8" p={1.5} borderRadius="full" border="1px solid #E5E5E5">
            {['7d', '30d', '90d'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p as any)}
                className={`px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${period === p ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:text-black'}`}
              >
                {p}
              </button>
            ))}
          </Flex>
        </header>

        <Grid cols="1 md:2 lg:4" gap={6} mb={12}>
          <MetricCard title="Total Impressions" value={12480} change={14.2} icon={<Eye size={20} />} />
          <MetricCard title="Neural Resonance" value={88.4} format="percentage" change={2.1} icon={<Heart size={20} />} />
          <MetricCard title="Gross Pipeline" value={156200} format="currency" change={8.4} icon={<DollarSign size={20} />} />
          <MetricCard title="Network Flux" value={22} change={12} icon={<TrendingUp size={20} />} />
        </Grid>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* THE RADAR: Collector Tracking */}
           <section className="lg:col-span-8 space-y-10">
              <div className="flex justify-between items-center mb-6">
                 <Box>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
                       <Fingerprint size={16} className="text-blue-500" /> Active Signal Radar
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 font-light italic">Tracking logged-in collectors currently inspecting your assets.</p>
                 </Box>
                 <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 text-[9px] font-black text-blue-600 uppercase">
                    <Activity size={10} className="animate-pulse" /> Live Stream Synchronized
                 </div>
              </div>

              <div className="space-y-4">
                 {radarSignals.map((sig) => (
                   <div key={sig.id} className="group bg-white border border-gray-100 p-8 rounded-[3rem] flex items-center gap-10 hover:shadow-2xl hover:border-black transition-all duration-700 relative overflow-hidden">
                      <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-all">
                         <div className="relative">
                            <Users size={32} className="text-gray-300" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></div>
                         </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-4 mb-2">
                            <Text weight="bold" size={22} font="serif" italic className="group-hover:text-blue-600 transition-colors">{sig.collectorName}</Text>
                            <span className="text-[10px] font-mono text-gray-300 uppercase tracking-widest flex items-center gap-1">
                               <Clock size={12}/> {sig.timestamp}
                            </span>
                         </div>
                         <p className="text-sm text-gray-400 leading-none">
                            Inspecting <span className="text-black font-bold">"{sig.artworkTitle}"</span>
                         </p>
                         
                         <div className="mt-6 space-y-2">
                            <Flex justify="between" align="end">
                               <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">Interaction Intensity</span>
                               <span className="text-[10px] font-mono font-bold">{sig.intensity}%</span>
                            </Flex>
                            <div className="h-[2px] bg-gray-50 w-full overflow-hidden">
                               <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${sig.intensity}%` }}></div>
                            </div>
                         </div>
                      </div>

                      <div className="shrink-0 flex gap-3">
                         {sig.isConverted ? (
                           <div className="px-8 py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold text-[9px] uppercase tracking-[0.2em] border border-gray-100 flex items-center gap-2">
                              <CheckCircle size={14} className="text-green-500" /> In Studio CRM
                           </div>
                         ) : (
                           <button 
                             onClick={() => handleConvertToLead(sig)}
                             className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-[9px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center gap-3"
                           >
                              <UserPlus size={16} /> Add to Database
                           </button>
                         )}
                         <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-black hover:text-white transition-all">
                            <ArrowLeft className="rotate-180" size={20} />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </section>

           {/* STRATEGIC SUMMARY */}
           <aside className="lg:col-span-4 space-y-12">
              <section className="bg-black text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                 <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mb-10">
                    <Zap size={14} className="animate-pulse" /> Neural Strategy
                 </div>
                 <h4 className="text-3xl font-serif font-bold italic leading-tight mb-8">Performance <br/>Handshake.</h4>
                 <p className="text-lg text-gray-400 font-light leading-relaxed mb-10">
                    "Collector interest in your <span className="text-white font-medium italic">Abstraction</span> series is peaking in the Berlin sector. We recommend disconnecting 'Ethereal Synthesis' from general discovery and offering it privately to high-resonance leads."
                 </p>
                 <button className="w-full py-5 bg-white text-black rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-105 transition-all">
                    Generate Private Link
                 </button>
              </section>

              <section className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300 mb-10 flex items-center gap-3">
                    <Search size={14} /> Discovery Calibration
                 </h4>
                 <div className="space-y-8">
                    {[
                      { label: 'Berlin Sector', val: 84, color: 'bg-blue-600' },
                      { label: 'High-Net worth Seg.', val: 62, color: 'bg-green-500' },
                      { label: 'C-Suite Profiles', val: 34, color: 'bg-purple-600' }
                    ].map(stat => (
                      <div key={stat.label} className="space-y-2">
                         <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            <span>{stat.label}</span>
                            <span className="text-black">{stat.val}%</span>
                         </div>
                         <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.val}%` }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>
           </aside>
        </div>
      </Box>
    </Box>
  )
}

export default ArtistInsights;
