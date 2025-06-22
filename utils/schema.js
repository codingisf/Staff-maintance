import { mysqlTable, int, varchar,boolean , json} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('employees', {
  id: int('id',{length:11}).primaryKey().autoincrement().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  salary: int('salary').notNull(),
  face_descriptor: json('face_descriptor').notNull(),
});

export const attendance = mysqlTable('attendance' ,{
  id:int('id',{length:11}).autoincrement().primaryKey(),
  EmployeeId :int('employeeId',{length:11}).notNull(),
  present:boolean('present').default(false),
  day:int('day',{length:11}).notNull(),
  date:varchar('date',{length:20}).notNull(),
  time: varchar("time",{length:20}).notNull()
})

