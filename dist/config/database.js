"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
// src/config/database.ts
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
// Loading environment variables from .env file
dotenv_1.default.config();
//Database class to handle the connection and interaction with the database//
class Database {
    //Constructor initializes the Sequelize instance with database configuration from environment variables//
    constructor() {
        this.sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, // Database name
        process.env.DB_USER, // Database user
        process.env.DB_PASSWORD, // Database password
        {
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT,
            port: Number(process.env.DB_PORT), // Database port
        });
    }
    // Method to authenticate and connect to the database
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Try to authenticate the connection
                yield this.sequelize.authenticate();
                console.log('Connection has been established successfully.');
                // Sync models with the database (force: false ensures existing data is not dropped)
                yield this.sequelize.sync({ force: false });
            }
            catch (error) {
                // Log any errors during the connection process
                console.error('Unable to connect to the database:', error);
            }
        });
    }
    // Getter for the Sequelize instance.
    getInstance() {
        return this.sequelize;
    }
}
// Instantiate the Database class
const database = new Database();
exports.database = database;
