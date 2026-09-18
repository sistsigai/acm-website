import multer from "multer";

export const upload = multer({
    storage: multer.memoryStorage(), // ✅ IMPORTANT
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
});
