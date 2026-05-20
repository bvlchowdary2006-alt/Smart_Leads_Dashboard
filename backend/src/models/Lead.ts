import mongoose, { Schema, type Types } from "mongoose";
import type { ILead } from "../interfaces/models";

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Lead email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Lost"],
      default: "New",
    },
    source: {
      type: String,
      enum: ["Website", "Instagram", "Referral"],
      required: [true, "Lead source is required"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdBy: 1 });
leadSchema.index({ createdAt: -1 });

const Lead = mongoose.model<ILead>("Lead", leadSchema);

export default Lead;
