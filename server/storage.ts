import { type RaceData, type InsertRaceData, type RaceDataJson } from "@shared/schema";

export interface IStorage {
  getRaceData(): Promise<RaceDataJson | undefined>;
  createRaceData(data: InsertRaceData): Promise<RaceData>;
}

export class MemStorage implements IStorage {
  private raceData?: RaceData;

  async getRaceData(): Promise<RaceDataJson | undefined> {
    return this.raceData?.data as RaceDataJson | undefined;
  }

  async createRaceData(insertData: InsertRaceData): Promise<RaceData> {
    const id = 1; // Since we're only storing one race data
    const raceData: RaceData = { id, ...insertData };
    this.raceData = raceData;
    return raceData;
  }
}

export const storage = new MemStorage();