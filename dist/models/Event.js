"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Event.ts
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
// Define the Event model class
class Event extends sequelize_1.Model {
}
// Initialize the Event model with its attributes and options
Event.init({
    // Unique identifier for the event, auto-incremented
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    // Name of the event
    event_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    // Date of the event
    date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    // Description of the event
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
}, {
    // Sequelize instance
    sequelize: database_1.database.getInstance(),
    // Table name in the database
    tableName: 'events',
});
exports.default = Event;
