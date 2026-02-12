
// Professional logging service for ArtFlow Frontier
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  userId?: string
  sessionId?: string
  component?: string
  action?: string
  error?: Error
}

class Logger {
  private level: LogLevel = LogLevel.INFO;
  private sessionId: string = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: any, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, { ...context, error: error?.message || error, stack: error?.stack });
  }

  authEvent(event: string, userId?: string, context?: Record<string, unknown>): void {
    this.info(`Identity Signal: ${event}`, { ...context, userId, component: 'auth-layer' });
  }

  stressTestEvent(label: string, status: string, latency?: number): void {
    this.info(`Stress Diagnostic: ${label}`, { status, latency, component: 'health-monitor' });
  }

  searchEvent(query: string, resultsCount: number, filters?: Record<string, unknown>): void {
    this.info('Taste Search Execution', { query, resultsCount, filters, component: 'neural-search' });
  }

  artworkInteraction(action: string, artworkId: string, context?: Record<string, unknown>): void {
    this.info(`Asset Interaction: ${action}`, { ...context, artworkId, component: 'engagement-loop' });
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    if (level < this.level) return;
    const entry = {
      timestamp: new Date().toISOString(),
      level: LogLevel[level],
      sessionId: this.sessionId,
      message,
      ...context
    };
    
    const prefix = `[${entry.timestamp.split('T')[1].split('.')[0]}] [${entry.level}]`;
    if (level >= LogLevel.ERROR) {
      console.error(prefix, message, context);
    } else {
      console.log(prefix, message, context);
    }
  }
}

export const logger = new Logger();
