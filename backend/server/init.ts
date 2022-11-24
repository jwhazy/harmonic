import childProcess from "child_process";
import express from "express";
import { authCheck } from "../utils/apiChecks";

const app = express();

app.get("/status", (req, res) => {
  res.json({
    frontend: true,
    port: global.config.backendPort,
    name: global.config.name,
  });
});

app.get("/get/queue", authCheck, (req, res) => {
  res.json(global.player.queue);
});

app.get("/add/queue", authCheck, (req, res) => {
  res.json(global.player.queue);
});

app.get("/shutdown", authCheck, (req, res) => {
  res.json({
    message: "Shutting down...",
  });
  process.exit(0);
});

app.get("/restart", authCheck, (req, res) => {
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

app.post("/auth", (req, res) => {
  const { password } = req.body;

  if (!password) return res.json({ message: "Missing password.", error: true });

  if (password !== process.env.PASSWORD)
    return res.json({ message: "Invalid password.", error: true });

  if (!global.token)
    global.token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

  return res.json({ status: "success", token: global.token });
});

app.get("/verify", (req, res) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) return res.status(401).send("");

  if (token !== global.token) return res.status(401).send("");

  return res.status(200).send("");
});

export default app;
