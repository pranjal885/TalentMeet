import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables
if (!process.env.DB_URL) {
  throw new Error("❌ DB_URL is missing in your .env file");
}

export const ENV = {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,

  NODE_ENV: process.env.NODE_ENV || "development",

  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,

  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,
};
