export const ENV = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "secret",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "secret",
  SESSION_PASSWORD: process.env.SESSION_PASSWORD,
  NODE_ENV: process.env.NODE_ENV || "development",
  SESSION_NAME: process.env.SESSION_NAME || "session",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || "",

  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
  GITHUB_SECRET: process.env.GITHUB_SECRET || "",

  NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET || "",
};
