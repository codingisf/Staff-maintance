import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "srv674.hstgr.io",
  user: "u724131309_StaffMaintance",
  database: "u724131309_StaffMaintance",
  password: "PK+05bJ0@Lw",
  port: "3306",
});

export const db = drizzle(connection);
