import multer from "multer";

// Image-only upload middleware (for avatars, member images, event posters/thumbnails)
export const upload = multer({
    storage: multer.memoryStorage(), // ✅ IMPORTANT
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
});

// Document & registration file upload middleware (supports PDF, DOCX, DOC, PPTX, XLSX, TXT, images, etc.)
export const uploadRegistrationFile = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 25 * 1024 * 1024, // 25MB max
    },
    fileFilter: (_req, file, cb) => {
        // Disallow dangerous executable files
        const dangerousExtensions = [
            ".exe", ".bat", ".cmd", ".sh", ".msi", ".dll", ".com",
            ".vbs", ".scr", ".jar", ".ps1", ".vbe", ".jse", ".wsf", ".wsh"
        ];
        const originalNameLower = (file.originalname || "").toLowerCase();
        const isDangerous = dangerousExtensions.some((ext) => originalNameLower.endsWith(ext));

        if (isDangerous) {
            return cb(new Error("Executable or unsafe file types are not allowed"));
        }

        cb(null, true);
    },
});

export const uploadDocument = uploadRegistrationFile;

