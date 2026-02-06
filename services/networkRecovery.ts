
import { toast } from 'react-hot-toast';

class NetworkRecoveryService {
  async executeWithRetry<T>(op: () => Promise<T>, id: string) {
    try {
      return await op();
    } catch (e) {
      toast.error('Network flicker detected. Syncing...');
      throw e;
    }
  }
}

export const networkRecovery = new NetworkRecoveryService();
