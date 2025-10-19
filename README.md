# Order Management System (OMS)

A full-stack order management system built with Node.js, Express, PostgreSQL, React, and TypeScript. This application implements a complete CRUD interface with pagination for managing customer orders.

## Challenge Requirements

This project fulfills the Full Stack Engineer Challenge requirements:

### Backend Requirements ✅

- **POST /orders** – Create a new order
- **GET /orders/{id}** – Retrieve order details by ID
- **PUT /orders/{id}** – Update an order
- **DELETE /orders/{id}** – Delete an order (soft delete)
- **GET /orders** – Retrieve paginated list of orders with `page` and `page_size` parameters
- **Order Structure**: All orders include `id` (UUID), `customer_name`, `item`, `quantity`, `status` (pending/completed/cancelled), and `created_at` timestamp
- **Technology**: Node.js with TypeScript, Express.js, PostgreSQL database, fully typed interfaces and models

### Frontend Requirements ✅

- **Order List View**: Paginated table displaying Order ID, Customer Name, Item, Quantity, and Status
- **Pagination Controls**: First, Previous, Next, and Last page navigation
- **Order Details**: Click any order to view detailed information
- **Create/Edit Order**: Form with Customer Name, Item, Quantity inputs and Status dropdown
- **Delete Order**: Delete functionality with confirmation dialog
- **Error & Loading States**: Proper handling of API loading, success, and error states
- **Technology**: React with TypeScript, type-safe axios client, fully typed components and data models

## Demo Video

Watch a complete demonstration of the Order Management System:

[![Watch the video](dashboard.png)](https://drive.google.com/file/d/1vUFiov3_z5rYCLbqhSdwFlKPJeccXCs3/view?usp=sharing)

_or_

[![Demo Video](https://img.shields.io/badge/▶️_Watch_Demo-4285F4?style=for-the-badge&logo=google-drive&logoColor=white)](https://drive.google.com/file/d/1vUFiov3_z5rYCLbqhSdwFlKPJeccXCs3/view?usp=sharing)

_Click the badge above to watch the full demo video on Google Drive_

## Tech Stack

### Backend

- **Node.js** with **Express** - REST API server
- **TypeScript** - Type-safe development
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for database operations
- **Zod** - Schema validation
- **dotenv** - Environment configuration

### Frontend

- **React** with **TypeScript** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first styling
- **Zod** - Form validation

### DevOps & Deployment

- **Docker** - Containerization for easy development and deployment
- **Docker Compose** - Multi-service orchestration
- **Nginx** - Production web server for frontend

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v7 or higher)
- **PostgreSQL** (v12 or higher)

## Database Setup

### 1. Install PostgreSQL

If you don't have PostgreSQL installed:

**macOS (using Homebrew):**

```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Create the Database

Open a PostgreSQL terminal:

```bash
psql postgres
```

Create the database and user:

```sql
CREATE DATABASE fs_oms;
CREATE USER fs_oms WITH PASSWORD 'fs_oms';
GRANT ALL PRIVILEGES ON DATABASE fs_oms TO fs_oms;
\q
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env  # if you have an example file, or create manually
```

Add the following to your `.env` file:

```env
DATABASE_URL=postgres://fs_oms:fs_oms@localhost:5432/fs_oms
PORT=3000
NODE_ENV=development
```

### 4. Run Migrations

Migrations create the database tables:

```bash
cd backend
npm run db:migrate
```

### 5. Seed the Database (Optional)

To populate the database with sample orders:

```bash
npm run db:seed
```

## Installation

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Ensure your `.env` file is configured (see Database Setup above)

4. Run database migrations:

```bash
npm run db:migrate
```

5. (Optional) Seed sample data:

```bash
npm run db:seed
```

6. Start the development server:

```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. (Optional) Create a `.env` file if you need to change the API URL:

```env
REACT_APP_API_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm start
```

The frontend will be available at `http://localhost:3001` (or another port if 3001 is busy)

## Running the Application

### Option 1: Docker (Recommended)

```bash
# Start all services with Docker
docker-compose up -d

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:3000
```

### Option 2: Manual Setup

1. Ensure PostgreSQL is running
2. Start the backend: `cd backend && npm run dev`
3. Start the frontend: `cd frontend && npm start`
4. Open your browser to `http://localhost:3001`

### Response Format (GET /orders)

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "customerName": "John Doe",
      "item": "Widget",
      "quantity": 5,
      "status": "pending",
      "createdAt": "2025-10-16T12:00:00Z",
      "updatedAt": "2025-10-16T12:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "page_size": 10,
  "total_pending": 30,
  "total_completed": 50,
  "total_cancelled": 20
}
```

### Response Format (GET /orders/:id, POST /orders, PUT /orders/:id)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "customerName": "John Doe",
  "item": "Widget",
  "quantity": 5,
  "status": "pending",
  "createdAt": "2025-10-16T12:00:00Z",
  "updatedAt": "2025-10-16T12:00:00Z"
}
```

## Project Structure

```
fs_oms/
├── backend/
│   ├── config/              # Database configuration
│   ├── migrations/          # Database migrations
│   ├── seeders/             # Database seeders
│   ├── src/
│   │   ├── db/              # Database connection
│   │   ├── middlewares/     # Express middlewares
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── validation/      # Zod schemas
│   │   └── server.ts        # Entry point
│   ├── Dockerfile           # Production Docker image
│   ├── Dockerfile.dev       # Development Docker image
│   ├── .dockerignore        # Docker ignore file
│   ├── init-db.sql          # Database initialization
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── api/             # API client and endpoints
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main app component
│   │   └── index.tsx        # Entry point
│   ├── Dockerfile           # Production Docker image (nginx)
│   ├── Dockerfile.dev       # Development Docker image
│   ├── nginx.conf           # Nginx configuration
│   ├── .dockerignore        # Docker ignore file
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml       # Multi-service Docker setup
└── README.md
```

## Database Commands

Useful commands for database management:

```bash
# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Undo all migrations
npm run db:undo

# Reset database (undo, migrate, seed)
npm run db:reset
```

## Development

### Backend Development

The backend uses `ts-node-dev` for hot reloading during development:

```bash
cd backend
npm run dev
```

### Frontend Development

The frontend uses Create React App with hot reloading:

```bash
cd frontend
npm start
```

## Docker Setup

### Prerequisites for Docker

- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)

### Quick Start with Docker

**Prerequisites**: Docker and Docker Compose installed

```bash
# 1. Clone and enter directory
git clone <repository-url>
cd fs_oms

# 2. Start everything with one command
docker-compose up -d

# 3. Wait for services to start (30-60 seconds)
docker-compose logs -f

# 4. Open your browser to http://localhost
```

**That's it!** The application should be running with sample data.

#### Verify Everything is Working

```bash
# Run the validation script to ensure everything works
bash test-docker.sh
```

This script tests all services and confirms the setup is working correctly.

The application will be available at:

- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432

### Development with Docker

For development with hot reload:

```bash
# Start development environment
docker-compose --profile dev up -d

# View logs
docker-compose --profile dev logs -f

# Stop development environment
docker-compose --profile dev down
```

Development URLs:

- **Frontend**: http://localhost:3001 (with hot reload)
- **Backend API**: http://localhost:3000 (with hot reload)

### Docker Commands

```bash
# Build images
docker-compose build

# Start services in background
docker-compose up -d

# View running containers
docker-compose ps

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend

# Stop all services
docker-compose down

# Remove volumes (deletes database data)
docker-compose down -v

# Rebuild and restart
docker-compose up --build -d
```

### Docker Services

The docker-compose setup includes:

- **postgres**: PostgreSQL 15 database with persistent storage
- **backend**: Node.js/Express API server
- **frontend**: React app served with nginx
- **backend-dev**: Development backend with hot reload (dev profile)
- **frontend-dev**: Development frontend with hot reload (dev profile)

### Environment Variables for Docker

The docker-compose.yml uses these default values:

- Database: `oms_db`
- User: `oms_user`
- Password: `oms_secure_password`

To customize, create a `.env` file in the root directory:

```env
POSTGRES_DB=oms_db
POSTGRES_USER=oms_user
POSTGRES_PASSWORD=your_custom_password
```

### Docker Troubleshooting

**Port conflicts:**

```bash
# Check what's using the ports
lsof -i :3000
lsof -i :80

# Stop conflicting services or change ports in docker-compose.yml
```

**Database connection issues:**

```bash
# Check postgres logs
docker-compose logs postgres

# Connect to database directly
docker-compose exec postgres psql -U oms_user -d oms_db
```

**Reset everything:**

```bash
# Stop and remove everything including volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up --build -d
```

## Building for Production

### Manual Build

The production build will be in the `frontend/build` directory.

### Docker Production Build

Use the default docker-compose.yml for production-ready containers with optimized nginx serving.

## Troubleshooting

### Database Connection Issues

1. Verify PostgreSQL is running: `pg_isready`
2. Check your `.env` file has the correct `DATABASE_URL`
3. Ensure the database user has proper permissions
4. Test the connection: `psql -U fs_oms -d fs_oms`

### Port Already in Use

If port 3000 or 3001 is already in use:

**Backend**: Change `PORT` in `backend/.env`

**Frontend**: The app will prompt you to use a different port, or set `PORT=3002` before running `npm start`

### Migration Errors

If migrations fail, try resetting the database:

```bash
npm run db:reset
```
