
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Tag, 
  Send, 
  Filter, 
  Search, 
  MoreVertical, 
  Mail, 
  Zap, 
  TrendingUp, 
  Activity, 
  Download, 
  Plus, 
  ChevronRight, 
  BookOpen, 
  Target,
  Brain,
  CheckSquare,
  Square,
  Clock,
  ArrowRight,
  ShieldCheck,
  Layout
} from 'lucide-react';
import { purchaseIntentScoringService } from '../services/purchaseIntentScoring';
import { Contact, ContactTag, Campaign } from '../types';
import toast from 'react-hot-toast';

interface ArtistCRMProps {
  onBack: () => void;
}

export const ArtistCRM: React.FC<ArtistCRMProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'audience' | 'tags' | 'campaigns'>('audience');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock Audience Data
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 'c1', name: 'Julian Rossi', email: 'julian@frontier.art', avatarUrl: 'https://picsum.photos/seed/j1/100', lastActive: '2h ago', tags: ['High Spender', 'VIP'], location: 'Toronto, CA', totalInquiries: 14, totalPurchases: 2, favoriteMedium: 'Oil on Linen' },
    { id: 'c2', name: 'Sasha Vance', email: 'sasha@vancegallery.co', avatarUrl: 'https://picsum.photos/seed/s2/100', lastActive: '12h ago', tags: ['Abstract Enthusiast', 'New Lead'], location: 'Berlin, DE', totalInquiries: 4, totalPurchases: 0, favoriteMedium: 'Digital Synthesis' },
    { id: 'c3', name: 'Marcus Thorne', email: 'm.thorne@londonart.net', avatarUrl: 'https://picsum.photos/seed/m3/100', lastActive: '2d ago', tags: ['VIP', 'Minimalist'], location: 'London, UK', totalInquiries: 22, totalPurchases: 5, favoriteMedium: 'Brutalist Sculpture' },
    { id: 'c4', name: 'Elena Novak', email: 'elena@novak.art', avatarUrl: 'https://picsum.photos/seed/e4/100', lastActive: '45m ago', tags: ['Collector Tier 1'], location: 'NYC, US', totalInquiries: 8, totalPurchases: 1, favoriteMedium: 'Acrylic' },
  ]);

  const [campaigns] = useState<Campaign[]>([
    { id: 'camp1', title: 'The Vernal Drop', type: 'catalogue_drop', status: 'sent', targetTags: ['VIP'], sentAt: '2024-05-10', openRate: 84, clickRate: 42, conversionRate: 8 },
    { id: 'camp2', title: 'Studio Update #12', type: 'newsletter', status: 'draft', targetTags: ['All'], openRate: 0, clickRate: 0, conversionRate: 0 },
  ]);

  useEffect(() => {
    const enrichAudience = async () => {
      const enriched = await Promise.all(contacts.map(async c => {
        const intent = await purchaseIntentScoringService.calculateIntent(c.id, 'any');
        return { ...c, intentScore: intent.score, intentLabel: intent.label };
      }));
      setContacts(enriched);
      setIsLoading(false);
    };
    enrichAudience();
  }, []);

  const toggleSelectAll = () => {
    if (selectedContacts.length === contacts.length) setSelectedContacts([]);
    else setSelectedContacts(contacts.map(c => c.id));
  };

  const toggleSelect = (id: string) => {
    setSelectedContacts(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const bulkAction = (action: string) => {
    if (selectedContacts.length === 0) {
      toast.error('Identify target collectors for this operation.');
      return;
    }
    toast.success(`Broadcasting ${action} to ${selectedContacts.length} neural nodes.`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-20">
      <div className="max-w-[1600px] mx-auto flex h-[calc(100vh-80px)] overflow-hidden">
        
        {/* Sidebar Nav */}
        <aside className="w-80 bg-white border-r border-gray-100 p-8 shrink-0 flex flex-col justify-between">
           <div className="space-y-10">
              <div>
                 <button onClick={onBack} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black mb-10 flex items-center gap-2 group transition-all">
                    <ChevronRight className="rotate-180 group-hover:-translate-x-1" size={14} /> Back to Studio
                 </button>
                 <h1 className="text-4xl font-serif font-bold italic tracking-tight">Neural CRM.</h1>
                 <p className="text-xs text-gray-400 mt-2 font-light">Managing the collective audience spectrum.</p>
              </div>

              <nav className="space-y-1">
                 {[
                   { id: 'audience', label: 'Entire Collective', icon: Users, count: contacts.length },
                   { id: 'tags', label: 'Vector Groups', icon: Tag, count: 8 },
                   { id: 'campaigns', label: 'Signal Broadcasts', icon: Send, count: campaigns.length }
                 ].map(item => (
                   <button 
                    key={item.id} 
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === item.id ? 'bg-black text-white shadow-xl' : 'text-gray-500 hover:bg-gray-50'}`}
                   >
                      <div className="flex items-center gap-4">
                         <item.icon size={18} className={activeTab === item.id ? 'text-blue-400' : 'text-gray-300 group-hover:text-black'} />
                         <span className="text-sm font-bold">{item.label}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${activeTab === item.id ? 'bg-white/10' : 'bg-gray-100'}`}>{item.count}</span>
                   </button>
                 ))}
              </nav>

              <div className="space-y-4 pt-10 border-t border-gray-50">
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">Target Segments</h4>
                 <div className="space-y-2">
                    {['High-Velocity VIPs', 'Abstract Collectors', 'Digital First'].map(tag => (
                      <button key={tag} className="w-full flex items-center justify-between text-xs text-gray-400 hover:text-black py-2 transition-colors">
                         <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                            <span>{tag}</span>
                         </div>
                         <ChevronRight size={12} />
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 relative overflow-hidden">
              <div className="relative z-10">
                 <h5 className="text-blue-900 font-bold text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Brain size={12} /> Optimization
                 </h5>
                 <p className="text-[11px] text-blue-800/70 leading-relaxed font-light">
                   Neural signals peak at <span className="font-bold">11:00 PM EST</span> for your VIP segment. 
                 </p>
                 <button className="mt-4 text-[10px] font-bold uppercase tracking-widest text-blue-600 border-b border-blue-200">View Velocity Report</button>
              </div>
           </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Top Bar Actions */}
          <header className="h-28 border-b border-gray-100 px-10 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-50">
             <div className="flex items-center gap-6 flex-1 max-w-2xl">
                <div className="relative flex-1">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                   <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Identify collector by name, vector, or signal..." 
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-black/5 transition-all outline-none" 
                   />
                </div>
                <button className="flex items-center gap-2 px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-400 transition-all font-bold text-xs uppercase tracking-widest border border-gray-100">
                   <Filter size={14} /> Refine
                </button>
             </div>

             <div className="flex items-center gap-4">
                {selectedContacts.length > 0 && (
                  <div className="flex items-center gap-2 animate-in slide-in-from-right duration-300 mr-4 pr-4 border-r border-gray-100">
                     <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{selectedContacts.length} Selected</span>
                     <div className="flex gap-2">
                        <button onClick={() => bulkAction('tag')} className="p-2.5 bg-gray-50 hover:bg-black hover:text-white rounded-xl transition-all" title="Add Vector Tag"><Tag size={16}/></button>
                        <button onClick={() => bulkAction('catalogue')} className="p-2.5 bg-gray-50 hover:bg-black hover:text-white rounded-xl transition-all" title="Drop Private Catalogue"><BookOpen size={16}/></button>
                        <button onClick={() => bulkAction('message')} className="p-2.5 bg-black text-white rounded-xl transition-all px-4 flex items-center gap-2 shadow-lg shadow-black/10"><Send size={14}/> <span className="text-[10px] font-bold uppercase tracking-widest">Broadcast</span></button>
                     </div>
                  </div>
                )}
                <button className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-black/10">
                   <Plus size={18} /> Sync New Identity
                </button>
             </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'audience' && (
              <div className="p-10">
                 {isLoading ? (
                   <div className="py-40 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-t-black border-black/10 rounded-full animate-spin mb-6"></div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Calibrating Intent Weights...</p>
                   </div>
                 ) : (
                   <table className="w-full text-left border-separate border-spacing-y-4 -mt-4">
                      <thead>
                         <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                            <th className="px-6 py-4 w-12">
                               <button onClick={toggleSelectAll} className="hover:text-black transition-colors">
                                  {selectedContacts.length === contacts.length ? <CheckSquare size={18} className="text-black" /> : <Square size={18} />}
                               </button>
                            </th>
                            <th className="px-6 py-4">Collector Identity</th>
                            <th className="px-6 py-4">Neural Intent</th>
                            <th className="px-6 py-4">Vector Tags</th>
                            <th className="px-6 py-4">Last Active</th>
                            <th className="px-6 py-4 text-right">Acquisitions</th>
                            <th className="px-6 py-4 w-12"></th>
                         </tr>
                      </thead>
                      <tbody>
                         {filteredContacts.map((contact) => (
                           <tr key={contact.id} className="group hover:bg-white hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden cursor-pointer bg-white">
                              <td className="px-6 py-8 first:rounded-l-3xl border-y border-transparent">
                                 <button onClick={(e) => { e.stopPropagation(); toggleSelect(contact.id); }} className="hover:text-blue-500 transition-colors">
                                    {selectedContacts.includes(contact.id) ? <CheckSquare size={18} className="text-blue-500" /> : <Square size={18} className="text-gray-100 group-hover:text-gray-300" />}
                                 </button>
                              </td>
                              <td className="px-6 py-8 border-y border-transparent">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xl relative">
                                       <img src={contact.avatarUrl} className="w-full h-full object-cover" />
                                       <div className="absolute inset-0 ring-1 ring-black/5 rounded-full"></div>
                                    </div>
                                    <div>
                                       <p className="font-bold text-sm leading-tight mb-1">{contact.name}</p>
                                       <p className="text-[10px] text-gray-400 font-light truncate max-w-[150px]">{contact.email}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-8 border-y border-transparent">
                                 <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                       <div className="flex-1 h-1.5 bg-gray-50 rounded-full overflow-hidden w-24">
                                          <div className={`h-full transition-all duration-1000 ${
                                             (contact.intentScore || 0) > 80 ? 'bg-red-500' : (contact.intentScore || 0) > 50 ? 'bg-blue-500' : 'bg-gray-200'
                                          }`} style={{ width: `${contact.intentScore}%` }}></div>
                                       </div>
                                       <span className="text-[10px] font-mono font-bold text-gray-400">{contact.intentScore}%</span>
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] self-start px-2 py-0.5 rounded ${
                                       contact.intentLabel === 'Critical' ? 'bg-red-50 text-red-500' : contact.intentLabel === 'High' ? 'bg-blue-50 text-blue-500' : 'bg-gray-50 text-gray-400'
                                    }`}>{contact.intentLabel} Intent</span>
                                 </div>
                              </td>
                              <td className="px-6 py-8 border-y border-transparent">
                                 <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                    {contact.tags.map(tag => (
                                      <span key={tag} className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-bold uppercase tracking-widest text-gray-400">{tag}</span>
                                    ))}
                                    <button className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 hover:text-black transition-colors"><Plus size={10}/></button>
                                 </div>
                              </td>
                              <td className="px-6 py-8 border-y border-transparent">
                                 <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Clock size={12} /> {contact.lastActive}
                                 </div>
                              </td>
                              <td className="px-6 py-8 text-right border-y border-transparent last:rounded-r-3xl">
                                 <p className="font-mono font-bold text-sm">{contact.totalPurchases}</p>
                                 <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300">{contact.totalInquiries} Inquiries</p>
                              </td>
                              <td className="px-6 py-8 text-right">
                                 <button className="p-3 hover:bg-gray-50 rounded-xl transition-all text-gray-200 hover:text-black"><MoreVertical size={16}/></button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                 )}
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div className="p-10 space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { label: 'Total Signal Reach', value: '4.2k', delta: '+12%', icon: TrendingUp },
                      { label: 'Avg Open Velocity', value: '72%', delta: '+4%', icon: Activity },
                      { label: 'Conversion Lift', value: '3.4%', delta: '+0.8%', icon: Zap }
                    ].map(stat => (
                      <div key={stat.label} className="p-10 bg-white border border-gray-100 rounded-[3rem] shadow-sm group hover:border-black transition-all">
                         <div className="flex justify-between items-start mb-6">
                            <stat.icon className="text-gray-300 group-hover:text-black transition-colors" />
                            <span className="text-[10px] font-bold px-3 py-1 bg-green-50 text-green-600 rounded-full">{stat.delta}</span>
                         </div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                         <p className="text-4xl font-serif font-bold italic">{stat.value}</p>
                      </div>
                    ))}
                 </div>

                 <div className="bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm">
                    <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                       <h3 className="text-xl font-serif font-bold italic">Broadcast History</h3>
                       <button className="px-6 py-3 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-black/10">Initiate New Drop</button>
                    </div>
                    <div className="divide-y divide-gray-50">
                       {campaigns.map(camp => (
                         <div key={camp.id} className="p-10 flex items-center justify-between hover:bg-gray-50/50 transition-all group">
                            <div className="flex items-center gap-8 flex-1">
                               <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-lg ${
                                 camp.type === 'catalogue_drop' ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-purple-500 text-white shadow-purple-500/20'
                               }`}>
                                  {camp.type === 'catalogue_drop' ? <BookOpen size={24}/> : <Mail size={24}/>}
                               </div>
                               <div className="space-y-1">
                                  <h4 className="text-2xl font-serif font-bold italic leading-none mb-2">{camp.title}</h4>
                                  <div className="flex items-center gap-4">
                                     <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{camp.type.replace('_', ' ')}</span>
                                     <div className="flex items-center gap-1.5">
                                        {camp.targetTags.map(t => (
                                          <span key={t} className="px-2 py-0.5 bg-gray-100 rounded-full text-[9px] font-bold uppercase tracking-widest text-gray-400">{t}</span>
                                        ))}
                                     </div>
                                  </div>
                               </div>
                            </div>
                            
                            <div className="flex gap-12 text-center">
                               <div>
                                  <p className="text-lg font-serif font-bold italic">{camp.openRate}%</p>
                                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Opened</p>
                               </div>
                               <div>
                                  <p className="text-lg font-serif font-bold italic">{camp.clickRate}%</p>
                                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Clicked</p>
                               </div>
                               <div>
                                  <p className="text-lg font-serif font-bold italic">{camp.conversionRate}%</p>
                                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Converted</p>
                               </div>
                            </div>

                            <button className="ml-12 p-4 bg-gray-50 text-gray-300 rounded-2xl group-hover:bg-black group-hover:text-white transition-all">
                               <ArrowRight size={20}/>
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
