import type { Request, Response, NextFunction } from "express";

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: "Not found" });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof Error) {
    console.error(`[Error] ${err.message}`);
    const mongoErr = err as { name?: string; code?: number };

    if (mongoErr.name === "MongoServerError" && mongoErr.code === 11000) {
      res
        .status(409)
        .json({ error: "A resource with that value already exists" });
      return;
    }

    if (err.name === "CastError") {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
  }
  res.status(500).json({ error: "Internal server error" });
}
