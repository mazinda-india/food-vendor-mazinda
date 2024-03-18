import Vendor from "@/models/Vendor";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

import jwt from "jsonwebtoken";

export async function GET() {
  try {
    console.log("hjh");
    const vendor_token = cookies().get("vendor_token").value;
    console.log("ven", vendor_token);
    const data = jwt.verify(vendor_token, process.env.JWT_SECRET);
    const number = data.number;
    // Connecting to database
    await connectDB();

    // Checking if the user already exists
    let vendor = await Vendor.findOne({ number });

    if (vendor) {
      return NextResponse.json({
        success: true,
        message: "Vendor fetched successfully",
        vendor,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Vendor doesn't exist",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the Vendor : " + error,
    });
  }
}
