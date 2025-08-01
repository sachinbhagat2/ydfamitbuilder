# 🐘 Neon Database Setup Guide

This guide will help you set up Neon PostgreSQL database for the Youth Dreamers Foundation application.

## 🚀 Quick Setup Steps

### 1. Create Neon Account & Database

1. Go to [Neon Console](https://console.neon.tech)
2. Sign up/login with your GitHub or Google account
3. Create a new project named "youth-dreamers-foundation"
4. Note down your connection string

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Copy from .env.example
cp .env.example .env
```

Update `.env` with your Neon connection string:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"
JWT_EXPIRES_IN="7d"
BCRYPT_ROUNDS="12"

# Application
NODE_ENV="development"
PORT="3000"
FRONTEND_URL="http://localhost:5173"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Generate & Run Database Migrations

```bash
# Generate migration files
npm run db:generate

# Push schema to Neon database
npm run db:migrate
```

### 5. Start Development Servers

Open two terminals:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend API:**
```bash
npm run dev:server
```

### 6. Test Database Connection

Visit: `http://localhost:3000/api/db-test`

Should return:
```json
{
  "success": true,
  "message": "Database connection successful",
  "data": {...}
}
```

## 📊 Database Schema Overview

Your Neon database will have these tables:

- **`users`** - All users (students, admins, reviewers, donors)
- **`scholarships`** - Scholarship schemes and programs
- **`applications`** - Student scholarship applications
- **`reviews`** - Application reviews and evaluations
- **`notifications`** - In-app notifications
- **`documents`** - File uploads and document management
- **`announcements`** - System announcements
- **`contributions`** - Donor contributions and payments
- **`settings`** - Application configuration

## 🔧 Development Commands

```bash
# Start backend server
npm run dev:server

# View database in Drizzle Studio
npm run db:studio

# Generate new migrations after schema changes
npm run db:generate

# Push schema changes to database
npm run db:migrate
```

## 🌐 API Endpoints

Once running, your API will be available at:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Scholarships
- `GET /api/scholarships` - List scholarships
- `GET /api/scholarships/:id` - Get scholarship details
- `POST /api/scholarships` - Create scholarship (admin)
- `PUT /api/scholarships/:id` - Update scholarship (admin)

## 🚀 Next Steps

1. **Test Authentication**: Register a user through the frontend
2. **Create Scholarships**: Use admin account to create test scholarships
3. **Add More Endpoints**: Applications, notifications, etc.
4. **File Upload**: Set up document upload functionality
5. **Email Integration**: Configure SMTP for notifications

## 🛠️ Production Deployment

For production on Digital Ocean:

1. Set production environment variables
2. Use `npm run build:production`
3. Start with `npm start`
4. Configure Nginx reverse proxy
5. Set up SSL certificates

## 📞 Support

If you encounter any issues:

1. Check Neon console for connection status
2. Verify environment variables are correct
3. Ensure all dependencies are installed
4. Check server logs for detailed error messages

---

**Your Youth Dreamers Foundation application is now connected to a professional PostgreSQL database! 🎉**
