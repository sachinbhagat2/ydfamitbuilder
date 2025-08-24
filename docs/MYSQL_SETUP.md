# 🐬 MySQL Database Setup Guide

This guide will help you set up MySQL database for the Youth Dreamers Foundation application.

## 🚀 Setup Options

### Option 1: Local MySQL Installation

#### Windows
1. Download MySQL from [mysql.com](https://dev.mysql.com/downloads/mysql/)
2. Install MySQL Server with default settings
3. Remember the root password you set
4. MySQL will run on port 3306 by default

#### macOS
```bash
# Using Homebrew
brew install mysql
brew services start mysql

# Secure installation
mysql_secure_installation

# Create database and user
mysql -u root -p
CREATE DATABASE youth_dreamers_foundation;
CREATE USER 'ydf_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON youth_dreamers_foundation.* TO 'ydf_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Ubuntu/Linux
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure installation
sudo mysql_secure_installation

# Create database and user
sudo mysql
CREATE DATABASE youth_dreamers_foundation;
CREATE USER 'ydf_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON youth_dreamers_foundation.* TO 'ydf_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Option 2: Cloud MySQL (Recommended for Production)

#### Popular Cloud Options:
- **AWS RDS MySQL**
- **Google Cloud SQL MySQL** 
- **DigitalOcean Managed Databases**
- **PlanetScale** (MySQL-compatible with branching)
- **Railway MySQL**
- **Aiven MySQL**

## 🔧 Configuration

### 1. Create Environment File

Create `.env` file in your project root:

```bash
# Copy from example
cp .env.example .env
```

### 2. Update Database URL

**Local MySQL:**
```env
DATABASE_URL="mysql://ydf_user:secure_password@localhost:3306/youth_dreamers_foundation"
```

**Cloud MySQL (example):**
```env
DATABASE_URL="mysql://user:pass@hostname:3306/dbname?ssl={"rejectUnauthorized":true}"
```

**Full .env example:**
```env
# Database Configuration
DATABASE_URL="mysql://ydf_user:secure_password@localhost:3306/youth_dreamers_foundation"

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

Dependencies are already installed with the MySQL driver.

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

# Connect to MySQL directly
mysql -u ydf_user -p youth_dreamers_foundation

# Backup database
mysqldump -u ydf_user -p youth_dreamers_foundation > backup.sql

# Restore database
mysql -u ydf_user -p youth_dreamers_foundation < backup.sql
```

### Database Schema

Your MySQL database will have these tables:
- **users** - All user accounts (students, admins, reviewers, donors)
- **scholarships** - Scholarship programs and schemes
- **applications** - Student applications
- **reviews** - Application evaluations
- **notifications** - System notifications
- **documents** - File uploads
- **announcements** - System announcements
- **contributions** - Donor contributions
- **settings** - Application configuration

## 🌐 Cloud MySQL Examples

### PlanetScale (Recommended)
1. Go to [planetscale.com](https://planetscale.com)
2. Create new database
3. Get connection string from dashboard
4. No need for migrations - PlanetScale handles schema changes

### AWS RDS MySQL
1. Go to AWS RDS Console
2. Create Database → MySQL
3. Configure settings and security groups
4. Get endpoint URL for connection string

### Railway MySQL
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add MySQL service
4. Copy DATABASE_URL from variables tab

## 🔒 Security Best Practices

1. **Strong Passwords**: Use complex passwords for database users
2. **SSL/TLS**: Always use SSL for remote connections
3. **Firewall**: Restrict database access to your application servers
4. **Regular Backups**: Set up automated backups
5. **User Permissions**: Create specific users with minimal required permissions

## 🚀 Production Deployment

For production:

1. **Database**: Use managed MySQL service (PlanetScale, AWS RDS, etc.)
2. **Application**: Deploy on your preferred platform
3. **Environment**: Set production environment variables
4. **SSL**: Configure SSL certificates
5. **Backups**: Enable automated backups

## 📞 Troubleshooting

### Common Issues:

**Connection Refused:**
- Check if MySQL is running: `sudo systemctl status mysql`
- Verify port and host in connection string

**Authentication Failed:**
- Check username and password
- Verify user has database permissions
- For MySQL 8.0+, you might need to use `mysql_native_password`

**SSL Required:**
- Add SSL configuration to connection string for cloud databases

**Migration Errors:**
- Ensure database exists and user has permissions
- Check for syntax errors in schema files

### MySQL 8.0 Authentication Issue Fix:
```sql
ALTER USER 'ydf_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'secure_password';
FLUSH PRIVILEGES;
```

---

**Your Youth Dreamers Foundation app is now ready with MySQL! 🎉**