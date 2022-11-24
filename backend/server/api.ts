import cors from "cors";
import express from "express";
import { prodCheck } from "../utils/apiChecks";
import { success } from "../utils/logger";
import startApi from "./init";

const app = express();

export default function initServer() {
  app.use(cors());
  app.use(express.json());

  process.env.NODE_ENV === "production" &&
    app.use(express.static("build/public"));

  app.use("/", prodCheck);
  app.use("/api", startApi);

  app.get("*", (req, res) => {
    res.sendFile("index.html", { root: "build/public" });
  });

  app.listen(global.config.backendPort, () => {
    success(`API started on port ${global.config.backendPort}`);
  });
}
