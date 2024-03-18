import Vendor from "@/models/Vendor";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { number } = await req.json();

    // Connecting to database
    await connectDB();

    // Checking if the Vendor already exists
    let vendor = await Vendor.findOne({ number });

    if (vendor) {
      return NextResponse.json({
        success: true,
        message: "Menu fetched successfully",
        menu: vendor.menu,
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
      error: "An error occurred while fetching the vendor menu : " + error,
    });
  }
}
