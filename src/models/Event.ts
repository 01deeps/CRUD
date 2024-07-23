// src/models/Event.ts
import { Model, DataTypes } from 'sequelize';
import { database } from '../config/database';

// Define the Event model class
class Event extends Model {
  // Model attributes with TypeScript type definitions
  public id!: number;
  public event_name!: string;
  public date!: Date;
  public description!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Event model with its attributes and options
Event.init(
  {
    // Unique identifier for the event, auto-incremented
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Name of the event
    event_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Date of the event
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // Description of the event
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    // Sequelize instance
    sequelize: database.getInstance(),
    // Table name in the database
    tableName: 'events',
  }
);

export default Event;
