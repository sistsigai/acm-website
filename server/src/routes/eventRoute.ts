import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import {
  getAllEvents,
  registerForEvent,
  uploadEventRegistrationFile,
  deleteEventRegistrationFile,
} from "../controllers/webeventController";
import { uploadRegistrationFile } from "../middleware/upload";

const router = Router();

// Middleware to handle registration file upload with clear error responses
const handleRegistrationFileUpload = (req: Request, res: Response, next: NextFunction) => {
  uploadRegistrationFile.single("file")(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File exceeds the 25MB maximum upload limit.",
          });
        }
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`,
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || "Failed to process uploaded file",
      });
    }
    next();
  });
};

router.get("/getallmem", getAllEvents);
router.post("/register", registerForEvent);
router.post("/upload-file", handleRegistrationFileUpload, uploadEventRegistrationFile);
router.post("/delete-file", deleteEventRegistrationFile);

export default router;
