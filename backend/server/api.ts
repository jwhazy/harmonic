import cors from "cors";
import childProcess from "child_process";
import express from "express";
import { success } from "../utils/logger";

const app = express();

const prodCheck = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (process.env.NODE_ENV !== "production" && !req.path.includes("/api/")) {
    return res.redirect(
      `http://${req.headers.host?.split(":")[0]}:${global.config.frontendPort}${
        req.url
      }`
    );
  }
  next();
};

const authCheck = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.path.includes("/api/")) {
    if (req.headers.authorization?.split("Bearer ")[1] !== global.token) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
  }
  next();
};

export default function startServer() {
  app.use(cors());
  app.use(express.json());

  app.use("/", prodCheck);

  process.env.NODE_ENV === "production" &&
    app.use(express.static("build/public"));

  app.get("/api/status", (req, res) => {
    res.json({
      frontend: true,
      port: global.config.backendPort,
      name: global.config.name,
    });
  });

  app.get("/api/get/queue", authCheck, (req, res) => {
    res.json(global.player.queue);
  });

  app.get("/api/add/queue", authCheck, (req, res) => {
    res.json(global.player.queue);
  });

  app.get("/api/shutdown", authCheck, (req, res) => {
    res.json({
      message: "Shutting down...",
    });
    process.exit(0);
  });

  app.get("/api/restart", authCheck, (req, res) => {
    res.json({
      message: "Restarting...",
    });
    setTimeout(() => {
      process.on("exit", () => {
        childProcess.spawn(process.argv.shift() as string, process.argv, {
          cwd: process.cwd(),
          detached: true,
          stdio: "inherit",
        });
      });
      process.exit();
    }, 5000);
  });

  app.post("/api/auth", (req, res) => {
    const { password } = req.body;

    if (!password)
      return res.json({ message: "Missing password.", error: true });

    if (password !== process.env.PASSWORD)
      return res.json({ message: "Invalid password.", error: true });

    if (!global.token)
      global.token =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

    return res.json({ status: "success", token: global.token });
  });

  app.get("/api/verify", (req, res) => {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) return res.status(401).send("");

    if (token !== global.token) return res.status(401).send("");

    return res.status(200).send("");
  });

  app.get("*", (req, res) => {
    res.sendFile("index.html", { root: "build/public" });
  });

  app.listen(global.config.backendPort, () => {
    success(`API started on port ${global.config.backendPort}`);
  });
}
