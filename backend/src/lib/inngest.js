// This file handles event-driven backend automation using Inngest.
// It keeps Clerk users automatically synced with MongoDB.

import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { upsertStreamUser } from "./stream.js";

// Initialize Inngest client for TalentMeet
export const inngest = new Inngest({ id: "talentmeet-inngest" });

/*
  Function: Sync user when a new Clerk account is created
  Trigger: clerk/user.created
*/
const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },

  async ({ event }) => {
    // Connect to MongoDB
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    // Safely extract primary email
    const primaryEmail = email_addresses?.[0]?.email_address;

    if (!primaryEmail) {
      throw new Error("User email not found. Cannot sync user.");
    }

    // Create user object for MongoDB
    const newUser = {
      clerkId: id,
      email: primaryEmail,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      profileImage: image_url || "",
    };

    // Upsert ensures:
    // - If user exists → update
    // - If user does not exist → create
    await User.findOneAndUpdate(
      { clerkId: id },
      newUser,
      { upsert: true, new: true }
    );

    await upsertStreamUser({
      id:newUser.clerkId.toString(),
      name:newUser.name,
      image:newUser.profileImage
    });
  }
);

/*
  Function: Delete user when Clerk account is removed
  Trigger: clerk/user.deleted
*/
const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },

  async ({ event }) => {
    // Connect to MongoDB
    await connectDB();

    const { id } = event.data;

    // Remove user from MongoDB using Clerk ID
    await User.deleteOne({ clerkId: id });

    await deleteStreamUser(id.toString());
  }
);

// Export all Inngest functions for registration in server
export const functions = [syncUser, deleteUserFromDB];
