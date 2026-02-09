import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, ResponsiveContainer 
} from 'recharts';
// Fix: Alias Activity as PulseIcon to match usage in the component
import { Brain, Target, Activity as PulseIcon, Zap, TrendingUp } from 'lucide-react';
import { Box, Flex, Text } from '../flow';

interface DiscoveryVector {
  subject: string;
  A: number;
  fullMark: number;
}

interface DiscoveryMapProps {
  vectors?: DiscoveryVector[];
}

export const CollectorDiscoveryMap: React.FC<DiscoveryMapProps> = ({ vectors }) => {
  const chartData = vectors || [
    { subject: 'Minimalism', A: 88, fullMark: 100 },
    { subject: 'Abstraction', A: 72, fullMark: 100 },
    { subject: 'Cyber-Realism', A: 45, fullMark: 100 },
    { subject: 'Brutalism', A: 30, fullMark: 100 },
    { subject: 'Impressionism', A: 65, fullMark: 100 },
    { subject: 'Pop Art', A: 20, fullMark: 100 },
  ];

  return (
    <Box bg="white" border="1px solid #E5E5E5" p={8} borderRadius="2px" position="relative" overflow="hidden" className="group shadow-sm hover:shadow-xl transition-all duration-700">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/40 rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      
      <Flex justify="between" align="start" mb={10}>
         <Box>
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2">
               <Target size={14} /> Creative Signature
            </div>
            <Text variant="h2" className="text-3xl font-serif font-bold italic leading-none">Discovery Map.</Text>
         </Box>
         <Box textAlign="right">
            <span className="text-[10px] font-mono font-bold text-green-600 bg-green-50 px-2 py-1 uppercase">Synced</span>
         </Box>
      </Flex>

      <Box height="300px" width="100%" mb={8}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#f0f0f0" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#999', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }} 
            />
            <Radar
              name="Taste Discovery"
              dataKey="A"
              stroke="#000"
              strokeWidth={2}
              fill="#1023D7"
              fillOpacity={0.15}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Box>

      <div className="space-y-6 pt-8 border-t border-gray-100">
         <section className="space-y-4">
            <Flex align="center" gap={3}>
               <TrendingUp size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-black">Aesthetic Trajectory</span>
            </Flex>
            <p className="text-sm text-gray-500 font-light italic leading-relaxed">
              Your profile is currently <span className="text-black font-bold">pivoting 14% toward Brutalist geometry</span> based on recent inspections.
            </p>
         </section>

         <Box bg="#F8F8F8" p={4} borderLeft="4px solid #000">
            <Flex align="center" gap={2} mb={1}>
               <Zap size={12} className="text-blue-500" />
               <Text weight="bold" size={10} tracking="0.1em">STRATEGIC SEGMENT</Text>
            </Flex>
            <Text size={12} color="#666">Focus category: <span className="text-black font-bold">Monochrome Oils ($5k-$8k)</span></Text>
         </Box>
      </div>

      <div className="mt-8 flex items-center justify-between">
         <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-gray-300 animate-pulse">
            <PulseIcon size={10} /> Syncing Activity Loops
         </div>
         <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 border-b border-blue-200 pb-0.5 hover:border-blue-600 transition-all">
            Recalibrate Manually
         </button>
      </div>
    </Box>
  );
};