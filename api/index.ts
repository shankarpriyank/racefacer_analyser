 import express from 'express';
 import { storage } from '../server/storage';
 import { raceDataJsonSchema } from '../shared/schema';
 
 const app = express();
 app.use(express.json());
 
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
 
 export default app;