
import React, { useState, useRef, useCallback } from 'react';
import { ArtworkStatus } from '../types';
import { geminiService } from '../services/geminiService';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, Save, Camera, Trash2, Tag, Layers, Lock, Globe, ShieldCheck, Zap, 
  Plus, MessageSquare, Brain, Loader2, CheckCircle2, Sparkles, Activity, Target,
  // Fix: Added missing DollarSign icon import
  DollarSign
} from 'lucide-react';

interface ArtworkImage {
  id: string;
  file: File;
  preview: string;
  isPrimary: boolean;
  order: number;
}

interface ArtworkCreateProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

const ArtworkCreate: React.FC<ArtworkCreateProps> = ({ onSave, onCancel }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ArtworkImage[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'pricing' | 'visibility'>('basic');
  const [newTag, setNewTag] = useState('');
  const [analysisProgress, setAnalysisProgress] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    medium: '',
    style: '',
    subject: '',
    dimensions: { width: 0, height: 0, depth: 0, unit: 'cm' as 'cm' | 'in' },
    year: new Date().getFullYear(),
    price: 0,
    currency: 'USD' as any,
    status: 'available' as ArtworkStatus,
    tags: [] as string[],
    location: '',
    condition: 'excellent',
    provenance: '',
    exhibitionHistory: '',
    awards: '',
    isPublic: true,
    allowInquiries: true,
    palette: { primary: '', secondary: '', accents: [] as string[] }
  });

  const handleNeuralAnalysis = async (base64: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(['Opening neural link...']);
    
    setTimeout(() => setAnalysisProgress(prev => [...prev, 'Decoding brushwork DNA...']), 800);
    setTimeout(() => setAnalysisProgress(prev => [...prev, 'Synthesizing curatorial narrative...']), 1600);

    try {
      const analysis = await geminiService.analyzeArtworkForUpload(base64);
      if (analysis) {
        setFormData(prev => ({
          ...prev,
          title: prev.title || analysis.title,
          description: prev.description || analysis.description,
          medium: prev.medium || analysis.medium,
          style: prev.style || analysis.style,
          subject: prev.subject || analysis.subject,
          tags: Array.from(new Set([...prev.tags, ...analysis.tags])),
          price: prev.price || analysis.suggestedPrice,
          palette: analysis.palette
        }));
        toast.success('Aesthetic DNA Mapped');
      }
    } catch (e) {
      toast.error('Neural Interrupt. Manual entry required.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress([]);
    }
  };

  const handleImageUpload = useCallback((files: FileList) => {
    const newImages: ArtworkImage[] = Array.from(files).map((file, index) => ({
      id: `img-${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
      isPrimary: images.length === 0 && index === 0,
      order: images.length + index
    }));
    
    setImages(prev => [...prev, ...newImages]);

    if (images.length === 0 && newImages.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => handleNeuralAnalysis(reader.result as string);
      reader.readAsDataURL(newImages[0].file);
    }
  }, [images.length]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) handleImageUpload(files);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const newImages = prev.filter(img => img.id !== id);
      if (newImages.length > 0 && !newImages.some(img => img.isPrimary)) {
        newImages[0].isPrimary = true;
      }
      return newImages;
    });
  };

  const setPrimaryImage = (id: string) => {
    setImages(prev => prev.map(img => ({ ...img, isPrimary: img.id === id })));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSave({ ...formData, images });
    setIsSaving(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <button onClick={onCancel} className="flex items-center gap-2 text-gray-400 hover:text-black mb-4 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Studio</span>
          </button>
          <div className="flex items-center gap-4">
             <h1 className="text-5xl font-serif font-bold italic tracking-tight">Catalog Asset.</h1>
             {isAnalyzing && (
               <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-500 rounded-full animate-pulse border border-blue-100">
                  <Brain size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Neural Scan Active</span>
               </div>
             )}
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving || !formData.title || images.length === 0}
          className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all disabled:opacity-30 flex items-center gap-2 shadow-xl shadow-black/10"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {isSaving ? 'Encrypting Metadata...' : 'Sync to Collection'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar: Visual Assets */}
        <div className="lg:col-span-1 space-y-8">
          <div className={`bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 shadow-inner overflow-hidden relative ${isAnalyzing ? 'ring-2 ring-blue-500 ring-offset-4 ring-offset-white' : ''}`}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Visual Engine</h3>
            
            {images.length === 0 ? (
              <div 
                onClick={() => !isAnalyzing && fileInputRef.current?.click()}
                className={`aspect-square border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-black/20 hover:bg-white transition-all group`}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-bold text-sm">Upload Masters</p>
                <p className="text-xs text-gray-400 mt-1 text-center px-4">Identify and analyze aesthetic DNA</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group">
                      <img src={img.preview} alt="Artwork preview" className="w-full h-full object-cover" />
                      {!isAnalyzing && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={() => setPrimaryImage(img.id)} className={`p-2 rounded-full ${img.isPrimary ? 'bg-blue-500 text-white' : 'bg-white/20 text-white'}`}><ShieldCheck size={16} /></button>
                          <button onClick={() => removeImage(img.id)} className="p-2 bg-red-500/80 text-white rounded-full"><Trash2 size={16} /></button>
                        </div>
                      )}
                      {img.isPrimary && <div className="absolute top-2 left-2 px-2 py-0.5 bg-black text-white text-[8px] font-bold uppercase rounded">Anchor</div>}
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                           <div className="w-full h-0.5 bg-white/30 relative overflow-hidden">
                              <div className="absolute inset-0 bg-white animate-[slide_1.5s_infinite]"></div>
                           </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />

            {isAnalyzing && (
               <div className="mt-8 space-y-2 animate-in slide-in-from-top-2">
                  {analysisProgress.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                       <span className="text-blue-500">▶</span> {p}
                    </div>
                  ))}
               </div>
            )}

            {formData.palette.primary && !isAnalyzing && (
               <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Extracted DNA</p>
                  <div className="flex gap-2">
                     {[formData.palette.primary, formData.palette.secondary, ...formData.palette.accents].slice(0, 5).map(c => (
                       <div key={c} className="w-10 h-10 rounded-xl border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
                     ))}
                  </div>
               </div>
            )}
          </div>

          <div className="bg-black p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl"></div>
            <h4 className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap size={14} /> AI Synthesis Locked
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed font-light mb-6">
              Neural interface identified this as <span className="text-white font-bold">{formData.subject || 'a new aesthetic vector'}</span>.
            </p>
          </div>
        </div>

        {/* Main Form Tabs */}
        <div className="lg:col-span-2">
          <div className="flex border-b border-gray-100 mb-8 overflow-x-auto whitespace-nowrap">
            {[
              { id: 'basic', label: 'Identity', icon: Target },
              { id: 'details', label: 'Heritage', icon: Layers },
              { id: 'pricing', label: 'Market', icon: DollarSign },
              { id: 'visibility', label: 'Broadcast', icon: Globe }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-6 border-b-2 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                  activeTab === tab.id ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-10 min-h-[400px]">
            {activeTab === 'basic' && (
              <div className="space-y-8 animate-in slide-in-from-right-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Master Title *</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter visual identity"
                    className="w-full text-4xl font-serif italic border-b border-gray-50 py-4 focus:border-black outline-none transition-all placeholder:text-gray-100 bg-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Physical Medium</label>
                    <input 
                      type="text" 
                      value={formData.medium}
                      onChange={(e) => setFormData({...formData, medium: e.target.value})}
                      placeholder="e.g. Mixed Media"
                      className="w-full border-2 border-gray-50 rounded-2xl px-6 py-4 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Aesthetic Specialty</label>
                    <input 
                      type="text" 
                      value={formData.style}
                      onChange={(e) => setFormData({...formData, style: e.target.value})}
                      placeholder="e.g. Neo-Minimalism"
                      className="w-full border-2 border-gray-50 rounded-2xl px-6 py-4 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Narrative Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={6}
                    placeholder="Synthesize the intent behind this work..."
                    className="w-full border-2 border-gray-50 rounded-[2rem] px-8 py-6 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all resize-none leading-relaxed font-light text-lg shadow-inner"
                  />
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-10 animate-in slide-in-from-right-4">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Physical Scale (Critical for Room Sync)</label>
                  <div className="flex items-center gap-6">
                    <div className="flex-1 space-y-2">
                       <span className="text-[9px] uppercase text-gray-300 font-bold">Width</span>
                       <input type="number" placeholder="W" value={formData.dimensions.width || ''} onChange={e => setFormData({...formData, dimensions: {...formData.dimensions, width: parseFloat(e.target.value)}})} className="w-full border-2 border-gray-50 rounded-2xl px-6 py-4 bg-gray-50 focus:bg-white outline-none font-mono" />
                    </div>
                    <span className="text-gray-200 mt-6">×</span>
                    <div className="flex-1 space-y-2">
                       <span className="text-[9px] uppercase text-gray-300 font-bold">Height</span>
                       <input type="number" placeholder="H" value={formData.dimensions.height || ''} onChange={e => setFormData({...formData, dimensions: {...formData.dimensions, height: parseFloat(e.target.value)}})} className="w-full border-2 border-gray-50 rounded-2xl px-6 py-4 bg-gray-50 focus:bg-white outline-none font-mono" />
                    </div>
                    <select 
                      value={formData.dimensions.unit}
                      onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, unit: e.target.value as any}})}
                      className="mt-6 border-2 border-gray-50 rounded-2xl px-6 py-4 bg-gray-50 outline-none font-bold"
                    >
                      <option value="cm">cm</option>
                      <option value="in">in</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Provenance History</label>
                  <textarea value={formData.provenance} onChange={e => setFormData({...formData, provenance: e.target.value})} rows={3} placeholder="History of ownership..." className="w-full border-2 border-gray-50 rounded-2xl px-6 py-4 bg-gray-50 focus:bg-white outline-none resize-none font-light" />
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-10 animate-in slide-in-from-right-4">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Target Valuation *</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input type="number" value={formData.price || ''} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full border-2 border-gray-50 rounded-2xl pl-12 pr-6 py-6 bg-gray-50 focus:bg-white focus:border-black outline-none text-2xl font-mono font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Collection Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as ArtworkStatus})} className="w-full border-2 border-gray-50 rounded-2xl px-6 py-6 bg-gray-50 outline-none font-bold">
                      <option value="available">Available Signal</option>
                      <option value="reserved">Reserved Node</option>
                      <option value="sold">Acquired Asset</option>
                      <option value="private">Private Archive</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'visibility' && (
              <div className="space-y-8 animate-in slide-in-from-right-4">
                 <div onClick={() => setFormData({...formData, isPublic: !formData.isPublic})} className={`p-10 rounded-[3rem] flex items-center justify-between cursor-pointer transition-all border-2 ${formData.isPublic ? 'bg-black border-black text-white shadow-2xl scale-[1.02]' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}>
                    <div className="flex items-center gap-8">
                      <div className={`p-5 rounded-2xl ${formData.isPublic ? 'bg-blue-500/20 text-blue-400' : 'bg-white text-gray-400 shadow-sm'}`}>{formData.isPublic ? <Globe size={28} /> : <Lock size={28} />}</div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-2xl italic font-serif">Global Discovery</h4>
                        <p className={`text-sm ${formData.isPublic ? 'text-gray-400' : 'text-gray-500'} font-light max-w-sm`}>Broadcast this identity to the discovery spectrum and collective feed.</p>
                      </div>
                    </div>
                    <div className={`w-16 h-9 rounded-full relative flex items-center px-1 border-2 ${formData.isPublic ? 'bg-blue-500 border-blue-400' : 'bg-gray-200 border-gray-300'}`}>
                      <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform ${formData.isPublic ? 'translate-x-7' : 'translate-x-0'}`}></div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCreate;
