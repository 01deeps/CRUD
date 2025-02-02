﻿# Initial Commit
# Event Management Project

## Description
This project is an Event Management system built using Node.js, Express, TypeScript, and Sequelize. It includes features such as user authentication, event creation, and management.

## Features
- User authentication (register and login)
- User roles: User and Admin
- Event creation, get evnets, updating, and deletion
- API with Postman

## Technologies Used
- Node.js
- Express
- TypeScript
- Sequelize
- PostgreSQL
- JWT for authentication
- BCrypt for password hashing
- Winston for logging

## Installation

1. *Clone the repository*
    sh
    git clone https://github.com/01deeps/CRUD.git
    cd event-management
    

2. *Install dependencies*
    sh
    npm install
    

3. **Create a .env file in the root directory and add the following environment variables:**
    env
    DB_NAME=demo
    DB_USER=
    DB_PASSWORD=
    DB_PORT=5432
    PORT=3000
    DB_DIALECT=
    DB_HOST=localhost
    JWT_SECRET=
    

4. *Compile the TypeScript code*
    sh
    npm run build
    

5. *Start the development server*
    sh
    npm run dev
    

## Scripts
- build: Compiles the TypeScript code
- dev: Runs the application in development mode using nodemon
- start: Starts the application

## Usage

### API Endpoints
- *User Authentication*
  - POST /register: User register
  - POST /login: User login

- *Event Management*
  - GET /events: Get all events
  - POST /events: Create a new event
  - GET /events/:id: Get event by ID (Admin only)
  - PUT /events/:id: Update event by ID
  - DELETE /events/:id: Delete event by ID

- *User Roles
  - User (can create, update and delete own events)
  - Admin (can GET all events and also create, update and delete every events)

## Dependencies
### Dev Dependencies
- @types/bcryptjs
- @types/express
- @types/node
- nodemon
- ts-node
- typescript
- winston

### Dependencies
- bcryptjs
- express
- jsonwebtoken
- dotenv
- pg
- pg-hstore
- reflect-metadata
- routing-controllers
- sequelize
- sequelize-typescript


## License
This project is licensed under the ISC License.
