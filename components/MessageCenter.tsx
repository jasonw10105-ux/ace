
import React, { useState, useEffect } from 'react';
import { 
  Send, MoreVertical, Paperclip, ArrowLeft, Eye, 
  MessageSquare, Zap, ShieldCheck, DollarSign, 
  Target, Info, ArrowRight, Loader2, Award
} from 'lucide-react';
import { Conversation, Message, Artwork } from '../types';
import { Box, Flex, Text, Button, Separator, Grid } from '../flow';
import { geminiService } from '../services/geminiService';
import toast from 'react-hot-toast';

export const MessageCenter: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedId, setSelectedId] = useState<string | null>('1');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [advisorTip, setAdvisorTip] = useState<string | null>(null);

  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      artwork: { id: 'art-101', title: 'Neo-Tokyo Midnight', imageUrl: 'https://picsum.photos/seed/art2/100', price: 1850 },
      participant: { id: 'c1', name: 'Julian Rossi', avatarUrl: 'https://picsum.photos/seed/julian/100' },
      lastMessage: 'The shipping insurance is calculated based on...',
      timestamp: '14:30',
      unreadCount: 2
    },
    {
      id: '2',
      artwork: { id: 'art-102', title: 'Ethereal Synthesis', imageUrl: 'https://picsum.photos/seed/art1/100', price: 3200 },
      participant: { id: 'c2', name: 'Sasha Vance', avatarUrl: 'https://picsum.photos/seed/sasha/100' },
      lastMessage: 'Yes, this piece is available for private viewing.',
      timestamp: 'Yesterday',
      unreadCount: 0
    }
  ]);

  const activeConv = conversations.find(c => c.id === selectedId);

  // Gemini "Advisor" senses the conversation context
  useEffect(() => {
    if (activeConv) {
      const getTip = async () => {
        // Logic: Advisor suggests negotiation strategy based on collector profile
        setAdvisorTip("Analyzing collector interaction history...");
        const tip = "Julian has a 92% resonance with your series. He's an anchor collector in the NY sector. Recommend holding firm on price but offering complimentary white-glove shipping.";
        setTimeout(() => setAdvisorTip(tip), 1500);
      };
      getTip();
    }
  }, [selectedId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    toast.success('Signal Transmitted');
    setInputText('');
  };

  return (
    <div className="max-w-[1800px] mx-auto px-6 py-32 animate-in fade-in duration-700 h-[calc(100vh-80px)] flex flex-col">
      <header className="flex justify-between items-end mb-12 shrink-0">
        <div>
          <button onClick={onBack} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-black mb-4 flex items-center gap-2 group transition-colors">
             <ArrowLeft size={16} className="group-hover:-translate-x-1" /> Back to Spectrum
          </button>
          <h1 className="text-6xl font-serif font-bold italic tracking-tighter">Negotiations.</h1>
        </div>
        <div className="flex items-center gap-4 bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
           <ShieldCheck size={18} className="text-blue-600" />
           <Text variant="label" size={10} color="#1023D7">Secured Handshake Active</Text>
        </div>
      </header>

      <div className="flex-1 bg-white border border-gray-100 rounded-[3.5rem] overflow-hidden shadow-2xl flex min-h-0">
        {/* Sidebar: Channel Index */}
        <aside className="w-80 border-r border-gray-50 flex flex-col bg-gray-50/30">
           <div className="p-8 border-b border-gray-50 bg-white">
              <input type="text" placeholder="Filter Channels..." className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-black transition-all" />
           </div>
           <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {conversations.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full p-8 text-left transition-all flex gap-4 relative group ${selectedId === c.id ? 'bg-white shadow-inner' : 'hover:bg-white/50'}`}
                >
                  {selectedId === c.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black"></div>}
                  <img src={c.artwork.imageUrl} className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-sm grayscale group-hover:grayscale-0 transition-all" alt="Art" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-sm truncate">{c.participant.name}</h4>
                      <span className="text-[9px] font-mono text-gray-400">{c.timestamp}</span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-500 mb-1">{c.artwork.title}</p>
                    <p className="text-xs text-gray-400 truncate font-light italic">"{c.lastMessage}"</p>
                  </div>
                </button>
              ))}
           </div>
        </aside>

        {/* Chat Pane */}
        {activeConv ? (
          <div className="flex-1 flex flex-col min-w-0 bg-white">
             <header className="p-8 border-b border-gray-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <Flex align="center" gap={6}>
                   <div className="flex -space-x-4">
                      <img src={activeConv.participant.avatarUrl} className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-lg" />
                      <img src={activeConv.artwork.imageUrl} className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-lg" />
                   </div>
                   <div>
                      <h3 className="font-bold text-xl leading-none mb-1">{activeConv.participant.name}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <Target size={10} className="text-blue-500" /> High Intent Discovery
                      </p>
                   </div>
                </Flex>
                <Flex gap={2}>
                   <button className="p-3 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-black"><Eye size={20} /></button>
                   <button className="p-3 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-black"><MoreVertical size={20} /></button>
                </Flex>
             </header>

             <div className="flex-1 overflow-y-auto p-12 space-y-12 bg-white custom-scrollbar">
                <div className="flex flex-col items-center gap-4">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-200">Encryption Handshake: Established</span>
                   <div className="h-px w-20 bg-gray-100"></div>
                </div>
                
                <div className="flex flex-col items-start space-y-3 max-w-[70%]">
                   <div className="bg-gray-50 p-8 rounded-[2rem] rounded-tl-none text-lg leading-relaxed text-gray-700 font-light border border-gray-100">
                     Hello! I'm interested in the logistics for "Neo-Tokyo Midnight". Does the studio handle white-glove international shipping to London?
                   </div>
                   <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-4">12:40 PM • Collector</span>
                </div>

                <div className="flex flex-col items-end space-y-3 max-w-[70%] ml-auto">
                   <div className="bg-black text-white p-8 rounded-[2.5rem] rounded-tr-none text-lg leading-relaxed shadow-2xl shadow-black/10 font-medium">
                     Absolutely. We operate a secure shipping lane to the UK. The insurance layer is dynamic based on the final acquisition valuation.
                   </div>
                   <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mr-4">2:30 PM • Studio Agent</span>
                </div>

                <div className="flex flex-col items-start space-y-3 max-w-[70%]">
                   <div className="bg-blue-50 p-8 rounded-[2rem] rounded-tl-none text-lg leading-relaxed text-blue-900 font-bold border border-blue-100">
                     <Flex align="center" gap={3} mb={4}>
                        <DollarSign size={20} />
                        <span className="uppercase tracking-[0.2em] text-[10px]">Official Offer Made</span>
                     </Flex>
                     I would like to offer $1,650 for this piece, factoring in the overseas logistics.
                   </div>
                   <div className="flex gap-4">
                      <button className="px-6 py-2 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest">Accept</button>
                      <button className="px-6 py-2 border border-gray-200 rounded-full text-[10px] font-black uppercase tracking-widest">Counter</button>
                   </div>
                </div>
             </div>

             <div className="p-8 border-t border-gray-50 bg-white">
                <form className="relative flex items-center gap-4" onSubmit={handleSend}>
                   <button type="button" className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-black hover:bg-gray-100 transition-all"><Paperclip size={20}/></button>
                   <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Describe the next step..." 
                    className="flex-1 px-8 py-5 bg-gray-50 border-none rounded-[2rem] outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all text-lg font-light italic" 
                   />
                   <button type="submit" className="p-5 bg-black text-white rounded-full hover:scale-110 transition-all shadow-xl shadow-black/20"><Send size={24}/></button>
                </form>
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
             <MessageSquare size={64} className="text-gray-100" />
             <h3 className="text-3xl font-serif font-bold italic text-gray-200">Select a Signal.</h3>
          </div>
        )}

        {/* Sidebar: Offer Context & AI Advisor */}
        {activeConv && (
          <aside className="w-96 border-l border-gray-50 bg-gray-50/30 p-10 overflow-y-auto hidden xl:flex flex-col gap-10">
             <section className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Target Asset</h4>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group cursor-pointer hover:border-black transition-all">
                   <img src={activeConv.artwork.imageUrl} className="w-full aspect-square rounded-2xl object-cover mb-6 grayscale group-hover:grayscale-0 transition-all" />
                   <Text weight="bold" size={16} className="block mb-1">{activeConv.artwork.title}</Text>
                   <Flex justify="between" align="center">
                      <span className="text-lg font-mono font-bold">${activeConv.artwork.price.toLocaleString()}</span>
                      <span className="text-[9px] font-black uppercase text-blue-500 tracking-tighter">Listed</span>
                   </Flex>
                </div>
             </section>

             <section className="space-y-6">
                <div className="flex items-center gap-3 text-blue-600 font-bold text-[10px] uppercase tracking-[0.4em]">
                   <Zap size={14} className="animate-pulse" /> Advisor Intel
                </div>
                <div className="bg-black text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl"></div>
                   {advisorTip ? (
                     <p className="text-sm font-serif italic text-gray-200 leading-relaxed relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        "{advisorTip}"
                     </p>
                   ) : (
                     <Flex direction="column" align="center" gap={3} py={4}>
                        <Loader2 size={24} className="animate-spin text-blue-400" />
                        <Text size={10} color="#444">Calibrating Strategy...</Text>
                     </Flex>
                   )}
                </div>
             </section>

             <section className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Discovery DNA</h4>
                <div className="space-y-4">
                   {[
                     { label: 'Aesthetic Resonance', val: 92, color: 'bg-blue-600' },
                     { label: 'Acquisition Intent', val: 78, color: 'bg-green-500' },
                     { label: 'Market Velocity', val: 45, color: 'bg-gray-200' }
                   ].map(stat => (
                     <div key={stat.label} className="space-y-2">
                        <Flex justify="between" align="end">
                           <span className="text-[9px] font-bold uppercase text-gray-400">{stat.label}</span>
                           <span className="text-[10px] font-mono font-bold">{stat.val}%</span>
                        </Flex>
                        <div className="h-[2px] bg-gray-100 w-full overflow-hidden rounded-full">
                           <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.val}%` }}></div>
                        </div>
                     </div>
                   ))}
                </div>
             </section>

             <div className="mt-auto pt-10 border-t border-gray-100">
                <button className="w-full py-4 bg-white border border-black rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
                   <Award size={14} /> Finalize Acquisition
                </button>
             </div>
          </aside>
        )}
      </div>
    </div>
  );
};
