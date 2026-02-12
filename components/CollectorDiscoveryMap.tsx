
import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, ResponsiveContainer 
} from 'recharts';
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
    { subject: 'Contemporary', A: 45, fullMark: 100 },
    { subject: 'Expressionism', A: 30, fullMark: 100 },
    { subject: 'Realism', A: 65, fullMark: 100 },
    { subject: 'Pop Art', A: 20, fullMark: 100 },
  ];

  return (
    <Box bg="white" border="1px solid #E5E5E5" p={8} borderRadius="2px" position="relative" overflow="hidden" className="group shadow-sm hover:shadow-xl transition-all duration-700">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/40 rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      
      <Flex justify="between" align="start" mb={10}>
         <Box>
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2">
               <Target size={14} /> Style Matrix
            </div>
            <Text variant="h2" className="text-3xl font-serif font-bold italic leading-none">Your Taste Profile.</Text>
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
              name="Taste Analysis"
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
               <span className="text-[10px] font-black uppercase tracking-widest text-black">Aesthetic Shifts</span>
            </Flex>
            <p className="text-sm text-gray-400 font-light italic leading-relaxed">
              You are showing <span className="text-black font-bold">increased interest in Minimalism</span> lately. The system is surfacing more geometric works in your feed.
            </p>
         </section>
      </div>
    </Box>
  );
};
