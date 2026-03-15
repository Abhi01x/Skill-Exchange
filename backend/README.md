# Student Skill Exchange Platform Backend

A production-ready Node.js & Express REST API backend for a student skill exchange platform.

## Features

- **Authentication System:** JWT-based user register, login, and Email OTP verification via Nodemailer.
- **User Profiles:** Manage skills, interests, and profile details.
- **Skills System:** Create, read, and search skills by category or keywords.
- **Skill Requests:** Send, accept, or reject skill exchange requests.
- **Real-Time Chat Logic:** Database schema and REST endpoints for exchanging messages.
- **Rating System:** Rate users after completed skill exchange sessions.

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Nodemailer
- express-validator, bcrypt, cors, dotenv

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed locally or access to MongoDB Atlas
- Basic knowledge of REST APIs

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables:
   Rename `.env.example` to `.env` and configure your credentials.

3. Start the Server:

   Development mode (uses nodemon):
   ```bash
   npm run dev
   ```

   Production mode:
   ```bash
   npm start
   ```

The server will start on port `5000` (or the port defined in your `.env`).

## API Testing

A complete Postman collection (`postman_collection.json`) is included in the project directory. You can import this directly into Postman to test all endpoints.

## Folder Structure

Follows the standard MVC architecture. Check models, controllers, and routes folders for module-specific details.
