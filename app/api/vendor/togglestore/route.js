import Vendor from "@/models/Vendor";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { number } = await req.json();

    // Connecting to database
    await connectDB();

    // Checking if the Vendor already exists
    let vendor = await Vendor.findOne({ number });

    if (vendor) {
      vendor.openStatus = !vendor.openStatus;
      await vendor.save();
      return NextResponse.json({
        success: true,
        message: "openStatus toggled successfully",
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
      error: "An error occurred while fetching the vendor : " + error,
    });
  }
}
