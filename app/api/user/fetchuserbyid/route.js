import User from "@/models/User";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { user_id } = await req.json();
    // Connecting to database
    await connectDB();

    // Checking if the user already exists
    let user = await User.findOne({ _id: user_id });

    if (user) {
      return NextResponse.json({
        success: true,
        message: "User fetched successfully",
        user,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "User doesn't exist",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while logging in the User : " + error,
    });
  }
}
