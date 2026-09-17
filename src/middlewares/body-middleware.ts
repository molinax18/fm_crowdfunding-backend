import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validateBody =
  <Schema extends ZodType>(schema: Schema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        data: "Please complete all the fields",
        details: result.error.issues.map(({ code, message, path }) => ({
          path,
          code,
          message,
        })),
      });
    }

    return next();
  };
