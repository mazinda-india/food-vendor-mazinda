import Vendor from "@/models/Vendor";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import FoodOrder from "@/models/FoodOrder";

export async function POST(req) {
  try {
    const { vendor_token } = await req.json();

    const data = jwt.verify(vendor_token, process.env.JWT_SECRET);
    const number = data.number;

    // Connecting to database
    await connectDB();

    // Checking if the user already exists
    let vendor = await Vendor.findOne({ number });

    if (vendor) {
      const orders = await FoodOrder.find({ vendorId: vendor._id });

      return NextResponse.json({
        success: true,
        message: "Orders fetched successfully",
        orders,
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
