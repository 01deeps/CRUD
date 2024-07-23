"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/logger.ts
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file")); // Correct way to import DailyRotateFile
// Define the log format combining timestamp and printf
const logFormat = winston_1.format.combine(winston_1.format.timestamp(), // Add a timestamp to each log entry
winston_1.format.printf((_a) => {
    var { timestamp, level, message } = _a, meta = __rest(_a, ["timestamp", "level", "message"]);
    return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
}) // Custom format for log output
);
// Create a logger instance with specified format and transports
const logger = (0, winston_1.createLogger)({
    format: logFormat,
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '1d',
            zippedArchive: true // Enable file compression
        })
    ],
    exitOnError: false // Prevent the logger from exiting on error
});
// Export the logger instance
exports.default = logger;
