type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private createLogEntry(level: LogLevel, message: string, details?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      details,
    };
  }

  private log(entry: LogEntry): void {
    this.logs.push(entry);
    console[entry.level](
      `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`,
      entry.details || ''
    );
  }

  info(message: string, details?: any): void {
    this.log(this.createLogEntry('info', message, details));
  }

  warn(message: string, details?: any): void {
    this.log(this.createLogEntry('warn', message, details));
  }

  error(message: string, error?: Error | any): void {
    this.log(this.createLogEntry('error', message, {
      error: error?.message || error,
      stack: error?.stack,
    }));
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const logger = Logger.getInstance(); 