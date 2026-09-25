import dotenv from "dotenv";
import path from "path";
import fs from "fs";

process.env.DOTENV_CONFIG_QUIET = "true";

// Determine environment and load corresponding configuration file
const NODE_ENV = process.env.NODE_ENV || "development";
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = NODE_ENV;
}

export const envFile = NODE_ENV === "production" ? ".env.production" : ".env.development";
export const envPath = path.resolve(process.cwd(), envFile);

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    console.warn(`⚠️ Warning: Environment file '${envFile}' was not found at ${envPath}`);
}
