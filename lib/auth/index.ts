import {
  DrizzleSQLiteAdapter,
  SQLiteSessionTable,
  SQLiteUserTable,
} from "@lucia-auth/adapter-drizzle";
import { Discord, GitHub } from "arctic";
import { Lucia, TimeSpan } from "lucia";
import { env } from "~/env";
import { absoluteUrl } from "~/lib/utils";
import { db } from "~/server/db";
import { type User as DbUser, sessions, users } from "~/server/db/schema";

const adapter = new DrizzleSQLiteAdapter(
  db,
  sessions as unknown as SQLiteSessionTable,
  users as unknown as SQLiteUserTable
);

export const lucia = new Lucia(adapter, {
  getSessionAttributes: (/* attributes */) => {
    return {};
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      email: attributes.email,
      emailVerified: attributes.emailVerified,
      avatar: attributes.avatar,
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
      username: attributes.username,
      name: attributes.name,
      bio: attributes.bio,
    };
  },
  sessionExpiresIn: new TimeSpan(30, "d"),
  sessionCookie: {
    name: "session",

    expires: false, // session cookies have very long lifespan (2 years)
    attributes: {
      secure: env.NODE_ENV === "production",
    },
  },
});

export const discord = new Discord(
  env.DISCORD_CLIENT_ID,
  env.DISCORD_CLIENT_SECRET,
  absoluteUrl("/login/discord/callback")
);

export const github = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseSessionAttributes {}
interface DatabaseUserAttributes extends Omit<DbUser, "hashedPassword"> {}
