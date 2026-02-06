
import React, { useState, useRef, useCallback } from 'react';
import { Camera, Image as ImageIcon, Plus, X, Globe, Lock, ShieldCheck, Tag, Layout, ArrowRight, Layers, Sparkles, Brain, Cpu, Clock, Key, Mail, UserCheck } from 'lucide-react';
import { MOCK_ARTWORKS } from '../constants';
import { ArtworkSelector } from './ArtworkSelector';
import { geminiService } from '../services/geminiService';
import { CatalogueAccessConfig } from '../types';
import toast from 'react-hot-toast';

interface CatalogueCreateProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const CatalogueCreate: React.FC<CatalogueCreateProps> = ({ onSave, onCancel }) => {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'selection' | 'visibility'>('basic');
  const [showArtSelector, setShowArtSelector] = useState(false);
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    selectedArtworkIds: [] as string[],
    includePrices: true,
    access_config: {
      mode: 'public',
      password: '',
      whitelistedTags: [] as string[],
      whitelistedEmails: [] as string[],
      timedAccess: false,
      autoPublishAt: '',
      isViewingRoomEnabled: false,
      allowDirectNegotiation: true
    } as CatalogueAccessConfig
  });

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const generateCuration = async () => {
    if (formData.selectedArtworkIds.length === 0) {
      toast.error('Select artworks first to trigger the curator assistant.');
      return;
    }
    setIsGenerating(true);
    const selectedArt = MOCK_ARTWORKS.filter(a => formData.selectedArtworkIds.includes(a.id));
    const analysis = await geminiService.generateCurationStatement(
      selectedArt.map(a => ({ title: a.title, style: a.style, medium: a.medium }))
    );
    setIsGenerating(false);
    if (analysis) {
      setFormData(prev => ({
        ...prev,
        description: analysis.description,
        tags: Array.from(new Set([...prev.tags, ...analysis.tags]))
      }));
      toast.success('Neural Curation Synced');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSave({ ...formData, coverPreview });
    setIsSaving(false);
  };

  const selectedArtworks = MOCK_ARTWORKS.filter(art => formData.selectedArtworkIds.includes(art.id));

  const TabButton = ({ id, label, icon }: { id: typeof activeTab, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all font-bold text-sm uppercase tracking-widest ${
        activeTab === id ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <button onClick={onCancel} className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-4 group">
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Discard Draft</span>
          </button>
          <h1 className="text-5xl font-serif font-bold italic tracking-tight">Viewing Room Studio.</h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving || !formData.title || formData.selectedArtworkIds.length === 0}
          className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all disabled:opacity-30 flex items-center gap-2 shadow-xl shadow-black/10"
        >
          {isSaving ? <Cpu className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
          {isSaving ? 'Encrypting Curation...' : 'Finalize & Drop'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 shadow-inner">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-6">Master Visual Anchor</h3>
            {coverPreview ? (
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden group shadow-2xl">
                <img src={coverPreview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => coverInputRef.current?.click()} className="p-4 bg-white/20 text-white rounded-full"><Camera size={24} /></button>
                </div>
              </div>
            ) : (
              <div onClick={() => coverInputRef.current?.click()} className="aspect-[3/4] border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-all group">
                <Camera className="w-8 h-8 text-gray-200 group-hover:text-black mb-4 transition-colors" />
                <p className="font-bold text-xs uppercase tracking-widest">Upload Key Asset</p>
              </div>
            )}
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
          </div>

          <div className="bg-black p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl group-hover:scale-150 transition-transform"></div>
            <h4 className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles size={14} /> Neural Assistant
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed font-light mb-8">
              Let the AI Curator synthesize your works into a sophisticated curatorial statement.
            </p>
            <button 
              onClick={generateCuration}
              disabled={isGenerating || formData.selectedArtworkIds.length === 0}
              className="w-full py-4 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? <Cpu className="animate-spin" size={14} /> : <Brain size={14} />}
              {isGenerating ? 'Decoding DNA...' : 'Generate AI Narrative'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex border-b border-gray-100 mb-8 overflow-x-auto">
            <TabButton id="basic" label="Curation" icon={<Layers size={16} />} />
            <TabButton id="selection" label="Asset Loop" icon={<Tag size={16} />} />
            <TabButton id="visibility" label="Viewing Room" icon={<Lock size={16} />} />
          </div>

          <div className="space-y-8 min-h-[400px]">
            {activeTab === 'basic' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Catalogue Identity</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. The Vernal Synthesis"
                    className="w-full text-4xl font-serif font-bold italic border-b border-gray-50 py-4 focus:border-black outline-none transition-all placeholder:text-gray-100 bg-transparent"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Curatorial Thesis</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={6}
                    placeholder="Define the aesthetic narrative..."
                    className="w-full border-2 border-gray-50 rounded-[2rem] px-8 py-6 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all resize-none font-light text-lg leading-relaxed shadow-inner"
                  />
                </div>
              </div>
            )}

            {activeTab === 'selection' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-center bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-500"><Layers size={20}/></div>
                     <div>
                        <p className="text-sm font-bold">Selection Matrix</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{formData.selectedArtworkIds.length} Works Linked</p>
                     </div>
                  </div>
                  <button onClick={() => setShowArtSelector(true)} className="bg-black text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Select Assets</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedArtworks.map(art => (
                    <div key={art.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 group hover:shadow-xl transition-all border-l-4 border-l-blue-500">
                      <img src={art.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{art.title}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${art.price.toLocaleString()}</p>
                      </div>
                      <button onClick={() => setFormData({...formData, selectedArtworkIds: formData.selectedArtworkIds.filter(id => id !== art.id)})} className="p-2 text-gray-200 hover:text-red-500 transition-colors"><X size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'visibility' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                {/* Immersive Room Toggle */}
                <div className="p-8 bg-black text-white rounded-[2.5rem] flex items-center justify-between shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full"></div>
                   <div className="space-y-1 relative z-10">
                      <h4 className="font-bold text-lg flex items-center gap-2">Immersive Viewing Room Mode <Sparkles size={16} className="text-blue-400"/></h4>
                      <p className="text-sm text-gray-400 font-light">Enabled dark-gallery UI, curatorial audio, and presence signals.</p>
                   </div>
                   <div className={`w-14 h-8 rounded-full transition-colors relative flex items-center px-1 cursor-pointer ${formData.access_config.isViewingRoomEnabled ? 'bg-blue-500' : 'bg-white/20'}`} 
                        onClick={() => setFormData({...formData, access_config: {...formData.access_config, isViewingRoomEnabled: !formData.access_config.isViewingRoomEnabled}})}>
                      <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${formData.access_config.isViewingRoomEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'public', label: 'Public Signal', desc: 'Visible in search & global feed.', icon: Globe },
                    { id: 'invite_only', label: 'Invite Only', desc: 'Neural Gatekeeper Active.', icon: UserCheck },
                    { id: 'password', label: 'Protected', desc: 'Standard key encryption.', icon: Key },
                    { id: 'link_only', label: 'Private Link', desc: 'Hidden from discovery engines.', icon: Mail }
                  ].map(mode => (
                    <div 
                      key={mode.id}
                      onClick={() => setFormData({...formData, access_config: {...formData.access_config, mode: mode.id as any}})}
                      className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer group ${formData.access_config.mode === mode.id ? 'bg-white border-black shadow-xl scale-[1.02]' : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-200'}`}
                    >
                      <mode.icon className={`mb-4 ${formData.access_config.mode === mode.id ? 'text-blue-500' : 'text-gray-300'}`} size={20} />
                      <h5 className="font-bold text-sm mb-1">{mode.label}</h5>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold leading-none">{mode.desc}</p>
                    </div>
                  ))}
                </div>

                {formData.access_config.mode === 'password' && (
                  <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 animate-in slide-in-from-top-4">
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 block">Room Passkey</label>
                     <input 
                      type="text" 
                      value={formData.access_config.password}
                      onChange={e => setFormData({...formData, access_config: {...formData.access_config, password: e.target.value}})}
                      className="w-full bg-white border-2 border-transparent focus:border-black rounded-xl px-6 py-4 outline-none font-mono text-xl tracking-widest shadow-inner"
                      placeholder="Define access key..."
                     />
                  </div>
                )}

                {formData.access_config.mode === 'invite_only' && (
                  <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 space-y-6 animate-in slide-in-from-top-4">
                     <div className="flex items-center gap-3 text-blue-900">
                        <Brain size={20} />
                        <h5 className="font-bold text-sm uppercase tracking-widest">Neural Whitelisting</h5>
                     </div>
                     <p className="text-xs text-blue-800/60 leading-relaxed font-light">Identify which Contact Groups or Vector Tags can enter this room automatically.</p>
                     <div className="flex flex-wrap gap-2">
                        {['VIP Minimalists', 'High-Intent Leads', 'European Sector'].map(tag => (
                          <button 
                            key={tag}
                            onClick={() => {
                              const current = formData.access_config.whitelistedTags;
                              const next = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag];
                              setFormData({...formData, access_config: {...formData.access_config, whitelistedTags: next}});
                            }}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                              formData.access_config.whitelistedTags.includes(tag) ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-blue-400 border border-blue-100'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                     </div>
                  </div>
                )}

                {/* Timed Access Controls */}
                <div className="p-8 border-2 border-gray-50 rounded-[2.5rem] space-y-8">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400"><Clock size={20}/></div>
                         <div>
                            <p className="text-sm font-bold">Timed Release Protocol</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Auto-transition to Public Spectrum</p>
                         </div>
                      </div>
                      <div className={`w-14 h-8 rounded-full transition-colors relative flex items-center px-1 cursor-pointer ${formData.access_config.timedAccess ? 'bg-blue-500' : 'bg-gray-200'}`} 
                           onClick={() => setFormData({...formData, access_config: {...formData.access_config, timedAccess: !formData.access_config.timedAccess}})}>
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${formData.access_config.timedAccess ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                   </div>

                   {formData.access_config.timedAccess && (
                     <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Publish After (Days)</label>
                           <select 
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none"
                            onChange={e => {
                               const date = new Date();
                               date.setDate(date.getDate() + parseInt(e.target.value));
                               setFormData({...formData, access_config: {...formData.access_config, autoPublishAt: date.toISOString()}});
                            }}
                           >
                              <option value="2">48 Hours (Aggressive)</option>
                              <option value="7">7 Days (Standard)</option>
                              <option value="14">14 Days (Exclusive)</option>
                           </select>
                        </div>
                        <div className="bg-blue-50/50 p-4 rounded-xl flex items-center gap-3">
                           <ShieldCheck className="text-blue-500" size={16} />
                           <p className="text-[10px] text-blue-800 leading-tight">Assets will remain private until threshold is reached.</p>
                        </div>
                     </div>
                   )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showArtSelector && (
        <div className="fixed inset-0 z-[300] bg-white/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="w-full max-w-5xl animate-in zoom-in duration-500">
              <ArtworkSelector 
                artworks={MOCK_ARTWORKS.map(a => ({ id: a.id, title: a.title, imageUrl: a.imageUrl, artist: a.artist }))}
                selectedArtworks={formData.selectedArtworkIds}
                onSelectionChange={(ids) => setFormData({ ...formData, selectedArtworkIds: ids })}
                onConfirm={() => setShowArtSelector(false)}
              />
           </div>
        </div>
      )}
    </div>
  );
};
