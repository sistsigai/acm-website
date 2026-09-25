import dotenv from "dotenv";
import path from "path";
import fs from "fs";

process.env.DOTENV_CONFIG_QUIET = "true";

// Determine environment
const NODE_ENV = process.env.NODE_ENV || "development";
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = NODE_ENV;
}

// Search candidates for env file
const possibleDirs = [
    process.cwd(),
    path.resolve(__dirname, "../.."), // when compiled in dist/config or dist/
    path.resolve(__dirname, ".."),
    "/home/sistsigaihosting/api.sistsigai.acm.org"
];

const targetFiles = [
    NODE_ENV === "production" ? ".env.production" : ".env.development",
    ".env",
    ".env.production",
    ".env.local"
];

let loadedEnvPath: string | null = null;

for (const dir of possibleDirs) {
    for (const file of targetFiles) {
        const fullPath = path.resolve(dir, file);
        if (fs.existsSync(fullPath)) {
            dotenv.config({ path: fullPath });
            loadedEnvPath = fullPath;
            break;
        }
    }
    if (loadedEnvPath) break;
}

export const envFile = loadedEnvPath ? path.basename(loadedEnvPath) : targetFiles[0];
export const envPath = loadedEnvPath || path.resolve(process.cwd(), envFile);

if (!loadedEnvPath) {
    console.warn(`⚠️ Warning: No environment file found in [${possibleDirs.join(", ")}]. Relying on system process.env variables.`);
}