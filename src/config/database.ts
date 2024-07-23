// src/config/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Loading environment variables from .env file
dotenv.config();

class Database {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize(
      process.env.DB_NAME as string,
      process.env.DB_USER as string,
      process.env.DB_PASSWORD as string,
      {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT as any,
        port: Number(process.env.DB_PORT),
      }
    );
  }

  // Method to authenticate and connect to the database
  public async connect(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log('Connection has been established successfully.');

      // Sync models with the database
      await this.sequelize.sync({ force: false });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  // Getter for Sequelize instance
  public getInstance(): Sequelize {
    return this.sequelize;
  }
}

const database = new Database();
export { database };
