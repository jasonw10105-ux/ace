
import React, { useState } from 'react';
import { 
  FolderPlus, Layers, Plus, Target, ChevronRight, 
  Trash2, Download, Zap, Brain, Layout, ArrowLeft,
  Briefcase, Building2, Map, ShieldCheck
} from 'lucide-react';
import { Box, Flex, Text, Button, Grid, Separator } from '../flow';
import { MOCK_ARTWORKS } from '../constants';
import toast from 'react-hot-toast';

interface SpatialZone {
  id: string;
  name: string;
  description: string;
  artworkIds: string[];
}

export const ProjectWorkspace: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [zones, setZones] = useState<SpatialZone[]>([
    { id: 'z1', name: 'Main Lobby', description: 'High-traffic entrance area. Requires large-scale anchors.', artworkIds: [] },
    { id: 'z2', name: 'Executive Suite', description: 'Restrained, sophisticated palette for focused work.', artworkIds: [] }
  ]);
  const [activeZoneId, setActiveZoneId] = useState('z1');

  const addZone = () => {
    const newZone = { 
      id: `z-${Date.now()}`, 
      name: 'New Spatial Zone', 
      description: 'Define the aesthetic intent for this area...', 
      artworkIds: [] 
    };
    setZones([...zones, newZone]);
    setActiveZoneId(newZone.id);
  };

  const addArtToZone = (artId: string) => {
    setZones(zones.map(z => 
      z.id === activeZoneId ? { ...z, artworkIds: Array.from(new Set([...z.artworkIds, artId])) } : z
    ));
    toast.success('Asset Linked to Zone');
  };

  const activeZone = zones.find(z => z.id === activeZoneId);

  return (
    <div className="max-w-[1800px] mx-auto px-6 py-32 animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 border-b border-gray-100 pb-12">
        <div>
          <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black mb-6 flex items-center gap-2 group transition-colors">
            <ArrowLeft size={14} /> Back to Hub
          </button>
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-blue-50 text-blue-500 border border-blue-100">
                <Briefcase size={24} />
             </div>
             <h1 className="text-7xl font-serif font-bold italic tracking-tighter">Scheme Architect.</h1>
          </div>
          <p className="text-gray-400 text-xl font-light">Architecting <span className="text-black font-medium">commercial art portfolios</span> for enterprise scale.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-5 border border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">Export PDF Spec</button>
          <Button onClick={() => toast.success('Collective Acquisition Triggered')} size="lg">Bulk Acquisition</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Spatial Zones Sidebar */}
        <aside className="lg:col-span-3 space-y-4">
          <Flex justify="between" align="center" mb={6}>
             <Text variant="label" color="#999">Spatial Zones</Text>
             <button onClick={addZone} className="p-2 hover:bg-gray-100 rounded-sm transition-colors text-blue-600"><FolderPlus size={18}/></button>
          </Flex>
          {zones.map(zone => (
            <button
              key={zone.id}
              onClick={() => setActiveZoneId(zone.id)}
              className={`w-full p-8 text-left border transition-all flex flex-col gap-4 group ${
                activeZoneId === zone.id ? 'bg-black border-black text-white shadow-2xl' : 'bg-white border-gray-100 text-gray-400 hover:border-black'
              }`}
            >
              <Flex justify="between" width="100%">
                 <Building2 size={18} className={activeZoneId === zone.id ? 'text-blue-400' : 'text-gray-200'} />
                 <Text size={10} font="mono" weight="bold">{zone.artworkIds.length} ASSETS</Text>
              </Flex>
              <div>
                 <p className="font-bold text-xs uppercase tracking-widest leading-none mb-1">{zone.name}</p>
                 <p className={`text-[10px] line-clamp-2 leading-relaxed ${activeZoneId === zone.id ? 'text-gray-400' : 'text-gray-300'}`}>{zone.description}</p>
              </div>
            </button>
          ))}
        </aside>

        {/* Workspace Central Stage */}
        <main className="lg:col-span-6 space-y-12">
           <Box bg="#F8F8F8" p={10} border="1px solid #E5E5E5" minHeight="600px">
              <Flex justify="between" align="start" mb={12}>
                 <Box>
                    <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                       <Target size={12} /> Active Zone Analysis
                    </div>
                    <h2 className="text-4xl font-serif font-bold italic">{activeZone?.name}</h2>
                 </Box>
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">
                    <Brain size={14} /> Neural Fill
                 </button>
              </Flex>

              {activeZone?.artworkIds.length === 0 ? (
                <Flex direction="column" align="center" justify="center" height="400px" border="2px dashed #DDD" className="text-center p-20">
                   <Layout size={48} className="text-gray-200 mb-6" />
                   <p className="text-xl font-serif italic text-gray-400">Zone Empty.</p>
                   <p className="text-xs text-gray-300 mt-2">Select assets from the studio feed to architect this space.</p>
                </Flex>
              ) : (
                <Grid cols={2} gap={4}>
                   {activeZone?.artworkIds.map(id => {
                     const art = MOCK_ARTWORKS.find(a => a.id === id);
                     if (!art) return null;
                     return (
                       <Box key={id} bg="white" p={4} border="1px solid #EEE" className="group">
                          <img src={art.imageUrl} className="w-full aspect-video object-cover mb-4 grayscale group-hover:grayscale-0 transition-all" />
                          <Flex justify="between" align="center">
                             <Box>
                                <Text weight="bold" size={13} className="block">{art.title}</Text>
                                <Text size={11} color="#999">{art.dimensions.width} x {art.dimensions.height} {art.dimensions.unit}</Text>
                             </Box>
                             <button onClick={() => setZones(zones.map(z => z.id === activeZoneId ? {...z, artworkIds: z.artworkIds.filter(aid => aid !== id)} : z))} className="text-gray-200 hover:text-red-500 transition-colors">
                                <Trash2 size={14} />
                             </button>
                          </Flex>
                       </Box>
                     )
                   })}
                </Grid>
              )}
           </Box>
        </main>

        {/* Global Asset Index (The "Pick List") */}
        <aside className="lg:col-span-3 border-l border-gray-100 pl-12">
           <Flex align="center" gap={3} mb={10}>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <Text variant="label" color="#000">Studio Index</Text>
           </Flex>
           <div className="relative mb-8">
              <input type="text" placeholder="Filter by Style..." className="w-full bg-gray-50 border-none px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-black" />
           </div>
           <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
              {MOCK_ARTWORKS.map(art => (
                <div key={art.id} className="group cursor-pointer flex gap-4 items-center">
                   <div className="w-16 h-16 bg-gray-100 overflow-hidden shrink-0">
                      <img src={art.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <Text weight="bold" size={12} className="block truncate">{art.title}</Text>
                      <Text size={10} color="#999">${art.price.toLocaleString()}</Text>
                   </div>
                   <button onClick={() => addArtToZone(art.id)} className="p-2 border border-gray-100 hover:border-black transition-colors opacity-0 group-hover:opacity-100">
                      <Plus size={14} />
                   </button>
                </div>
              ))}
           </div>
        </aside>
      </div>
    </div>
  );
};
