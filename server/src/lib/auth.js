import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { dash } from "@better-auth/infra";
import { getDB } from "../config/db.js";

export const createAuth = () => {
  const db = getDB();

  const origins = ["http://localhost:3000"];

  if (process.env.CLIENT_URL) {
    process.env.CLIENT_URL.split(",").forEach((url) => {
      const trimmed = url.trim();
      if (trimmed && !origins.includes(trimmed)) {
        origins.push(trimmed);
      }
    });
  }

  return betterAuth({
    database: mongodbAdapter(db),

    secret: process.env.BETTER_AUTH_SECRET,

    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",

    basePath: "/api/auth",

    trustedOrigins: origins,

    plugins: [
      dash(),
    ],

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },

    emailAndPassword: {
      enabled: true,
    },
  });
};