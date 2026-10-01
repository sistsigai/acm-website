import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Reusable middleware to validate request body with a Zod schema
 */
export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      return res.status(400).json({
        success: false,
        message: "Invalid request payload",
      });
    }
  };
};

/**
 * Reusable middleware to validate query parameters with a Zod schema
 */
export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = await schema.parseAsync(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Query validation failed",
          errors: error.issues.map((err) => ({
            param: err.path.join("."),
            message: err.message,
          })),
        });
      }
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
      });
    }
  };
};

/**
 * Reusable middleware to validate route params with a Zod schema
 */
export const validateParams = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = await schema.parseAsync(req.params) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "URL parameter validation failed",
          errors: error.issues.map((err) => ({
            param: err.path.join("."),
            message: err.message,
          })),
        });
      }
      return res.status(400).json({
        success: false,
        message: "Invalid URL parameters",
      });
    }
  };
};
