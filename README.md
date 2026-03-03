# Flight Booking System

This project consists of three backend services and one frontend client application.

## Project Structure

- Backends:
  - Server
  - BookingServer
  - AuthServer
- Frontend:
  - Client

## Prerequisites

- Node.js and Yarn
- MySQL database system

## Setup Instructions

### 1. Environment Setup

Create `.env` files from `.env.example` in all folders.

### 2. Database Setup

Create three databases in your SQL system:

- FLIGHTS_BOOKING_DB
- Flights_Search_DB
- AUTH_DB

### 3. Backend Setup

For each backend (server, bookingserver, authserver):

```bash
cd <backend-folder>
yarn build
```
This will install packages and run migrations to create tables in the databases.

In server run below command to add flights.

```bash
npx sequelize-cli db:seed:all --seeders-path src/seeders --config src/config/config.js
```

### 4. Frontend Setup

Set up the client:

```bash
cd client
yarn install
```

### 5. Starting the Application

To start all backends and the client, run the following command in each folder:

```bash
yarn start
```

The application will be available at `http://localhost:3000`.

## Docker Development Mode

1. Create `.env` files from `.env.example` in all folders (if not done already).

2. Run the following command to start all services:

```bash
docker-compose up --build
```

This will build and start all the required containers for the application.

## Accessing the Application

Once everything is set up and running, you can access the application at:

`http://localhost:3000`

