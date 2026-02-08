//This file is doing event-driven backend automation.

import {Inngest} from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";

export const inngest = new Inngest({ id : "talentmeet-inngest" });

const syncUser = inngest.createFunction(
    {id : "sync-user"},
    {event : "clerk/user.created" },//Whenever Clerk creates a new user, run this function.
    async ({event}) => {
        //connect to db
        await connectDB()
        const{id,email_addresses,first_name,last_name,image_url} = event.data

        const newUser = {
            clerkId : id,
            email : email_addresses[0].email_address,
            name : `${first_name || ""} ${last_name || ""}`,
            profileImage : image_url
        }
        await User.findOneAndUpdate(
           { clerkId: id },   // find user
            newUser,           // update with this data
           { upsert: true, new: true }
       );

        //todo : do something else
    }
)

const deleteUserFromDB = inngest.createFunction(
    {id : "delete-user-from-db"},
    {event : "clerk/user.deleted" },
    async ({event}) => {
        //connect to db
        await connectDB()
        const{id} = event.data

        await User.deleteOne({clerkId : id});

        //todo : do something else
    }
)

export const functions = [syncUser, deleteUserFromDB];

//It automatically syncs Clerk users into your MongoDB database.

//So instead of manually writing:

//when user signs up → create user in DB

//when user deletes account → remove from DB

//You are using events.

//Inngest is a background job + event workflow tool.

// It listens to events like:

// user created

// user deleted

// email sent

// interview scheduled

// And runs backend functions automatically.