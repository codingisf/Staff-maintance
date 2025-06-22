import {db} from '@/utils'
import {users} from '@/utils/schema'
import {NextResponse} from 'next/server'
import { eq } from 'drizzle-orm';

export async function POST(req,res) {
    const data = await req.json();
    
    
    const result = await db.insert(users).values({
        name:data?.name,
        role : data?.role,
        salary : data?.salary,
        face_descriptor : data?.faceVector,
    })
    console.log(data?.faceVector);

    return NextResponse.json(result)
}

export async function GET(req) {
    const result = await db.select().from(users);
    return NextResponse.json(result);
}

export async function DELETE(req) {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    const result = await db.delete(users)
    .where(eq(users.id,id));

    return NextResponse.json(result)
}