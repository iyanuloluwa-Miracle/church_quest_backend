import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });

interface EnvironmentConfig {
  nodeEnv: string;
  port: number;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
}

export const environment: EnvironmentConfig = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongodbUri:
    (process.env.NODE_ENV === "production" ? process.env.MONGODB_URI_PROD : process.env.MONGODB_URI) ||
    "mongodb://localhost:27017/church-management", // ✅ Default value ensures it's always a string
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
};

// ✅ Throw an error if required environment variables are missing
if (!environment.mongodbUri) {
  throw new Error("Missing MONGODB_URI in environment variables");
}

if (!environment.jwtSecret) {
  throw new Error("Missing JWT_SECRET in environment variables");
}
