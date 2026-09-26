import "./config/env";
import { envFile } from "./config/env";
import express, { Application, Request, Response, NextFunction } from "express";
import connectDB from "./config/db";
import path from "path";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import compression from "compression";

import adminAuthRoutes from "./routes/authRoutes";
import homeRoutes from "./routes/homeRoutes";
import adminSettingsRoutes from "./routes/adminSettingsRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import eventManagerRoutes from "./routes/eventManagerRoutes";
import memberRoutes from "./routes/memberRoutes";
import aboutRoutes from "./routes/aboutRoutes";
import eventRoutes from "./routes/eventRoutes";

if (!process.env.MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI environment variable is required");
    process.exit(1);
}

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
    console.error("❌ ERROR: JWT_SECRET environment variable is required in production");
    process.exit(1);
}

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

const app: Application = express();

// ========== SECURITY & PERFORMANCE ENHANCEMENTS ==========
app.use(helmet());
app.use(compression());

const defaultAllowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'https://sistsigai.acm.org',
    'http://sistsigai.acm.org',
    'https://www.sistsigai.acm.org',
    'http://www.sistsigai.acm.org',
    'https://api.sistsigai.acm.org',
    'http://api.sistsigai.acm.org'
];

const configuredOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : [];

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...configuredOrigins]));

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || !isProduction || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "Cache-Control",
        "Pragma",
        "Expires",
        "X-Requested-With",
        "Origin"
    ],
    credentials: true,
    maxAge: 86400
};

app.use(cors(corsOptions));
app.use(cookieParser());

// ========== LOGGING ==========
app.use(morgan(isProduction ? 'combined' : 'dev'));

app.use(express.json({
    limit: "10mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "10mb"
}));

// Serve uploaded files (e.g., resumes)
const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));
app.use("/api/uploads", express.static(uploadsDir));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setTimeout(30_000, () => {
        res.status(408).json({
            success: false,
            message: "Request timeout",
            code: "TIMEOUT"
        });
    });
    next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
    if (isDevelopment) {
        console.log(`${new Date().toISOString()} [${req.method}] ${req.path} - ${req.ip}`);
    }
    next();
});

// ========== RATE LIMITING ==========
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 100 : 500,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes",
        code: "RATE_LIMIT_EXCEEDED"
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 5 : 20,
    message: {
        success: false,
        message: "Too many login attempts, please try again after 15 minutes",
        code: "AUTH_RATE_LIMIT_EXCEEDED"
    },
    skipSuccessfulRequests: true
});

// ========== STRICT NO-CACHE HEADERS FOR DYNAMIC API ENDPOINTS ==========
// Ensures reverse proxies (Cloudflare, Nginx, Hostinger), CDNs, and browsers NEVER serve stale API responses
app.set("etag", false);
app.use("/api", (req: Request, res: Response, next: NextFunction) => {
    res.set({
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
        "Surrogate-Control": "no-store"
    });
    next();
});

// ========== ROUTES ==========
app.use("/api/home", homeRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/events", eventRoutes);

app.use("/api/admin/auth", authLimiter, adminAuthRoutes);

app.use("/api/admin", apiLimiter);
app.use("/api/admin/members", memberRoutes);
app.use("/api/admin/eventmanager", eventManagerRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);

// ========== HEALTH CHECK ==========
const healthCheckHandler = async (req: Request, res: Response) => {
    try {
        const mongoose = (await import("mongoose")).default;

        const healthData = {
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: {
                rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
                heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
                heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`
            },
            database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
            environment: process.env.NODE_ENV
        };

        res.status(200).json(healthData);
    } catch (error) {
        res.status(500).json({
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            error: "Health check failed"
        });
    }
};

app.get("/api/health", healthCheckHandler);
app.get("/health", healthCheckHandler);

const apiStatusHandler = (req: Request, res: Response) => {
    res.json({
        name: "ACM SIGAI API",
        version: "1.0.0",
        status: "operational",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
};

app.get("/api", apiStatusHandler);
app.get("/", apiStatusHandler);

// ========== ERROR HANDLING ==========
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        method: req.method,
        code: "NOT_FOUND"
    });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`Error:`, {
        error: err.message,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });

    const statusCode = (err as any).status || 500;

    const errorResponse: any = {
        success: false,
        message: isProduction ? "Internal server error" : err.message,
        code: "SERVER_ERROR",
        timestamp: new Date().toISOString()
    };

    if (isDevelopment) {
        errorResponse.error = err.message;
    }

    res.status(statusCode).json(errorResponse);
});

// ========== GRACEFUL SHUTDOWN ==========
const shutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

    try {
        const mongoose = (await import("mongoose")).default;
        await mongoose.connection.close();
        console.log("🗄️ MongoDB connection closed");
    } catch (err) {
        console.error("Error closing MongoDB:", err);
    }

    console.log("✅ Server shutdown complete");
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("unhandledRejection", (reason) => {
    console.error("❌ Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception:", error);
    process.exit(1);
});

// ========== START SERVER ==========
const RAW_PORT = process.env.PORT;
const PORT = RAW_PORT && isNaN(Number(RAW_PORT)) ? RAW_PORT : (Number(RAW_PORT) || 5000);

(async () => {
    try {
        console.log("────────────────────────────────────────────");
        console.log("🚀 Starting ACM SIGAI Backend...");
        console.log("────────────────────────────────────────────");

        console.log(`🧭 Mode        : ${isProduction ? "PRODUCTION" : "DEVELOPMENT"}`);
        console.log(`🌍 Environment : ${process.env.NODE_ENV}`);
        console.log(`📄 Config File : ${envFile}`);
        console.log(`🔌 Port        : ${PORT}`);

        await connectDB();
        console.log("🗄️  MongoDB    : Connected successfully");

        const startCallback = () => {
            console.log("────────────────────────────────────────────");
            console.log(`✅ Server Status : RUNNING`);

            if (isDevelopment) {
                console.log("🔁 Development Mode : ENABLED");
            }

            if (isProduction) {
                console.log("🛡️  Production Mode : SECURE");
            }

            console.log(`⏱️  Started At  : ${new Date().toLocaleString()}`);
            console.log("────────────────────────────────────────────\n");
        };

        if (typeof PORT === "string") {
            app.listen(PORT, startCallback);
        } else {
            app.listen(PORT, "0.0.0.0", startCallback);
        }

    } catch (error) {
        console.error("❌ Server failed to start:", error);
        process.exit(1);
    }
})();

// Schema and API routes reloaded cleanly.