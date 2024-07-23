// src/config/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Loading environment variables from .env file
dotenv.config();

//Database class to handle the connection and interaction with the database//

class Database {
  private sequelize: Sequelize;

  //Constructor initializes the Sequelize instance with database configuration from environment variables//


  constructor() {
    this.sequelize = new Sequelize(
      process.env.DB_NAME as string, // Database name
      process.env.DB_USER as string, // Database user
      process.env.DB_PASSWORD as string, // Database password
      {
        host: process.env.DB_HOST, // Database host
        dialect: process.env.DB_DIALECT as any, // Database dialect (e.g., 'mysql', 'postgres', etc.)
        port: Number(process.env.DB_PORT), // Database port
      }
    );
  }

  
  // Method to authenticate and connect to the database
   
  public async connect(): Promise<void> {
    try {
      // Try to authenticate the connection
      await this.sequelize.authenticate();
      console.log('Connection has been established successfully.');

      // Sync models with the database (force: false ensures existing data is not dropped)
      await this.sequelize.sync({ force: false });
    } catch (error) {
      // Log any errors during the connection process
      console.error('Unable to connect to the database:', error);
    }
  }

  // Getter for the Sequelize instance.
   
  public getInstance(): Sequelize {
    return this.sequelize;
  }
}

// Instantiate the Database class
const database = new Database();

// Export the database instance
export { database };
