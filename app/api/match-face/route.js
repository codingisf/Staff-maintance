import { NextResponse } from "next/server";
import { db } from "@/utils";
import { users } from "@/utils/schema";
// Helper to calculate Euclidean distance
function euclideanDistance(desc1, desc2) {
  return Math.sqrt(
    desc1.reduce((sum, val, i) => sum + (val - desc2[i]) ** 2, 0)
  );
}

export async function POST(req) {
  const body = await req.json();
  const { descriptor } = body;

  if (!Array.isArray(descriptor)) {
    return NextResponse.json(
      { success: false, message: "Invalid descriptor" },
      { status: 400 }
    );
  }

  const employees = await db.select().from(users);

  let matchedUser = null;
  let minDistance = Infinity;
  const threshold = 0.45; // Tune based on your data

  for (const emp of employees) {
    const dbDescriptor = Array.isArray(emp.face_descriptor)
      ? emp.face_descriptor
      : JSON.parse(emp.face_descriptor);

    const distance = euclideanDistance(descriptor, dbDescriptor);

    if (distance < threshold && distance < minDistance) {
      matchedUser = emp;
      minDistance = distance;
    }
  }

  if (matchedUser) {
    return NextResponse.json({
      success: true,
      employee: {
        id: matchedUser.id,
        name: matchedUser.name,
      },
    });
  }

  return NextResponse.json({ success: false, message: "No match found" });
}
