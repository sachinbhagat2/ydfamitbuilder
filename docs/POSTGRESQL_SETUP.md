# 🐘 PostgreSQL Setup Guide

This guide will help you set up PostgreSQL database for the Youth Dreamers Foundation application.

## 🚀 Setup Options

### Option 1: Local PostgreSQL Installation

#### Windows
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Install with default settings
3. Remember the password you set for the `postgres` user
4. PostgreSQL will run on port 5432 by default

#### macOS
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb youth_dreamers_foundation
```

#### Ubuntu/Linux
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user and create database
sudo -u postgres psql
CREATE DATABASE youth_dreamers_foundation;
CREATE USER ydf_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE youth_dreamers_foundation TO ydf_user;
\q
```

### Option 2: Cloud PostgreSQL (Recommended for Production)

#### Popular Cloud Options:
- **AWS RDS PostgreSQL**
- **Google Cloud SQL PostgreSQL** 
- **DigitalOcean Managed Databases**
- **Heroku Postgres**
- **Railway PostgreSQL**
- **Supabase** (PostgreSQL with additional features)

## 🔧 Configuration

### 1. Create Environment File

Create `.env` file in your project root:

```bash
# Copy from example
cp .env.example .env
```

### 2. Update Database URL

**Local PostgreSQL:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/youth_dreamers_foundation"
```

**Cloud PostgreSQL (example):**
```env
DATABASE_URL="postgresql://user:pass@hostname:5432/dbname?sslmode=require"
```

**Full .env example:**
```env
# Database Configuration
DATABASE_URL="postgresql://ydf_user:secure_password@localhost:5432/youth_dreamers_foundation"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-make-it-long-and-random-123456789"
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

### 4. Setup Database Schema

```bash
# Generate migration files
npm run db:generate

# Apply migrations to database
npm run db:migrate
```

### 5. Start Development Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:server
```

### 6. Verify Setup

Visit `http://localhost:3000/api/db-test` - should return:
```json
{
  "success": true,
  "message": "Database connection successful"
}
```

## 📊 Database Management

### Useful Commands

```bash
# View database in Drizzle Studio
npm run db:studio

# Connect to PostgreSQL directly
psql "postgresql://username:password@localhost:5432/youth_dreamers_foundation"

# Backup database
pg_dump youth_dreamers_foundation > backup.sql

# Restore database
psql youth_dreamers_foundation < backup.sql
```

### Database Schema

Your PostgreSQL database will have these tables:
- **users** - All user accounts (students, admins, reviewers, donors)
- **scholarships** - Scholarship programs and schemes
- **applications** - Student applications
- **reviews** - Application evaluations
- **notifications** - System notifications
- **documents** - File uploads
- **announcements** - System announcements
- **contributions** - Donor contributions
- **settings** - Application configuration

## 🌐 Cloud PostgreSQL Examples

### DigitalOcean Managed Database
1. Create Managed Database in DigitalOcean
2. Select PostgreSQL
3. Choose region and plan
4. Get connection string from dashboard

### AWS RDS PostgreSQL
1. Go to AWS RDS Console
2. Create Database → PostgreSQL
3. Configure settings and security groups
4. Get endpoint URL for connection string

### Railway PostgreSQL
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL service
4. Copy DATABASE_URL from variables tab

## 🔒 Security Best Practices

1. **Strong Passwords**: Use complex passwords for database users
2. **SSL/TLS**: Always use SSL for remote connections
3. **Firewall**: Restrict database access to your application servers
4. **Regular Backups**: Set up automated backups
5. **User Permissions**: Create specific users with minimal required permissions

## 🚀 Production Deployment

For production on Digital Ocean:

1. **Database**: Use DigitalOcean Managed PostgreSQL
2. **Application**: Deploy on DigitalOcean Droplet
3. **Environment**: Set production environment variables
4. **SSL**: Configure SSL certificates
5. **Backups**: Enable automated backups

## 📞 Troubleshooting

### Common Issues:

**Connection Refused:**
- Check if PostgreSQL is running: `sudo systemctl status postgresql`
- Verify port and host in connection string

**Authentication Failed:**
- Check username and password
- Verify user has database permissions

**SSL Required:**
- Add `?sslmode=require` to connection string for cloud databases

**Migration Errors:**
- Ensure database exists and user has permissions
- Check for syntax errors in schema files

---

**Your Youth Dreamers Foundation app is now ready with PostgreSQL! 🎉**
