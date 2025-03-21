import { createClient, Session, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.SUPABASE_URL;
const dbServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!dbUrl || !dbServiceKey) {
  throw new Error(
    "Database URL or Service Key not set in environment variables",
  );
}

const dbLogin = process.env.SUPABASE_LOGIN;
const dbPassword = process.env.SUPABASE_PASSWORD;

if (!dbLogin || !dbPassword) {
  throw new Error(
    "Database Login or Password not set in environment variables",
  );
}

let dbClient: SupabaseClient = createClient(dbUrl, dbServiceKey);

async function signIn(email: string, password: string): Promise<Session> {
  const { data, error } = await dbClient.auth.signInWithPassword({
    email: email,
    password: password,
  });
  console.log("Foo", data);
  console.log("Bar", error);
  return data.session;
}

(async () => {
  console.log(dbLogin);
  let session: Session = await signIn(dbLogin, dbPassword);
  console.log("Baz", session);
})();

// temp code
// initializeDb from app.ts
export async function initializeDb(): Promise<void> {
  dbClient = createClient(dbUrl, dbServiceKey);
  const session: Session = await signIn(dbLogin, dbPassword);
  console.log("Database initialized with session:", session);
}
export async function closeDbConnection(): Promise<void> {
  // Todo: implement code to signout and close db connection
  console.log("Database connection closed.");
}

export default dbClient;
