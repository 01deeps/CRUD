// // src/config/logger.ts
// import { createLogger, format, transports } from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';  // Correct way to import DailyRotateFile

// const logFormat = format.combine(
//   format.timestamp(),
//   format.printf(({ timestamp, level, message, ...meta }) => {
//     return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
//   })
// );

// const logger = createLogger({
//   format: logFormat,
//   transports: [
//     new transports.Console(),
//     new DailyRotateFile({
//       filename: 'logs/application-%DATE%.log',
//       datePattern: 'YYYY-MM-DD',
//       maxSize: '20m',
//       maxFiles: '1d',
//       zippedArchive: true  // Enable file compression
//     })
//   ],
//   exitOnError: false
// });

// export default logger;
