// src/config/logger.ts
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';  // Correct way to import DailyRotateFile

// Define the log format combining timestamp and printf
const logFormat = format.combine(
  format.timestamp(),  // Add a timestamp to each log entry
  format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  })  // Custom format for log output
);

// Create a logger instance with specified format and transports
const logger = createLogger({
  format: logFormat,  // Set the log format
  transports: [
    new transports.Console(),  // Output logs to the console
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',  // Log file name pattern
      datePattern: 'YYYY-MM-DD',  // Daily log file rotation
      maxSize: '20m',  // Maximum size of a log file before rotating
      maxFiles: '1d',  // Maximum number of log files to keep
      zippedArchive: true  // Enable file compression
    })
  ],
  exitOnError: false  // Prevent the logger from exiting on error
});

// Export the logger instance
export default logger;
