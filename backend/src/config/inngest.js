import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "slack-clone" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      await connectDB();
      console.log("[INGEST] DB connection successful within function.");
    } catch (err) {
      console.error(
        "[INGEST CRASH] Failed to connect DB inside function:",
        err
      );

      throw err;
    }

    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    const newUser = {
      clerkId: id,
      email:
        email_addresses && email_addresses[0]
          ? email_addresses[0].email_address
          : undefined,
      name: `${first_name || ""} ${last_name || ""}`,
      image: image_url,
    };

    try {
      await User.create(newUser);
      console.log("User added to DB successfully.");
    } catch (dbError) {
      console.error("MongoDB User.create failed:", dbError);
    }

    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.image,
      email: newUser.email,
    });
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

    await deleteStreamUser(id.toString());
  }
);

export const functions = [syncUser, deleteUserFromDB];
