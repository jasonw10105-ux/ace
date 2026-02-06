
import { useEffect, useCallback } from 'react';
import { learningLoops } from '../services/learningLoops';
import { logger } from '../services/logger';

export const useNeuralSync = (userId?: string) => {
  const recordInteraction = useCallback((
    type: 'view' | 'like' | 'inquiry' | 'purchase',
    entityId: string,
    metadata?: any
  ) => {
    if (!userId) return;

    learningLoops.recordSignal({
      userId,
      signalType: type === 'like' ? 'like' : type,
      entityType: 'artwork',
      entityId,
      timestamp: new Date().toISOString(),
      metadata
    });

    logger.artworkInteraction(type, entityId, metadata);
  }, [userId]);

  return { recordInteraction };
};
