import Vendor from "@/models/Vendor";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { number, menu } = await req.json();

    // Connecting to database
    await connectDB();

    // Checking if the Vendor already exists
    let vendor = await Vendor.findOne({ number });

    if (vendor) {
      vendor.menu = menu;
      await vendor.save();
      return NextResponse.json({
        success: true,
        message: "Menu updated successfully",
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
      error: "An error occurred while logging in the Vendor : " + error,
    });
  }
}
