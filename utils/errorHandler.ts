
import { logger } from '../services/logger'
import toast from 'react-hot-toast'

export const handleError = (error: any, context?: string) => {
  logger.error(`Error in ${context || 'Unknown'}: ${error.message || error}`, error)
  return {
    message: error?.message || 'An unexpected neural interrupt occurred',
    code: error?.code || 'UNKNOWN_ERROR'
  }
}

export const showErrorToast = (message: string, context?: Record<string, unknown>) => {
  logger.warn('User-facing error triggered', context);
  toast.error(message);
}

export const showSuccessToast = (message: string, context?: Record<string, unknown>) => {
  logger.info('User-facing success triggered', context);
  toast.success(message);
}
