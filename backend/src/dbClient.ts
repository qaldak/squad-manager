import { createClient, Session, SupabaseClient } from "@supabase/supabase-js";
import logger from "./utils/logger";

const dbUrl = process.env.SUPABASE_URL;
const dbServiceKey = process.env.SUPABASE_SERVICE_KEY;
const dbLogin = process.env.SUPABASE_LOGIN;
const dbPassword = process.env.SUPABASE_PASSWORD;

if (!dbUrl || !dbServiceKey) {
  throw new Error(
    "Database URL or Service Key not set in environment variables",
  );
}

if (!dbLogin || !dbPassword) {
  throw new Error(
    "Database Login or Password not set in environment variables",
  );
}

const dbClient: SupabaseClient = createClient(dbUrl, dbServiceKey);
let session: Session;

async function signIn(email: string, password: string): Promise<Session> {
  const { data, error } = await dbClient.auth.signInWithPassword({
    email: email,
    password: password,
  });
  logger.debug(`response data: ${JSON.stringify(data)}`);

  if (error) {
    logger.error(`Sign-in failed: ${error}`);
    throw new Error("Sign-in failed");
  }

  if (!data.session) {
    logger.warn("No session returned from sign-in.");
  }

  return data.session;
}

// initializeDb from app.ts
export async function initializeDb(): Promise<void> {
  session = await signIn(dbLogin, dbPassword);
  logger.debug(
    "Database initialized with session: %s",
    JSON.stringify(session),
  );

  logger.info("log into db successfully.");
}

// sign out user from database
export async function signOutFromDb(): Promise<void> {
  const { error } = await dbClient.auth.signOut();
  if (error) {
    logger.error(error);
    throw error;
  }

  logger.info("Database connection closed.");
}

export default dbClient;
