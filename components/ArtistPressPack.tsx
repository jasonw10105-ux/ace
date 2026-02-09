import React, { useState } from 'react';
import { 
  FileText, Download, Sparkles, Brain, Loader2, ArrowLeft, 
  Zap, Globe, MessageSquare, ChevronRight, Eye, Settings2,
  Building2, Gem, Palette, Target, Mail, Printer, Share,
  Search, ShieldCheck, History
} from 'lucide-react';
import { geminiService, GalleryPersona } from '../services/geminiService';
import { Artwork } from '../types';
import { Box, Flex, Text, Button } from '../flow';
import toast from 'react-hot-toast';

interface PressPackProps {
  artworks: Artwork[];
  onBack: () => void;
}

export const ArtistPressPack: React.FC<PressPackProps> = ({ artworks, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [persona, setPersona] = useState<GalleryPersona>('blue_chip');
  const [packContent, setPackContent] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const generatePack = async () => {
    if (artworks.length === 0) {
      toast.error("Registry nodes required for synthesis.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await geminiService.generatePressPack(artworks, persona);
      setPackContent(response);
      toast.success(`Identity Synthesized for ${persona.replace('_', ' ')} sector.`);
    } catch (e) {
      toast.error("Neural Synthesis Interrupt.");
    } finally {
      setIsGenerating(false);
    }
  };

  const personas = [
    { id: 'blue_chip', label: 'Institutional / Blue-Chip', icon: <Gem size={18} />, desc: 'Rigorous, academic, historical context. Best for major global galleries.' },
    { id: 'emerging', label: 'Contemporary Emerging', icon: <Zap size={18} />, desc: 'Narrative-driven, high energy, cultural focus. Best for project spaces.' },
    { id: 'boutique', label: 'Interior / Boutique', icon: <Palette size={18} />, desc: 'Harmonious, atmospheric, lifestyle-focused. Best for design sectors.' },
    { id: 'corporate', label: 'Enterprise / Corporate', icon: <Building2 size={18} />, desc: 'Stable, professional, investment-aligned. Best for private collections.' }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-32 animate-in fade-in duration-700">
      <header className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="max-w-3xl">
          <button onClick={onBack} className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-black mb-10 flex items-center gap-2 group transition-all">
            <ArrowLeft size={14} className="group-hover:-translate-x-1" /> Return to Studio
          </button>
          <div className="flex items-center gap-6 mb-6">
             <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl border border-blue-100 shadow-inner">
                <Brain size={32} />
             </div>
             <div>
               <h1 className="text-8xl font-serif font-bold italic tracking-tighter leading-none">Agent <span className="text-blue-600">V.2</span>.</h1>
             </div>
          </div>
          <p className="text-gray-400 text-2xl font-light leading-relaxed">
            Synthesize your visual ledger into a museum-grade <span className="text-black font-medium">dossier</span>. Tailored narratives for specific market archetypes.
          </p>
        </div>
        {packContent && (
           <div className="flex gap-4">
              <button 
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-10 py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 ${previewMode ? 'bg-black text-white shadow-2xl scale-105' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}
              >
                {previewMode ? <Eye size={16} /> : <Eye size={16} className="opacity-40" />}
                {previewMode ? 'Exit Dossier' : 'Preview PDF'}
              </button>
              <button className="px-12 py-5 bg-black text-white rounded-[1.5rem] font-bold text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 transition-all">
                 <Download size={18} /> Export PDF
              </button>
           </div>
        )}
      </header>

      {!packContent ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
           <div className="lg:col-span-8 space-y-16">
              <section className="space-y-10">
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 flex items-center gap-3">
                   <Target size={14} className="text-blue-500" /> 01. Select Submission Persona
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {personas.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPersona(p.id as any)}
                        className={`p-10 rounded-[3rem] border-2 text-left transition-all group relative overflow-hidden ${
                          persona === p.id 
                            ? 'bg-white border-black shadow-2xl scale-[1.02]' 
                            : 'bg-gray-50 border-transparent text-gray-400 hover:border-gray-200'
                        }`}
                      >
                         <div className={`p-5 rounded-2xl mb-8 transition-colors inline-block ${persona === p.id ? 'bg-black text-white' : 'bg-white text-gray-300 group-hover:text-black shadow-sm'}`}>
                            {p.icon}
                         </div>
                         <p className={`font-bold text-2xl mb-2 ${persona === p.id ? 'text-black' : ''}`}>{p.label}</p>
                         <p className="text-sm font-light leading-relaxed max-w-[240px]">{p.desc}</p>
                         {persona === p.id && (
                            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>
                         )}
                      </button>
                    ))}
                 </div>
              </section>

              <section className="space-y-10">
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 flex items-center gap-3">
                   <FileText size={14} className="text-blue-500" /> 02. Verify Portfolio Nodes
                 </h3>
                 <div className="bg-gray-50 p-12 rounded-[3.5rem] border border-gray-100 flex items-center justify-between group hover:border-black transition-all">
                    <div className="flex items-center gap-8">
                       <div className="flex -space-x-8">
                          {artworks.slice(0, 4).map(a => (
                            <div key={a.id} className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-xl grayscale group-hover:grayscale-0 transition-all duration-700">
                               <img src={a.imageUrl} className="w-full h-full object-cover" />
                            </div>
                          ))}
                       </div>
                       <div>
                          <p className="font-bold text-xl">Active Series Context</p>
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{artworks.length} Elements Linked</p>
                       </div>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 border-b-2 border-blue-50 hover:border-blue-500 transition-all">Edit Registry</button>
                 </div>
              </section>
           </div>

           <aside className="lg:col-span-4">
              <div className="sticky top-32 bg-gray-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                 <h3 className="text-3xl font-serif font-bold italic mb-8">Execute <br/>Identity Synthesis.</h3>
                 <p className="text-sm text-gray-400 leading-relaxed font-light mb-12 italic">
                   "Our agent logic will adjust your technical narrative, ensuring your conceptual friction aligns with the {persona.replace('_', ' ')} market's specific frequency."
                 </p>
                 <button 
                  onClick={generatePack}
                  disabled={isGenerating || artworks.length === 0}
                  className="w-full py-8 bg-white text-black rounded-[2.5rem] font-bold text-[10px] uppercase tracking-[0.3em] hover:scale-[1.02] transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-5 disabled:opacity-30"
                 >
                   {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                   Initialize Logic
                 </button>
              </div>
           </aside>
        </div>
      ) : (
        <div className={`animate-in slide-in-from-bottom-12 duration-1000 ${previewMode ? 'bg-gray-100 p-10 lg:p-24 rounded-[5rem] shadow-inner min-h-screen' : ''}`}>
           {previewMode ? (
              <div className="max-w-[1000px] mx-auto bg-white shadow-2xl p-16 lg:p-24 rounded-sm min-h-[1200px] flex flex-col font-serif border border-gray-100 overflow-hidden relative">
                 <div className="absolute top-0 left-0 w-full h-3 bg-black"></div>
                 
                 <header className="border-b-[12px] border-black pb-16 mb-20">
                    <Flex justify="between" align="start" mb={12}>
                       <p className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-400 font-sans">SYNTHESIS / ARCHETYPE: {persona.toUpperCase()}</p>
                       <p className="text-[10px] font-mono text-gray-300 uppercase">REF: SYNC_{new Date().getTime()}</p>
                    </Flex>
                    
                    <h2 className="text-[120px] font-bold tracking-tighter leading-[0.8] mb-16 break-words">{packContent.headline}</h2>
                    
                    <Flex justify="between" align="end">
                       <div className="space-y-2">
                          <p className="text-sm font-black uppercase tracking-[0.2em] font-sans">Artist Portfolio Dossier</p>
                          <p className="text-3xl italic">Contemporary Series Ledger</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black uppercase font-sans text-gray-400 mb-1">Narrative DNA</p>
                          <p className="text-2xl font-bold uppercase tracking-tighter text-blue-600">{packContent.narrative_dna}</p>
                       </div>
                    </Flex>
                 </header>

                 <main className="space-y-24 flex-1">
                    <section className="grid grid-cols-12 gap-16">
                       <div className="col-span-4 space-y-12">
                          <div className="border-t-4 border-black pt-6">
                             <h4 className="text-[11px] font-black uppercase tracking-[0.2em] font-sans mb-8">Curatorial Focus</h4>
                             <div className="space-y-4">
                                {packContent.tags?.map((k: string) => (
                                  <p key={k} className="text-2xl italic text-gray-400 leading-none">#{k}</p>
                                ))}
                             </div>
                          </div>
                          
                          <div className="pt-10">
                             <p className="text-[10px] font-black uppercase font-sans text-gray-300 mb-3">Asset Count</p>
                             <p className="text-5xl font-bold font-sans tracking-tighter">{artworks.length}</p>
                          </div>
                       </div>
                       
                       <div className="col-span-8">
                          <p className="text-[42px] leading-[1.2] text-gray-900 italic font-light first-letter:text-[140px] first-letter:font-bold first-letter:mr-6 first-letter:float-left first-letter:leading-[0.7] first-letter:text-black">
                             {packContent.statement}
                          </p>
                       </div>
                    </section>

                    <section className="grid grid-cols-3 gap-8 pt-20 border-t border-gray-100">
                       {artworks.slice(0, 3).map(art => (
                         <div key={art.id} className="space-y-6 group cursor-pointer">
                            <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative border border-gray-100">
                               <img src={art.imageUrl} className="w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000" />
                            </div>
                            <div className="space-y-1">
                               <p className="text-[11px] font-black font-sans uppercase tracking-[0.2em]">{art.title}</p>
                               <p className="text-[10px] font-sans text-gray-400 uppercase">{art.primary_medium} • {art.year}</p>
                            </div>
                         </div>
                       ))}
                    </section>
                 </main>

                 <footer className="mt-32 pt-16 border-t-[6px] border-gray-100 flex justify-between items-center text-gray-300 font-sans">
                    <div className="flex gap-8">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em]">ArtFlow Neural Sync</p>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em]">Identity Protocol 8.4</p>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">© {new Date().getFullYear()} STUDIO REGISTRY</p>
                 </footer>
              </div>
           ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                 <div className="lg:col-span-8 space-y-12">
                    <section className="bg-white border border-gray-100 p-16 rounded-[4rem] shadow-sm space-y-10 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[5rem] flex items-center justify-center">
                          <Zap size={24} className="text-blue-500" />
                       </div>
                       <Flex justify="between" align="center">
                          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-500">Synthesized Identity Statement</span>
                          <button onClick={() => setPackContent(null)} className="text-[10px] font-black text-gray-300 uppercase hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500">Restart Agent</button>
                       </Flex>
                       <h2 className="text-6xl font-serif font-bold italic leading-tight tracking-tight">{packContent.headline}</h2>
                       <div className="h-[2px] bg-gray-50 w-full"></div>
                       <p className="text-3xl font-serif italic text-gray-700 leading-relaxed font-light">"{packContent.statement}"</p>
                    </section>

                    <section className="bg-gray-900 text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                       <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                       <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-400 mb-8 flex items-center gap-3">
                          <Brain size={18} /> Strategic Positioning Advice
                       </h4>
                       <p className="text-2xl text-gray-300 leading-relaxed font-light italic">
                         "{packContent.positioning}"
                       </p>
                    </section>
                 </div>
                 
                 <aside className="lg:col-span-4 space-y-8">
                    <div className="bg-white border border-gray-100 p-12 rounded-[3.5rem] shadow-sm">
                       <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-10 flex items-center gap-3">
                          <Globe size={18} className="text-blue-500" /> Signal Dispatch
                       </h4>
                       <div className="space-y-4">
                          <button className="w-full py-6 bg-black text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-black/20">
                             <Mail size={18} /> Direct Portfolio Drop
                          </button>
                          <button className="w-full py-6 bg-gray-50 text-gray-400 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-all border border-transparent hover:border-black">
                             <Share size={18} /> Public Registry Link
                          </button>
                       </div>
                    </div>

                    <div className="p-10 bg-blue-50 border border-blue-100 rounded-[3rem] space-y-6">
                       <Flex align="center" gap={3}>
                          <ShieldCheck size={20} className="text-blue-600" />
                          <p className="text-xs font-black uppercase tracking-widest text-blue-800">Verification Active</p>
                       </Flex>
                       <p className="text-sm text-blue-700/60 leading-relaxed italic">
                         This press pack is end-to-end verified. Registry hashes for all linked works are embedded in the final PDF export.
                       </p>
                    </div>
                 </aside>
              </div>
           )}
        </div>
      )}
    </div>
  );
};