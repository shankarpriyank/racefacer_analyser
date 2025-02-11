import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { raceDataJsonSchema } from "../shared/schema.js";
export function registerRoutes(app: Express): Server {
  app.post("/api/upload", async (req, res) => {
    try {
      const validatedData = raceDataJsonSchema.parse(req.body);
      await storage.createRaceData({ data: validatedData });
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Invalid race data format" });
    }
  });

  app.get("/api/races", async (_req, res) => {
    const races = await storage.getRaceData();
    res.json(races);
  });

  const httpServer = createServer(app);
  return httpServer;
}
