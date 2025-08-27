export default async function handler(req, res) {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    USE_MOCK_DB: process.env.USE_MOCK_DB,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    FRONTEND_URL: process.env.FRONTEND_URL,
  });
}