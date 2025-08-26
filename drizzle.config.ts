import type { Config } from 'drizzle-kit';

export default {
  schema: './server/schema/index.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    host: '162.214.80.161',
    port: 3306,
    user: 'sparsind_ydf',
    password: 'Vishwanath!@3',
    database: 'sparsind_ydf_ngo',
    ssl: {
      rejectUnauthorized: false
    }
  },
  verbose: true,
  strict: true,
} satisfies Config;