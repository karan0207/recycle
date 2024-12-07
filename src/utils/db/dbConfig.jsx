import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import 'dotenv/config'; // Ensure this is at the top to load `.env` variables

const DATABASE_URL='postgresql://neondb_owner:ntq2oxIZlB3A@ep-icy-scene-a53o3wsk.us-east-2.aws.neon.tech/neondb?sslmode=require'
// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL environment variable is not set");
// }

// console.log("Connecting to Database URL:", process.env.DATABASE_URL); // Debug

const sql = neon(DATABASE_URL);

export const db = drizzle(sql, { schema });
