
import React from 'react';
import { 
  FileText, ShieldCheck, TrendingUp, Download, 
  ArrowLeft, BadgeAlert, History, Activity, 
  PieChart, FileSearch, HardDrive
} from 'lucide-react';
import { Box, Flex, Text, Button, Grid, Separator } from '../flow';
import { MOCK_ARTWORKS } from '../constants';

export const CollectionAudit: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const stats = [
    { label: 'Insured Value', value: '$428,500', icon: ShieldCheck, status: 'Secured' },
    { label: 'Market Liquidity', value: 'High', icon: TrendingUp, status: 'Optimal' },
    { label: 'Last Appraisal', value: '12d ago', icon: History, status: 'Current' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 border-b border-gray-100 pb-12">
        <div>
          <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black mb-6 flex items-center gap-2 group transition-colors">
            <ArrowLeft size={14} /> Return to Hub
          </button>
          <h1 className="text-7xl font-serif font-bold italic tracking-tighter">Vault Audit.</h1>
          <p className="text-gray-400 text-xl font-light">End-to-end ledger of <span className="text-black font-medium">acquisition provenance</span> and financial health.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-5 bg-gray-50 border border-gray-200 text-[10px] font-black uppercase tracking-widest hover:border-black transition-all flex items-center gap-2">
            <Download size={16} /> Export Ledger
          </button>
          <Button size="lg">Generate Dossier</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {stats.map(s => (
          <Box key={s.label} p={10} border="1px solid #E5E5E5" borderRadius="2px" className="group hover:border-black transition-all">
             <Flex justify="between" mb={8}>
                <s.icon size={24} className="text-gray-200 group-hover:text-blue-600 transition-colors" />
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1">
                   <Activity size={10} /> {s.status}
                </span>
             </Flex>
             <Text variant="label" color="#999" className="block mb-2">{s.label}</Text>
             <Text size={48} weight="bold" tracking="-0.03em" font="serif" italic>{s.value}</Text>
          </Box>
        ))}
      </div>

      <Box border="1px solid #E5E5E5" borderRadius="2px" overflow="hidden">
         <div className="bg-gray-50 p-8 border-b border-gray-200 flex justify-between items-center">
            <Text variant="label" color="#000">Asset Inventory Health</Text>
            <Flex gap={4}>
               <button className="text-[10px] font-bold uppercase text-gray-400 hover:text-black">All Assets</button>
               <button className="text-[10px] font-bold uppercase text-gray-400 hover:text-black">Critical Focus</button>
            </Flex>
         </div>
         <div className="divide-y divide-gray-100">
            {MOCK_ARTWORKS.map(art => (
              <div key={art.id} className="p-8 flex items-center gap-12 group hover:bg-gray-50/50 transition-all">
                 <div className="w-20 h-20 bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                    <img src={art.imageUrl} className="w-full h-full object-cover grayscale" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <Text weight="bold" size={16} className="block truncate mb-1">{art.title}</Text>
                    <Text size={12} color="#999" className="block font-mono uppercase tracking-widest">{art.artist} • SKU-{art.id.slice(0, 5)}</Text>
                 </div>
                 <div className="hidden md:block">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Status</p>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-tighter border border-blue-100">Vaulted</span>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Evaluation</p>
                    <p className="text-xl font-bold font-serif italic">${(art.price * 1.15).toLocaleString()}</p>
                 </div>
                 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="p-3 border border-gray-100 hover:border-black"><FileSearch size={16}/></button>
                    <button className="p-3 border border-gray-100 hover:border-black"><HardDrive size={16}/></button>
                 </div>
              </div>
            ))}
         </div>
      </Box>
    </div>
  );
};
