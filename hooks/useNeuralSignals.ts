
import { useEffect, useRef } from 'react';
import { learningLoops } from '../services/learningLoops';
import { contextualBandit } from '../services/contextualBandit';

interface SignalConfig {
  artworkId: string;
  userId?: string;
}

export const useNeuralSignals = ({ artworkId, userId }: SignalConfig) => {
  const startTime = useRef<number>(Date.now());
  const maxScroll = useRef<number>(0);
  const dwellThresholds = useRef<Set<number>>(new Set([5000, 15000, 30000, 60000])); // ms

  useEffect(() => {
    if (!userId) return;

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > maxScroll.current) {
        maxScroll.current = scrollPercent;
      }
    };

    const dwellInterval = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      dwellThresholds.current.forEach(threshold => {
        if (elapsed >= threshold) {
          learningLoops.recordSignal({
            userId,
            signalType: 'view',
            entityType: 'artwork',
            entityId: artworkId,
            timestamp: new Date().toISOString(),
            metadata: { dwellTime: threshold, scrollDepth: maxScroll.current, intensity: 'high' }
          });
          dwellThresholds.current.delete(threshold);
          console.debug(`Neural threshold reached: ${threshold}ms on ${artworkId}`);
        }
      });
    }, 1000);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(dwellInterval);
      
      // Record final exit signal
      const finalDwell = Date.now() - startTime.current;
      if (finalDwell > 2000) { // Only log meaningful visits
        learningLoops.recordSignal({
          userId,
          signalType: 'view',
          entityType: 'artwork',
          entityId: artworkId,
          timestamp: new Date().toISOString(),
          metadata: { 
            totalDwell: finalDwell, 
            finalScrollDepth: maxScroll.current,
            isDeepEngagement: maxScroll.current > 70 && finalDwell > 20000
          }
        });
      }
    };
  }, [artworkId, userId]);
};
