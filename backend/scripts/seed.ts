import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User";
import Lead from "../src/models/Lead";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/smart-leads";

const sampleLeads = [
  { name: "John Smith", email: "john@example.com", status: "New", source: "Website" },
  { name: "Sarah Johnson", email: "sarah@example.com", status: "Contacted", source: "Instagram" },
  { name: "Michael Brown", email: "michael@example.com", status: "Qualified", source: "Referral" },
  { name: "Emily Davis", email: "emily@example.com", status: "New", source: "Website" },
  { name: "David Wilson", email: "david@example.com", status: "Lost", source: "Referral" },
  { name: "Jessica Martinez", email: "jessica@example.com", status: "Contacted", source: "Website" },
  { name: "James Anderson", email: "james@example.com", status: "New", source: "Instagram" },
  { name: "Lisa Thomas", email: "lisa@example.com", status: "Qualified", source: "Referral" },
  { name: "Robert Taylor", email: "robert@example.com", status: "New", source: "Website" },
  { name: "Amanda White", email: "amanda@example.com", status: "Contacted", source: "Instagram" },
  { name: "Daniel Harris", email: "daniel@example.com", status: "Lost", source: "Website" },
  { name: "Jennifer Clark", email: "jennifer@example.com", status: "New", source: "Referral" },
  { name: "Christopher Lewis", email: "christopher@example.com", status: "Qualified", source: "Website" },
  { name: "Michelle Walker", email: "michelle@example.com", status: "New", source: "Instagram" },
  { name: "Matthew Hall", email: "matthew@example.com", status: "Contacted", source: "Referral" },
];

const seedDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log("Cleared existing data");

    // Create demo users
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@smartleads.com",
      password: "admin123",
      role: "admin",
    });

    const salesUser = await User.create({
      name: "Sales User",
      email: "sales@smartleads.com",
      password: "sales123",
      role: "sales",
    });

    console.log("Created demo users");

    // Create sample leads
    const leadsData = sampleLeads.map((lead) => ({
      ...lead,
      createdBy: adminUser._id,
    }));

    await Lead.insertMany(leadsData);
    console.log(`Created ${sampleLeads.length} sample leads`);

    console.log("\nSeed completed successfully!");
    console.log("\nDemo Credentials:");
    console.log("Admin: admin@smartleads.com / admin123");
    console.log("Sales: sales@smartleads.com / sales123");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedDatabase();
