
import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, Save, Camera, Trash2, Tag, Layers, Lock, Globe, ShieldCheck, Zap, 
  Plus, Brain, Loader2, FileText, Palette, DollarSign, Eye, EyeOff, Unlock,
  ChevronUp, ChevronDown, Star
} from 'lucide-react';
import { Box, Flex, Text, Button, Input, Separator, Spacer } from '../flow';
import { ArtworkStatus } from '../types';

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
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ArtworkImage[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'pricing' | 'visibility'>('basic');
  const [newTag, setNewTag] = useState('');

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
        toast.success('Neural Analysis Complete: Metadata Synced.');
      }
    } catch (e) {
      console.error('Neural Interrupt', e);
    } finally {
      setIsAnalyzing(false);
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

  // Fix: Added missing handleFileSelect function to handle image input change
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleImageUpload(e.target.files);
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const setPrimaryImage = (id: string) => {
    setImages(prev => prev.map(img => ({ ...img, isPrimary: img.id === id })));
  };

  const reorder = (index: number, direction: 'up' | 'down') => {
    const newItems = [...images];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newItems.length) return;
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    setImages(newItems.map((img, i) => ({ ...img, order: i })));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSave({ ...formData, images });
    setIsSaving(false);
  };

  return (
    <Box maxWidth="1200px" mx="auto" px={2} py={8} className="animate-in fade-in slide-in-from-bottom-2">
      <Flex justify="between" align="center" mb={10}>
        <Box>
          <Button variant="no-border" onClick={onCancel} className="mb-4">
             <Flex align="center" gap={1}>
                <ArrowLeft size={16} /> <Text variant="label">Return to Studio</Text>
             </Flex>
          </Button>
          <Flex align="center" gap={2}>
            <Text variant="h1">Catalog <Text variant="italic">Asset</Text>.</Text>
            {isAnalyzing && <Brain className="text-blue-500 animate-pulse" size={24} />}
          </Flex>
        </Box>
        <Button size="lg" onClick={handleSave} loading={isSaving} disabled={!formData.title || images.length === 0}>
           <Save size={18} className="mr-2" /> Sync to Portfolio
        </Button>
      </Flex>

      <Flex direction={['column', 'row']} gap={6}>
        {/* Visual Engine Sidebar */}
        <Box width={['100%', '380px']} className="shrink-0 space-y-6">
           <Box bg="#F8F8F8" p={4} borderRadius="16px" border="1px solid #E5E5E5">
              <Text variant="label" color="#999" className="block mb-4">Master Visuals</Text>
              
              {images.length === 0 ? (
                <Box 
                  height="300px" 
                  border="2px dashed #DDD" 
                  borderRadius="12px" 
                  display="flex" 
                  className="flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-black transition-all group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={40} className="text-gray-300 group-hover:text-black mb-2" />
                  <Text weight="bold" size={14}>Upload Masters</Text>
                  <Text size={12} color="#999">Max 10 assets (JPG/WebP)</Text>
                </Box>
              ) : (
                <Box className="space-y-4">
                  <Box className="grid grid-cols-2 gap-2">
                    {images.map((img, idx) => (
                      <Box key={img.id} position="relative" borderRadius="8px" overflow="hidden" className="group shadow-sm">
                        <img src={img.preview} className="w-full aspect-square object-cover" />
                        <Box position="absolute" top={0.5} right={0.5} className="opacity-0 group-hover:opacity-100 transition-opacity">
                           <Flex direction="column" gap={0.5}>
                             <button onClick={() => removeImage(img.id)} className="p-1.5 bg-red-500 text-white rounded-lg"><Trash2 size={12}/></button>
                             <button onClick={() => setPrimaryImage(img.id)} className={`p-1.5 rounded-lg ${img.isPrimary ? 'bg-black text-white' : 'bg-white text-black'}`}><Star size={12}/></button>
                           </Flex>
                        </Box>
                        <Box position="absolute" bottom={0.5} left={0.5} className="opacity-0 group-hover:opacity-100 transition-opacity">
                           <Flex gap={0.5}>
                              <button onClick={() => reorder(idx, 'up')} className="p-1 bg-white/80 rounded"><ChevronUp size={10}/></button>
                              <button onClick={() => reorder(idx, 'down')} className="p-1 bg-white/80 rounded"><ChevronDown size={10}/></button>
                           </Flex>
                        </Box>
                        {img.isPrimary && <Box position="absolute" top={0.5} left={0.5} bg="black" px={1} borderRadius="2px"><Text color="white" size={8} weight="black">PRIMARY</Text></Box>}
                      </Box>
                    ))}
                    {images.length < 10 && (
                      <Box 
                        border="2px dashed #DDD" 
                        borderRadius="8px" 
                        className="flex items-center justify-center cursor-pointer hover:bg-white transition-all"
                        onClick={() => fileInputRef.current?.click()}
                      >
                         <Plus size={20} className="text-gray-400" />
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
              <input ref={fileInputRef} type="file" multiple hidden onChange={handleFileSelect} />
           </Box>

           <Box bg="black" p={4} borderRadius="16px" className="relative overflow-hidden">
              <Zap size={24} className="text-blue-400 mb-2" />
              <Text weight="bold" color="white" className="block mb-1">Commercial Discovery</Text>
              <Text color="#666" size={13}>Neural calibration ensures this asset is surfaced to high-intent collectors in the matching aesthetic spectrum.</Text>
              <Box position="absolute" top="-20px" right="-20px" width="100px" height="100px" bg="blue-100" borderRadius="full" style={{ opacity: 0.1, filter: 'blur(40px)' }} />
           </Box>
        </Box>

        {/* Form Content */}
        <Box flex={1}>
           <Box borderBottom="1px solid #E5E5E5" mb={6} className="overflow-x-auto">
             <Flex gap={4}>
               {[
                 { id: 'basic', label: 'Identity', icon: FileText },
                 { id: 'details', label: 'Heritage', icon: Palette },
                 { id: 'pricing', label: 'Market', icon: DollarSign },
                 { id: 'visibility', label: 'Broadcast', icon: Eye }
               ].map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`px-4 py-4 border-b-2 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
                 >
                   <tab.icon size={14} /> {tab.label}
                 </button>
               ))}
             </Flex>
           </Box>

           <Box minHeight="400px">
              {activeTab === 'basic' && (
                <Box className="space-y-6 animate-in slide-in-from-right-1">
                   <Box className="space-y-2">
                      <Text variant="label" color="#999">Asset Title *</Text>
                      <input 
                        className="w-full text-4xl font-serif italic border-none focus:ring-0 outline-none placeholder:text-gray-100"
                        placeholder="Untitled Synthesis..."
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                      />
                   </Box>
                   <Box className="space-y-2">
                      <Text variant="label" color="#999">Narrative Description</Text>
                      <textarea 
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:bg-white transition-all outline-none min-h-[150px] leading-relaxed"
                        placeholder="Describe the aesthetic intent..."
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                      />
                   </Box>
                   <Flex gap={4}>
                      <Box flex={1} className="space-y-2">
                         <Text variant="label" color="#999">Medium *</Text>
                         <Input value={formData.medium} onChange={e => setFormData({...formData, medium: e.target.value})} placeholder="e.g. Oil on Linen" />
                      </Box>
                      <Box flex={1} className="space-y-2">
                         <Text variant="label" color="#999">Movement / Style</Text>
                         <Input value={formData.style} onChange={e => setFormData({...formData, style: e.target.value})} placeholder="e.g. Neo-Minimalist" />
                      </Box>
                   </Flex>
                </Box>
              )}

              {activeTab === 'details' && (
                <Box className="space-y-6 animate-in slide-in-from-right-1">
                   <Box className="space-y-4">
                      <Text variant="label" color="#999">Physical Scale</Text>
                      <Flex gap={2} align="center">
                         <input type="number" placeholder="W" className="w-20 p-3 bg-gray-50 rounded-xl outline-none" value={formData.dimensions.width || ''} onChange={e => setFormData({...formData, dimensions: {...formData.dimensions, width: parseFloat(e.target.value)}})} />
                         <Text color="#CCC">×</Text>
                         <input type="number" placeholder="H" className="w-20 p-3 bg-gray-50 rounded-xl outline-none" value={formData.dimensions.height || ''} onChange={e => setFormData({...formData, dimensions: {...formData.dimensions, height: parseFloat(e.target.value)}})} />
                         <select className="p-3 bg-gray-50 rounded-xl font-bold text-xs" value={formData.dimensions.unit} onChange={e => setFormData({...formData, dimensions: {...formData.dimensions, unit: e.target.value as any}})}>
                            <option value="cm">cm</option>
                            <option value="in">in</option>
                         </select>
                      </Flex>
                   </Box>
                   <Separator m={4} />
                   <Box className="space-y-2">
                      <Text variant="label" color="#999">Provenance & Heritage</Text>
                      <textarea 
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none min-h-[100px]"
                        placeholder="History of ownership..."
                        value={formData.provenance}
                        onChange={e => setFormData({...formData, provenance: e.target.value})}
                      />
                   </Box>
                   <Box className="space-y-2">
                      <Text variant="label" color="#999">Condition Report</Text>
                      <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                         <option value="excellent">Excellent</option>
                         <option value="very-good">Very Good</option>
                         <option value="good">Good</option>
                         <option value="fair">Fair</option>
                      </select>
                   </Box>
                </Box>
              )}

              {activeTab === 'pricing' && (
                <Box className="space-y-8 animate-in slide-in-from-right-1">
                   <Flex gap={4}>
                      <Box flex={1} className="space-y-2">
                         <Text variant="label" color="#999">Target Valuation *</Text>
                         <Flex bg="#F8F8F8" borderRadius="16px" align="center" px={4}>
                            <Text weight="bold" color="#999">$</Text>
                            <input 
                              type="number" 
                              className="w-full bg-transparent p-4 outline-none font-mono font-bold text-2xl"
                              placeholder="0.00"
                              value={formData.price || ''}
                              onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                            />
                         </Flex>
                      </Box>
                      <Box flex={1} className="space-y-2">
                         <Text variant="label" color="#999">Status</Text>
                         <select className="w-full p-4 h-[64px] bg-gray-50 rounded-2xl font-bold text-sm outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                            <option value="available">Available for Acquisition</option>
                            <option value="sold">Acquired Asset</option>
                            <option value="reserved">Reserved Node</option>
                            <option value="private">Private Archive</option>
                         </select>
                      </Box>
                   </Flex>
                   <Box bg="#F0F7FF" p={4} borderRadius="16px" border="1px solid #C2E0FF">
                      <Text size={12} color="#1023D7" lineHeight={1.5}>
                        <Zap size={12} className="inline mr-1" />
                        Neural pricing insight suggests a valuation between <b>$2,400 - $3,100</b> based on current stylistic demand for {formData.style || 'this movement'}.
                      </Text>
                   </Box>
                </Box>
              )}

              {activeTab === 'visibility' && (
                <Box className="space-y-6 animate-in slide-in-from-right-1">
                   <Box p={6} border="1px solid #E5E5E5" borderRadius="24px" className="bg-gray-50 flex items-center justify-between cursor-pointer" onClick={() => setFormData({...formData, isPublic: !formData.isPublic})}>
                      <Flex align="center" gap={4}>
                        <Box p={3} bg="white" borderRadius="12px" shadow="sm">{formData.isPublic ? <Globe size={24}/> : <EyeOff size={24}/>}</Box>
                        <Box>
                           <Text weight="bold" className="block">Public Visibility</Text>
                           <Text size={12} color="#999">{formData.isPublic ? 'Visible to global discovery spectrum' : 'Hidden from public index'}</Text>
                        </Box>
                      </Flex>
                      <Box width="48px" height="24px" borderRadius="full" bg={formData.isPublic ? "black" : "#DDD"} position="relative" className="transition-colors">
                         <Box width="20px" height="20px" borderRadius="full" bg="white" position="absolute" top="2px" left={formData.isPublic ? "26px" : "2px"} className="transition-all shadow-sm" />
                      </Box>
                   </Box>

                   <Box p={6} border="1px solid #E5E5E5" borderRadius="24px" className="bg-gray-50 flex items-center justify-between cursor-pointer" onClick={() => setFormData({...formData, allowInquiries: !formData.allowInquiries})}>
                      <Flex align="center" gap={4}>
                        <Box p={3} bg="white" borderRadius="12px" shadow="sm">{formData.allowInquiries ? <Unlock size={24}/> : <Lock size={24}/>}</Box>
                        <Box>
                           <Text weight="bold" className="block">Open Negotiations</Text>
                           <Text size={12} color="#999">{formData.allowInquiries ? 'Collectors can initiate acquisition signal' : 'Direct negotiations disabled'}</Text>
                        </Box>
                      </Flex>
                      <Box width="48px" height="24px" borderRadius="full" bg={formData.allowInquiries ? "black" : "#DDD"} position="relative" className="transition-colors">
                         <Box width="20px" height="20px" borderRadius="full" bg="white" position="absolute" top="2px" left={formData.allowInquiries ? "26px" : "2px"} className="transition-all shadow-sm" />
                      </Box>
                   </Box>
                </Box>
              )}
           </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default ArtworkCreate;
