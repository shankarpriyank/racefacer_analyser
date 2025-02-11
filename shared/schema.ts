import { pgTable, text, serial, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const raceData = pgTable("race_data", {
  id: serial("id").primaryKey(),
  data: json("data").notNull(),
});

export const insertRaceDataSchema = createInsertSchema(raceData).pick({
  data: true,
});

export type InsertRaceData = z.infer<typeof insertRaceDataSchema>;
export type RaceData = typeof raceData.$inferSelect;

export const raceDataJsonSchema = z.object({
  profile_info: z.object({
    "Driver Name": z.string(),
    Location: z.string(),
    Statistics: z.object({
      "Total Distance": z.string(),
      "Total Drive Hours": z.string(),
      "Preferred Track": z.string()
    }),
    "Total Races": z.number()
  }),
  races_data: z.array(z.object({
    race_id: z.string(),
    position: z.string(),
    date: z.string(),
    time: z.string(),
    track: z.string(),
    kart: z.string(),
    lap_times: z.array(z.tuple([z.string(), z.string()])),
    best_time: z.string()
  }))
});

export type RaceDataJson = z.infer<typeof raceDataJsonSchema>;
