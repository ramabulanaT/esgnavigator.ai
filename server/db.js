import pg from "pg"; const { Pool } = pg;
const DB_URL = process.env.DB_URL; let pool=null;
if(DB_URL){ pool=new Pool({ connectionString:DB_URL, ssl: DB_URL.includes("sslmode=require")?{rejectUnauthorized:false}:undefined, max:5, idleTimeoutMillis:10000 }); pool.on("error",e=>console.error("[pg]",e)); }
export async function query(text,params){ if(!pool) return { rows:[] }; const c=await pool.connect(); try{ return await c.query(text,params); } finally{ c.release(); } }
export async function healthy(){ if(!pool) return false; await query("select 1"); return true; }
