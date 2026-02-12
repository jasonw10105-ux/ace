
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Filter, Search, MoreVertical, Zap, 
  Plus, ChevronRight, ArrowRight, ArrowLeft, ShieldCheck, 
  DollarSign, Target, Loader2, Mail, MapPin, 
  Clock, MessageSquare, X, Eye, TrendingUp,
  Download, Upload, HardDrive, Package, UserCheck,
  Award, Tag, Send, BarChart3, List, CheckCircle2,
  Trash2, Sliders, Globe, Activity, Layout, 
  Settings as SettingsIcon, Bell, Layers,
  MousePointer2, Heart, SendHorizonal, Brain,
  Sparkles, Fingerprint
} from 'lucide-react';
import { geminiService, CollectorNeuralIntel } from '../services/geminiService';
import { Contact, InteractionEvent, Artwork } from '../types';
import { MOCK_ARTWORKS } from '../constants';
import { Box, Flex, Text, Button, Grid, Separator } from '../flow';
import toast from 'react-hot-toast';

type CRMView = 'audience' | 'campaigns' | 'automations' | 'segments';

export const ArtistCRM: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeView, setActiveView] = useState<CRMView>('audience');
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [is360Open, setIs360Open] = useState(false);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messageDraft, setMessageDraft] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [neuralIntel, setNeuralIntel] = useState<CollectorNeuralIntel | null>(null);
  
  const [availableTags] = useState(['VIP', 'Berlin Sector', 'NYC Sector', 'High-Intent', 'Minimalist Lover', 'Past Collector']);
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setIsLoading(true);
    // Real-world mock data for launch demonstration
    const mockContacts: Contact[] = [
      { 
        id: 'c1', user_id: 'a1', full_name: 'Julian Rossi', email: 'j.rossi@vault.art', 
        purchase_intent_score: 0.94, acquisition_likelihood: 0.9, lead_status: 'critical', 
        source: 'acquisition', ownedAssets: ['art-101'], 
        tags: ['VIP', 'Berlin Sector', 'Past Collector'], location: 'Berlin, DE', 
        avatar_url: 'https://picsum.photos/seed/julian/400', lifecycle_stage: 'collector', 
        growth_trajectory: 'surging', last_active: '12m ago',
        interaction_timeline: [
          { id: 'ev1', type: 'view', asset_title: 'Silent Monolithic #04', timestamp: '12m ago' },
          { id: 'ev2', type: 'campaign_open', asset_title: 'Brussels Fair Preview', timestamp: '2h ago' },
          { id: 'ev3', type: 'purchase', asset_title: 'Neo-Tokyo Midnight', timestamp: 'March 2024' }
        ]
      },
      { 
        id: 'c2', user_id: 'a1', full_name: 'Sasha Vance', email: 'sasha@frontier.art', 
        purchase_intent_score: 0.78, acquisition_likelihood: 0.7, lead_status: 'active', 
        source: 'organic', tags: ['High-Intent', 'NYC Sector'], location: 'New York, NY', 
        avatar_url: 'https://picsum.photos/seed/sasha/400', lifecycle_stage: 'opportunity', 
        growth_trajectory: 'stable', last_active: '2h ago' 
      },
      { 
        id: 'c3', user_id: 'a1', full_name: 'Marcus Thorne', email: 'm.thorne@estate.com', 
        purchase_intent_score: 0.45, acquisition_likelihood: 0.4, lead_status: 'dormant', 
        source: 'imported', tags: ['Archive'], location: 'London, UK', 
        avatar_url: 'https://picsum.photos/seed/marcus/400', lifecycle_stage: 'subscriber', 
        growth_trajectory: 'declining', last_active: '14d ago' 
      }
    ];
    setContacts(mockContacts);
    setIsLoading(false);
  };

  const filtered = useMemo(() => {
    let list = contacts.filter(c => 
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (activeSegment) {
       list = list.filter(c => c.tags.includes(activeSegment));
    }
    return list;
  }, [contacts, searchQuery, activeSegment]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const openContact360 = (contact: Contact) => {
    setActiveContact(contact);
    setNeuralIntel(null);
    setIs360Open(true);
  };

  const handleSynthesizeNeuralIntel = async () => {
    if (!activeContact) return;
    setIsSynthesizing(true);
    const synthToast = toast.loading('Synthesizing Collector DNA...');
    
    try {
      const intel = await geminiService.synthesizeCollectorDna(
        activeContact, 
        activeContact.interaction_timeline || [], 
        MOCK_ARTWORKS.slice(0, 50)
      );
      setNeuralIntel(intel);
      toast.success('Neural Map Synchronized', { id: synthToast });
    } catch (e) {
      toast.error('Synthesis Interrupt', { id: synthToast });
    } finally {
      setIsSynthesizing(false);
    }
  };

  const generateCommunicationDraft = async () => {
    if (!activeContact || !neuralIntel) return;
    toast.loading('Synthesizing tailored signal...');
    setTimeout(() => {
      setMessageDraft(`Hi ${activeContact.full_name.split(' ')[0]}, I noticed your recurring interest in the materiality of my recent series. Based on your affinity for ${neuralIntel.materialityBias[0] || 'structural forms'}, I'd love to share some private details on '${neuralIntel.predictedNextAssetId}'...`);
      toast.dismiss();
      toast.success('Communication Draft Ready');
    }, 1500);
  };

  const AudienceView = () => (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <header className="h-28 border-b border-gray-100 px-12 flex items-center justify-between shrink-0 bg-white/95 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-8 flex-1">
          {selectedIds.length > 0 ? (
            <div className="flex items-center gap-6 animate-in slide-in-from-left-4 duration-300">
               <div className="bg-black text-white px-5 py-2.5 rounded-full text-xs font-black uppercase flex items-center gap-2 shadow-lg">
                  <UserCheck size={14} /> {selectedIds.length} Nodes
               </div>
               <div className="h-8 w-[1px] bg-gray-200" />
               <button onClick={() => {}} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-black transition-all">
                  <Layers size={14} /> Targeted Drop
               </button>
               <button onClick={() => {}} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all">
                  <Tag size={14} /> Refine Tags
               </button>
            </div>
          ) : (
            <div className="relative flex-1 max-w-xl group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search audience by identity or intent DNA..." 
                className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none rounded-none text-xl font-serif italic outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all" 
              />
            </div>
          )}
        </div>
        <div className="flex gap-4">
           <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-black hover:text-white transition-all"><Sliders size={20}/></button>
           <button className="bg-black text-white px-10 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center gap-3">
              <Plus size={18} /> Import Ledger
           </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-12 py-8 custom-scrollbar">
         {isLoading ? (
            <Flex direction="column" align="center" justify="center" height="400px">
               <Loader2 className="animate-spin mb-4" />
               <Text variant="label" color="#999">Hydrating Audience Ledger...</Text>
            </Flex>
         ) : (
            <table className="w-full text-left border-separate border-spacing-y-4">
               <thead>
                  <tr className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">
                     <th className="w-12 px-6"><input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? contacts.map(c => c.id) : [])} checked={selectedIds.length === contacts.length && contacts.length > 0} className="accent-black w-4 h-4" /></th>
                     <th className="px-6 pb-4">Identity</th>
                     <th className="px-6 pb-4">Intent DNA</th>
                     <th className="px-6 pb-4">Segments</th>
                     <th className="px-6 pb-4">Activity</th>
                     <th className="px-6 pb-4 text-right">360 View</th>
                  </tr>
               </thead>
               <tbody>
                  {filtered.map((c) => (
                    <tr 
                      key={c.id} 
                      className={`group bg-white hover:bg-gray-50 transition-all cursor-pointer border border-gray-100 ${selectedIds.includes(c.id) ? 'bg-blue-50/30 ring-1 ring-blue-500/20 shadow-md' : ''}`}
                    >
                       <td className="px-6 py-8" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => toggleSelect(c.id)} className="accent-black w-4 h-4" /></td>
                       <td className="px-6 py-8" onClick={() => openContact360(c)}>
                          <Flex align="center" gap={6}>
                             <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 shadow-sm border border-gray-100">
                                <img src={c.avatar_url} className="w-full h-full object-cover" />
                             </div>
                             <div>
                                <Text weight="bold" size={18} font="serif" italic className="block mb-1 group-hover:text-blue-600 transition-colors">{c.full_name}</Text>
                                <Text size={11} color="#999" font="mono">{c.email}</Text>
                             </div>
                          </Flex>
                       </td>
                       <td className="px-6 py-8">
                          <Box maxWidth="140px">
                             <Flex justify="between" align="end" mb={1.5}>
                                <span className={`text-[9px] font-black uppercase tracking-tighter ${c.growth_trajectory === 'surging' ? 'text-green-500' : 'text-gray-400'}`}>
                                   {c.growth_trajectory}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-black">{Math.round(c.purchase_intent_score * 100)}%</span>
                             </Flex>
                             <div className="h-1 bg-gray-100 w-full overflow-hidden rounded-full">
                                <div 
                                  className={`h-full transition-all duration-[1.5s] ${c.purchase_intent_score > 0.8 ? 'bg-blue-600' : 'bg-black'}`} 
                                  style={{ width: `${c.purchase_intent_score * 100}%` }}
                                />
                             </div>
                          </Box>
                       </td>
                       <td className="px-6 py-8">
                          <div className="flex flex-wrap gap-1">
                             {c.tags.slice(0, 2).map(t => (
                               <span key={t} className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-[8px] font-black uppercase text-gray-400 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">{t}</span>
                             ))}
                             {c.tags.length > 2 && <span className="text-[8px] font-black text-gray-300 ml-1">+{c.tags.length - 2}</span>}
                          </div>
                       </td>
                       <td className="px-6 py-8">
                          <Flex align="center" gap={2}>
                             <Clock size={12} className="text-gray-300" />
                             <Text size={12} color="#707070" weight="medium">{c.last_active}</Text>
                          </Flex>
                       </td>
                       <td className="px-6 py-8 text-right">
                          <button onClick={(e) => { e.stopPropagation(); openContact360(c); }} className="p-3 hover:bg-black hover:text-white rounded-xl transition-all text-gray-300">
                             <ChevronRight size={18} />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         )}
      </div>
    </div>
  );

  return (
    <Box bg="#FFFFFF" minHeight="100vh" pt={24} className="animate-in fade-in duration-700">
      <div className="max-w-[1900px] mx-auto flex h-[calc(100vh-120px)] overflow-hidden">
        <aside className="w-[380px] bg-white border-r border-gray-100 p-12 shrink-0 flex flex-col justify-between overflow-y-auto">
           <div className="space-y-20">
              <div>
                 <button onClick={onBack} className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 hover:text-black mb-12 flex items-center gap-2 group transition-all">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1" /> Studio Workspace
                 </button>
                 <div className="flex items-center gap-6 mb-8">
                    <div className="p-4 bg-black text-white rounded-[1.5rem] shadow-2xl">
                       <Users size={32} />
                    </div>
                    <h1 className="text-7xl font-serif font-bold italic tracking-tighter leading-none">CRM.</h1>
                 </div>
              </div>
              <nav className="space-y-2">
                 <button 
                  onClick={() => { setActiveView('audience'); setActiveSegment(null); }}
                  className={`w-full flex items-center gap-6 p-7 rounded-[1.25rem] transition-all border ${activeView === 'audience' && !activeSegment ? 'bg-black border-black text-white shadow-2xl scale-[1.02]' : 'border-transparent text-gray-400 hover:text-black hover:bg-gray-50'}`}
                 >
                    <List size={20} /> 
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Master Audience</span>
                 </button>
                 <button 
                  onClick={() => setActiveView('campaigns')}
                  className={`w-full flex items-center gap-6 p-7 rounded-[1.25rem] transition-all border ${activeView === 'campaigns' ? 'bg-black border-black text-white shadow-2xl scale-[1.02]' : 'border-transparent text-gray-400 hover:text-black hover:bg-gray-50'}`}
                 >
                    <Send size={20} /> 
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Signal Dispatch</span>
                 </button>
                 <Separator my={12} />
                 <Text variant="label" color="#CCC" size={8} className="block mb-8 tracking-[0.4em] ml-2">Intelligent Segments</Text>
                 <div className="space-y-1">
                  {availableTags.map(tag => (
                    <button 
                      key={tag}
                      onClick={() => { setActiveSegment(activeSegment === tag ? null : tag); setActiveView('audience'); }}
                      className={`w-full flex items-center justify-between p-6 rounded-xl transition-all border ${activeSegment === tag ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-400 hover:text-black hover:bg-gray-50'}`}
                    >
                        <div className="flex items-center gap-6">
                          <Tag size={18} className={activeSegment === tag ? 'text-blue-600' : 'text-gray-200'} /> 
                          <span className="text-xs font-bold uppercase tracking-widest">{tag}</span>
                        </div>
                        <ChevronRight size={14} className="opacity-20" />
                    </button>
                  ))}
                 </div>
              </nav>
           </div>
           <div className="pt-10 border-t border-gray-100 space-y-8">
              <Box bg="#F8F8F8" p={10} borderRadius="2.5rem" className="shadow-inner">
                 <Flex align="center" gap={3} mb={6}>
                    <Activity size={20} className="text-blue-600 animate-pulse" />
                    <Text variant="label" size={9} weight="black" tracking="0.2em">Lead Scoring Online</Text>
                 </Flex>
                 <Text size={13} color="#707070" lineHeight={1.8}>
                    Neural engine re-calibrated 142 new interaction loops. Audience resonance updated.
                 </Text>
              </Box>
           </div>
        </aside>

        <AudienceView />

        {is360Open && activeContact && (
          <div className="fixed inset-y-0 right-0 w-[700px] bg-white shadow-[-40px_0_100px_rgba(0,0,0,0.2)] z-[250] flex flex-col animate-in slide-in-from-right-20 duration-700">
             <header className="h-36 border-b border-gray-100 px-12 flex items-center justify-between bg-white/95 backdrop-blur-xl sticky top-0 z-10">
                <Flex align="center" gap={8}>
                   <div className="w-24 h-24 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                      <img src={activeContact.avatar_url} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h2 className="text-5xl font-serif font-bold italic tracking-tighter leading-none mb-1">{activeContact.full_name}</h2>
                      <Flex align="center" gap={3}>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">Stage: {activeContact.lifecycle_stage}</span>
                        <span className="text-[10px] font-mono text-gray-300 uppercase tracking-widest">{activeContact.email}</span>
                      </Flex>
                   </div>
                </Flex>
                <button onClick={() => setIs360Open(false)} className="p-5 hover:bg-gray-50 rounded-full transition-all text-gray-200 hover:text-black">
                   <X size={32} />
                </button>
             </header>

             <div className="flex-1 overflow-y-auto p-12 space-y-16 custom-scrollbar pb-32">
                {/* Neural Intelligence Synthesis HUD */}
                <section className="bg-gray-900 text-white p-12 rounded-[4.5rem] relative overflow-hidden group shadow-2xl">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                   <Flex justify="between" align="center" mb={10}>
                      <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.4em]">
                         <Brain size={20} className={isSynthesizing ? 'animate-spin' : ''} /> Neural Intelligence
                      </div>
                      {!neuralIntel && (
                         <button 
                          onClick={handleSynthesizeNeuralIntel}
                          className="px-6 py-2.5 bg-white text-black rounded-xl font-bold text-[9px] uppercase tracking-widest hover:scale-105 transition-all"
                         >
                            Synthesize DNA
                         </button>
                      )}
                   </Flex>

                   {neuralIntel ? (
                      <div className="animate-in fade-in duration-1000">
                         <h4 className="text-3xl font-serif font-bold italic mb-6">Archetype: {neuralIntel.archetype}</h4>
                         <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 mb-8">
                            <p className="text-xl text-gray-300 font-light italic leading-relaxed">
                               "{neuralIntel.sentimentSummary}"
                            </p>
                         </div>
                         <div className="grid grid-cols-2 gap-8">
                            <Box>
                               <p className="text-[9px] font-black uppercase text-gray-500 mb-4 tracking-[0.2em]">Materiality Focus</p>
                               <div className="flex flex-wrap gap-2">
                                  {neuralIntel.materialityBias.map(m => (
                                    <span key={m} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-mono">{m}</span>
                                  ))}
                               </div>
                            </Box>
                            <Box textAlign="right">
                               <p className="text-[9px] font-black uppercase text-gray-500 mb-2 tracking-[0.2em]">Acquisition Confidence</p>
                               <p className="text-5xl font-serif font-bold italic text-blue-400">{Math.round(neuralIntel.confidence * 100)}%</p>
                            </Box>
                         </div>
                      </div>
                   ) : (
                      <div className="py-12 text-center">
                         <p className="text-sm text-gray-500 italic">Initialize synthesis to calibrate collector signals.</p>
                      </div>
                   )}
                </section>

                {/* Predictive Asset Matching */}
                {neuralIntel && (
                  <section className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                     <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300 flex items-center gap-4">
                        <Target size={20} className="text-red-500" /> Predictive Asset Matching
                     </h3>
                     <div className="bg-white border-2 border-black p-8 rounded-[3.5rem] flex items-center gap-8 shadow-xl">
                        <div className="w-32 h-32 rounded-[2rem] overflow-hidden shrink-0 shadow-lg grayscale hover:grayscale-0 transition-all duration-700">
                           <img src={`https://picsum.photos/seed/${neuralIntel.predictedNextAssetId}/400`} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-center mb-2">
                              <p className="text-2xl font-serif font-bold italic">Series Node: ${neuralIntel.predictedNextAssetId}</p>
                              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-black">HIGH ALIGNMENT</span>
                           </div>
                           <p className="text-sm text-gray-500 font-light italic leading-relaxed">
                              {neuralIntel.predictedReasoning}
                           </p>
                        </div>
                     </div>
                  </section>
                )}

                {/* Interaction Timeline */}
                <section className="space-y-12">
                   <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300 flex items-center gap-4">
                      <Activity size={20} className="text-blue-500" /> Identity Engagement History
                   </h3>
                   <div className="space-y-12 pl-4">
                      {(activeContact.interaction_timeline || []).map((evt, i) => (
                        <div key={evt.id} className="flex gap-10 relative group">
                           {i !== activeContact.interaction_timeline!.length - 1 && <div className="absolute left-[9px] top-8 bottom-[-48px] w-[1px] bg-gray-100 group-hover:bg-blue-200 transition-colors"></div>}
                           <div className={`w-5 h-5 rounded-full mt-2 shrink-0 z-10 bg-white border-2 border-gray-100 group-hover:border-black group-hover:scale-125 transition-all`}></div>
                           <div className="flex-1">
                              <Flex justify="between" align="start" mb={2}>
                                 <Box>
                                    <div className="flex items-center gap-3 mb-1">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 bg-gray-50 px-2 py-0.5 rounded">{evt.type}</span>
                                      <p className="font-bold text-lg text-black">{evt.asset_title}</p>
                                    </div>
                                    <p className="text-sm text-gray-400 font-light leading-relaxed">Captured via Registry v.8.4</p>
                                 </Box>
                                 <span className="text-[10px] font-mono text-gray-300 uppercase tracking-widest pt-1">{evt.timestamp}</span>
                              </Flex>
                           </div>
                        </div>
                      ))}
                   </div>
                </section>

                {/* Intelligent Signal Dispatch */}
                <section className="space-y-10">
                   <Flex justify="between" align="center">
                      <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300">Dispatch Individual Signal</h3>
                      {neuralIntel && (
                        <button 
                          onClick={generateCommunicationDraft}
                          className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:opacity-70"
                        >
                           <Sparkles size={14}/> Use Advisor Draft
                        </button>
                      )}
                   </Flex>
                   <div className="relative">
                      <textarea 
                        value={messageDraft}
                        onChange={e => setMessageDraft(e.target.value)}
                        placeholder={`Direct loop with ${activeContact.full_name.split(' ')[0]}...`}
                        className="w-full p-10 bg-gray-50 border-none rounded-[3.5rem] focus:bg-white focus:ring-1 focus:ring-black outline-none transition-all resize-none italic font-serif text-2xl leading-relaxed min-h-[200px] shadow-inner"
                      />
                      <button 
                        onClick={() => { toast.success('Signal Transmitted.'); setMessageDraft(''); }}
                        disabled={!messageDraft.trim()}
                        className="absolute bottom-8 right-8 p-8 bg-black text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all disabled:opacity-20"
                      >
                         <SendHorizonal size={28} />
                      </button>
                   </div>
                </section>
             </div>

             <footer className="p-12 border-t border-gray-100 bg-white flex justify-between items-center bg-white/95 backdrop-blur-md mt-auto">
                <button className="px-10 py-5 bg-gray-50 text-gray-400 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all">
                   Purge Identity Node
                </button>
                <div className="flex items-center gap-4">
                   <div className="text-right">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">End-to-End Encryption</p>
                      <p className="text-[9px] font-mono text-gray-400">Ledger-Synced (V.8.4)</p>
                   </div>
                   <ShieldCheck size={32} className="text-blue-500" />
                </div>
             </footer>
          </div>
        )}
      </div>
    </Box>
  );
};
