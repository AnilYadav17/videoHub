import { connectToDatabase } from "@/lib/db";
import isValidEmail from "@/lib/emailValidate";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    try{
       const {email, password} = await request.json();

       //Validation
       if(!email || !password){
          return NextResponse.json(
            {error: "Email and password are required"},
            {status: 400}
          )
       }
       if (!isValidEmail(email)) {
          return NextResponse.json(
            {error: "Enter valid email"},
            {status: 400}
          )
       }
      

       //Existing User
       await connectToDatabase();
       const existingUser = await User.findOne({email});
       if(existingUser){
          return NextResponse.json(
             {error: "User already exists !!"},
             {status: 400}
          )
       }

       //Create User
       await User.create({email, password})
        return NextResponse.json(
            {message: "User registered successfully"},
            {status: 200}
        )

    } catch(error){
        console.error("Registration Error", error )
       return NextResponse.json(
            {error: "Fail to register user"},
            {status: 400}
       )
    }
}
