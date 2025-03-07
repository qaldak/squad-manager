import {createClient, SupabaseClient} from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.SUPABASE_URL
const dbServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!dbUrl || !dbServiceKey) {
    throw new Error('Database URL or Service Key not set in environment variables')
}

const dbClient: SupabaseClient = createClient(dbUrl, dbServiceKey)

export default dbClient