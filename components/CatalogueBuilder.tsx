
import React, { useState } from 'react';
import { 
  Save, Eye, Type, Layout, Trash2, 
  ArrowUp, ArrowDown, Image as ImageIcon, ArrowLeft, Plus, X 
} from 'lucide-react';
import { MOCK_ARTWORKS } from '../constants';
import { Catalogue, CatalogueItem, Artwork } from '../types';

interface CatalogueBuilderProps {
  onBack: () => void;
  onSave: (c: any) => void;
}

export const CatalogueBuilder: React.FC<CatalogueBuilderProps> = ({ onBack, onSave }) => {
  // Fix: Added missing access_config property to satisfy the Catalogue interface
  const [catalogue, setCatalogue] = useState<Catalogue>({
    id: 'new',
    title: 'Untitled Synthesis',
    name: 'Untitled Synthesis',
    artworks: [],
    artist_id: '',
    is_published: false,
    isPublic: true,
    access_config: {
      mode: 'public',
      whitelistedTags: [],
      whitelistedEmails: [],
      timedAccess: false,
      isViewingRoomEnabled: false,
      allowDirectNegotiation: true
    },
    branding: {
      primaryColor: '#000000',
      secondaryColor: '#F3F4F6',
      fontFamily: 'Playfair Display',
      layout: 'grid',
      showPrices: true,
      showDescriptions: true,
      showArtistInfo: true
    },
    items: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showArtSelector, setShowArtSelector] = useState(false);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...catalogue.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setCatalogue({ ...catalogue, items: newItems });
  };

  const addArtworks = (arts: Artwork[]) => {
    const newItems: CatalogueItem[] = arts.map((art, idx) => ({
      id: `art-${art.id}-${Date.now()}-${idx}`,
      type: 'artwork',
      content: art,
      order: catalogue.items.length + idx
    }));
    setCatalogue({ ...catalogue, items: [...catalogue.items, ...newItems] });
    setShowArtSelector(false);
  };

  const addText = () => {
    const newItem: CatalogueItem = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: { text: 'Identity Statement' },
      order: catalogue.items.length,
      styles: { fontSize: 24, textAlign: 'center', fontFamily: 'Playfair Display' }
    };
    setCatalogue({ ...catalogue, items: [...catalogue.items, newItem] });
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-gray-100 z-[200] px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 hover:bg-gray-50 rounded-full transition-colors"><ArrowLeft size={20}/></button>
          <div>
            <input 
              type="text" 
              value={catalogue.name} 
              onChange={e => setCatalogue({...catalogue, name: e.target.value})}
              className="text-xl font-serif font-bold italic outline-none border-b border-transparent focus:border-black/10 bg-transparent w-64"
            />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{catalogue.items.length} Elements Linked</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${previewMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
          >
            <Eye size={14} /> {previewMode ? 'Exit Preview' : 'Preview Link'}
          </button>
          <button 
            onClick={() => { setIsSaving(true); setTimeout(() => { onSave(catalogue); setIsSaving(false); }, 1500); }}
            className="px-8 py-2.5 bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:scale-105 transition-all flex items-center gap-2"
          >
            {isSaving ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <Save size={14} />}
            {isSaving ? 'Encrypting...' : 'Publish Loop'}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col md:flex-row gap-12">
        {!previewMode && (
          <aside className="w-full md:w-80 shrink-0 space-y-6">
             <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Synthesis Toolbox</h3>
                <div className="grid grid-cols-1 gap-3">
                   <button onClick={() => setShowArtSelector(true)} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-black hover:text-white transition-all group">
                      <ImageIcon size={18} className="text-gray-400 group-hover:text-blue-400" />
                      <span className="font-bold text-xs uppercase tracking-widest">Link Artwork</span>
                   </button>
                   <button onClick={addText} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-black hover:text-white transition-all group">
                      <Type size={18} className="text-gray-400 group-hover:text-blue-400" />
                      <span className="font-bold text-xs uppercase tracking-widest">Text Block</span>
                   </button>
                </div>
             </div>
          </aside>
        )}

        <main className={`flex-1 ${previewMode ? 'max-w-4xl mx-auto' : ''}`}>
          {catalogue.items.length === 0 ? (
            <div className="h-[600px] bg-white border-2 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-center p-20">
               <Layout size={64} className="text-gray-100 mb-8" />
               <h3 className="text-3xl font-serif font-bold italic text-gray-200">Start the Synthesis.</h3>
               <p className="text-gray-400 max-w-xs mt-4">Add elements from the toolbox to build a visual narrative.</p>
            </div>
          ) : (
            <div className={`space-y-12 animate-in fade-in duration-500 ${previewMode ? 'bg-white shadow-2xl rounded-[3rem] p-20 min-h-screen' : ''}`}>
               {previewMode && (
                 <div className="text-center mb-32">
                    <h1 className="text-6xl font-serif font-bold italic mb-6">{catalogue.name}</h1>
                    <div className="w-20 h-1 bg-black mx-auto"></div>
                 </div>
               )}

               <div className="space-y-12">
                  {catalogue.items.map((item, index) => (
                    <div key={item.id} className="relative group">
                      {!previewMode && (
                        <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => moveItem(index, 'up')} className="p-2 bg-white border border-gray-100 rounded-full hover:bg-gray-50"><ArrowUp size={14}/></button>
                          <button onClick={() => moveItem(index, 'down')} className="p-2 bg-white border border-gray-100 rounded-full hover:bg-gray-50"><ArrowDown size={14}/></button>
                        </div>
                      )}
                      {!previewMode && (
                        <button 
                          onClick={() => setCatalogue({...catalogue, items: catalogue.items.filter(i => i.id !== item.id)})}
                          className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                      {item.type === 'artwork' ? (
                        <div className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                           <div className="flex-1">
                              <img src={item.content.imageUrl} className="w-full h-auto rounded-lg shadow-2xl" alt="Art" />
                           </div>
                           <div className="flex-1 space-y-4">
                              <h3 className="text-4xl font-serif font-bold italic">{item.content.title}</h3>
                              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{item.content.medium} • {item.content.year}</p>
                              <p className="text-lg text-gray-500 leading-relaxed font-light">{item.content.description}</p>
                           </div>
                        </div>
                      ) : (
                        <div className="py-20 text-center">
                           <textarea 
                             value={item.content.text}
                             disabled={previewMode}
                             onChange={e => {
                                const items = [...catalogue.items];
                                items[index].content.text = e.target.value;
                                setCatalogue({...catalogue, items});
                             }}
                             className={`w-full bg-transparent text-center font-serif italic outline-none resize-none overflow-hidden ${previewMode ? 'text-4xl text-gray-900' : 'text-3xl text-gray-400 focus:text-black border-b border-transparent focus:border-black/10'}`}
                             rows={2}
                           />
                        </div>
                      )}
                    </div>
                  ))}
               </div>
            </div>
          )}
        </main>
      </div>

      {showArtSelector && (
        <div className="fixed inset-0 z-[300] bg-white/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in duration-500">
              <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                 <h2 className="text-3xl font-serif font-bold italic">Select Signal Assets</h2>
                 <button onClick={() => setShowArtSelector(false)} className="p-4 hover:bg-gray-50 rounded-full transition-colors"><X/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {MOCK_ARTWORKS.map(art => (
                   <div 
                    key={art.id} 
                    onClick={() => addArtworks([art])}
                    className="group cursor-pointer bg-gray-50 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all"
                   >
                      <div className="aspect-square">
                        <img src={art.imageUrl} className="w-full h-full object-cover" alt="Art Select" />
                      </div>
                      <div className="p-4">
                        <p className="font-bold text-sm truncate">{art.title}</p>
                        <p className="text-[10px] uppercase font-bold text-gray-400">${art.price.toLocaleString()}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
