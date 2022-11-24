import express from "express";

export function prodCheck(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (process.env.NODE_ENV !== "production" && !req.path.includes("/api/")) {
    return res.redirect(
      `http://${req.headers.host?.split(":")[0]}:${global.config.frontendPort}${
        req.url
      }`
    );
  }
  next();
}

export function authCheck(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.path.includes("/api/")) {
    if (req.headers.authorization?.split("Bearer ")[1] !== global.token) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
  }
  next();
}
