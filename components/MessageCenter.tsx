
import React, { useState } from 'react';
// Added MessageSquare to imports
import { Send, MoreVertical, Paperclip, ArrowLeft, Eye, MessageSquare } from 'lucide-react';
import { Conversation, Message } from '../types';

export const MessageCenter: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      artwork: { id: '2', title: 'Neo-Tokyo Midnight', imageUrl: 'https://picsum.photos/seed/art2/100', price: 1850 },
      participant: { id: 'a1', name: 'Kenji Sato', avatarUrl: 'https://picsum.photos/seed/kenji/100' },
      lastMessage: 'The shipping insurance is calculated based on...',
      timestamp: '14:30',
      unreadCount: 2
    },
    {
      id: '2',
      artwork: { id: '1', title: 'Ethereal Synthesis', imageUrl: 'https://picsum.photos/seed/art1/100', price: 3200 },
      participant: { id: 'a2', name: 'Elena Vance', avatarUrl: 'https://picsum.photos/seed/elena/100' },
      lastMessage: 'Yes, this piece is available for private viewing.',
      timestamp: 'Yesterday',
      unreadCount: 0
    }
  ]);

  const [selectedId, setSelectedId] = useState<string | null>('1');
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find(c => c.id === selectedId);

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-end mb-12 shrink-0">
        <div>
          <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-4 flex items-center gap-2 group transition-colors">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back Hub
          </button>
          <h1 className="text-5xl font-serif font-bold italic">Negotiations.</h1>
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm flex min-h-0">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-50 flex flex-col">
           <div className="p-8 border-b border-gray-50">
              <input type="text" placeholder="Search Channels..." className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:bg-gray-100 transition-all" />
           </div>
           <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {conversations.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full p-8 text-left transition-all flex gap-4 ${selectedId === c.id ? 'bg-blue-50/50' : 'hover:bg-gray-50/30'}`}
                >
                  <img src={c.artwork.imageUrl} className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm" alt="Art" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-sm truncate">{c.participant.name}</h4>
                      <span className="text-[10px] font-mono text-gray-400">{c.timestamp}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{c.artwork.title}</p>
                    <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
                  </div>
                  {c.unreadCount > 0 && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>}
                </button>
              ))}
           </div>
        </div>

        {/* Chat Pane */}
        {activeConv ? (
          <div className="flex-1 flex flex-col min-w-0">
             <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <div className="flex items-center gap-6">
                   <div className="flex -space-x-4">
                      <img src={activeConv.participant.avatarUrl} className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                      <img src={activeConv.artwork.imageUrl} className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                   </div>
                   <div>
                      <h3 className="font-bold text-lg leading-none mb-1">{activeConv.participant.name}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{activeConv.artwork.title} • ${activeConv.artwork.price.toLocaleString()}</p>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button className="p-3 hover:bg-white rounded-full transition-colors"><Eye size={20} /></button>
                   <button className="p-3 hover:bg-white rounded-full transition-colors"><MoreVertical size={20} /></button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-12 space-y-10">
                <div className="flex justify-center">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 bg-gray-50 px-3 py-1 rounded-full">Conversation Initiated Yesterday</span>
                </div>
                
                <div className="flex flex-col items-start space-y-2 max-w-[80%]">
                   <div className="bg-gray-100 p-6 rounded-3xl rounded-tl-none text-sm leading-relaxed text-gray-700">
                     Hello! I'm interested in the logistics for "Neo-Tokyo Midnight". Does the gallery handle international shipping to London?
                   </div>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">12:40 PM</span>
                </div>

                <div className="flex flex-col items-end space-y-2 max-w-[80%] ml-auto">
                   <div className="bg-black text-white p-6 rounded-3xl rounded-tr-none text-sm leading-relaxed shadow-xl shadow-black/10">
                     Absolutely. We offer white-glove service to the UK. The shipping insurance is calculated based on the finalized acquisition price. Are you looking to have it framed as well?
                   </div>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">2:30 PM • Read</span>
                </div>
             </div>

             <div className="p-8 border-t border-gray-50">
                <form className="relative flex items-center gap-4" onSubmit={(e) => e.preventDefault()}>
                   <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-black transition-colors"><Paperclip size={20}/></button>
                   <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="MessageKenji Sato..." 
                    className="flex-1 px-8 py-4 bg-gray-50 rounded-[2rem] outline-none border-2 border-transparent focus:border-black/10 focus:bg-white transition-all" 
                   />
                   <button className="p-4 bg-black text-white rounded-full hover:scale-110 transition-all shadow-xl shadow-black/10"><Send size={20}/></button>
                </form>
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
             <MessageSquare size={64} className="text-gray-100" />
             <h3 className="text-3xl font-serif font-bold italic text-gray-300">Select a negotiation loop.</h3>
          </div>
        )}
      </div>
    </div>
  );
};
