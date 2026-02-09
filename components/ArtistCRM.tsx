import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Filter, Search, MoreVertical, Zap, 
  Plus, ChevronRight, ArrowRight, ArrowLeft, ShieldCheck, 
  DollarSign, Target, Loader2, Mail, MapPin, 
  Clock, MessageSquare, X, Eye, TrendingUp,
  Download, Upload, HardDrive, Package, UserCheck
} from 'lucide-react';
import { purchaseIntentScoringService, IntentAnalysis } from '../services/purchaseIntentScoring';
import { Contact } from '../types';
import { Box, Flex, Text, Button, Grid, Separator } from '../flow';
import toast from 'react-hot-toast';

type CRMFilter = 'all' | 'owners' | 'buyers' | 'imported';

export const ArtistCRM: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<CRMFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<IntentAnalysis | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setIsLoading(true);
    // Categorized Studio Data
    const mockContacts: Contact[] = [
      { id: 'c1', user_id: 'a1', full_name: 'Julian Rossi', email: 'j.rossi@vault.art', purchase_intent_score: 0.92, acquisition_likelihood: 0.9, lead_status: 'critical', source: 'owner', ownedAssets: ['art-101'], tags: ['Collector', 'Berlin'], location: 'Berlin, DE', avatar_url: 'https://picsum.photos/seed/julian/100' },
      { id: 'c2', user_id: 'a1', full_name: 'Sasha Vance', email: 'sasha@frontier.art', purchase_intent_score: 0.75, acquisition_likelihood: 0.7, lead_status: 'active', source: 'buyer', tags: ['London'], location: 'London, UK', avatar_url: 'https://picsum.photos/seed/sasha/100' },
      { id: 'c3', user_id: 'a1', full_name: 'Marcus Thorne', email: 'm.thorne@estate.com', purchase_intent_score: 0.45, acquisition_likelihood: 0.4, lead_status: 'dormant', source: 'imported', tags: ['Estate'], location: 'New York, NY', avatar_url: 'https://picsum.photos/seed/marcus/100' },
      { id: 'c4', user_id: 'a1', full_name: 'Elena List', email: 'e.list@curated.io', purchase_intent_score: 0.88, acquisition_likelihood: 0.85, lead_status: 'critical', source: 'owner', ownedAssets: ['art-102', 'art-105'], tags: ['Legacy'], location: 'Paris, FR', avatar_url: 'https://picsum.photos/seed/elena/100' }
    ];
    
    setContacts(mockContacts);
    setIsLoading(false);
  };

  const handleContactSelect = async (contact: Contact) => {
    setSelectedContact(contact);
    const analysis = await purchaseIntentScoringService.calculateIntent(contact.id);
    setSelectedAnalysis(analysis);
  };

  const filtered = useMemo(() => {
    let list = contacts.filter(c => 
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (activeTab === 'owners') list = list.filter(c => c.source === 'owner');
    if (activeTab === 'buyers') list = list.filter(c => c.source === 'buyer');
    if (activeTab === 'imported') list = list.filter(c => c.source === 'imported');
    return list;
  }, [contacts, searchQuery, activeTab]);

  return (
    <Box bg="#FFFFFF" minHeight="100vh" pt={24} className="animate-in fade-in duration-700">
      <div className="max-w-[1700px] mx-auto flex h-[calc(100vh-120px)] overflow-hidden">
        {/* Studio Sidebar */}
        <aside className="w-96 bg-white border-r border-gray-100 p-12 shrink-0 flex flex-col justify-between">
           <div className="space-y-16">
              <div>
                 {/* Added ArrowLeft icon from lucide-react */}
                 <button onClick={onBack} className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 hover:text-black mb-12 flex items-center gap-2 group transition-all">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1" /> Return to Studio
                 </button>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-black text-white rounded-2xl shadow-xl">
                       <HardDrive size={24} />
                    </div>
                    <h1 className="text-6xl font-serif font-bold italic tracking-tighter leading-none">Studio DB.</h1>
                 </div>
                 <p className="text-gray-400 text-lg font-light leading-relaxed">Your private register of authenticated collectors and buyers.</p>
              </div>
              
              <nav className="space-y-1">
                 {[
                   { id: 'all', label: 'Entire Database', icon: Users, count: contacts.length },
                   { id: 'owners', label: 'Verified Owners', icon: ShieldCheck, count: contacts.filter(c => c.source === 'owner').length },
                   { id: 'buyers', label: 'Past Buyers', icon: Package, count: contacts.filter(c => c.source === 'buyer').length },
                   { id: 'imported', label: 'Hand-Added / Import', icon: Upload, count: contacts.filter(c => c.source === 'imported').length }
                 ].map(tab => (
                   <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as CRMFilter)}
                    className={`w-full flex items-center justify-between p-6 rounded-sm transition-all border ${activeTab === tab.id ? 'bg-black border-black text-white shadow-2xl scale-[1.02]' : 'border-transparent text-gray-400 hover:text-black hover:bg-gray-50'}`}
                   >
                      <div className="flex items-center gap-6">
                        <tab.icon size={18} className={activeTab === tab.id ? 'text-blue-400' : ''} /> 
                        <span className="text-xs font-bold uppercase tracking-widest">{tab.label}</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-40">{tab.count}</span>
                   </button>
                 ))}
              </nav>
           </div>

           <div className="flex flex-col gap-3">
              <button 
               onClick={() => toast('Initializing CSV Link...')}
               className="w-full py-5 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3"
              >
                 <Upload size={14} /> Bulk Import Contacts
              </button>
              <div className="p-6 bg-gray-50 border border-gray-100 rounded-[2rem] flex items-start gap-4">
                 <UserCheck size={20} className="text-blue-500 shrink-0" />
                 <p className="text-[10px] text-gray-400 leading-relaxed uppercase font-bold tracking-widest">
                   Studio Guard: <span className="font-light italic text-gray-300">This registry is private. Contact data is never used for collective training.</span>
                 </p>
              </div>
           </div>
        </aside>

        {/* Studio Ledger (Table) */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
          <header className="h-28 border-b border-gray-100 px-16 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
             <div className="relative flex-1 max-w-xl group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter Studio DB by identity..." 
                  className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none rounded-none text-xl font-serif italic outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all" 
                />
             </div>
             <div className="flex gap-4">
                <button className="px-10 py-5 bg-gray-50 text-gray-400 border border-gray-100 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-3">
                   <Download size={16} /> Export Ledger
                </button>
                <button className="bg-black text-white px-10 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20 flex items-center gap-3">
                   <Plus size={18} /> Add Contact
                </button>
             </div>
          </header>

          <div className="flex-1 overflow-y-auto px-16 py-12 custom-scrollbar">
             {isLoading ? (
               <Flex direction="column" align="center" justify="center" height="100%">
                  <Loader2 className="animate-spin text-black mb-6" size={48} />
                  <Text variant="label" color="#999" tracking="0.4em">Accessing Studio Archives...</Text>
               </Flex>
             ) : (
               <table className="w-full text-left border-separate border-spacing-y-6">
                  <thead>
                     <tr className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">
                        <th className="px-8 pb-4">Identity Node</th>
                        <th className="px-8 pb-4">Provenance Link</th>
                        <th className="px-8 pb-4 text-center">Neural Resonance</th>
                        <th className="px-8 pb-4">Geo Sector</th>
                        <th className="px-8 pb-4 text-right">Channel</th>
                     </tr>
                  </thead>
                  <tbody>
                     {filtered.map((c) => (
                       <tr 
                        key={c.id} 
                        onClick={() => handleContactSelect(c)}
                        className={`group bg-white hover:bg-gray-50 transition-all cursor-pointer border-y border-gray-100 ${selectedContact?.id === c.id ? 'ring-2 ring-black bg-gray-50 scale-[1.01]' : ''}`}
                       >
                          <td className="px-8 py-10">
                             <Flex align="center" gap={8}>
                                <div className="w-16 h-16 rounded-[2rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 shadow-lg border-4 border-white">
                                   <img src={c.avatar_url} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                   <Text weight="bold" size={20} font="serif" italic className="block mb-1">{c.full_name}</Text>
                                   <div className="flex items-center gap-2">
                                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                        c.source === 'owner' ? 'bg-blue-50 text-blue-500' : 
                                        c.source === 'buyer' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                                      }`}>
                                        {c.source}
                                      </span>
                                      <Text size={11} color="#999" font="mono">{c.email}</Text>
                                   </div>
                                </div>
                             </Flex>
                          </td>
                          <td className="px-8 py-10">
                             <Box>
                                {c.ownedAssets && c.ownedAssets.length > 0 ? (
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-50"><Package size={16}/></div>
                                     <div>
                                        <p className="text-[10px] font-black text-black uppercase tracking-widest">{c.ownedAssets.length} Assets</p>
                                        <p className="text-[9px] text-gray-400 font-mono">LOCKED IN VAULT</p>
                                     </div>
                                  </div>
                                ) : (
                                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 italic">No Provenance</span>
                                )}
                             </Box>
                          </td>
                          <td className="px-8 py-10">
                             <Box maxWidth="180px" mx="auto">
                                <Flex justify="between" align="end" mb={1.5}>
                                   <span className="text-[10px] font-mono font-bold">{Math.round(c.purchase_intent_score * 100)}%</span>
                                   <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-tighter ${
                                     c.purchase_intent_score > 0.8 ? 'text-blue-600' : 'text-gray-300'
                                   }`}>High Interaction</span>
                                </Flex>
                                <div className="h-0.5 bg-gray-100 w-full overflow-hidden">
                                   <div 
                                    className="h-full bg-black transition-all duration-1000" 
                                    style={{ width: `${c.purchase_intent_score * 100}%` }}
                                   />
                                </div>
                             </Box>
                          </td>
                          <td className="px-8 py-10">
                             <Flex align="center" gap={2} color="#707070">
                                <MapPin size={14} className="text-blue-500" />
                                <Text size={14} weight="medium">{c.location}</Text>
                             </Flex>
                          </td>
                          <td className="px-8 py-10 text-right">
                             <button className="p-4 rounded-2xl hover:bg-black hover:text-white transition-all text-gray-300 hover:shadow-xl group/btn">
                                <MessageSquare size={20} className="group-hover/btn:scale-110 transition-transform" />
                             </button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
             )}
          </div>
        </main>

        {/* Individual Profile Synthesis */}
        {selectedContact && selectedAnalysis && (
          <aside className="w-[550px] bg-white border-l border-gray-100 p-16 overflow-y-auto animate-in slide-in-from-right duration-700">
             <div className="flex justify-between items-center mb-16">
                <div className="flex items-center gap-4 text-black font-bold text-[10px] uppercase tracking-[0.5em]">
                   <UserCheck size={18} className="text-blue-600" /> Studio Identity Profile
                </div>
                <button onClick={() => setSelectedContact(null)} className="p-3 hover:bg-gray-50 rounded-full transition-all">
                   <X size={24} className="text-gray-300" />
                </button>
             </div>

             <header className="space-y-10 mb-16">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden shadow-2xl mb-8 relative group">
                   <img src={selectedContact.avatar_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                   <div className="absolute inset-0 border-[6px] border-white/20 rounded-[2.5rem]"></div>
                </div>
                <div>
                   <h2 className="text-5xl font-serif font-bold italic tracking-tight">{selectedContact.full_name}</h2>
                   <div className="flex gap-2 mt-4">
                      {selectedContact.tags.map(t => (
                        <span key={t} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-sm text-[9px] font-black uppercase text-gray-400 tracking-widest">#{t}</span>
                      ))}
                   </div>
                   <p className="text-2xl text-gray-400 font-light italic leading-relaxed mt-10">"{selectedAnalysis.collectorNotes}"</p>
                </div>
             </header>

             <section className="space-y-16">
                <Grid cols={2} gap={6}>
                   <Box p={8} bg="#F9F9F9" border="1px solid #EEE" borderRadius="2px">
                      <Text variant="label" color="#999" size={9}>Acquisition Confidence</Text>
                      <Text size={32} weight="bold" className="block mt-2 font-mono">{Math.round(selectedAnalysis.acquisitionLikelihood * 100)}%</Text>
                   </Box>
                   <Box p={8} bg="#F9F9F9" border="1px solid #EEE" borderRadius="2px">
                      <Text variant="label" color="#999" size={9}>Portfolio Tier</Text>
                      <Text size={32} weight="bold" className="block mt-2 font-mono">{selectedAnalysis.investmentTier}</Text>
                   </Box>
                </Grid>

                <div className="space-y-8 pt-8 border-t border-gray-50">
                   <Flex align="center" gap={3}>
                      <Package size={18} className="text-blue-500" />
                      <Text variant="label" color="#000">Linked Provenance</Text>
                   </Flex>
                   <div className="space-y-4">
                      {selectedContact.ownedAssets?.map(aid => (
                        <div key={aid} className="flex items-center gap-6 p-6 bg-white border border-gray-100 rounded-2xl group hover:border-black transition-all">
                           <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                              <img src={`https://picsum.photos/seed/${aid}/100`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm truncate">Verified Ownership: #{aid}</p>
                              <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">AUTHENTICATED LEDGER ENTRY</p>
                           </div>
                           <ArrowRight size={16} className="text-gray-200 group-hover:text-black" />
                        </div>
                      ))}
                      {(!selectedContact.ownedAssets || selectedContact.ownedAssets.length === 0) && (
                        <div className="p-8 border-2 border-dashed border-gray-100 text-center rounded-[2rem]">
                           <p className="text-xs text-gray-300 font-bold uppercase tracking-widest italic">Awaiting First Acquisition</p>
                        </div>
                      )}
                   </div>
                </div>

                <div className="bg-black text-white p-12 space-y-10 relative overflow-hidden rounded-[3rem] shadow-2xl">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl"></div>
                   <h4 className="text-xs font-bold uppercase tracking-[0.5em] text-blue-400 flex items-center gap-4">
                      <Zap size={20} className="animate-pulse" /> Studio Action Hub
                   </h4>
                   <p className="text-3xl font-bold italic font-serif leading-tight">{selectedAnalysis.recommendedAction}</p>
                   <div className="flex flex-col gap-4 pt-4">
                      <Button 
                        onClick={() => toast.success('Private Portfolio Drop Initiated')}
                        className="w-full h-20 bg-white text-black font-bold text-xs shadow-xl"
                      >
                         <Mail size={18} className="mr-4" /> Dispatch Exclusive Dossier
                      </Button>
                      <button className="w-full h-20 border border-white/20 text-white font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-3 rounded-xl">
                         <MessageSquare size={18} /> Initialize Secure Message Channel
                      </button>
                   </div>
                </div>
             </section>
          </aside>
        )}
      </div>
    </Box>
  );
};

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
);