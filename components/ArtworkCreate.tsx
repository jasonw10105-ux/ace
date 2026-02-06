import React, { useState, useRef, useCallback } from 'react';
import { ArtworkStatus } from '../types';
import { 
  ArrowLeft, Save, Camera, Trash2, Tag, 
  Layers, Lock, Globe, ShieldCheck, Zap, 
  // Added Plus and MessageSquare to the import list
  Info, AlertTriangle, Eye, EyeOff, Plus, MessageSquare
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
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'pricing' | 'visibility'>('basic');
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    medium: '',
    style: '',
    dimensions: {
      width: 0,
      height: 0,
      depth: 0,
      unit: 'cm' as 'cm' | 'in'
    },
    year: new Date().getFullYear(),
    price: 0,
    currency: 'USD',
    status: 'available' as ArtworkStatus,
    tags: [] as string[],
    location: '',
    condition: 'excellent',
    provenance: '',
    isPublic: true,
    allowInquiries: true
  });

  const handleImageUpload = useCallback((files: FileList) => {
    const newImages: ArtworkImage[] = Array.from(files).map((file, index) => ({
      id: `img-${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
      isPrimary: images.length === 0 && index === 0,
      order: images.length + index
    }));
    setImages(prev => [...prev, ...newImages]);
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

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API logic
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSave({ ...formData, images });
    setIsSaving(false);
  };

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
          <button 
            onClick={onCancel}
            className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-4 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Studio</span>
          </button>
          <h1 className="text-5xl font-serif font-bold italic tracking-tight">Catalog New Work.</h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving || !formData.title || images.length === 0}
          className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all disabled:opacity-30 disabled:hover:scale-100 flex items-center gap-2 shadow-xl shadow-black/10"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {isSaving ? 'Encrypting Metadata...' : 'Save to Collection'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Image Management */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Visual Assets</h3>
            
            {images.length === 0 ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-black/20 hover:bg-white transition-all group"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-bold text-sm">Upload Masters</p>
                <p className="text-xs text-gray-400 mt-1 text-center px-4">Drag and drop or click to browse high-res files</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group">
                      <img src={img.preview} alt="Artwork preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setPrimaryImage(img.id)}
                          className={`p-2 rounded-full ${img.isPrimary ? 'bg-blue-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                          title="Set as primary"
                        >
                          <ShieldCheck size={16} />
                        </button>
                        <button 
                          onClick={() => removeImage(img.id)}
                          className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {img.isPrimary && <div className="absolute top-2 left-2 px-2 py-0.5 bg-black text-white text-[8px] font-bold uppercase tracking-widest rounded">Primary</div>}
                    </div>
                  ))}
                  {images.length < 10 && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center hover:border-black/20 transition-all text-gray-400 hover:text-black"
                    >
                      {/* Plus icon from lucide-react */}
                      <Plus size={24} />
                    </button>
                  )}
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
          </div>

          <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
            <h4 className="text-blue-900 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <Zap size={14} />
              AI Curation Tip
            </h4>
            <p className="text-sm text-blue-800/80 leading-relaxed font-light">
              Higher resolution images with natural lighting improve the Engine's ability to map your work to the right collectors.
            </p>
          </div>
        </div>

        {/* Right Column: Form Data */}
        <div className="lg:col-span-2">
          <div className="flex border-b border-gray-100 mb-8 overflow-x-auto">
            <TabButton id="basic" label="Identity" icon={<Tag size={16} />} />
            <TabButton id="details" label="Physicality" icon={<Layers size={16} />} />
            <TabButton id="pricing" label="Market" icon={<ShieldCheck size={16} />} />
            <TabButton id="visibility" label="Network" icon={<Lock size={16} />} />
          </div>

          <div className="space-y-8 min-h-[400px]">
            {activeTab === 'basic' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Artwork Title *</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="The name of your vision"
                    className="w-full text-3xl font-serif italic border-b border-gray-100 py-4 focus:border-black outline-none transition-colors bg-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Medium</label>
                    <input 
                      type="text" 
                      value={formData.medium}
                      onChange={(e) => setFormData({...formData, medium: e.target.value})}
                      placeholder="e.g. Oil on Belgian Linen"
                      className="w-full border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Creation Year</label>
                    <input 
                      type="number" 
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                      className="w-full border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2 pt-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Concept Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={6}
                    placeholder="Tell the story behind the piece..."
                    className="w-full border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Dimensions</label>
                  <div className="flex items-center gap-4">
                    <input type="number" placeholder="W" className="flex-1 border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all" />
                    <span className="text-gray-300">×</span>
                    <input type="number" placeholder="H" className="flex-1 border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all" />
                    <span className="text-gray-300">×</span>
                    <input type="number" placeholder="D" className="flex-1 border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all" />
                    <select 
                      value={formData.dimensions.unit}
                      onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, unit: e.target.value as 'cm' | 'in'}})}
                      className="border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 outline-none"
                    >
                      <option value="cm">cm</option>
                      <option value="in">in</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Condition</label>
                    <select className="w-full border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all">
                      <option>Pristine / New</option>
                      <option>Excellent</option>
                      <option>Good (Minor wear)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Location</label>
                    <input type="text" placeholder="Gallery, Studio, City..." className="w-full border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">List Price *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input 
                        type="number" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                        className="w-full border border-gray-100 rounded-xl pl-10 pr-4 py-4 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all text-xl font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Current Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as ArtworkStatus})}
                      className="w-full border border-gray-100 rounded-xl px-4 py-4 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all font-bold"
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Discovery Tags</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      placeholder="e.g. brutalism, sunset, textured"
                      className="flex-1 border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all"
                    />
                    <button onClick={addTag} className="bg-black text-white px-6 rounded-xl font-bold text-sm">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium">
                        #{tag}
                        <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'visibility' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-4 flex items-center gap-2">
                    <Lock size={14} className="text-blue-500" />
                    Access Protocols
                  </h3>
                  
                  {/* Public Discovery Toggle */}
                  <div 
                    onClick={() => setFormData({...formData, isPublic: !formData.isPublic})}
                    className={`p-8 rounded-[2.5rem] flex items-center justify-between group cursor-pointer transition-all border-2 ${
                      formData.isPublic 
                        ? 'bg-black border-black text-white shadow-2xl' 
                        : 'bg-gray-50 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-2xl ${formData.isPublic ? 'bg-blue-500/20 text-blue-400' : 'bg-white text-gray-400 shadow-sm'}`}>
                         {formData.isPublic ? <Globe size={24} /> : <EyeOff size={24} />}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-xl flex items-center gap-2">
                          Public Signal
                          {formData.isPublic && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                        </h4>
                        <p className={`text-sm ${formData.isPublic ? 'text-gray-400' : 'text-gray-500'} font-light max-w-sm leading-relaxed`}>
                          Broadcast this work to the global discovery engine and marketplace grid.
                        </p>
                      </div>
                    </div>
                    
                    <div className={`w-16 h-9 rounded-full transition-all relative flex items-center px-1 border-2 ${
                      formData.isPublic ? 'bg-blue-500 border-blue-400' : 'bg-gray-200 border-gray-300'
                    }`}>
                      <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 transform ${
                        formData.isPublic ? 'translate-x-7' : 'translate-x-0'
                      }`}></div>
                    </div>
                  </div>

                  {/* Direct Inquiry Toggle */}
                  <div 
                    onClick={() => setFormData({...formData, allowInquiries: !formData.allowInquiries})}
                    className={`p-8 rounded-[2.5rem] flex items-center justify-between group cursor-pointer transition-all border-2 ${
                      formData.allowInquiries 
                        ? 'bg-black border-black text-white shadow-2xl' 
                        : 'bg-gray-50 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-2xl ${formData.allowInquiries ? 'bg-blue-500/20 text-blue-400' : 'bg-white text-gray-400 shadow-sm'}`}>
                         {/* MessageSquare icon from lucide-react */}
                         <MessageSquare size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-xl">Direct Inquiries</h4>
                        <p className={`text-sm ${formData.allowInquiries ? 'text-gray-400' : 'text-gray-500'} font-light max-w-sm leading-relaxed`}>
                          Enable collectors to initiate high-intent negotiation loops for this asset.
                        </p>
                      </div>
                    </div>
                    
                    <div className={`w-16 h-9 rounded-full transition-all relative flex items-center px-1 border-2 ${
                      formData.allowInquiries ? 'bg-blue-500 border-blue-400' : 'bg-gray-200 border-gray-300'
                    }`}>
                      <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 transform ${
                        formData.allowInquiries ? 'translate-x-7' : 'translate-x-0'
                      }`}></div>
                    </div>
                  </div>
                </div>

                {/* Overrides Info Note */}
                <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-[2.5rem] flex gap-5">
                   <div className="shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                      <Info size={24} />
                   </div>
                   <div className="space-y-2">
                      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900">Neural Visibility Note</h5>
                      <p className="text-sm text-blue-800/80 leading-relaxed font-light">
                        Individual visibility signals are <span className="font-bold">overridden by Catalogue settings</span>. If you add a "Public" work to a "Private Viewing Room", only collectors with room access can view the asset DNA. 
                      </p>
                      <div className="flex items-center gap-4 mt-4">
                         <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                            <ShieldCheck size={12} /> SECURE HIERARCHY
                         </div>
                      </div>
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

const X: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default ArtworkCreate;