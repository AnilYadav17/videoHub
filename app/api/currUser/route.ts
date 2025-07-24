
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User, {IUser} from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        const session = await getServerSession(authOptions);
        if(!session){
           return NextResponse.json(
            {error: "Unautharized"},
            {status: 401  }
           ) 
        }
        
        const userId = session?.user.id;
        await connectToDatabase();
        const currUser = await User.find({_id: userId}).populate('video').sort({createdAt: -1}).lean();
        if(!currUser || currUser.length === 0){
            return NextResponse.json(currUser ?? [], { status: 200 });
        }
        return NextResponse.json(currUser);
    } catch (error) {
        console.error("user info fatch Failed: ", error)
        return NextResponse.json(
            {error: "Failed to fatch User"},
            {status: 500}
        )
    }
}