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
        // Allowlist of safe file types for registration uploads
        const allowedExtensions = [
            ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx",
            ".txt", ".csv", ".rtf", ".odt", ".ods", ".odp",
            ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg",
            ".zip", ".rar", ".7z"
        ];
        const allowedMimePatterns = [
            /^image\//,
            /^application\/pdf$/,
            /^application\/msword$/,
            /^application\/vnd\.openxmlformats/,
            /^application\/vnd\.ms-(excel|powerpoint)/,
            /^application\/vnd\.oasis\.opendocument/,
            /^text\/(plain|csv|rtf)$/,
            /^application\/(zip|x-rar-compressed|x-7z-compressed)$/,
        ];

        const originalNameLower = (file.originalname || "").toLowerCase();
        const hasAllowedExt = allowedExtensions.some((ext) => originalNameLower.endsWith(ext));
        const hasAllowedMime = allowedMimePatterns.some((pattern) => pattern.test(file.mimetype));

        if (hasAllowedExt || hasAllowedMime) {
            return cb(null, true);
        }

        cb(new Error("File type not allowed. Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, CSV, images, and archives."));
    },
});

export const uploadDocument = uploadRegistrationFile;

