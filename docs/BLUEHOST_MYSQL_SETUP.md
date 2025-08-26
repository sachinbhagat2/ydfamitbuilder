# 🐬 Bluehost MySQL Database Integration Guide

This guide covers the integration of your existing Bluehost MySQL database with the Youth Dreamers Foundation application.

## 📋 Database Details

- **Database Name**: `sparsind_ydf_ngo`
- **Username**: `sparsind_ydf`
- **Host**: `bluehost.in`
- **Port**: `3306` (default MySQL port)

## 🔧 Configuration Applied

### Environment Variables
Your `.env` file has been configured with:
```env
DATABASE_URL="mysql://sparsind_ydf:Vishwanath!@3@bluehost.in:3306/sparsind_ydf_ngo"
```

### Connection Settings
- **SSL**: Configured with `rejectUnauthorized: false` for shared hosting compatibility
- **Connection Pool**: Optimized for shared hosting (5 connections max)
- **Timeouts**: Extended timeouts for stable connection
- **Reconnection**: Automatic reconnection enabled

## 🚀 Next Steps

### 1. Test Database Connection
```bash
# Start the backend server
npm run dev:server
```

Then visit: `http://localhost:3000/api/db-test`

You should see:
```json
{
  "success": true,
  "message": "Bluehost MySQL database connection successful",
  "data": [...]
}
```

### 2. Setup Database Schema
```bash
# Generate migration files
npm run db:generate

# Apply migrations to your Bluehost database
npm run db:migrate
```

### 3. Start Development
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend (if not already running)
npm run dev:server
```

## 📊 Database Schema

The following tables will be created in your `sparsind_ydf_ngo` database:

### Core Tables:
- **users** - All user accounts (students, admins, reviewers, donors)
- **scholarships** - Scholarship programs and schemes
- **applications** - Student applications
- **reviews** - Application evaluations
- **notifications** - System notifications
- **documents** - File uploads metadata
- **announcements** - System announcements
- **contributions** - Donor contributions
- **settings** - Application configuration

## 🔒 Security Considerations

### Bluehost Specific:
1. **SSL Connection**: Configured for Bluehost's SSL requirements
2. **Connection Limits**: Optimized for shared hosting limits
3. **Firewall**: Ensure your application server IP is whitelisted in Bluehost
4. **Backup**: Bluehost provides automatic backups, but consider additional backups

### Best Practices:
1. **Regular Backups**: Export database regularly via phpMyAdmin
2. **Monitor Usage**: Keep track of database size and connection usage
3. **Security Updates**: Keep database credentials secure
4. **Access Control**: Use Bluehost's database access controls

## 🛠️ Bluehost Database Management

### Access Methods:
1. **phpMyAdmin**: Available in your Bluehost cPanel
2. **MySQL Remote Access**: Configure in cPanel if needed
3. **SSH Access**: If available on your hosting plan

### Common Tasks:
```sql
-- Check database size
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'sparsind_ydf_ngo'
GROUP BY table_schema;

-- View all tables
SHOW TABLES;

-- Check table structure
DESCRIBE users;
```

## 🚨 Troubleshooting

### Common Bluehost Issues:

**Connection Timeout:**
- Increase timeout values in connection config
- Check Bluehost server status
- Verify database service is running

**SSL Certificate Issues:**
- Ensure `rejectUnauthorized: false` is set
- Check if Bluehost requires specific SSL configuration

**Connection Limit Exceeded:**
- Reduce connection pool size
- Implement connection retry logic
- Monitor concurrent connections

**Access Denied:**
- Verify username and password
- Check database user permissions in cPanel
- Ensure remote access is enabled if needed

### Bluehost cPanel Steps:
1. Login to your Bluehost cPanel
2. Go to "MySQL Databases"
3. Verify user `sparsind_ydf` has full privileges on `sparsind_ydf_ngo`
4. Check "Remote MySQL" settings if accessing from external servers

## 📞 Support

### Bluehost Support:
- **Phone**: Available 24/7
- **Live Chat**: Available in cPanel
- **Knowledge Base**: help.bluehost.com

### Application Support:
- Check database connection: `/api/db-test`
- Monitor logs for connection issues
- Use Drizzle Studio for database inspection: `npm run db:studio`

---

**Your Bluehost MySQL database is now integrated! 🎉**

The application will now use your existing Bluehost database for all operations.