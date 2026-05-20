import { type Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin" | "sales";
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateTokens(): { accessToken: string; refreshToken: string };
}

export interface ILead {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: "New" | "Contacted" | "Qualified" | "Lost";
  source: "Website" | "Instagram" | "Referral";
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
