import { db } from "@/utils";
import { users, attendance } from "@/utils/schema";
import { NextResponse } from "next/server";
import { eq, or, isNull, and } from "drizzle-orm";
export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;

  const month = searchParams.get("month");

  const result = await db
    .select({
      name: users.name,
      present: attendance.present,
      day: attendance.day,
      date: attendance.date,
      EmployeeId: users.id,
      attendanceId: attendance.EmployeeId,
      time:attendance.time
    })
    .from(users)
    .leftJoin(attendance,and( eq(users.id, attendance.EmployeeId),eq(attendance.date, month)))
    
  return NextResponse.json(result);
}

export async function POST(req, res) {
  
  const data = await req.json();
  console.log("Received data:", data);
  const result = await db.insert(attendance).values({
    EmployeeId: data.EmployeeId,
    present: data.present,
    date: data.date,
    day: data.day,
    time:data.time
  });
  console.log(data.time);
  

  return NextResponse.json(result);
}

export async function DELETE(req) {
  const searchParams = req.nextUrl.searchParams;
  const EmployeeId = searchParams.get("EmployeeId");
  const date = searchParams.get("date");
  const day = searchParams.get("day");

  const result = await db
    .delete(attendance)
    .where(and(eq(attendance.EmployeeId, EmployeeId),
        eq(attendance.date, date),
        eq(attendance.day, day)
      )
    );
  return NextResponse.json(result);
}
