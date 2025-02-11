import { users, type User, type InsertUser } from "@shared/schema";
import { type RaceData, type InsertRaceData, type RaceDataJson } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getRaceData(): Promise<RaceDataJson | undefined>;
  createRaceData(data: InsertRaceData): Promise<RaceData>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private raceData?: RaceData;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

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