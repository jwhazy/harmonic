import cors from "cors";

import express from "express";
import { success } from "../utils/logger";

const app = express();

export default function startServer() {
  app.use(cors());
  app.use(express.json());

  app.use("/", (req, res, next) => {
    if (process.env.NODE_ENV !== "production" && !req.path.includes("/api/")) {
      return res.redirect(
        `http://${req.headers.host?.split(":")[0]}:${
          global.config.frontendPort
        }${req.url}`
      );
    }
    next();
  });

  process.env.NODE_ENV === "production" &&
    app.use(express.static("build/public"));

  app.get("/api/status", (req, res) => {
    res.json({
      frontend: true,
      name: global.config.name,
    });
  });

  app.get("/api/get/queue", (req, res) => {
    res.json(global.player.queue);
  });

  app.get("/api/add/queue", (req, res) => {
    res.json(global.player.queue);
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

  app.post("/api/verify", (req, res) => {
    const { token } = req.body;

    if (!token) return res.status(401).send("");

    if (token !== global.token) return res.status(401).send("");

    return res.status(200).send("");
  });

  app.get("*", (req, res) => {
    res.sendFile("index.html", { root: "build/public" });
  });

  app.listen(3000, () => {
    success("API started on port 3000");
  });
}
